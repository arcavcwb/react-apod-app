# Task Checklist - TASK-005: Carga Instantánea (Circuit Breaker y CDN Espacial de Alta Velocidad)

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-005-instant-load-and-circuit-breaker`.

- [x] **Fase 2: Circuit Breaker y Cero Esperas en Servicio de NASA (`nasa.service.ts`)**
  - [x] Implementar Circuit Breaker: si NASA retorna 429, activar bloqueo temporal de 10 minutos en cliente.
  - [x] Responder en 0ms con catálogo curado mientras el circuit breaker esté activo, eliminando demoras de 8 a 16 segundos por llamadas colgadas.
  - [x] Permitir reset del circuit breaker si el usuario solicita un reintento manual explícito.

- [x] **Fase 3: CDN Espacial de Alta Velocidad (`curatedApod.ts` y `imageOptimizer.ts`)**
  - [x] Sustituir URLs lentas de `images-assets.nasa.gov` (que tardaban hasta 84s) en `src/services/curatedApod.ts` por URLs del archivo oficial de NASA en CDN de alta velocidad (Imgix/Fastly, respuesta en <200ms).
  - [x] Ajustar `src/utils/imageOptimizer.ts` para no re-enrutar imágenes que ya cuentan con CDN dedicado nativo.

- [x] **Fase 4: Verificación Zero-Trust**
  - [x] Auditoría de diseño: `pnpm run check:design` (0 anti-patrones).
  - [x] Pruebas unitarias: `pnpm test` (22 suites y 29 tests pasados al 100%).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Verificación en navegador local con Playwright (carga instantánea <300ms de tarjetas e imágenes).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-005-instant-load-and-circuit-breaker`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-005-instant-load-and-circuit-breaker.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
