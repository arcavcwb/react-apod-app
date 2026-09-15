// The link preview (Open Graph and Twitter tags) for one APOD day, written into the app's index.html.
// Pure and dependency-free, so the edge function and the unit tests run the same code.

export interface ApodDay {
  date: string;
  title: string;
  explanation?: string;
  media_type: string;
  url?: string;
  thumbnail_url?: string;
}

export interface Preview {
  title: string;
  description: string;
  url: string;
  image: string | null;
}

const SITE = 'NASA APOD Explorer';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/** NASA's explanation cut at a word near `max` characters. */
export function excerpt(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
}

/** What a crawler should show for a day: its title, the date and a few lines, and its picture at 1200px. */
export function previewFor(day: ApodDay, origin: string): Preview {
  const still = day.media_type === 'image' ? day.url : day.thumbnail_url;
  const date = new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return {
    title: day.title,
    description: day.explanation ? `${date} · ${excerpt(day.explanation)}` : `Astronomy Picture of the Day, ${date}`,
    url: `${origin}/apod/${day.date}`,
    // Through Netlify Image CDN: a JPEG small enough for WhatsApp, whatever NASA's original weighs.
    image: still && /^https:\/\//.test(still) ? `${origin}/.netlify/images?url=${encodeURIComponent(still)}&w=1200&q=75&fm=jpg` : null,
  };
}

/** Replaces the page's default title, description and preview tags with the day's. */
export function injectPreview(html: string, preview: Preview): string {
  const og: [string, string][] = [
    ['og:site_name', SITE],
    ['og:type', 'article'],
    ['og:title', preview.title],
    ['og:description', preview.description],
    ['og:url', preview.url],
    ...(preview.image ? ([['og:image', preview.image], ['og:image:alt', preview.title]] as [string, string][]) : []),
  ];
  const twitter: [string, string][] = [
    ['twitter:card', preview.image ? 'summary_large_image' : 'summary'],
    ['twitter:title', preview.title],
    ['twitter:description', preview.description],
    ...(preview.image ? ([['twitter:image', preview.image]] as [string, string][]) : []),
  ];
  const tags = [
    ...og.map(([key, value]) => `<meta property="${key}" content="${escape(value)}" />`),
    ...twitter.map(([key, value]) => `<meta name="${key}" content="${escape(value)}" />`),
    `<link rel="canonical" href="${escape(preview.url)}" />`,
  ];
  return html
    .replace(/\s*<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/g, '')
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${escape(preview.description)}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(`${preview.title} · ${SITE}`)}</title>`)
    .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);
}
