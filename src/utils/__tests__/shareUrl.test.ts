import { describe, expect, it } from 'vitest';
import { shareUrl } from '../shareUrl';

describe('shared links', () => {
  it('point to the public site when the app runs locally', () => {
    expect(window.location.hostname).toBe('localhost');
    expect(shareUrl('/apod/2026-09-07')).toBe('https://apodgallery.netlify.app/apod/2026-09-07');
  });
});
