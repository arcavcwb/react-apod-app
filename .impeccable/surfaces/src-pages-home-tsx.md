---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/Pages/Home.tsx"
related_targets: ["src/Pages/Day.tsx","src/Pages/Archive.tsx","src/Pages/About.tsx"]
---

## Scope and mode

Whole app shell plus the day plate (home `/` and `/apod/:date`), the month archive (`/archive/:month`), about, not-found. Mode: Experience (the picture leads); about is Read.

## Audience, job, constraints

Astronomy enthusiasts on the daily ritual, portfolio visitors judging craft. Job: see today's picture whole, read it, travel by day or month, share. Constraints: trilingual UI (es, en, pt-BR) with NASA text untouched and marked `lang="en"`; Three.js orrery kept as a secondary lazy section on home; DEMO_KEY allows 10 requests per hour, so fetch months and reuse them for days.

## Direction contract

THESIS: Each day is a chart plate in a 31-year field atlas: the picture is the plate, whole and uncropped; everything else is margin notation. It refuses the category's sci-fi HUD dashboard and the stock dark photo gallery.

OWN-WORLD: Field-edition star atlas. Ink black #0a0a0b ground, starlight white #f2f0ea, graticule hairlines #2c2c30 and #616168, muted notation #9b9992, one red-light accent #ff5a47 for the current day, focus and the primary action. Source Serif 4 with optical sizes for titles and captions; Archivo spaced caps with tabular figures for notation. 1px neat-lines with graduated ticks. No cards, no glow, no glass. Errors are dashed empty plates, never red.

STORY: The visitor sees today's picture at once, learns what it is, and travels by day (arrows, ruler, date field) or by month (index chart) in their own language. Portfolio visitors find a restrained 3D orrery below the caption.

FIRST VIEWPORT: Desktop: 56px index bar (wordmark, Hoy/Archivo/Acerca de, ES EN PT). Plate spans columns 1-8 at about 75svh, image contained inside a graduated neat-line, plate code (AP260911) rotated on its left edge. Margin columns 9-12: date and day count in spaced caps, title in display serif, credit, actions. Full-width date ruler under the plate with previous and next. Mobile: plate within 16px gutters at max 60svh, notation below, day controls in a bottom bar.

FORM: Field-edition star atlas, candidate 3 of 7, seed 17cb43fd. Signature interaction: the date ruler, a native range slider graduated by day that scrubs the month. Motion grammar: focus pull, a blurred low-res plate resolving to the sharp image.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Dragging the ruler through a month and watching each plate pull into focus.

## Unresolved

Whether to proxy the NASA API through Netlify to hide the key and share a cache.
