import { ApodItem, ApodItemSchema, ApodGallery, ApodGallerySchema } from '../contracts/apod.contract';
import { getCuratedApod, getCuratedGallery } from './curatedApod';

const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const REQUEST_TIMEOUT_MS = 4000; // Fail-fast a 4s para evitar bloqueos prolongados
const CIRCUIT_BREAKER_KEY = 'nasa_circuit_breaker_until';
const CIRCUIT_BREAKER_DURATION_MS = 10 * 60 * 1000; // 10 minutos de protección ante 429

function getApiKey(): string {
  const envKey = import.meta.env.VITE_NASA_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }
  return 'DEMO_KEY';
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isRateLimited?: boolean;
  isFallback?: boolean;
}

// -------------------------------------------------------------
// Circuit Breaker (Cero Esperas ante Cuota 429 de NASA)
// -------------------------------------------------------------
export function isCircuitBreakerOpen(): boolean {
  try {
    const raw = sessionStorage.getItem(CIRCUIT_BREAKER_KEY);
    if (!raw) return false;
    const until = parseInt(raw, 10);
    if (Date.now() < until) return true;
    sessionStorage.removeItem(CIRCUIT_BREAKER_KEY);
    return false;
  } catch {
    return false;
  }
}

export function tripCircuitBreaker(): void {
  try {
    sessionStorage.setItem(CIRCUIT_BREAKER_KEY, (Date.now() + CIRCUIT_BREAKER_DURATION_MS).toString());
  } catch {
    // Ignorar si sessionStorage no está disponible
  }
}

export function resetCircuitBreaker(): void {
  try {
    sessionStorage.removeItem(CIRCUIT_BREAKER_KEY);
  } catch {
    // Ignorar si sessionStorage no está disponible
  }
}

// -------------------------------------------------------------
// Utilidades de Caché en Cliente (localStorage)
// -------------------------------------------------------------
interface CacheEnvelope<T> {
  timestamp: number;
  ttl: number; // 0 = sin expiración (fechas históricas inmutables)
  payload: T;
}

function getCacheKey(prefix: string, id: string): string {
  return `apod_cache_v2_${prefix}_${id}`;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const envelope: CacheEnvelope<T> = JSON.parse(raw);
    if (envelope.ttl > 0 && Date.now() - envelope.timestamp > envelope.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return envelope.payload;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, payload: T, ttl: number = 0): void {
  try {
    const envelope: CacheEnvelope<T> = {
      timestamp: Date.now(),
      ttl,
      payload,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Si localStorage está lleno o deshabilitado, continuar silenciosamente
  }
}

/**
 * Helper para resolver la miniatura óptima de un medio astronómico.
 * Si es un video de YouTube, deriva automáticamente la miniatura oficial en HD.
 */
export function getMediaThumbnail(item: ApodItem): string {
  if (item.thumbnail_url) return item.thumbnail_url;
  if (item.media_type === 'video' && item.url) {
    const ytMatch = item.url.match(/(?:youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([\w-]+)/i);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  return item.url;
}

/**
 * Obtiene la Imagen Astronómica del Día de hoy con caché y fallback
 */
export async function fetchTodayApod(forceRefresh = false): Promise<ApiResponse<ApodItem>> {
  return fetchApodByDate(undefined, forceRefresh);
}

/**
 * Obtiene la Imagen Astronómica del Día para una fecha específica (YYYY-MM-DD).
 * Con Circuit Breaker: si la API de NASA está en 429, responde inmediatamente (0ms)
 * con el catálogo de respaldo curado, eliminando esperas y spinners congelados.
 */
export async function fetchApodByDate(date?: string, forceRefresh = false): Promise<ApiResponse<ApodItem>> {
  const isSpecificDate = !!date;
  const cacheKey = getCacheKey('item', date || 'today');

  if (forceRefresh) {
    resetCircuitBreaker();
    try {
      localStorage.removeItem(cacheKey);
    } catch {
      // ignore
    }
  }

  // 1. Verificar Caché en Cliente (Respuesta en 0ms)
  const cached = readCache<ApodItem>(cacheKey);
  if (cached) {
    const parsed = ApodItemSchema.safeParse(cached);
    if (parsed.success) {
      return { data: parsed.data, error: null, isFallback: false };
    }
  }

  // 2. Circuit Breaker activo: responder inmediatamente sin hacer llamada de red
  if (isCircuitBreakerOpen() && !forceRefresh) {
    const fallbackItem = getCuratedApod(date);
    return {
      data: fallbackItem,
      error: null,
      isRateLimited: true,
      isFallback: true,
    };
  }

  // 3. Preparar Petición con AbortController fail-fast (4s)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = new URL(NASA_BASE_URL);
    url.searchParams.set('api_key', getApiKey());
    url.searchParams.set('thumbs', 'true');
    if (date) {
      url.searchParams.set('date', date);
    }

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 429) {
      tripCircuitBreaker();
      const fallbackItem = getCuratedApod(date);
      writeCache(cacheKey, fallbackItem, 10 * 60 * 1000);
      return {
        data: fallbackItem,
        error: null,
        isRateLimited: true,
        isFallback: true,
      };
    }

    if (!response.ok) {
      const fallbackItem = getCuratedApod(date);
      return {
        data: fallbackItem,
        error: null,
        isFallback: true,
      };
    }

    const raw = await response.json();
    const result = ApodItemSchema.safeParse(raw);

    if (!result.success) {
      console.error('[NASA Contract Discrepancy]:', result.error.format());
      const fallbackItem = getCuratedApod(date);
      return { data: fallbackItem, error: null, isFallback: true };
    }

    // Fechas históricas se cachean permanentemente; la de hoy por 6 horas
    writeCache(cacheKey, result.data, isSpecificDate ? 0 : 6 * 60 * 60 * 1000);
    return { data: result.data, error: null, isFallback: false };
  } catch {
    clearTimeout(timeoutId);
    tripCircuitBreaker();
    const fallbackItem = getCuratedApod(date);
    writeCache(cacheKey, fallbackItem, 10 * 60 * 1000);
    return {
      data: fallbackItem,
      error: null,
      isFallback: true,
      isRateLimited: true,
    };
  }
}

/**
 * Obtiene una colección aleatoria de imágenes espaciales para la galería.
 * Si el Circuit Breaker está abierto o la NASA responde con 429/timeout,
 * responde en 0ms con la colección curada sin congelar la interfaz.
 */
export async function fetchRandomApods(count: number = 12, forceRefresh = false): Promise<ApiResponse<ApodGallery>> {
  const cacheKey = getCacheKey('gallery', `count_${count}`);

  if (forceRefresh) {
    resetCircuitBreaker();
    try {
      localStorage.removeItem(cacheKey);
    } catch {
      // ignore
    }
  }

  // 1. Revisar caché de galería (0ms)
  const cached = readCache<ApodGallery>(cacheKey);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    const parsed = ApodGallerySchema.safeParse(cached);
    if (parsed.success) {
      return { data: parsed.data, error: null, isFallback: false };
    }
  }

  // 2. Circuit Breaker activo: responder inmediatamente sin red
  if (isCircuitBreakerOpen() && !forceRefresh) {
    return {
      data: getCuratedGallery(count),
      error: null,
      isRateLimited: true,
      isFallback: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = new URL(NASA_BASE_URL);
    url.searchParams.set('api_key', getApiKey());
    url.searchParams.set('count', Math.min(count, 30).toString());
    url.searchParams.set('thumbs', 'true');

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 429) {
      tripCircuitBreaker();
      const fallbackGallery = getCuratedGallery(count);
      writeCache(cacheKey, fallbackGallery, 10 * 60 * 1000);
      return {
        data: fallbackGallery,
        error: null,
        isRateLimited: true,
        isFallback: true,
      };
    }

    if (!response.ok) {
      const fallbackGallery = getCuratedGallery(count);
      return {
        data: fallbackGallery,
        error: null,
        isFallback: true,
      };
    }

    const raw = await response.json();
    const result = ApodGallerySchema.safeParse(raw);

    if (!result.success) {
      console.error('[NASA Gallery Contract Discrepancy]:', result.error.format());
      return {
        data: getCuratedGallery(count),
        error: null,
        isFallback: true,
      };
    }

    // Cachear resultado exitoso por 30 minutos
    writeCache(cacheKey, result.data, 30 * 60 * 1000);
    return { data: result.data, error: null, isFallback: false };
  } catch {
    clearTimeout(timeoutId);
    tripCircuitBreaker();
    const fallbackGallery = getCuratedGallery(count);
    writeCache(cacheKey, fallbackGallery, 10 * 60 * 1000);
    return {
      data: fallbackGallery,
      error: null,
      isFallback: true,
      isRateLimited: true,
    };
  }
}
