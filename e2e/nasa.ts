import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

// Responses recorded from api.nasa.gov (see e2e/fixtures). The public DEMO_KEY allows
// 10 requests per hour, so live calls would make the suite flaky; these are the real payloads.
const dir = path.join(import.meta.dirname, 'fixtures');
const load = (name: string) => JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), 'utf8'));

export const TODAY = '2026-09-11';
export const today = load(TODAY);
export const september: { date: string; title: string }[] = load('2026-09');

const json = (body: unknown, status = 200) => ({
  status,
  contentType: 'application/json',
  headers: { 'access-control-allow-origin': '*' },
  body: JSON.stringify(body),
});

/** Serves the recorded archive; `rateLimited` answers every request with HTTP 429 instead. */
export async function serveNasa(page: Page, { rateLimited = false } = {}) {
  await page.clock.setFixedTime(new Date(`${TODAY}T15:00:00Z`));
  await page.route('https://api.nasa.gov/**', (route) => {
    if (rateLimited) return route.fulfill(json({ error: { code: 'OVER_RATE_LIMIT' } }, 429));
    const url = new URL(route.request().url());
    const date = url.searchParams.get('date');
    const start = url.searchParams.get('start_date');
    if (start?.startsWith('2026-09')) return route.fulfill(json(september));
    const item = date ? september.find((d) => d.date === date) : today;
    return route.fulfill(item ? json(item) : json({ msg: 'No data available for date' }, 404));
  });
  // Keep image hosts out of the test: a 1px PNG stands in for every picture.
  await page.route(/wsrv\.nl|apod\.nasa\.gov\/apod\/image|img\.youtube\.com/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
    })
  );
}
