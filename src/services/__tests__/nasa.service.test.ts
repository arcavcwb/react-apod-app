import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchApodByDate,
  fetchApodMonth,
  fetchLatestApod,
  peekDay,
  purgeLegacyCache,
  thumbnailOf,
} from '../nasa.service';
import { ApodItem } from '../../contracts/apod.contract';

const item = (date: string, extra: Partial<ApodItem> = {}) => ({
  date,
  title: `Picture ${date}`,
  explanation: 'Explanation',
  media_type: 'image',
  url: `https://apod.nasa.gov/apod/image/${date}.jpg`,
  ...extra,
});

const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('nasa.service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-11T15:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns a validated day and serves it from cache afterwards', async () => {
    const fetchMock = respond(200, item('2020-01-01'));
    vi.stubGlobal('fetch', fetchMock);

    const first = await fetchApodByDate('2020-01-01');
    expect(first.data?.title).toBe('Picture 2020-01-01');
    const second = await fetchApodByDate('2020-01-01');
    expect(second.data?.title).toBe('Picture 2020-01-01');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports rate limits instead of inventing a picture', async () => {
    vi.stubGlobal('fetch', respond(429, { error: { code: 'OVER_RATE_LIMIT' } }));
    expect(await fetchApodByDate('2020-01-01')).toEqual({ data: null, error: 'rate-limit' });
    expect(peekDay('2020-01-01')).toBeNull();
  });

  it('maps missing days and network failures to their own errors', async () => {
    vi.stubGlobal('fetch', respond(404, { msg: 'No data available for date' }));
    expect((await fetchApodByDate('1995-06-17')).error).toBe('not-found');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    expect((await fetchApodByDate('2020-01-02')).error).toBe('network');
  });

  it('reports contract violations', async () => {
    vi.stubGlobal('fetch', respond(200, { title: 'no date' }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await fetchLatestApod()).error).toBe('contract');
  });

  // Answers each range request with one item per day in [start_date, end_date || today].
  const rangeServer = () =>
    vi.fn().mockImplementation(async (input: URL | string) => {
      const url = new URL(String(input));
      const from = url.searchParams.get('start_date')!;
      const to = url.searchParams.get('end_date') ?? '2026-09-11';
      const days = [];
      for (let d = Number(from.slice(8)); d <= Number(to.slice(8)); d++) days.push(item(`${from.slice(0, 8)}${String(d).padStart(2, '0')}`));
      return new Response(JSON.stringify(days), { status: 200 });
    });

  it('fetches a past month as parallel weeks and reuses it for its days', async () => {
    const fetchMock = rangeServer();
    vi.stubGlobal('fetch', fetchMock);

    const month = await fetchApodMonth('2026-08');
    expect(month.data).toHaveLength(31);
    const ranges = fetchMock.mock.calls.map(([u]) => {
      const url = new URL(String(u));
      return `${url.searchParams.get('start_date')}..${url.searchParams.get('end_date')}`;
    });
    expect(ranges).toEqual([
      '2026-08-01..2026-08-07',
      '2026-08-08..2026-08-14',
      '2026-08-15..2026-08-21',
      '2026-08-22..2026-08-28',
      '2026-08-29..2026-08-31',
    ]);

    expect((await fetchApodByDate('2026-08-02')).data?.title).toBe('Picture 2026-08-02');
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('leaves the end date off the week that reaches today', async () => {
    const fetchMock = rangeServer();
    vi.stubGlobal('fetch', fetchMock);
    const month = await fetchApodMonth('2026-09');
    expect(month.data?.map((d) => d.date).at(-1)).toBe('2026-09-11');
    const last = new URL(String(fetchMock.mock.calls.at(-1)![0]));
    expect(last.searchParams.get('start_date')).toBe('2026-09-08');
    expect(last.searchParams.has('end_date')).toBe(false);
  });

  it('reports each week as it lands', async () => {
    vi.stubGlobal('fetch', rangeServer());
    const progress: number[] = [];
    await fetchApodMonth('2026-08', (items) => progress.push(items.length));
    expect(progress).toHaveLength(5);
    expect(progress.at(-1)).toBe(31);
  });

  it('retries a week once after a network failure, and fails the month if it fails again', async () => {
    const server = rangeServer();
    const flaky = vi.fn().mockImplementation(async (input: URL | string) => {
      if (String(input).includes('start_date=2026-08-08') && flaky.mock.calls.filter(([u]) => String(u).includes('2026-08-08')).length === 1) {
        throw new TypeError('Failed to fetch');
      }
      return server(input);
    });
    vi.stubGlobal('fetch', flaky);
    expect((await fetchApodMonth('2026-08')).data).toHaveLength(31);

    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: URL | string) => {
      if (String(input).includes('start_date=2026-07-15')) return new Response('{}', { status: 503 });
      return server(input);
    }));
    expect(await fetchApodMonth('2026-07')).toEqual({ data: null, error: 'network' });
  });

  it('expires the current month after an hour but keeps past months', async () => {
    const fetchMock = rangeServer();
    vi.stubGlobal('fetch', fetchMock);
    await fetchApodMonth('2026-09');
    await fetchApodMonth('2026-08');
    const calls = fetchMock.mock.calls.length;
    vi.setSystemTime(new Date('2026-09-11T16:30:00Z'));
    await fetchApodMonth('2026-08');
    expect(fetchMock.mock.calls.length).toBe(calls);
    await fetchApodMonth('2026-09');
    expect(fetchMock.mock.calls.length).toBe(calls + 2);
  });

  it('purges caches written by earlier versions', () => {
    localStorage.setItem('apod_cache_v2_item_today', '{}');
    localStorage.setItem('apod:locale', 'es');
    purgeLegacyCache();
    expect(localStorage.getItem('apod_cache_v2_item_today')).toBeNull();
    expect(localStorage.getItem('apod:locale')).toBe('es');
  });

  it('derives thumbnails for videos', () => {
    const video = (url: string, thumbnail_url?: string) =>
      ({ ...item('2020-01-01'), media_type: 'video', url, thumbnail_url }) as ApodItem;
    expect(thumbnailOf(video('https://www.youtube.com/embed/abc123XYZ?rel=0'))).toBe(
      'https://img.youtube.com/vi/abc123XYZ/hqdefault.jpg'
    );
    expect(thumbnailOf(video('https://player.vimeo.com/video/1', 'https://i.vimeocdn.com/x.jpg'))).toBe(
      'https://i.vimeocdn.com/x.jpg'
    );
    expect(thumbnailOf(video('https://player.vimeo.com/video/1'))).toBeUndefined();
  });
});
