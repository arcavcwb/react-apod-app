import { describe, expect, it } from 'vitest';
import { optimizedImageUrl, optimizedSrcSet } from '../imageOptimizer';

describe('imageOptimizer', () => {
  const raw = 'https://apod.nasa.gov/apod/image/2609/M83.jpg';

  it('leaves local, svg and gif sources untouched', () => {
    expect(optimizedImageUrl('/favicon.svg', 400)).toBe('/favicon.svg');
    expect(optimizedImageUrl('https://apod.nasa.gov/a.gif', 400)).toBe('https://apod.nasa.gov/a.gif');
  });

  it('resizes through wsrv.nl on localhost', () => {
    const url = optimizedImageUrl(raw, 480);
    expect(url).toContain('https://wsrv.nl/?url=' + encodeURIComponent(raw));
    expect(url).toContain('w=480');
  });

  it('builds a width-described srcset', () => {
    expect(optimizedSrcSet(raw, [960, 1600]).split(', ').map((s) => s.split(' ')[1])).toEqual(['960w', '1600w']);
  });
});
