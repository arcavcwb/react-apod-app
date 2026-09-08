/**
 * Utilidad de optimización y aceleración de entrega de medios astronómicos.
 *
 * Estrategia de entrega:
 * 1. En Producción (Netlify Edge): Utiliza el endpoint oficial de Netlify Image CDN
 *    `/.netlify/images?url=...&w=...&q=80&fm=webp` que procesa y sirve desde el Edge de Netlify.
 * 2. En Desarrollo Local (Vite dev en localhost): Conmuta automáticamente a wsrv.nl (Cloudflare Edge Cache)
 *    para disponer de transcodificación instantánea a WebP a <100ms sin requerir Netlify CLI.
 * 3. En caso de error o URL local/SVG: Retorna la URL original.
 */

export interface OptimizeImageOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif';
}

export function getOptimizedImageUrl(
  rawUrl: string,
  options: OptimizeImageOptions = {}
): string {
  if (!rawUrl) return '';

  // Preservar URLs locales, data URIs y SVGs
  if (
    rawUrl.startsWith('data:') ||
    rawUrl.endsWith('.svg') ||
    rawUrl.startsWith('/') ||
    rawUrl.startsWith('./')
  ) {
    return rawUrl;
  }

  const { width = 800, quality = 80, format = 'webp' } = options;

  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  if (!isLocal) {
    // Netlify Image CDN oficial para producción
    return `/.netlify/images?url=${encodeURIComponent(rawUrl)}&w=${width}&q=${quality}&fm=${format}`;
  }

  // Edge CDN acelerador para entorno de desarrollo local
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${width}&q=${quality}&output=${format}`;
}
