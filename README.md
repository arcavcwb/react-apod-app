# NASA APOD Explorer

A reader for NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html): today's picture uncropped, any day since 16 June 1995, and a month-by-month gallery. Interface in Spanish, English and Brazilian Portuguese; NASA's titles and explanations stay in their original English.

Independent project, not affiliated with NASA.

Live: https://apodgallery.netlify.app/

## Routes

| Path | What it shows |
|---|---|
| `/` | Latest picture, plus the days just before it |
| `/apod/YYYY-MM-DD` | One day (old `/apod?date=` links redirect here) |
| `/gallery/YYYY-MM` | Every picture of a month, newest first (`/gallery` opens the current month; old `/archive` links redirect here) |
| `/about` | What APOD is, credits, how the app is built |

## Setup

```bash
pnpm install
cp .env.example .env   # add your key from https://api.nasa.gov
pnpm dev
```

Without `VITE_NASA_API_KEY` the app uses NASA's `DEMO_KEY`, which is limited to about 10 requests per hour per IP. A personal key allows 1,000 per hour. On Netlify, set the same variable under Site configuration > Environment variables. The key ships in the client bundle, as with any browser-side API call.

## Scripts

| Command | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Type-check (`tsc`, strict) and production build |
| `pnpm test` | Unit and component tests (Vitest) |
| `pnpm test:e2e` | End-to-end tests (Playwright, 390x844 and 1280x720) against recorded NASA responses |
| `pnpm check:design` | Impeccable design detector |

## How it works

- `src/contracts/apod.contract.ts`: every NASA response is validated with Zod before it reaches the UI.
- `src/services/nasa.service.ts`: a month is fetched as parallel weekly ranges and reused for each of its days, and the home's recent days come from one short range; past days are cached in `localStorage` forever, today for an hour. Errors are reported as `rate-limit`, `not-found`, `network` or `contract`; the app never shows a substitute picture.
- `src/utils/date.ts`: "today" is computed in US Eastern time, when NASA publishes.
- `src/i18n/`: typed message dictionaries and `Intl` formatting, no i18n library.
- `src/Components/Photo/Photo.tsx`: the day's media, never cropped; images develop from the cached thumbnail to the sharp CDN-resized file. Travelling between days uses the View Transitions API and respects `prefers-reduced-motion`.
- Design context lives in `PRODUCT.md`, `DESIGN.md` and `.impeccable/`.
