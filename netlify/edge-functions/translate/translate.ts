// /api/translate?date=YYYY-MM-DD&lang=es|pt-BR answers one day's APOD explanation in Spanish or Brazilian
// Portuguese. The work is in core.ts, shared with the Vite dev server; this adds the keys and the CDN cache.
import { apodToday } from '../../../src/utils/date.ts';
import { statusFor, translateExplanation } from './core.ts';

declare const Netlify: { env: { get(name: string): string | undefined } };

export default async (request: Request) => {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });

  const query = new URL(request.url).searchParams;
  const result = await translateExplanation(query.get('date'), query.get('lang'), {
    deeplKey: Netlify.env.get('DEEPL_API_KEY'),
    nasaKey: Netlify.env.get('VITE_NASA_API_KEY'),
  });
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: statusFor(result.error), headers: { 'Cache-Control': 'no-store' } });
  }

  // A published day's text does not change (today's may still be corrected), so the CDN keeps each
  // translation and DeepL is asked once per day and language until the next deploy.
  const maxAge = result.translation.date === apodToday() ? 3600 : 31536000;
  return Response.json(result.translation, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Netlify-CDN-Cache-Control': `public, durable, s-maxage=${maxAge}`,
      'Netlify-Vary': 'query=date|lang',
    },
  });
};

export const config = { path: '/api/translate', cache: 'manual' };
