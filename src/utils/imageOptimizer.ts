// APOD originals can weigh several megabytes. In production they go through
// Netlify Image CDN (resized, AVIF/WebP negotiated per browser); in local dev,
// where that endpoint does not exist, through wsrv.nl.

/** Archive thumbnails and the day plate's blurred preview share this width, so one is a cache hit for the other. */
export const THUMB_WIDTH = 480;

const isLocalHost = () =>
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

export function optimizedImageUrl(url: string, width: number): string {
  if (!/^https:\/\//.test(url) || /\.(svg|gif)(\?|$)/i.test(url)) return url;
  const encoded = encodeURIComponent(url);
  return isLocalHost()
    ? `https://wsrv.nl/?url=${encoded}&w=${width}&output=webp&q=80`
    : `/.netlify/images?url=${encoded}&w=${width}&q=80`;
}

export function optimizedSrcSet(url: string, widths: number[]): string {
  return widths.map((w) => `${optimizedImageUrl(url, w)} ${w}w`).join(', ');
}
