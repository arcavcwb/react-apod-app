# Task Checklist - TASK-009: Actualización de Skill project-to-article con Especificación Completa (30 Secciones)

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-009-update-project-to-article-full-spec`.

- [x] **Fase 2: Instalación de la Especificación Completa de la Skill**
  - [x] Actualizar `.agents/skills/project-to-article/SKILL.md` con las 30 secciones completas (inspección, SEO, confidencialidad, revisión factual, entrega).
  - [x] Sincronizar globalmente en `~/.gemini/config/skills/project-to-article/SKILL.md`.
  - [x] Incorporar metadatos SEO requeridos por la especificación (Sección 18 y 26) en `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md`.

- [x] **Fase 3: Verificación y Testing**
  - [x] Ejecutar auditoría de diseño: `pnpm run check:design`.
  - [x] Ejecutar pruebas unitarias: `pnpm test`.
  - [x] Ejecutar compilación estática: `pnpm run build`.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-009-update-project-to-article-full-spec`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-009-update-project-to-article-skill.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
