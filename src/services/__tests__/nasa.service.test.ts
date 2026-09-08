import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApodByDate, getMediaThumbnail } from '../nasa.service';
import { ApodItem } from '../../contracts/apod.contract';

describe('NASA Service Resilience & Thumbnail helper', () => {
  beforeEach(() => {
    localStorage.clear();
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

  it('falls back to curated item when fetch returns 429', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 429,
      ok: false,
    } as unknown as Response);

    const result = await fetchApodByDate('2022-07-12');
    expect(result.data).toBeDefined();
    expect(result.isFallback).toBe(true);
    expect(result.isRateLimited).toBe(true);
    expect(result.data?.title).toContain('Webb');
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
      'apod_cache_v1_item_2021-01-01',
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
