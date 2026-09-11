# Task Checklist - TASK-013: Rediseño Minimalista Centrado en la Imagen y Datos Humanos

- [x] **Fase 1: Planificación y Dirección de Experiencia**
  - [x] Analizar el feedback: eliminar datos robóticos/irrelevantes (fake telemetry), simplificar navbar, centrar el foco en la imagen del día y datos humanos.
  - [x] Elaborar Plan de Implementación en `implementation_plan.md` con `request_feedback: true`.
  - [x] Obtener feedback y validación del usuario sobre la estructura de la experiencia (Opción B seleccionada).

- [x] **Fase 2: Preparación y Feature Branch**
  - [x] Sincronizar `main` limpio.
  - [x] Crear rama feature `feat/TASK-013-minimalist-human-apod-redesign`.

- [x] **Fase 3: Depuración del Layout y Navbar ([NavBar.tsx](file:///home/arcav/projects/react-apod-app/src/Components/Layout/Navbar/NavBar.tsx))**
  - [x] Eliminar la barra de telemetría superior artificial (`OBSERVATORY NODE`, `PIPELINE NOMINAL`, `UTC TIME`, `LATENCY`).
  - [x] Transformar el navbar en una barra minimalista, silenciosa y flotante (`backdrop-blur-md`):
    - [x] Logo NASA limpio y sutil.
    - [x] Enlaces esenciales con lenguaje humano: `Inicio`, `Foto de Hoy`, `Archivo`, `Acerca de`.
    - [x] Menú móvil minimalista.

- [x] **Fase 3.1: Evolución Cinemática de la Animación 3D ([Orbital3DSystem.tsx](file:///home/arcav/projects/react-apod-app/src/Components/OrbitalSystem/Orbital3DSystem.tsx))**
  - [x] Campo estelar cósmico 3D de partículas con profundidad y rotación sutil (750 partículas).
  - [x] Parallax cinemático de cámara suave al mover el ratón (efecto de profundidad inmersiva con `lerp`).
  - [x] Iluminación cósmica mejorada: atmósfera planetaria con fresnel, anillos planetarios translúcidos y núcleo solar vivo.
  - [x] Eliminación total de textos de pseudotelemetría robótica (`ORBITAL_VIEW_3D`, `TILT`, `RA/DEC`).
  - [x] Dinámica orbital orgánica y tarjetas HUD elegantes al interactuar.

- [x] **Fase 4: Transformación Humana y Minimalista del Visor ([Apod.tsx](file:///home/arcav/projects/react-apod-app/src/Pages/Apod.tsx))**
  - [x] Eliminar la cuadrícula técnica artificial (`IDENTIFICADOR APOD-...`, `PROTOCOLO HTTPS`, `OPTICAL APERTURE // LIVE`, `STATUS: VERIFIED`, `RA/DEC`).
  - [x] Rediseñar la ficha con datos humanos e intencionales:
    - [x] Fecha humanizada en español legible (ej. "10 de septiembre de 2026" vía `Intl.DateTimeFormat`).
    - [x] Autoría / Crédito destacado con respeto al fotógrafo/institución ("Crédito: ...").
    - [x] Título monumental y poético.
  - [x] Imagen como protagonista cinematográfica:
    - [x] Marco limpio y fluido sin sobrecarga de badges o esquinas falsas.
    - [x] Acciones flotantes discretas: "Compartir" (1-clic) y "Pantalla Completa / Ultra HD".
  - [x] Tipografía editorial para la explicación astronómica: lectura agradable, ritmo y espaciado generoso.
  - [x] Navegador de fechas simplificado y ergonómico.

- [x] **Fase 5: Flujo de Compartir Simplificado**
  - [x] Optimizar `ShareButton` y `ShareModal` para compartir en 1 solo paso (Web Share nativo en móvil / popover rápido en desktop con "Copiar enlace", WhatsApp, X).

- [x] **Fase 6: Verificación Zero-Trust**
  - [x] Ejecutar auditoría de diseño: `echo y | pnpm run check:design` (0 anti-patrones).
  - [x] Ejecutar pruebas unitarias: `pnpm test` (100% passing: 22 suites / 29 tests).
  - [x] Ejecutar compilación estática: `pnpm run build` (exitoso).
  - [x] Verificación visual con Playwright (desktop 1440x900 y mobile 390x844).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`feat/TASK-013-minimalist-human-apod-redesign`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-013-minimalist-human-redesign.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
