import { describe, expect, it } from 'vitest';
import { excerpt, injectPreview, previewFor } from '../../../netlify/edge-functions/apod-preview/preview';

const ORIGIN = 'https://apodgallery.netlify.app';
const PAGE = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta
      name="description"
      content="Default description"
    />
    <meta property="og:title" content="NASA APOD Explorer" />
    <meta name="twitter:card" content="summary" />
    <title>NASA APOD Explorer</title>
  </head>
  <body><div id="root"></div></body>
</html>`;

const pelican = {
  date: '2026-09-07',
  title: 'The Pelican Nebula in Gas, Dust, and Stars',
  explanation: 'The Pelican Nebula is slowly being "transformed" & reshaped.',
  media_type: 'image',
  url: 'https://apod.nasa.gov/apod/image/2609/Pelican_Killion.jpg',
};

describe('link previews for shared days', () => {
  it("replace the page's defaults with the day's title, description and resized picture", () => {
    const html = injectPreview(PAGE, previewFor(pelican, ORIGIN));

    expect(html).toContain('<title>The Pelican Nebula in Gas, Dust, and Stars · NASA APOD Explorer</title>');
    expect(html).toContain('<meta property="og:title" content="The Pelican Nebula in Gas, Dust, and Stars" />');
    expect(html).toContain('<meta property="og:url" content="https://apodgallery.netlify.app/apod/2026-09-07" />');
    expect(html).toContain(
      `<meta property="og:image" content="${ORIGIN}/.netlify/images?url=${encodeURIComponent(pelican.url)}&amp;w=1200&amp;q=75&amp;fm=jpg" />`
    );
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('content="7 September 2026 · The Pelican Nebula is slowly being &quot;transformed&quot; &amp; reshaped."');
    // The defaults are gone, not duplicated.
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="twitter:card"/g)).toHaveLength(1);
    expect(html).not.toContain('Default description');
  });

  it('use a video still, and no picture when there is none', () => {
    const video = { ...pelican, media_type: 'video', url: 'https://www.youtube.com/embed/abc', thumbnail_url: 'https://img.youtube.com/vi/abc/0.jpg' };
    expect(previewFor(video, ORIGIN).image).toContain(encodeURIComponent('https://img.youtube.com/vi/abc/0.jpg'));

    const other = { ...pelican, media_type: 'other', url: undefined };
    const html = injectPreview(PAGE, previewFor(other, ORIGIN));
    expect(html).not.toContain('og:image');
    expect(html).toContain('<meta name="twitter:card" content="summary" />');
  });

  it('cut long explanations at a word', () => {
    const cut = excerpt('Stars '.repeat(60), 50);
    expect(cut.endsWith('…')).toBe(true);
    expect(cut.length).toBeLessThanOrEqual(51);
    expect(cut).not.toMatch(/\s…$/);
  });
});
