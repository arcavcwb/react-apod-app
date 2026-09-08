# Task Checklist - TASK-001: Nuevo Repositorio arcavcwb, Modernización del Layout y Flujo Agéntico

- [x] **Fase 1: Configuración de Repositorio GitHub (`arcavcwb`) y Branch**
  - [x] Crear repositorio en GitHub bajo `@arcavcwb`: `arcavcwb/react-apod-app`.
  - [x] Reconfigurar `git remote` a `https://github.com/arcavcwb/react-apod-app.git`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-001-modernize-layout-and-agentic-flow`.

- [x] **Fase 2: Implementación de Script y Flujo Agéntico**
  - [x] Crear `scripts/init-agentic-flow.sh` con diagnósticos `--check-env` (Doctor) y soporte operativo.
  - [x] Asignar permisos de ejecución al script.

- [x] **Fase 3: Modernización del Layout (Impeccable Craft Floor)**
  - [x] Rediseñar `src/Components/Layout/Layout.js` (contenedor flex `min-h-screen`, `flex-1 main`).
  - [x] Rediseñar `src/Components/Layout/Navbar/NavBar.js` (glassmorphism deep-space, logo NASA, badges).
  - [x] Rediseñar `src/Components/Layout/Navbar/NavBtn.js` (reemplazar cajas rojas/amarillas por tabs elegantes con active state).
  - [x] Rediseñar `src/Components/Layout/SideNav/SideDrawer/SideDrawer.js` (slide-over moderno).
  - [x] Rediseñar `src/Components/Layout/SideNav/SideDrawer/ToogleButton.js` (botón táctil accesible $\ge 48\text{px}$).
  - [x] Corregir `src/Components/Layout/SideNav/BackDrop/BackDrop.js` (cierre al hacer clic).
  - [x] Rediseñar `src/Components/Layout/Footer/Footer.js` (consola de observatorio con estado de API).

- [x] **Fase 4: Desbloqueo Zero-Trust (Build & Tests)**
  - [x] Crear `src/Pages/Gallery.js` (placeholder limpio para desbloquear build).
  - [x] Corregir anti-patrón en `src/Components/Spinner/Spinner.js`.
  - [x] Envolver tests de Router en `BrowserRouter` o `MemoryRouter`.

- [x] **Fase 5: Verificación Zero-Trust**
  - [x] Ejecutar diagnóstico: `bash scripts/init-agentic-flow.sh --check-env`.
  - [x] Ejecutar verificación Impeccable: `pnpm run check:design` (0 anti-patrones).
  - [x] Ejecutar pruebas unitarias: `pnpm test -- --watchAll=false`.
  - [x] Ejecutar compilación estática: `pnpm run build`.

- [ ] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`/`master`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-001-modernize-layout-and-agentic-flow`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [ ] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [ ] Ejecutar `git push -u origin feat/...`.
  - [ ] Crear Pull Request con `gh pr create`.
  - [ ] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [ ] Generar el reporte técnico en `docs/walkthroughs/TASK-XXX.md`.
  - [ ] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
