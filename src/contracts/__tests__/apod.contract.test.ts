import { describe, it, expect } from 'vitest';
import { ApodItemSchema } from '../apod.contract';

describe('ApodItemSchema Contract Validation', () => {
  it('validates and upgrades http to https', () => {
    const raw = {
      title: 'Test Nebula',
      date: '2023-01-01',
      explanation: 'A test nebula description',
      media_type: 'image',
      url: 'http://apod.nasa.gov/apod/image/test.jpg',
      hdurl: 'http://apod.nasa.gov/apod/image/test_hd.jpg',
    };

    const parsed = ApodItemSchema.parse(raw);
    expect(parsed.url).toBe('https://apod.nasa.gov/apod/image/test.jpg');
    expect(parsed.hdurl).toBe('https://apod.nasa.gov/apod/image/test_hd.jpg');
  });

  it('supports video media_type with thumbnail_url', () => {
    const raw = {
      title: 'Cosmic Video',
      date: '2023-01-02',
      explanation: 'A video from the ISS',
      media_type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail_url: 'http://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    };

    const parsed = ApodItemSchema.parse(raw);
    expect(parsed.media_type).toBe('video');
    expect(parsed.thumbnail_url).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });
});
