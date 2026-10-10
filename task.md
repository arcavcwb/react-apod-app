# Task Checklist - TASK-023: La imagen se abre a pantalla completa

- [x] **Fase 1: Decisión (usuario, 2026-10-09)**
  - [x] La imagen del día se abre en un modal. Hasta ahora un clic en ella no hacía nada, y «Alta resolución» abre el archivo en otra pestaña.
  - [x] En un laptop la fotografía del día mide entre 230 y 280 px de alto (TASK-022): el modal le devuelve el tamaño.

- [x] **Fase 2: Implementación**
  - [x] Un clic en la imagen (o Enter) la abre entera sobre la página oscurecida; una marca en la esquina lo indica donde no hay puntero.
  - [x] `<dialog>` nativo: cierra con Escape, con el botón y con otro clic; el foco queda dentro y vuelve a la imagen.
  - [x] En la página del día y en la portada. Los vídeos conservan su reproductor.
  - [x] Mientras está abierta, las flechas del teclado y el deslizamiento no cambian de día, y la página no se desplaza.
  - [x] Textos en español, inglés y portugués.
  - [x] Se abre y se cierra con la view transition `photo`: la tarjeta crece desde su sitio hasta el visor y vuelve. Sin cursor de lupa.

- [x] **Fase 3: Verificación**
  - [x] `tsc`, tests unitarios, E2E y build.
  - [x] Tres pruebas E2E nuevas, en teléfono y escritorio.
  - [x] En navegador, con datos reales: imagen apaisada y vertical, a 1366x650 y 390x844.
  - [ ] En un teléfono real: el gesto de atrás y el zoom con dos dedos no se probaron.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`feat/TASK-023-photo-viewer`, sobre la de TASK-022).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin feat/TASK-023-photo-viewer`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] El movimiento del visor, en `feat/TASK-023-viewer-morph` (segundo PR; el #23 ya estaba mergeado).
  - [x] Reporte técnico en `docs/walkthroughs/TASK-023-photo-viewer.md`.

- [ ] **Pendiente de tareas anteriores**
  - [ ] TASK-022: en `main` (llegó con el PR #23; el #22 se cerró); falta verlo en el laptop del usuario.
  - [x] TASK-021: producción comprobada tras el merge (2026-10-10): `/api/apod`, `/api/translate`, la vista previa de un día, la portada y la galería.
  - [ ] TASK-018: revisión final de diseño y `DESIGN.md` nuevo (`pnpm check:design` falla por eso: Public Sans no está declarada).
  - [ ] TASK-018: vistas previas al compartir por WhatsApp con un día real.
  - [ ] En Netlify, la variable `VITE_NASA_API_KEY` ya no se usa y se puede borrar.
