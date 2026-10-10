// Link previews for shared days. The app is a single-page app, so every address serves the same
// index.html, and link crawlers (WhatsApp, Telegram, X, Slack, iMessage) read Open Graph tags without
// running scripts. For /apod/YYYY-MM-DD this reads the day from APOD's official site, server-side, and
// writes its title, a few lines and its picture into the page. Anything unexpected leaves the page
// untouched.
import { apodDay } from '../apod/core.ts';
import { injectPreview, previewFor } from './preview.ts';

const DAY_PATH = /^\/apod\/(\d{4}-\d{2}-\d{2})\/?$/;

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const page = await context.next();
  const address = new URL(request.url);
  const match = address.pathname.match(DAY_PATH);
  if (!match || !page.ok || !page.headers.get('content-type')?.includes('text/html')) return page;

  // Crawlers do not wait long; a slow answer just means a plain link.
  const day = await apodDay(match[1], { timeout: 4000 });
  if (!day.ok) return page;

  const headers = new Headers(page.headers);
  headers.delete('content-length');
  // A published day never changes: the CDN keeps the finished page for a day (every deploy clears it).
  headers.set('Netlify-CDN-Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800, durable');
  return new Response(injectPreview(await page.text(), previewFor(day.data, address.origin)), { status: page.status, headers });
};

export const config = { path: '/apod/*', cache: 'manual' };
