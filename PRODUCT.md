# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed as equal priority:

- **Astronomy enthusiasts** who open the app as a daily ritual to see the Astronomy Picture of the Day, read its caption, jump to other dates, and browse past months.
- **Portfolio visitors** (recruiters, clients, other developers) who judge the author's frontend craft. The engineering quality is part of the product, not a side effect.

## Product Purpose

A reader for NASA's Astronomy Picture of the Day (APOD): today's picture, any day since 1995-06-16, and a month-by-month archive, with share links for every day. Success means the picture is on screen fast, never cropped or faked, and every day or month has a URL someone can send.

## Positioning

The official APOD site is a 1995-era HTML page in English only. This app presents the same archive content-first, with a trilingual interface (Spanish, English, Brazilian Portuguese), addressable day and month URLs, and honest loading and error states.

## Operating Context

- Data comes from `https://api.nasa.gov/planetary/apod` with `VITE_NASA_API_KEY` (falls back to `DEMO_KEY`, which NASA rate-limits per IP: 30 requests per hour, 50 per day).
- Media is hosted by NASA (`apod.nasa.gov`) or embedded from YouTube/Vimeo for video days. Some days are `media_type` values other than `image`/`video`.
- APOD's official site is moving from `apod.nasa.gov` to `science.nasa.gov/apod` (stated in the 2026-09-11 caption).
- Deployed on Netlify (`https://reactapod.netlify.app/`), with CSP headers in `netlify.toml`.

## Capabilities and Constraints

- Routes: home (today), a day view by date, a month archive, an about page.
- NASA titles, captions and credits arrive in English and are shown untranslated, marked `lang="en"`.
- Images vary in aspect ratio (portrait, panorama, square). They must never be cropped in the day view.
- `copyright` is absent for public-domain images; credit is never invented.
- The home keeps the Three.js orbital scene as a secondary, lazy-loaded element below today's picture (user decision, 2026-09-11). It must not delay the picture.
- Undecided: whether to proxy the API through Netlify to hide the key.

## Brand Commitments

- Name: "NASA APOD Explorer". Independent project, not affiliated with NASA; the NASA insignia is not used as the app's logo.
- UI copy in Spanish, English and Brazilian Portuguese (user decision, 2026-09-11).
- No emoji in the interface; icons are SVG (project rule in `AGENTS.md`).

## Evidence on Hand

- Live APOD data for any date via the API; no bundled image catalog.
- Technical case study in `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md`.
- No testimonials, usage metrics or press. Do not fabricate them, and do not invent telemetry or system status.

## Product Principles

1. The picture is the product: shown first, whole, and real.
2. Every claim on screen is true. No decorative status text, no substitute images passed off as the requested day.
3. Every day and month is addressable, shareable and back-button friendly.
4. Decorative and heavy features load after the picture and never block it.
5. The interface speaks the visitor's language; NASA's words stay NASA's.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, touch targets of at least 48px, full keyboard access, and `prefers-reduced-motion` respected (project rules in `AGENTS.md`).
