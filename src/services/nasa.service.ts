import { ApodItem, ApodItemSchema, ApodListSchema } from '../contracts/apod.contract';
import { apodToday, monthOf, monthRange } from '../utils/date';

const API_URL = 'https://api.nasa.gov/planetary/apod';
const TIMEOUT_MS = 15_000;
const HOUR_MS = 3_600_000;
const CACHE_PREFIX = 'apod:v3:';

export type ApodErrorKind = 'rate-limit' | 'not-found' | 'network' | 'contract';
export type ApodResult<T> = { data: T; error: null } | { data: null; error: ApodErrorKind };

function apiKey(): string {
  return import.meta.env.VITE_NASA_API_KEY?.trim() || 'DEMO_KEY';
}

// ---------------------------------------------------------------------------
// localStorage cache. Past days and past months never change, so they are kept
// forever; anything that includes "today" expires after an hour.
// ---------------------------------------------------------------------------
interface Envelope<T> {
  expires: number | null;
  value: T;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { expires, value } = JSON.parse(raw) as Envelope<T>;
    return expires === null || expires > Date.now() ? value : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T, ttl: number | null): void {
  try {
    const envelope: Envelope<T> = { expires: ttl === null ? null : Date.now() + ttl, value };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(envelope));
  } catch {
    // Storage full or disabled: the app still works, just without a cache.
  }
}

/** Drops caches from earlier versions, which could hold substitute images stored as real days. */
export function purgeLegacyCache(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('apod_cache_'))
      .forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem('nasa_circuit_breaker_until');
  } catch {
    // ignore
  }
}

const cacheDay = (item: ApodItem, today: string) => writeCache(`day:${item.date}`, item, item.date === today ? HOUR_MS : null);

// Synchronous cache reads, so cached days render without a loading frame.
export const peekMonth = (month: string) => readCache<ApodItem[]>(`month:${month}`);
export const peekDay = (date: string) =>
  readCache<ApodItem>(`day:${date}`) ?? peekMonth(monthOf(date))?.find((d) => d.date === date) ?? null;
export const peekLatest = () => peekDay(apodToday()) ?? readCache<ApodItem>('latest');

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
async function request(params: Record<string, string>): Promise<ApodResult<unknown>> {
  const url = new URL(API_URL);
  url.searchParams.set('api_key', apiKey());
  url.searchParams.set('thumbs', 'true');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    return { data: null, error: 'network' };
  }
  if (response.status === 429) return { data: null, error: 'rate-limit' };
  // The API answers 400 for dates outside the archive and 404 for days without a picture.
  if (response.status === 400 || response.status === 404) return { data: null, error: 'not-found' };
  if (!response.ok) return { data: null, error: 'network' };

  try {
    return { data: await response.json(), error: null };
  } catch {
    return { data: null, error: 'contract' };
  }
}

/** Latest published picture. NASA may not have published "today" yet, so no date is sent. */
export async function fetchLatestApod(): Promise<ApodResult<ApodItem>> {
  const today = apodToday();
  const cached = peekLatest();
  if (cached) return { data: cached, error: null };

  const res = await request({});
  if (res.error) return res;
  const parsed = ApodItemSchema.safeParse(res.data);
  if (!parsed.success) {
    console.error('[APOD contract]', parsed.error.issues);
    return { data: null, error: 'contract' };
  }
  writeCache('latest', parsed.data, HOUR_MS);
  cacheDay(parsed.data, today);
  return { data: parsed.data, error: null };
}

export async function fetchApodByDate(date: string): Promise<ApodResult<ApodItem>> {
  const today = apodToday();
  const cached = peekDay(date);
  if (cached) return { data: cached, error: null };

  const res = await request({ date });
  if (res.error) return res;
  const parsed = ApodItemSchema.safeParse(res.data);
  if (!parsed.success) {
    console.error('[APOD contract]', parsed.error.issues);
    return { data: null, error: 'contract' };
  }
  cacheDay(parsed.data, today);
  return { data: parsed.data, error: null };
}

async function fetchRange(params: Record<string, string>, month: string): Promise<ApodResult<ApodItem[]>> {
  let res = await request(params);
  // NASA's range endpoint is slow and flaky; one retry absorbs most timeouts and 5xx.
  if (res.error === 'network') res = await request(params);
  if (res.error) return res;
  const parsed = ApodListSchema.safeParse(res.data);
  if (!parsed.success) {
    console.error('[APOD contract]', parsed.error.issues);
    return { data: null, error: 'contract' };
  }
  return { data: parsed.data.filter((d) => monthOf(d.date) === month), error: null };
}

/**
 * Every picture of a month; also fills the per-day cache.
 * NASA answers a whole month in 5 to 40 seconds but a week in about 2, so the month is
 * fetched as parallel weeks and `onProgress` receives each week as it lands.
 */
export async function fetchApodMonth(
  month: string,
  onProgress?: (items: ApodItem[]) => void
): Promise<ApodResult<ApodItem[]>> {
  const today = apodToday();
  const cached = peekMonth(month);
  if (cached) return { data: cached, error: null };

  const { start, end } = monthRange(month, today);
  const isCurrent = month === monthOf(today);
  const chunks: Record<string, string>[] = [];
  for (let day = Number(start.slice(8)); day <= Number(end.slice(8)); day += 7) {
    const last = Math.min(day + 6, Number(end.slice(8)));
    const chunk = { start_date: `${month}-${String(day).padStart(2, '0')}`, end_date: `${month}-${String(last).padStart(2, '0')}` };
    // The week that reaches today leaves end_date out, so NASA stops at its latest published day.
    chunks.push(isCurrent && last === Number(end.slice(8)) ? { start_date: chunk.start_date } : chunk);
  }

  const collected: ApodItem[] = [];
  const byDate = (a: ApodItem, b: ApodItem) => a.date.localeCompare(b.date);
  const results = await Promise.all(
    chunks.map(async (params) => {
      const res = await fetchRange(params, month);
      if (res.data) {
        collected.push(...res.data);
        onProgress?.([...collected].sort(byDate));
      }
      return res;
    })
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { data: null, error: failed.error };

  const items = collected.sort(byDate);
  writeCache(`month:${month}`, items, isCurrent ? HOUR_MS : null);
  items.forEach((item) => cacheDay(item, today));
  return { data: items, error: null };
}

/** Thumbnail for grids: the video still when there is one, otherwise the image itself. */
export function thumbnailOf(item: ApodItem): string | undefined {
  if (item.media_type === 'image') return item.url;
  if (item.thumbnail_url) return item.thumbnail_url;
  const yt = item.url?.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{6,})/i);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : undefined;
}
