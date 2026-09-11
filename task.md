# Task Checklist - TASK-010: Rediseño Visual Futurista Deep-Space Observatory & Motion System

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-010-futuristic-deep-space-redesign`.

- [x] **Fase 2: Motor de Estilos, View Transitions y Tokens de Motion (`src/index.css`, `tailwind.config.js`)**
  - [x] Configurar soporte para View Transitions API nativas con progressive enhancement.
  - [x] Definir keyframes espaciales: Space Portal (`scale(1.04) blur(12px) -> scale(1) blur(0)`), desplazamientos direccionales (Slide Prev, Slide Next, Quantum Jump).
  - [x] Definir utilidades de glow, bordes HUD/sci-fi, scanlines sutiles y reglas de `@media (prefers-reduced-motion)`.

- [x] **Fase 3: Fondo Cósmico Vivo de Alto Rendimiento (`src/Components/CosmicBackground/`)**
  - [x] Crear `CosmicCanvas.tsx` con partículas estelares sutiles en 3 capas de profundidad, gradientes radiales y micro-parallax de mouse (desactivado en táctil y reduced motion).
  - [x] Integrar en `Layout.tsx` en capa aislada GPU (`will-change-transform`) garantizando 60–120 FPS sin repintado de scroll.

- [x] **Fase 4: Consola HUD de Navegación (`src/Components/Layout/Navbar/`)**
  - [x] Rediseñar `NavBar.tsx` y `NavBtn.tsx` con estética de consola espacial orbital.
  - [x] Incorporar telemetría en vivo: estado del nodo NASA y reloj UTC en tiempo real.
  - [x] Implementar helper de navegación con View Transitions nativas (`navigateWithTransition`).

- [x] **Fase 5: Hero / Visor APOD y Ficha de Telemetría Científica (`src/Pages/Apod.tsx`)**
  - [x] Implementar efecto "Space Portal" en carga de medios y soporte `view-transition-name: hero-apod-image`.
  - [x] Controles de navegación temporal direccionales (Día Anterior, Siguiente, Salto Cuántico Aleatorio) con transiciones espaciales.
  - [x] Rediseñar la ficha técnica como un dossier de observación astrofísica con coordenadas y badges futuristas (0 emojis).

- [x] **Fase 6: Archivo Orbital de Galería (`src/Pages/Gallery.tsx`)**
  - [x] Rediseñar cards de la galería como visores orbitales con micro-interacciones de hover y badges SVG.
  - [x] Conectar la selección de card con el visor APOD mediante View Transition de continuidad visual.
  - [x] Rediseñar modal de inspección en alta resolución como terminal de comando espacial.

- [x] **Fase 7: Páginas de Inicio y Misión (`src/Pages/Home.tsx`, `src/Pages/About.tsx`)**
  - [x] Modernizar `Home.tsx` con retícula orbital, anillos de escaneo SVG y telemetría de misión.
  - [x] Modernizar `About.tsx` con diseño de "Dossier de Misión" y especificaciones técnicas.

- [x] **Fase 8: Verificación Zero-Trust**
  - [x] Auditoría de diseño: `pnpm run check:design` (0 anti-patrones, 0 emojis, touch targets >= 48px).
  - [x] Pruebas unitarias: `pnpm test` (100% suites pasadas).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-010-futuristic-deep-space-redesign`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-010-futuristic-redesign.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
