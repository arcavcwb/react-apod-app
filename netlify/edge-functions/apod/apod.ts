// /api/apod answers APOD's days as the app reads them: ?date=YYYY-MM-DD for one day, ?start_date= (and
// ?end_date=) for a range, nothing for the latest. The work is in core.ts, shared with the Vite dev
// server; this adds the CDN cache, so NASA's site is asked once per answer and not once per reader.
import { answerApod } from './core.ts';

export default async (request: Request) => {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });

  const answer = await answerApod(new URL(request.url).searchParams);
  if (answer.status !== 200) return Response.json(answer.body, { status: answer.status, headers: { 'Cache-Control': 'no-store' } });

  // A published day does not change, but it is read from a page that may: a day, not a year. Anything
  // that reaches today (the latest day, the current week) is asked again after ten minutes.
  const cdn = answer.open ? 's-maxage=600' : 's-maxage=86400, stale-while-revalidate=604800';
  return Response.json(answer.body, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Netlify-CDN-Cache-Control': `public, durable, ${cdn}`,
      'Netlify-Vary': 'query=date|start_date|end_date',
    },
  });
};

export const config = { path: '/api/apod', cache: 'manual' };
