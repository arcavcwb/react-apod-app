// Link previews for shared days. The app is a single-page app, so every address serves the same
// index.html, and link crawlers (WhatsApp, Telegram, X, Slack, iMessage) read Open Graph tags without
// running scripts. For /apod/YYYY-MM-DD this asks NASA for the day, server-side with the site's own key,
// and writes its title, a few lines and its picture into the page. Anything unexpected leaves the page
// untouched.
import { injectPreview, previewFor, type ApodDay } from './preview.ts';

declare const Netlify: { env: { get(name: string): string | undefined } };

const DAY_PATH = /^\/apod\/(\d{4}-\d{2}-\d{2})\/?$/;

async function fetchDay(date: string): Promise<ApodDay | null> {
  const key = Netlify.env.get('VITE_NASA_API_KEY') || 'DEMO_KEY';
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&thumbs=true&api_key=${key}`, {
      // Crawlers do not wait long; a slow NASA answer just means a plain link.
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const day = await response.json();
    return typeof day?.title === 'string' && typeof day?.date === 'string' && typeof day?.media_type === 'string' ? day : null;
  } catch {
    return null;
  }
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const page = await context.next();
  const address = new URL(request.url);
  const match = address.pathname.match(DAY_PATH);
  if (!match || !page.ok || !page.headers.get('content-type')?.includes('text/html')) return page;

  const day = await fetchDay(match[1]);
  if (!day) return page;

  const headers = new Headers(page.headers);
  headers.delete('content-length');
  // A published day never changes: the CDN keeps the finished page for a day (every deploy clears it).
  headers.set('Netlify-CDN-Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800, durable');
  return new Response(injectPreview(await page.text(), previewFor(day, address.origin)), { status: page.status, headers });
};

export const config = { path: '/apod/*', cache: 'manual' };
