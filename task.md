# Task Checklist - TASK-017: Carga del archivo mensual

- [x] **Fase 1: Diagnóstico en producción**
  - [x] Medir la API de la NASA por tamaño de rango y el CDN de imágenes de Netlify.
  - [x] Identificar los días de video sin miniatura y el timeout de 10 s.

- [x] **Fase 2: Corrección**
  - [x] Mes en semanas paralelas con progreso, reintento y caché completa.
  - [x] Calendario progresivo; aviso de carga visible.
  - [x] Miniaturas con fundido y respaldo a la imagen original; marca de video.

- [x] **Fase 3: Verificación**
  - [x] `tsc`, 34 tests unitarios, E2E 19 pasan y 1 omitido, detector 0 hallazgos.
  - [x] Prueba con la API real en escritorio y móvil.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama (`fix/TASK-017-archive-loading`).
  - [x] Verificación Impeccable: 0 anti-patrones.
  - [x] Pruebas unitarias y compilación estática (`build`).
  - [x] `git add` y `git commit` (Conventional Commits).
  - [x] `git push -u origin fix/TASK-017-archive-loading`.
  - [x] Crear Pull Request con `gh pr create` (#17).
  - [x] Reporte técnico en `docs/walkthroughs/TASK-017-archive-loading.md`.
  - [x] Merge a `main` vía Squash (aprobado por el usuario el 2026-09-11).
