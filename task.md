# Task Checklist - TASK-019: Traducción de la explicación

- [x] **Fase 1: Decisión**
  - [x] Decisión del usuario (2026-09-15): el título y los créditos siguen en inglés; solo se traduce la explicación, a español y portugués de Brasil.
  - [x] Proveedor: DeepL, desde una Edge Function que recibe fecha e idioma (nunca texto) y pide la explicación a la NASA.

- [x] **Fase 2: Implementación**
  - [x] Contratos Zod: respuesta de DeepL y de `/api/translate` (`src/contracts/translation.contract.ts`).
  - [x] Núcleo compartido (`netlify/edge-functions/translate/core.ts`), Edge Function con caché de CDN y middleware de Vite para desarrollo local.
  - [x] Cliente: `translation.service.ts` con caché en `localStorage`, hook `useExplanation`, texto del día, tarjeta «Leer todo» y extracto de la portada con etiqueta y «Ver original».
  - [x] `PRODUCT.md`, `README.md`, `.env.example` y brief de diseño.

- [ ] **Fase 3: Verificación**
  - [x] `tsc`, tests unitarios (núcleo y servicio) y E2E (traducción y caída al original).
  - [x] Capturas en español, portugués e inglés, en escritorio y móvil.
  - [x] Con clave real de DeepL en local: español y portugués en el navegador, una petición por página.
  - [ ] Tras el merge, traducción en producción (clave de Netlify con ámbito *Functions*).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`feat/TASK-019-explanation-translation`).
  - [x] `git add` y `git commit` (Conventional Commits, commits atómicos).
  - [x] `git push -u origin feat/TASK-019-explanation-translation`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Reporte técnico en `docs/walkthroughs/TASK-019-explanation-translation.md`.

- [ ] **Pendiente de TASK-018**
  - [ ] Revisión final de diseño y `DESIGN.md` nuevo.
  - [ ] Vistas previas al compartir: tras el merge, en producción (las deploy previews piden inicio de sesión), compartir un día por WhatsApp y comprobar título, extracto y foto (usar un día no compartido antes: WhatsApp guarda las vistas previas).
  - [ ] Netlify: `VITE_NASA_API_KEY` disponible también para Functions; la Edge Function `apod-preview` la usa y sin ella cae en `DEMO_KEY`.
