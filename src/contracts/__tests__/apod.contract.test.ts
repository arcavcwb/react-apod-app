import { describe, expect, it } from 'vitest';
import { ApodItemSchema } from '../apod.contract';

const base = {
  date: '2026-09-11',
  title: 'M83: The Southern Pinwheel',
  explanation: 'Beautiful and bright spiral galaxy M83…',
  media_type: 'image',
  url: 'https://apod.nasa.gov/apod/image/2609/M83.jpg',
};

describe('ApodItemSchema', () => {
  it('upgrades http media to https', () => {
    const parsed = ApodItemSchema.parse({ ...base, url: 'http://apod.nasa.gov/a.jpg', hdurl: 'http://apod.nasa.gov/b.jpg' });
    expect(parsed.url).toBe('https://apod.nasa.gov/a.jpg');
    expect(parsed.hdurl).toBe('https://apod.nasa.gov/b.jpg');
  });

  it('cleans stray line breaks from credits and drops empty ones', () => {
    expect(ApodItemSchema.parse({ ...base, copyright: '\nAldo  Zanetti\n' }).copyright).toBe('Aldo Zanetti');
    expect(ApodItemSchema.parse({ ...base, copyright: ' \n ' }).copyright).toBeUndefined();
    expect(ApodItemSchema.parse(base).copyright).toBeUndefined();
  });

  it('keeps interactive days that have no url', () => {
    const parsed = ApodItemSchema.parse({ ...base, media_type: 'other', url: undefined });
    expect(parsed.media_type).toBe('other');
    expect(parsed.url).toBeUndefined();
  });

  it('maps unknown media types to "other" and drops unusable URLs', () => {
    const parsed = ApodItemSchema.parse({ ...base, media_type: 'hologram', url: 'not a url' });
    expect(parsed.media_type).toBe('other');
    expect(parsed.url).toBeUndefined();
  });

  it('rejects items without a valid date', () => {
    expect(ApodItemSchema.safeParse({ ...base, date: '11/09/2026' }).success).toBe(false);
  });

  it("rejects NASA's placeholder record, which has the shape of a day but is not one", () => {
    // What api.nasa.gov answered for every date on 2026-10-09 (explanation shortened).
    const placeholder = {
      date: '2026-10-08',
      explanation: 'Stickney Crater, the largest crater on the martian moon Phobos, is named for Chloe Angeline Stickney Hall…',
      hdurl: 'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png',
      media_type: 'image',
      service_version: 'v1',
      title: 'NASA Science',
      url: 'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png',
    };
    expect(ApodItemSchema.safeParse(placeholder).success).toBe(false);
    // A real picture hosted on the new site is still a day.
    expect(ApodItemSchema.safeParse({ ...base, url: 'https://science.nasa.gov/wp-content/uploads/2026/10/m83.jpg' }).success).toBe(true);
  });
});
