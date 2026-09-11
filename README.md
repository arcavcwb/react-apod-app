# NASA APOD Explorer

A reader for NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html): today's picture uncropped, any day since 16 June 1995, and a month-by-month archive. Interface in Spanish, English and Brazilian Portuguese; NASA's titles and explanations stay in their original English.

Independent project, not affiliated with NASA.

Live: https://reactapod.netlify.app/

## Routes

| Path | What it shows |
|---|---|
| `/` | Latest picture, plus a lazy-loaded 3D orrery below it |
| `/apod/YYYY-MM-DD` | One day (old `/apod?date=` links redirect here) |
| `/archive/YYYY-MM` | Every day of a month (`/archive` opens the current month) |
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
- `src/services/nasa.service.ts`: one request per month, reused for each of its days; past days are cached in `localStorage` forever, today for an hour. Errors are reported as `rate-limit`, `not-found`, `network` or `contract`; the app never shows a substitute picture.
- `src/utils/date.ts`: "today" is computed in US Eastern time, when NASA publishes.
- `src/i18n/`: typed message dictionaries and `Intl` formatting, no i18n library.
- `src/Components/Orrery/`: the Three.js scene is its own chunk, fetched when its section nears the viewport and paused off screen.
- Design context lives in `PRODUCT.md`, `DESIGN.md` and `.impeccable/`.
