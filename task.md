# Task Checklist - TASK-007: Instalación de Skill project-to-article

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-007-install-project-to-article-skill`.

- [x] **Fase 2: Instalación de la Skill**
  - [x] Instalar skill global en `~/.gemini/config/skills/project-to-article/SKILL.md`.
  - [x] Instalar skill del proyecto en `.agents/skills/project-to-article/SKILL.md`.
  - [x] Validar formato YAML frontmatter y estructura Markdown.

- [x] **Fase 3: Verificación y Testing**
  - [x] Ejecutar auditoría de diseño: `pnpm run check:design`.
  - [x] Ejecutar pruebas unitarias: `pnpm test`.
  - [x] Ejecutar compilación estática: `pnpm run build`.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-007-install-project-to-article-skill`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-007-project-to-article-skill.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
