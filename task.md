# Task Checklist - TASK-020: Registro de relleno de la NASA

- [x] **Fase 1: Diagnóstico (2026-10-09)**
  - [x] La API de la NASA responde a cualquier fecha con el mismo registro: título «NASA Science», el logo del sitio como imagen y una explicación que no es la del día; sin fecha responde 500.
  - [x] `apod.nasa.gov/apod/*.html` redirige a `science.nasa.gov/apod/`.
  - [x] La app lo aceptaba (la forma es válida) y lo guardaba: `localStorage` para siempre, traducciones un año en la CDN.

- [x] **Fase 2: Implementación**
  - [x] Contrato: un registro cuya imagen es un archivo del tema del sitio no es un día (`src/contracts/apod.contract.ts`).
  - [x] Caché `apod:v4:` y purga de `apod:v3:` al arrancar (`src/services/nasa.service.ts`).
  - [x] La vista previa al compartir usa el mismo contrato (`netlify/edge-functions/apod-preview/apod-preview.ts`).
  - [x] `/gallery/2025-13` y `/gallery/2025-00`: `isValidMonth` solo acepta meses 01 a 12.
  - [x] El título de la pestaña de un día ya guardado (`src/Pages/Day.tsx`).

- [ ] **Fase 3: Verificación**
  - [x] `tsc`, tests unitarios (8 nuevos, los 8 fallan sin el arreglo), E2E y build.
  - [x] En el navegador, con las respuestas de la NASA grabadas ese día: aviso «Respuesta inesperada», sin logo y sin nada en caché.
  - [ ] Tras el merge: el deploy vacía la CDN (traducciones y vistas previas del registro de relleno); comprobar `/api/translate` y un `/apod/YYYY-MM-DD` en producción.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`fix/TASK-020-nasa-placeholder`).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin fix/TASK-020-nasa-placeholder`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Reporte técnico en `docs/walkthroughs/TASK-020-nasa-placeholder.md`.

- [ ] **Decisión pendiente del usuario**
  - [ ] De dónde salen los datos si la NASA no repara la API. Hasta entonces la app muestra sus avisos de error, no contenido.

- [ ] **Pendiente de tareas anteriores**
  - [x] TASK-019: la traducción responde en producción con la clave de DeepL (comprobado el 2026-10-09).
  - [ ] TASK-018: revisión final de diseño y `DESIGN.md` nuevo (`pnpm check:design` falla por eso: Public Sans no está declarada).
  - [ ] TASK-018: vistas previas al compartir por WhatsApp con un día real (hoy la NASA no entrega ninguno).
  - [ ] TASK-018: Netlify, `VITE_NASA_API_KEY` disponible también para Functions.
