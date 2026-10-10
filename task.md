# Task Checklist - TASK-022: La app cabe en la pantalla de un laptop

- [x] **Fase 1: Diagnóstico (reporte del usuario, 2026-10-09: «la responsividad en mi laptop no se ve bien»)**
  - [x] El diseño de escritorio pone el día y «Acerca de» en una sola pantalla, pero solo cabía con unos 720 px de alto. Un laptop de 1366x768 o de 1280x720 deja entre 600 y 650.
  - [x] Día: el texto, «Leer todo» y la tira del mes quedaban sobre el pie o cortados.
  - [x] «Acerca de»: bloques cortados a media línea, sin forma de leer el resto.
  - [x] Galería: miniaturas de unos 50 px de alto, como franjas.

- [x] **Fase 2: Implementación**
  - [x] Día: el título, las acciones y el texto forman una columna propia; un título largo ya no empuja la tira y las acciones hacia el pie.
  - [x] Variante `short:` de Tailwind (escritorio de hasta 768 px de alto): menos aire entre bloques.
  - [x] El tamaño de los títulos (`text-display`) también depende del alto de la pantalla.
  - [x] Galería: una fila de imágenes por página cuando la pantalla tiene hasta 736 px de alto.
  - [x] «Acerca de»: dos bloques por página en pantallas bajas, en lugar de tres.
  - [x] Por debajo de 576 px de alto las páginas de una pantalla pasan a leerse hacia abajo (antes, 480); la fotografía del día se queda a la vista junto al texto.

- [x] **Fase 3: Verificación**
  - [x] `tsc`, tests unitarios, E2E y build.
  - [x] Seis pruebas E2E nuevas a 1366x650 y 1280x600 (día, galería y «Acerca de»); las seis fallan sin el arreglo.
  - [x] En navegador, con datos reales: seis días distintos (apaisado, vertical, vídeo, títulos de dos y tres líneas) en siete tamaños de pantalla, sin nada sobre el pie.
  - [x] Teléfono y escritorio grande: sin cambios a la vista.
  - [ ] En el laptop del usuario: no se conoce su resolución; lo medido es Chromium a los tamaños habituales.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`feat/TASK-022-laptop-heights`).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin feat/TASK-022-laptop-heights`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Reporte técnico en `docs/walkthroughs/TASK-022-laptop-heights.md`.

- [ ] **Pendiente de tareas anteriores**
  - [x] TASK-021: producción comprobada tras el merge (2026-10-10): `/api/apod`, `/api/translate`, la vista previa de un día, la portada y la galería.
  - [ ] TASK-018: revisión final de diseño y `DESIGN.md` nuevo (`pnpm check:design` falla por eso: Public Sans no está declarada).
  - [ ] TASK-018: vistas previas al compartir por WhatsApp con un día real.
  - [ ] En Netlify, la variable `VITE_NASA_API_KEY` ya no se usa y se puede borrar.
