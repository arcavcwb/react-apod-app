# Task Checklist - TASK-016: APOD primero, datos honestos y atlas de campo

- [x] **Fase 1: Auditoría (sin modificar archivos)**
  - [x] Build, tests y detector Impeccable de línea base (896 KB JS en un chunk; 29 tests; 0 hallazgos del detector).
  - [x] Capturas de línea base en 1440x900 y 390x844.
  - [x] Hallazgos: catálogo de respaldo con fotos de stock rotuladas como imágenes del Webb; fallback guardado en caché como dato real; "Cargar más" repetía los mismos 6 ítems; home sin la foto del día; telemetría inventada; imágenes recortadas con `object-cover`; tarjetas sin acceso por teclado; sin navegación a "Acerca de" en la home móvil; `strict: false`.

- [x] **Fase 2: Skills del proyecto instaladas en Claude Code**
  - [x] `.claude/skills/` enlaza `contract-first-api`, `web-vitals-heavy-media`, `playwright-e2e-suite`, `ponytail` y `vite-modernizer` desde `.agents/skills/`.
  - [x] Impeccable v0.1.5 (nivel usuario) para todo el trabajo de UI.

- [x] **Fase 3: Contexto de producto y dirección (Impeccable)**
  - [x] `PRODUCT.md` con las respuestas del usuario: público mixto, foto del día como héroe con el 3D secundario, interfaz trilingüe es / en / pt-BR.
  - [x] Ronda de dirección: elegido "Atlas de campo" (semilla 17cb43fd). Contrato en `.impeccable/surfaces/src-pages-home-tsx.md`.

- [x] **Fase 4: Datos (contract-first-api, ponytail)**
  - [x] Contrato Zod: https forzado, créditos limpios, `media_type` "other", URL opcional.
  - [x] Servicio sin catálogo falso ni circuit breaker: errores tipados (`rate-limit`, `not-found`, `network`, `contract`).
  - [x] Un mes por consulta, reutilizado para cada día; caché local permanente para el pasado y de 1 h para hoy; purga de cachés antiguas.
  - [x] "Hoy" calculado en hora del Este de EE. UU.

- [x] **Fase 5: Interfaz (impeccable, web-vitals-heavy-media)**
  - [x] Lámina del día sin recorte, notación de margen, regla de fechas nativa (`input type=range`), barra inferior en móvil, atajos ← →.
  - [x] Archivo mensual con calendario accesible y transición de vista de miniatura a lámina.
  - [x] i18n sin librerías (es, en, pt-BR) con `Intl`; textos de la NASA marcados `lang="en"`.
  - [x] Orrery Three.js reestilizado, diferido (chunk aparte), pausado fuera de pantalla, con lista de enlaces accesible.
  - [x] Estados honestos de carga, error, fecha inválida y 404.

- [x] **Fase 6: Plataforma (vite-modernizer)**
  - [x] TypeScript `strict`, `allowJs: false`, data router de React Router, fuentes autoalojadas, favicon SVG propio.
  - [x] Fuera `axios`, `react-share`, `jest-dom`, `package-lock.json` y ~45 archivos muertos.
  - [x] CSP sin `unsafe-inline` en scripts; `remote_images` sin Unsplash; caché inmutable para `/assets/*`.

- [ ] **Fase 7: Verificación Zero-Trust**
  - [x] `pnpm exec tsc` sin errores.
  - [x] `pnpm test`: 6 archivos, 32 tests.
  - [x] Detector Impeccable: 0 hallazgos.
  - [ ] `pnpm test:e2e` (390x844 y 1280x720) con respuestas reales grabadas.
  - [ ] Revisión final de Impeccable y `DESIGN.md`.

- [ ] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`feat/TASK-016-apod-first-overhaul`).
  - [x] Verificación Impeccable (`impeccable detect`): 0 anti-patrones.
  - [x] Pruebas unitarias y compilación estática (`build`).
  - [ ] `git add` y `git commit` (Conventional Commits).
  - [ ] `git push -u origin feat/TASK-016-apod-first-overhaul`.
  - [ ] Crear Pull Request con `gh pr create`.
  - [ ] Actualizar descripción del PR vía GitHub API.
  - [ ] Reporte técnico en `docs/walkthroughs/TASK-016-apod-first-overhaul.md`.
  - [ ] Merge a `main` vía Squash y limpieza de rama (requiere confirmación del usuario: despliega a producción).
