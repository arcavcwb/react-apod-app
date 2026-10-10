# NASA APOD Explorer

A reader for NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html): today's picture uncropped, any day since 16 June 1995, and a month-by-month gallery. Interface in Spanish, English and Brazilian Portuguese; NASA's titles stay in English, and its explanations are machine-translated into Spanish and Portuguese, always saying so.

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
cp .env.example .env   # optional: a DeepL key, for translated explanations
pnpm dev
```

The days are read from APOD's official site, server-side, so no NASA key is needed and nothing secret ships in the client bundle.

## Scripts

| Command | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Type-check (`tsc`, strict) and production build |
| `pnpm test` | Unit and component tests (Vitest) |
| `pnpm test:e2e` | End-to-end tests (Playwright, 390x844 and 1280x720) against a recorded day; no request leaves the machine |
| `pnpm check:design` | Impeccable design detector |

## How it works

- `netlify/edge-functions/apod/`: `/api/apod` reads the days from APOD's official site (`science.nasa.gov`, its WordPress JSON) and answers them as `?date=`, `?start_date=&end_date=` or, with no parameter, the latest day; the CDN keeps each answer. NASA's old API stopped answering real days when APOD moved sites. The Vite dev server runs the same code.
- `src/contracts/apod.contract.ts`: what the official site sends and what the app reads are both validated with Zod. A record whose picture is a file of NASA's website (its logo answered as a day) is rejected, so it is never shown, cached, translated or shared.
- `src/services/nasa.service.ts`: a month is fetched as parallel weekly ranges and reused for each of its days, and the home's recent days come from one short range; past days are cached in `localStorage` forever, today for an hour. Errors are reported as `rate-limit`, `not-found`, `network` or `contract`; the app never shows a substitute picture.
- `src/utils/date.ts`: "today" is computed in US Eastern time, when NASA publishes.
- `src/i18n/`: typed message dictionaries and `Intl` formatting, no i18n library.
- `netlify/edge-functions/translate/`: `/api/translate?date=YYYY-MM-DD&lang=es|pt-BR` translates a day's explanation (never its title) with DeepL, from the official site's own text, and the CDN keeps the result. Set `DEEPL_API_KEY` in Netlify (available to Functions) and in `.env` for local development, where the Vite dev server runs the same code. Without it the app shows NASA's English.
- `src/Components/Photo/Photo.tsx`: the day's media, never cropped; images develop from the cached thumbnail to the sharp CDN-resized file. Travelling between days uses the View Transitions API and respects `prefers-reduced-motion`.
- Design context lives in `PRODUCT.md`, `DESIGN.md` and `.impeccable/`.
