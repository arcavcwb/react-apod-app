# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed as equal priority:

- **Astronomy enthusiasts** who open the app as a daily ritual to see the Astronomy Picture of the Day, read its caption, jump to other dates, and browse past months.
- **Portfolio visitors** (recruiters, clients, other developers) who judge the author's frontend craft. The engineering quality is part of the product, not a side effect.

## Product Purpose

A simple reader for NASA's Astronomy Picture of the Day (APOD). In priority order (user brief, 2026-09-11):

1. Show today's picture clearly.
2. Explore earlier pictures through a gallery.
3. Share a picture easily.
4. Feel designed for phones first.
5. Make exploring the universe feel visually special.

The core flow is TODAY → EXPLORE → SHARE, with as little friction as possible. It is not a dashboard: no metrics, sidebars or controls that do not serve those three steps. Success means the picture is on screen fast, never faked, and every day has a URL someone can send.

## Positioning

The official APOD site is a 1995-era HTML page in English only. This app presents the same archive content-first, with a trilingual interface (Spanish, English, Brazilian Portuguese), addressable day and month URLs, and honest loading and error states.

## Operating Context

- Data comes from `https://api.nasa.gov/planetary/apod` with `VITE_NASA_API_KEY` (falls back to `DEMO_KEY`, which NASA rate-limits per IP: 30 requests per hour, 50 per day).
- Translations come from DeepL through the Edge Function at `/api/translate?date=&lang=`, with the server-only `DEEPL_API_KEY` (free-plan keys end in `:fx`). It takes a date and a language, never text, fetches the explanation from NASA itself, and the CDN keeps each translation until the next deploy. Without the key the app shows the original English.
- Media is hosted by NASA (`apod.nasa.gov`) or embedded from YouTube/Vimeo for video days. Some days are `media_type` values other than `image`/`video`.
- APOD's official site is moving from `apod.nasa.gov` to `science.nasa.gov/apod` (stated in the 2026-09-11 caption).
- Deployed on Netlify at `https://apodgallery.netlify.app` (project `apodgallery`, with its own `VITE_NASA_API_KEY`), CSP headers in `netlify.toml`. `https://reactapod.netlify.app` is an older, separate site.
- NASA answers a month-long range in 5 to 40 seconds but a week in about 2, so months are fetched as parallel weeks. DEMO_KEY was measured at 10 requests per hour on 2026-09-11.

## Capabilities and Constraints

- Routes: home `/` (today's picture plus a preview of recent days), a day detail view `/apod/YYYY-MM-DD`, a month gallery `/gallery/YYYY-MM` (old `/archive/*` links redirect), an about page reached from the footer.
- Navigation offers only Today and Gallery, plus the language switch (user brief, 2026-09-11).
- NASA titles and credits arrive in English and stay untranslated, marked `lang="en"`. Explanations are machine-translated into Spanish and Brazilian Portuguese with DeepL (user decision, 2026-09-15), always labelled as an automatic translation with NASA's original one tap away; English readers, and anyone when no translation can be had, read the original.
- Images vary in aspect ratio (portrait, panorama, square). They must never be cropped in the day view.
- `copyright` is absent for public-domain images; credit is never invented.
- No heavy Three.js scene for decoration; space atmosphere must stay light and never compete with the photograph (user brief, 2026-09-11, superseding the earlier decision to keep the 3D orrery below the home picture).
- Share is a first-class action: Web Share API where available, otherwise copy link (with visible confirmation) and the existing network links.
- Undecided: whether to proxy the API through Netlify to hide the key.

## Brand Commitments

- Name: "NASA APOD Explorer". Independent project, not affiliated with NASA; the NASA insignia is not used as the app's logo.
- UI copy in Spanish, English and Brazilian Portuguese (user decision, 2026-09-11).
- No emoji in the interface; icons are SVG (project rule in `AGENTS.md`).
- Binding visual constraints from the user brief (2026-09-11): deep navy or near-black ground (for example #020617, #030712, #0B1120), softened white text, slate secondary text, and a single spatial accent (orbital blue, deep violet or soft cyan). Mood: NASA, deep-space observatory, editorial photography, modern space exploration; cinematic, minimal, premium. Explicitly unwanted: dashboards, sidebars, decorative metrics or charts, large glassmorphism panels, too many cards, rainbow gradients, cyberpunk, neon, decorative tech grids, fake HUD, spaceship interfaces, many small labels, constant animation, unnecessary text.

## Evidence on Hand

- Live APOD data for any date via the API; no bundled image catalog.
- Technical case study in `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md`.
- No testimonials, usage metrics or press. Do not fabricate them, and do not invent telemetry or system status.

## Product Principles

1. The picture is the product: shown first, whole, and real. The interface is a frame around the universe, never a set of components competing with it.
2. Every claim on screen is true. No decorative status text, no substitute images passed off as the requested day.
3. Every day and month is addressable, shareable and back-button friendly.
4. Simple to use, spectacular to look at: few controls, generous space, motion that supports rather than distracts.
5. The interface speaks the visitor's language. NASA's titles stay NASA's; its explanations may be translated, and then say so.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, touch targets of at least 48px, full keyboard access, and `prefers-reduced-motion` respected (project rules in `AGENTS.md`).
