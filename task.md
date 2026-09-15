# Task Checklist - TASK-018: Rediseño integral «Manual de normas gráficas»

- [x] **Fase 1: Análisis**
  - [x] Inspeccionar páginas, componentes, datos de APOD, galería, compartir, estilos, Three.js y problemas móviles.
  - [x] Registrar el brief del usuario en `PRODUCT.md` (prioridades, navegación, paleta y prohibiciones).

- [x] **Fase 2: Dirección visual (Impeccable)**
  - [x] Tirada de dirección, re-tirada pedida por el usuario y elección de «Manual de normas gráficas».
  - [x] Contrato de dirección en `.impeccable/surfaces/src-pages-home-tsx.md`.

- [x] **Fase 3: Implementación**
  - [x] Sistema visual: azul noche, blanco suave, pizarra, un azul orbital; Public Sans en tres tamaños.
  - [x] Cabecera mínima (Hoy · Galería · idioma), pie con Acerca de.
  - [x] Portada: foto del día entera, título, fecha, extracto, Ver detalles y Compartir; días anteriores.
  - [x] Galería `/gallery/:month` en cuadrícula estricta; redirecciones desde `/archive/*`.
  - [x] Detalle: foto, título, fecha, acciones, explicación, datos, días vecinos; flechas, deslizamiento y transiciones.
  - [x] Compartir: hoja nativa o copiar enlace con confirmación.
  - [x] Esqueletos de carga, errores coherentes, fondo de estrellas fijo, sin Three.js.

- [ ] **Fase 4: Verificación**
  - [x] `tsc`, tests unitarios y E2E.
  - [x] Dos rondas de capturas en escritorio y móvil con datos reales.
  - [x] Detector Impeccable.
  - [ ] Revisión final de diseño y `DESIGN.md` nuevo.
  - [ ] Vistas previas al compartir: tras el merge, en producción (las deploy previews piden inicio de sesión), compartir un día por WhatsApp y comprobar título, extracto y foto (usar un día no compartido antes: WhatsApp guarda las vistas previas).
  - [ ] Netlify: `VITE_NASA_API_KEY` disponible también para Functions; la Edge Function `apod-preview` la usa y sin ella cae en `DEMO_KEY`.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`feat/TASK-018-cinematic-redesign`).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin feat/TASK-018-cinematic-redesign`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Reporte técnico en `docs/walkthroughs/TASK-018-cinematic-redesign.md`.
