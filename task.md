# Task Checklist - TASK-004: Optimización de Rendimiento de Renderizado y Carga de Medios (Netlify Image CDN + GPU Layers)

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-004-rendering-performance-and-image-optimization`.

- [x] **Fase 2: Eliminación de Cuellos de Botella de Renderizado en GPU**
  - [x] Reemplazar `background-attachment: fixed` en `src/index.css` por capa GPU aislada en `src/Components/Layout/Layout.tsx` (`fixed inset-0 -z-10 will-change-transform`).
  - [x] Eliminar filtros `backdrop-blur` redundantes en cuadrículas masivas (`src/Pages/Gallery.tsx`) y reemplazarlos con fondos opacos de alto rendimiento (`bg-slate-900/90`).

- [x] **Fase 3: Optimización y Entrega Rápida con Netlify Image CDN**
  - [x] Crear `netlify.toml` con configuración de build, SPA redirects y `[images.remote_images]` para dominios de la NASA y YouTube.
  - [x] Crear utilidad `src/utils/imageOptimizer.ts`:
    - [x] En producción (Netlify): `/.netlify/images?url=...&w=...&q=80&fm=webp`.
    - [x] En desarrollo local: `wsrv.nl` o entrega directa para mantener 100ms de respuesta en local sin requerir Netlify CLI.
  - [x] Integrar `getOptimizedImageUrl` en `ProgressiveImage.tsx` con fallback transparente a la URL directa en caso de error.
  - [x] Actualizar `src/services/curatedApod.ts` con resoluciones calibradas (~medium.jpg para tarjetas y ~orig.jpg para HD/4K).

- [x] **Fase 4: Verificación Zero-Trust**
  - [x] Auditoría de diseño: `pnpm run check:design` (0 anti-patrones).
  - [x] Pruebas unitarias: `pnpm test` (22 suites y 29 pruebas pasadas al 100%).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Medición de rendimiento en navegador local con Playwright (scroll suave a 60fps y carga rápida de imágenes).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-004-rendering-performance-and-image-optimization`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-004-rendering-performance.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
