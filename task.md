# Task Checklist - TASK-014: Hero Split Fullscreen (100vh), Retiro de Navbar en Home y Animación 3D Estelar

- [x] **Fase 1: Planificación y Análisis de Layout**
  - [x] Analizar el feedback: retirar navbar en Home, layout de Hero split en 2 bloques (izq: título y navegación humana; der: animación 3D espectacular), altura contenida al 100vh en laptops sin scroll vertical desastroso.
  - [x] Elaborar Plan de Implementación técnico.

- [x] **Fase 2: Condicionamiento del Layout Global ([Layout.tsx](file:///home/arcav/projects/react-apod-app/src/Components/Layout/Layout.tsx))**
  - [x] En Home (`/`), suprimir el NavBar superior y el Footer para conceder el 100% del viewport (`h-screen` / `100dvh`).
  - [x] Mantener el NavBar y Footer limpios en `/apod`, `/gallery` y `/about` para preservar la navegación interna sin atrapar al usuario.

- [x] **Fase 3: Arquitectura del Hero Split 100vh ([Home.tsx](file:///home/arcav/projects/react-apod-app/src/Pages/Home.tsx))**
  - [x] Estructura con dos bloques internos equilibrados en pantalla completa:
    - [x] **Bloque Izquierdo:**
      - [x] Insignia de la NASA minimalista y tipografía de impacto ("Explora la Frontera del Cosmos").
      - [x] Subtítulo editorial humano e inspirador.
      - [x] CTAs directos y ergonómicos: botón principal "Ver Foto de Hoy" (`/apod`), secundario "Explorar Archivo" (`/gallery`) y enlace rápido "Acerca de" (`/about`).
      - [x] Estado interactivo reactivo sincronizado con la estación que el usuario hoverea en el 3D.
    - [x] **Bloque Derecho:**
      - [x] Contenedor 100% responsivo para el canvas Three.js que llena la columna derecha sin desbordar el alto ni forzar scroll.

- [x] **Fase 4: Elevación Cinemática de la Animación 3D ([Orbital3DSystem.tsx](file:///home/arcav/projects/react-apod-app/src/Components/OrbitalSystem/Orbital3DSystem.tsx))**
  - [x] Rediseño estético radical de Three.js:
    - [x] Núcleo estelar 3D auténtico con halo multicapa y corona luminosa.
    - [x] Esferas planetarias con sombreado de alta fidelidad, atmósferas con resplandor aditivo (Fresnel / BackSide) y anillos volumétricos realistas.
    - [x] Órbitas elípticas tridimensionales nítidas y elegantes.
    - [x] Campo estelar con profundidad y polvo cósmico dinámico.
    - [x] Raycasting interactivo: cursor `pointer`, aceleración/desaceleración suave y click directo a rutas.
    - [x] Soporte para resize dinámico de ventana sin distorsión de relación de aspecto.

- [x] **Fase 5: Verificación Zero-Trust**
  - [x] Ejecutar auditoría de diseño: `echo y | pnpm run check:design` (0 anti-patrones).
  - [x] Ejecutar pruebas unitarias: `pnpm test` (100% passing).
  - [x] Ejecutar compilación estática: `pnpm run build`.
  - [x] Verificación visual con Playwright en laptop (1440x900, 1366x768).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`feat/TASK-014-hero-split-fullscreen-orbital-redesign`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-014-hero-split-fullscreen-orbital.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
