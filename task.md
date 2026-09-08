# Task Checklist - TASK-002: Modernización Integral (Vite + TS + Zod + Home + APOD + Galería)

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-002-full-modernization-vite-and-features`.

- [x] **Fase 2: Migración a Vite + TypeScript (Tooling)**
  - [x] Remover `react-scripts` y configurar dependencias modernas (`vite`, `@vitejs/plugin-react`, `typescript`, `zod`).
  - [x] Crear `vite.config.ts` con alias `@/*`.
  - [x] Crear `tsconfig.json` y `tsconfig.node.json`.
  - [x] Mover y adaptar `index.html` a la raíz del proyecto.
  - [x] Renombrar punto de entrada a `src/index.tsx` y adaptar scripts en `package.json`.

- [x] **Fase 3: Contratos Zod y Servicios NASA API (Contract-First)**
  - [x] Crear `src/contracts/apod.contract.ts` con `ApodSchema` e inferencia de tipos.
  - [x] Crear `src/services/nasa.service.ts` con clientes tipados para APOD del día, por fecha y galería.
  - [x] Configurar variables de entorno `VITE_NASA_API_KEY` en `.env` y `.env.example`.

- [x] **Fase 4: Optimización de Medios Pesados (Web Vitals)**
  - [x] Crear `src/Components/Media/ProgressiveImage.tsx` con soporte para aspect-ratio anti-shift, skeleton y reintentos.

- [x] **Fase 5: Rediseño de Páginas Core (Impeccable Craft)**
  - [x] Modernizar `src/Pages/Home.tsx` con hero section de observatorio, titulares estelares y CTAs.
  - [x] Modernizar `src/Pages/Apod.tsx` con selector de fechas históricas, visualizador HD y ficha técnica.
  - [x] Modernizar `src/Pages/Gallery.tsx` con cuadrícula de 12 fotos espaciales, modal y botón de recarga.

- [x] **Fase 6: Verificación Zero-Trust**
  - [x] Ejecutar auditoría de diseño: `pnpm run check:design` (0 anti-patrones).
  - [x] Ejecutar compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Ejecutar diagnóstico Doctor: `bash scripts/init-agentic-flow.sh --check-env`.

- [ ] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`/`master`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-002-full-modernization-vite-and-features`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [ ] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [ ] Ejecutar `git push -u origin feat/...`.
  - [ ] Crear Pull Request con `gh pr create`.
  - [ ] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [ ] Generar el reporte técnico en `docs/walkthroughs/TASK-002-full-modernization.md`.
  - [ ] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).

