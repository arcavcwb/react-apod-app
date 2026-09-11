# Task Checklist - TASK-015: NASA APOD Explorer — Deep Space Observatory

- [x] **Fase 1: Codebase Audit (No file modifications)**
  - [x] Identificar entrada de la aplicación, rutas y componentes de layout.
  - [x] Identificar capa de servicio APOD (`fetchTodayApod`, `ApodItem`, `ApodItemSchema`).
  - [x] Identificar motor Three.js (`Orbital3DSystem.tsx`, `orbital3d.config.ts`, lifecycle, render loop).
  - [x] Identificar diseño, tipografía y tokens de Tailwind.
  - [x] Elaborar Plan de Implementación técnico conciso en `implementation_plan.md`.

- [x] **Fase 2: Arquitectura del Observatorio en Home (`Home.tsx` & Layout)**
  - [x] Observatory Navigation: Header minimalista (NASA APOD + marca circular, Explore, Archive, About, y SYSTEM ONLINE con indicador sutil).
  - [x] Hero Typography: Editorial serif para el titular monumental ("EXPLORA EL COSMOS" / "EXPLORE THE COSMOS"), sans-serif para subtítulo humano y monospace para telemetría.
  - [x] CTAs directos y sobrios: `EXPLORAR APOD DE HOY →` y `VER ARCHIVO` (touch target >= 48px, WCAG 2.1 AA).
  - [x] Proporción espacial: 35-40% texto/UI y 60-65% visualización 3D predominante.

- [x] **Fase 3: Elevación del Sistema Orbital 3D (`Orbital3DSystem.tsx`)**
  - [x] Fondo espacial ultra-oscuro con miles de estrellas tenues (profundidad 3D, sin efecto de purpurina).
  - [x] Órbitas diferenciadas con inclinaciones sutiles, radios y velocidades astronómicas creíbles.
  - [x] Cuerpos celestes con atmósfera Fresnel sutil y materiales PBR restringidos (sin esferas gigantes de caricatura).
  - [x] Sol central como emisor estelar contenido (sin bloom excesivo ni posprocesamiento pesado).
  - [x] Parallax de cámara muy sutil y amortiguado (calmado).
  - [x] Raycasting exclusivo contra cuerpos celestes interactivos (sin setters de estado React en el render loop).
  - [x] Telemetría de instrumentación científica al hacer hover (`OBJECT`, `DISTANCE`, `STATUS`, monospace, bordes finos).
  - [x] Limpieza y disposición exhaustiva de recursos Three.js al desmontar.
  - [x] Soporte estricto de `prefers-reduced-motion: reduce` (render de frame estable sin rotación ni parallax).

- [x] **Fase 4: Telemetría HUD Científica y Módulo APOD (`ObservationStrip`)**
  - [x] HUD científico discreto y de baja opacidad (orientación, telemetría y marcadores de observación).
  - [x] Módulo APOD en tiempo real: integrar `fetchTodayApod` del servicio existente `nasa.service.ts` para mostrar la observación real de hoy (título real, fecha, botón de entrada).
  - [x] Tratamiento horizontal de instrumentación cerca del fondo (sin tarjetas redondeadas pesadas ni falsos datos).

- [x] **Fase 5: Composiciones Responsivas Multi-Viewport**
  - [x] Desktop (1440x900, 1280x800): composición horizontal con orbital dominante extendiéndose más allá del viewport.
  - [x] Tablet (1024x768, 768x1024): densidad tipográfica y HUD ajustados.
  - [x] Mobile (390x844, 375x812): composición vertical con el sistema orbital recortado deliberadamente en los bordes para sensación cinematográfica.

- [x] **Fase 6: Verificación Zero-Trust**
  - [x] Auditoría de diseño Impeccable: `echo y | pnpm run check:design` (0 anti-patrones).
  - [x] Pruebas unitarias: `pnpm test` (100% suites passing).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Pruebas visuales con Playwright en 1440x900, 1280x800, 1024x768, 390x844.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`feat/TASK-015-deep-space-observatory`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-015-deep-space-observatory.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
