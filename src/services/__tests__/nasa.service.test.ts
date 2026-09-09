import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApodByDate, getMediaThumbnail, resetCircuitBreaker, isCircuitBreakerOpen } from '../nasa.service';
import { ApodItem } from '../../contracts/apod.contract';

describe('NASA Service Resilience & Circuit Breaker', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetCircuitBreaker();
    vi.restoreAllMocks();
  });

  it('extracts youtube thumbnail when thumbnail_url is missing', () => {
    const item: ApodItem = {
      title: 'Mars Rover Video',
      date: '2023-05-01',
      explanation: 'Video',
      media_type: 'video',
      url: 'https://www.youtube.com/embed/abc123XYZ',
      hdurl: null,
      thumbnail_url: null,
      copyright: null,
    };

    const thumb = getMediaThumbnail(item);
    expect(thumb).toBe('https://img.youtube.com/vi/abc123XYZ/hqdefault.jpg');
  });

  it('trips circuit breaker on 429 and immediately serves from fallback on subsequent call', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      status: 429,
      ok: false,
    } as unknown as Response);
    global.fetch = fetchSpy;

    // 1er intento: responde 429 y activa el circuit breaker
    const result1 = await fetchApodByDate('2022-07-12');
    expect(result1.isFallback).toBe(true);
    expect(result1.isRateLimited).toBe(true);
    expect(isCircuitBreakerOpen()).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // 2do intento: Circuit Breaker está abierto -> NO hace fetch (0ms)
    fetchSpy.mockClear();
    const result2 = await fetchApodByDate('2022-07-13');
    expect(result2.isFallback).toBe(true);
    expect(result2.isRateLimited).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('serves from localStorage cache on subsequent call', async () => {
    const mockItem = {
      title: 'Cached Star',
      date: '2021-01-01',
      explanation: 'From cache',
      media_type: 'image',
      url: 'https://example.com/star.jpg',
      hdurl: null,
      thumbnail_url: null,
      copyright: null,
    };

    localStorage.setItem(
      'apod_cache_v2_item_2021-01-01',
      JSON.stringify({
        timestamp: Date.now(),
        ttl: 0,
        payload: mockItem,
      })
    );

    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;

    const res = await fetchApodByDate('2021-01-01');
    expect(res.data?.title).toBe('Cached Star');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
