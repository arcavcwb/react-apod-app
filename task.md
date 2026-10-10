# Task Checklist - TASK-021: Los días se leen del sitio oficial de APOD

- [x] **Fase 1: Decisión (usuario, 2026-10-09)**
  - [x] La API de la NASA (`api.nasa.gov/planetary/apod`) sigue devolviendo el registro de relleno; no se espera a que la reparen.
  - [x] La app lee los días del sitio oficial, `science.nasa.gov`, que los publica como JSON en su WordPress (`/wp-json/wp/v2/image-article`, categoría `apod`).

- [x] **Fase 2: Implementación**
  - [x] Contrato Zod de lo que envía el sitio (`ApodPostSchema`) y lector de un día (`netlify/edge-functions/apod/core.ts`): título, explicación, imagen, vídeo o reproductor, y crédito.
  - [x] Edge Function `/api/apod` con los mismos parámetros que tenía la API (`date`, `start_date`, `end_date`, o nada para el último día) y caché de CDN; el servidor de desarrollo de Vite ejecuta el mismo código.
  - [x] `nasa.service.ts` pide a `/api/apod`; ya no hay clave de la NASA en el navegador.
  - [x] `/api/translate` y la vista previa al compartir leen de la misma fuente.
  - [x] Enlaces oficiales a `science.nasa.gov/apod/`, textos de la interfaz, CSP (`connect-src 'self'`) y `.env.example`.

- [ ] **Fase 3: Verificación**
  - [x] `tsc` (ahora también las Edge Functions), tests unitarios con siete días reales grabados, E2E y build.
  - [x] 235 días grabados de nueve meses entre 1995 y 2026 se leen sin restos de HTML.
  - [x] En local contra el sitio real: portada, día con imagen, archivo de vídeo, YouTube, día interactivo, GIF de 1995, galería y traducción con DeepL.
  - [ ] Tras el merge, en producción: `/api/apod`, `/api/translate`, la vista previa de un día y la portada. Las Edge Functions no se pueden probar antes: los deploy previews piden inicio de sesión.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`feat/TASK-021-official-source`).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin feat/TASK-021-official-source`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Reporte técnico en `docs/walkthroughs/TASK-021-official-source.md`.

- [ ] **Pendiente de tareas anteriores**
  - [x] TASK-020: producción comprobada tras el merge (2026-10-10): sin registro de relleno y con la CDN vacía.
  - [ ] TASK-018: revisión final de diseño y `DESIGN.md` nuevo (`pnpm check:design` falla por eso: Public Sans no está declarada).
  - [ ] TASK-018: vistas previas al compartir por WhatsApp con un día real.
  - [ ] En Netlify, la variable `VITE_NASA_API_KEY` ya no se usa y se puede borrar.
