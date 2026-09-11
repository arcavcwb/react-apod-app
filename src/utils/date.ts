// APOD dates are plain YYYY-MM-DD strings. NASA publishes on US Eastern time,
// so "today" is computed there, not from the visitor's clock or UTC.

export const APOD_FIRST_DATE = '1995-06-16';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const DAY_MS = 86_400_000;

const easternParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function eastern(now: Date) {
  const p = Object.fromEntries(easternParts.formatToParts(now).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour), minute: Number(p.minute) };
}

export function apodToday(now = new Date()): string {
  return eastern(now).date;
}

/** Whole hours until the next midnight in US Eastern time, rounded up. */
export function hoursUntilNextApod(now = new Date()): number {
  const { hour, minute } = eastern(now);
  return Math.ceil((24 * 60 - (hour * 60 + minute)) / 60);
}

const toUtc = (date: string) => Date.parse(`${date}T00:00:00Z`);
const fromUtc = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function isValidApodDate(date: string | undefined, today = apodToday()): date is string {
  if (!date || !DATE_RE.test(date) || Number.isNaN(toUtc(date))) return false;
  // Rejects rollovers such as 2026-02-30.
  if (fromUtc(toUtc(date)) !== date) return false;
  return date >= APOD_FIRST_DATE && date <= today;
}

export function shiftDay(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

/** Days elapsed since the first APOD, counting that day as day 1. */
export function dayNumber(date: string): number {
  return Math.round((toUtc(date) - toUtc(APOD_FIRST_DATE)) / DAY_MS) + 1;
}

export function randomApodDate(today = apodToday(), random = Math.random): string {
  const span = dayNumber(today);
  return shiftDay(APOD_FIRST_DATE, Math.floor(random() * span));
}

export const monthOf = (date: string) => date.slice(0, 7);

export function isValidMonth(month: string | undefined, today = apodToday()): month is string {
  return !!month && MONTH_RE.test(month) && month >= monthOf(APOD_FIRST_DATE) && month <= monthOf(today);
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** First and last date of a month that APOD can have, clamped to the archive range. */
export function monthRange(month: string, today = apodToday()): { start: string; end: string } {
  const start = `${month}-01` < APOD_FIRST_DATE ? APOD_FIRST_DATE : `${month}-01`;
  const last = `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
  return { start, end: last > today ? today : last };
}

/** Monday-first weekday index (0-6) of the first day of the month. */
export function firstWeekday(month: string): number {
  return (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** Official page for a day, e.g. https://apod.nasa.gov/apod/ap260911.html */
export function officialApodUrl(date: string): string {
  return `https://apod.nasa.gov/apod/ap${date.slice(2).replace(/-/g, '')}.html`;
}

/** Plate code printed on the official site's URL, e.g. AP260911. */
export const plateCode = (date: string) => `AP${date.slice(2).replace(/-/g, '')}`;

/** Formats an APOD date without shifting it into the visitor's time zone. */
export function formatApodDate(date: string, locale: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toUtc(date));
}
