# Task Checklist - TASK-012: Sistema Orbital 3D Interactivo y Remoción de Navegación Estática

- [x] **Fase 1: Planificación y Feedback del Usuario**
  - [x] Analizar requerimientos y explorar opciones de arquitectura 3D (Three.js vs CSS 3D vs R3F).
  - [x] Generar Plan de Implementación detallado en `implementation_plan.md` con opciones y solicitar feedback (`request_feedback: true`).
  - [x] Obtener selección y aprobación del usuario (Opción 1 seleccionada).

- [x] **Fase 2: Preparación y Feature Branch**
  - [x] Sincronizar `main`.
  - [x] Crear rama feature `feat/TASK-012-orbital-3d-interactive-navigation`.
  - [x] Instalar dependencias si se selecciona Three.js (`three` + `@types/three`).

- [x] **Fase 3: Limpieza y Simplificación de Home.tsx**
  - [x] Remover botones de acción primaria estáticos ("Visor de Hoy", "Archivo Orbital").
  - [x] Remover tarjetas descriptivas estáticas (SISTEMA 01, SISTEMA 02, SISTEMA 03).
  - [x] Simplificar el texto y subtítulos para convertir Home en un cockpit / observatorio cinematográfico inmersivo.

- [x] **Fase 4: Implementación del Sistema Orbital 3D Interactivo**
  - [x] Desarrollar `<Orbital3DSystem />`:
    - [x] Escena 3D con perspectiva e inclinación orbital cinemática (~42°).
    - [x] Núcleo central con insignia de la NASA y halo estelar de energía.
    - [x] Órbita 1 (Interior): Estación / Baliza "APOD // VISOR" vinculada a `/apod`.
    - [x] Órbita 2 (Media): Estación / Sonda "ARCHIVO // GALERÍA" vinculada a `/gallery`.
    - [x] Órbita 3 (Exterior): Planeta / Observatorio "MISIÓN // ACERCA DE" vinculada a `/about`.
    - [x] HUD holográfico interactivo al hacer hover/focus sobre cada estación (coordenadas, telemetría y destino).
    - [x] Transiciones de ruta con `navigateWithViewTransition`.
    - [x] Accesibilidad: Navegación por teclado (Tab) y touch targets táctiles $\ge 48\text{px}$.
    - [x] Cumplir rigurosamente con `prefers-reduced-motion: reduce`.
  - [x] Implementar motor de compartir observación (`ShareButton` y `ShareModal`) en `Apod.tsx`.

- [x] **Fase 5: Verificación Zero-Trust**
  - [x] Ejecutar auditoría de diseño: `echo y | pnpm run check:design` (0 anti-patrones).
  - [x] Ejecutar pruebas unitarias: `pnpm test` (22 suites, 29 tests pasados al 100%).
  - [x] Ejecutar compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Verificación visual en vivo con Playwright (desktop 1440x900 y mobile 390x844).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`feat/TASK-012-orbital-3d-interactive-navigation`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-012-orbital-3d-navigation.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
