import { describe, it, expect } from 'vitest';
import { getOptimizedImageUrl } from '../imageOptimizer';

describe('imageOptimizer Utility', () => {
  it('preserves local assets, data URIs and svgs untouched', () => {
    expect(getOptimizedImageUrl('/assets/local.png')).toBe('/assets/local.png');
    expect(getOptimizedImageUrl('data:image/png;base64,...')).toBe('data:image/png;base64,...');
    expect(getOptimizedImageUrl('https://example.com/vector.svg')).toBe('https://example.com/vector.svg');
  });

  it('generates edge cdn webp url with target width and quality in local dev', () => {
    const raw = 'https://apod.nasa.gov/apod/image/test.jpg';
    const optimized = getOptimizedImageUrl(raw, { width: 600, quality: 80 });

    expect(optimized).toContain('wsrv.nl');
    expect(optimized).toContain('w=600');
    expect(optimized).toContain('output=webp');
    expect(optimized).toContain(encodeURIComponent(raw));
  });
});
