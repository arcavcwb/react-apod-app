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

  it('fetches a past month in one request and reuses it for its days', async () => {
    const fetchMock = respond(200, [item('2026-08-01'), item('2026-08-02')]);
    vi.stubGlobal('fetch', fetchMock);

    const month = await fetchApodMonth('2026-08');
    expect(month.data).toHaveLength(2);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get('start_date')).toBe('2026-08-01');
    expect(url.searchParams.get('end_date')).toBe('2026-08-31');

    expect((await fetchApodByDate('2026-08-02')).data?.title).toBe('Picture 2026-08-02');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('asks for the current month without an end date', async () => {
    const fetchMock = respond(200, [item('2026-09-01')]);
    vi.stubGlobal('fetch', fetchMock);
    await fetchApodMonth('2026-09');
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get('start_date')).toBe('2026-09-01');
    expect(url.searchParams.has('end_date')).toBe(false);
  });

  it('expires the current month after an hour but keeps past months', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => new Response(JSON.stringify([item('2026-09-01')]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchApodMonth('2026-09');
    vi.setSystemTime(new Date('2026-09-11T16:30:00Z'));
    await fetchApodMonth('2026-09');
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
