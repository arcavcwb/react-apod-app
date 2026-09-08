import { ApodItem, ApodItemSchema, ApodGallery, ApodGallerySchema } from '../contracts/apod.contract';

const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';

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
}

/**
 * Obtiene la Imagen Astronómica del Día de hoy
 */
export async function fetchTodayApod(): Promise<ApiResponse<ApodItem>> {
  return fetchApodByDate();
}

/**
 * Obtiene la Imagen Astronómica del Día para una fecha específica (YYYY-MM-DD)
 */
export async function fetchApodByDate(date?: string): Promise<ApiResponse<ApodItem>> {
  try {
    const url = new URL(NASA_BASE_URL);
    url.searchParams.set('api_key', getApiKey());
    if (date) {
      url.searchParams.set('date', date);
    }

    const response = await fetch(url.toString());

    if (response.status === 429) {
      return {
        data: null,
        error: 'Límite de cuota de la API de NASA excedido para DEMO_KEY. Intenta de nuevo en unos momentos o configura una API Key propia en .env.',
        isRateLimited: true,
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const msg = errorData?.error?.message || errorData?.msg || `Error en la solicitud a NASA: ${response.status} ${response.statusText}`;
      return { data: null, error: msg };
    }

    const raw = await response.json();
    const result = ApodItemSchema.safeParse(raw);

    if (!result.success) {
      console.error('[NASA Contract Discrepancy]:', result.error.format());
      return {
        data: null,
        error: 'La respuesta de la NASA no coincide con el contrato de datos esperado.',
      };
    }

    return { data: result.data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error de conexión con el servicio astronómico.';
    return { data: null, error: message };
  }
}

/**
 * Obtiene una colección aleatoria de imágenes espaciales para la galería
 */
export async function fetchRandomApods(count: number = 12): Promise<ApiResponse<ApodGallery>> {
  try {
    const url = new URL(NASA_BASE_URL);
    url.searchParams.set('api_key', getApiKey());
    url.searchParams.set('count', Math.min(count, 30).toString());

    const response = await fetch(url.toString());

    if (response.status === 429) {
      return {
        data: null,
        error: 'Límite de cuota de la API de NASA excedido. Espera unos segundos o agrega tu API Key.',
        isRateLimited: true,
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const msg = errorData?.error?.message || errorData?.msg || `Error de galería NASA: ${response.status}`;
      return { data: null, error: msg };
    }

    const raw = await response.json();
    const result = ApodGallerySchema.safeParse(raw);

    if (!result.success) {
      console.error('[NASA Gallery Contract Discrepancy]:', result.error.format());
      return {
        data: null,
        error: 'Discrepancia en el formato de datos de la galería astronómica.',
      };
    }

    return { data: result.data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al conectar con la galería de la NASA.';
    return { data: null, error: message };
  }
}
