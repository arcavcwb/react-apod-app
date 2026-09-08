import { ApodItem, ApodItemSchema, ApodGallery, ApodGallerySchema } from '../contracts/apod.contract';
import { getCuratedApod, getCuratedGallery } from './curatedApod';

const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const REQUEST_TIMEOUT_MS = 8000;

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
// Utilidades de Caché en Cliente (localStorage)
// -------------------------------------------------------------
interface CacheEnvelope<T> {
  timestamp: number;
  ttl: number; // 0 = sin expiración (fechas históricas inmutables)
  payload: T;
}

function getCacheKey(prefix: string, id: string): string {
  return `apod_cache_v1_${prefix}_${id}`;
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
export async function fetchTodayApod(): Promise<ApiResponse<ApodItem>> {
  return fetchApodByDate();
}

/**
 * Obtiene la Imagen Astronómica del Día para una fecha específica (YYYY-MM-DD).
 * Aplica estrategia de caché inmutable para fechas históricas y fallback curado
 * si la cuota de la NASA está saturada (HTTP 429) o la conexión falla.
 */
export async function fetchApodByDate(date?: string): Promise<ApiResponse<ApodItem>> {
  const isSpecificDate = !!date;
  const cacheKey = getCacheKey('item', date || 'today');

  // 1. Verificar Caché en Cliente
  const cached = readCache<ApodItem>(cacheKey);
  if (cached) {
    const parsed = ApodItemSchema.safeParse(cached);
    if (parsed.success) {
      return { data: parsed.data, error: null, isFallback: false };
    }
  }

  // 2. Preparar Petición con AbortController para prevenir cuelgues
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
      console.warn('[NASA Service] Rate limit 429 excedido. Activando catálogo de respaldo.');
      const fallbackItem = getCuratedApod(date);
      return {
        data: fallbackItem,
        error: null,
        isRateLimited: true,
        isFallback: true,
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const msg = errorData?.error?.message || errorData?.msg || `Error de NASA API: ${response.status}`;
      console.warn('[NASA Service] Error en respuesta remota:', msg);
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
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn('[NASA Service] Red no disponible o timeout alcanzado. Utilizando respaldo astronómico.', err);
    const fallbackItem = getCuratedApod(date);
    return {
      data: fallbackItem,
      error: null,
      isFallback: true,
    };
  }
}

/**
 * Obtiene una colección aleatoria de imágenes espaciales para la galería.
 * Si la API de NASA excede la cuota (429) o agota el tiempo de espera,
 * conmuta inmediatamente a la colección curada sin dejar la UI en blanco.
 */
export async function fetchRandomApods(count: number = 12): Promise<ApiResponse<ApodGallery>> {
  const cacheKey = getCacheKey('gallery', `count_${count}`);

  // 1. Revisar caché de galería de corta duración (30 minutos)
  const cached = readCache<ApodGallery>(cacheKey);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    const parsed = ApodGallerySchema.safeParse(cached);
    if (parsed.success) {
      return { data: parsed.data, error: null, isFallback: false };
    }
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
      console.warn('[NASA Gallery] Cuota 429 excedida. Conmutando a catálogo curado.');
      return {
        data: getCuratedGallery(count),
        error: null,
        isRateLimited: true,
        isFallback: true,
      };
    }

    if (!response.ok) {
      console.warn('[NASA Gallery] Respuesta no exitosa:', response.status);
      return {
        data: getCuratedGallery(count),
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
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn('[NASA Gallery] Fallo de red o timeout. Conmutando a catálogo curado.');
    return {
      data: getCuratedGallery(count),
      error: null,
      isFallback: true,
    };
  }
}
