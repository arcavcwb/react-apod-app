# Task Checklist - TASK-008: Redacción de Caso de Estudio Técnico con Skill project-to-article

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-008-technical-case-study-article`.

- [x] **Fase 2: Redacción del Artículo Técnico**
  - [x] Crear directorio `docs/posts/`.
  - [x] Redactar caso de estudio técnico exhaustivo en `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md` aplicando los principios de `project-to-article`:
    - [x] Cero invención de datos; apego a métricas y código real del repositorio.
    - [x] Estructura: Contexto, El Problema, La Solución, Arquitectura, Desafíos Técnicos con código, Resultados Reales, Aprendizajes.
    - [x] Snippets exactos de `apod.contract.ts`, `imageOptimizer.ts`, GPU layer CSS, Circuit Breaker, y `netlify.toml`.

- [x] **Fase 3: Verificación y Testing**
  - [x] Ejecutar auditoría de diseño: `pnpm run check:design`.
  - [x] Ejecutar pruebas unitarias: `pnpm test`.
  - [x] Ejecutar compilación estática: `pnpm run build`.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-008-technical-case-study-article`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-008-technical-article.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
