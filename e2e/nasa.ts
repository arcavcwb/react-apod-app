import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

// What /api/apod answers for 2026-09-11, read from APOD's official site as recorded on 2026-10-09. The
// suite never reaches NASA's site or DeepL: the app's two endpoints are answered here. Any other date
// answers 404, exactly as the endpoint does for a day without a picture.
export const TODAY = '2026-09-11';
export const today = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', `${TODAY}.json`), 'utf8'));

const json = (body: unknown, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

/** Serves the recorded day; `rateLimited` answers every request with HTTP 429 instead. */
export async function serveNasa(page: Page, { rateLimited = false } = {}) {
  await page.clock.setFixedTime(new Date(`${TODAY}T15:00:00Z`));
  await page.route(/\/api\/apod(\?|$)/, (route) => {
    if (rateLimited) return route.fulfill(json({ error: 'rate-limit' }, 429));
    const url = new URL(route.request().url());
    const date = url.searchParams.get('date');
    const start = url.searchParams.get('start_date');
    if (start) {
      // The app asks for a month as weekly ranges; answer each with the recorded day if it falls inside.
      const end = url.searchParams.get('end_date') ?? TODAY;
      return route.fulfill(json(start <= TODAY && TODAY <= end ? [today] : []));
    }
    if (!date || date === TODAY) return route.fulfill(json(today));
    return route.fulfill(json({ error: 'not-found' }, 404));
  });
  // No translation unless a test serves one: the reader gets NASA's original.
  await page.route(/\/api\/translate\?/, (route) => route.fulfill(json({ error: 'not-configured' }, 503)));
  // Keep image hosts out of the test: a 1px PNG stands in for every picture.
  await page.route(/wsrv\.nl|assets\.science\.nasa\.gov|img\.youtube\.com/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
    })
  );
}
