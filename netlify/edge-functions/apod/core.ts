// APOD's days, read from its official site. NASA's old API (api.nasa.gov/planetary/apod) stopped answering
// real days when APOD moved to science.nasa.gov; the site's own WordPress publishes every day as JSON.
// Shared by the Edge Functions (production), the Vite dev server (local) and the unit tests.
// Relative imports carry their extension, as Deno requires.
import { ApodItemSchema, ApodPostListSchema, type ApodItem, type ApodPost } from '../../../src/contracts/apod.contract.ts';
import { apodToday, isValidApodDate, shiftDay } from '../../../src/utils/date.ts';

const SOURCE = 'https://science.nasa.gov/wp-json/wp/v2/image-article';
// The id of the site's "apod" category (science.nasa.gov/wp-json/wp/v2/categories?slug=apod).
const APOD_CATEGORY = '22766';
// WordPress answers at most 100 posts a page; the app never asks for more than a month.
const MAX_DAYS = 100;
const DAY_MS = 86_400_000;
const TIMEOUT_MS = 12_000;

export type ApodError = 'bad-request' | 'not-found' | 'rate-limit' | 'upstream';
export type ApodResult<T> = { ok: true; data: T } | { ok: false; error: ApodError };

export interface ApodDeps {
  /** For tests; defaults to today in US Eastern time. */
  today?: string;
  /** How long to wait for NASA's site, in milliseconds. */
  timeout?: number;
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}

const STATUS: Record<ApodError, number> = { 'bad-request': 400, 'not-found': 404, 'rate-limit': 429, upstream: 502 };

const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** WordPress writes typography as numeric entities; these and the few named ones cover what it sends. */
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return NAMED[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });

/** The words of a piece of HTML, on one line. Links leave stray spaces around punctuation ("Earth , Moon"). */
const text = (html: string) =>
  decode(html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .replace(/ ([,.;:!?)])(?!\d)/g, '$1')
    .replace(/\( /g, '(')
    .trim();

const attribute = (html: string, tag: string, name: string) => {
  const value = html.match(new RegExp(`<${tag}\\b[^>]*\\s${name}="([^"]+)"`, 'i'))?.[1];
  return value ? decode(value) : undefined;
};

/** The day's media: a NASA-hosted video file, an embedded player, a picture, or none of them (interactive days). */
function mediaOf(hero: string): Pick<ApodItem, 'media_type' | 'url' | 'hdurl'> {
  const video = attribute(hero, 'source', 'src') ?? attribute(hero, 'iframe', 'src');
  if (video) return { media_type: 'video', url: video };
  // Days with an annotated version carry two pictures; the first is the day's own.
  const picture = attribute(hero, 'img', 'src');
  // The picture links to its largest version, when it links at all.
  const largest = hero.match(/<figure[^>]*>\s*<a\b[^>]*\shref="([^"]+)"/i)?.[1];
  if (picture) return { media_type: 'image', url: picture, hdurl: largest ? decode(largest) : picture };
  return { media_type: 'other' };
}

/** One post of the official site as the app's day. The page's markup is the contract here: see the recorded fixtures. */
export function toApodItem(post: ApodPost): ApodItem | null {
  const html = post.content.rendered;
  const hero = html.split('media-detail-hero__media')[1]?.split(/<h1\b|media-detail-hero__content-row/)[0] ?? '';
  // The page's heading is the title as APOD wrote it; the post's own title is a simplified copy ("Hoags Object").
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = text(heading ?? post.title.rendered).replace(/^APOD:\s*\d{4}\s+\S+\s+\d{1,2}\s*[–—-]\s*/, '');
  const explanation = html.match(/<p class="[^"]*media-detail-hero__description[^"]*">([\s\S]*?)<\/p>/i)?.[1] ?? '';
  const credit = [...html.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>\s*<td\b[^>]*>([\s\S]*?)<\/td>/gi)].find(([, label]) =>
    /credit|copyright/i.test(label)
  )?.[2];

  const parsed = ApodItemSchema.safeParse({
    date: post.date.slice(0, 10),
    title,
    // NASA's words up to its teaser for the next day, without the "Explanation:" label.
    explanation: text(
      explanation
        .replace(/(?:<br\s*\/?>|<strong>)\s*Tomorrow(?:&#8217;|['’])s picture[\s\S]*$/i, '')
        .replace(/^\s*<strong>\s*Explanation:?\s*<\/strong>/i, '')
    ),
    ...mediaOf(hero),
    // Older days repeat the label inside the credit itself ("Image Credit & Copyright: …").
    copyright: credit === undefined ? undefined : text(credit).replace(/^(?:[a-z]+\s+){0,2}(?:credit|copyright)[^:;,]{0,30}:\s*/i, ''),
  });
  return parsed.success ? parsed.data : null;
}

async function ask(query: Record<string, string>, deps: ApodDeps): Promise<ApodResult<ApodItem[]>> {
  const url = `${SOURCE}?${new URLSearchParams({ categories: APOD_CATEGORY, _fields: 'date,title,content', ...query })}`;
  try {
    const response = await (deps.fetch ?? fetch)(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'NASA-APOD-Explorer (+https://apodgallery.netlify.app)' },
      signal: AbortSignal.timeout(deps.timeout ?? TIMEOUT_MS),
    });
    if (response.status === 429) return { ok: false, error: 'rate-limit' };
    if (!response.ok) return { ok: false, error: 'upstream' };
    const posts = ApodPostListSchema.safeParse(await response.json());
    if (!posts.success) return { ok: false, error: 'upstream' };
    const days = posts.data.map(toApodItem);
    // A post that is not a day means the site changed: say so rather than answer part of a range.
    if (days.includes(null)) return { ok: false, error: 'upstream' };
    return { ok: true, data: days as ApodItem[] };
  } catch {
    return { ok: false, error: 'upstream' };
  }
}

/** The latest published day. */
export async function latestApod(deps: ApodDeps = {}): Promise<ApodResult<ApodItem>> {
  const days = await ask({ per_page: '1', orderby: 'date', order: 'desc' }, deps);
  if (!days.ok) return days;
  return days.data[0] ? { ok: true, data: days.data[0] } : { ok: false, error: 'not-found' };
}

/** Every published day from `start` to `end`, both included, oldest first. Days APOD skipped are simply absent. */
export async function apodDays(start: string, end: string, deps: ApodDeps = {}): Promise<ApodResult<ApodItem[]>> {
  const today = deps.today ?? apodToday();
  if (!isValidApodDate(start, today) || !isValidApodDate(end, today) || start > end) return { ok: false, error: 'bad-request' };
  if ((Date.parse(end) - Date.parse(start)) / DAY_MS >= MAX_DAYS) return { ok: false, error: 'bad-request' };

  const days = await ask(
    // `after` excludes its own instant, and older days are published at 00:00:00: start from the night before.
    { after: `${shiftDay(start, -1)}T23:59:59`, before: `${end}T23:59:59`, per_page: String(MAX_DAYS), orderby: 'date', order: 'asc' },
    deps
  );
  if (!days.ok) return days;
  return { ok: true, data: days.data.filter((day) => day.date >= start && day.date <= end) };
}

/** One day, or `not-found` when APOD published nothing on it. */
export async function apodDay(date: string, deps: ApodDeps = {}): Promise<ApodResult<ApodItem>> {
  const days = await apodDays(date, date, deps);
  if (!days.ok) return days;
  return days.data[0] ? { ok: true, data: days.data[0] } : { ok: false, error: 'not-found' };
}

export interface ApodAnswer {
  status: number;
  body: ApodItem | ApodItem[] | { error: ApodError };
  /** Whether the answer can still change: it reaches today, or it failed. */
  open: boolean;
}

/**
 * What /api/apod answers, with the parameters NASA's API had: `date` for one day, `start_date` (and
 * `end_date`, today when absent) for a range, nothing for the latest day.
 */
export async function answerApod(query: URLSearchParams, deps: ApodDeps = {}): Promise<ApodAnswer> {
  const today = deps.today ?? apodToday();
  const [date, start, end] = [query.get('date'), query.get('start_date'), query.get('end_date')];

  const result = date !== null ? await apodDay(date, deps) : start !== null ? await apodDays(start, end ?? today, deps) : await latestApod(deps);
  if (!result.ok) return { status: STATUS[result.error], body: { error: result.error }, open: true };
  return { status: 200, body: result.data, open: (date ?? (start === null ? today : end ?? today)) >= today };
}
