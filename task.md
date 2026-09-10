# Task Checklist - TASK-006: Hardening de Seguridad Integral y Auditoría Zero-Trust

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-006-security-hardening-and-audit`.

- [x] **Fase 2: Resolución de Vulnerabilidades de Dependencias (CVE Audit)**
  - [x] Actualizar `react-router-dom` a `>=7.18.0` para mitigar GHSA-wrjc-x8rr-h8h6 y GHSA-337j-9hxr-rhxg.
  - [x] Ejecutar `pnpm audit` y certificar 0 vulnerabilidades.

- [x] **Fase 3: Cabeceras de Seguridad HTTP y Content Security Policy (CSP)**
  - [x] Configurar en `netlify.toml`:
    - [x] `Content-Security-Policy` estricto (bloqueo de scripts externos no autorizados y restricción de iframes a YouTube/Vimeo).
    - [x] `X-Frame-Options: DENY` (anti-clickjacking).
    - [x] `X-Content-Type-Options: nosniff` (anti-MIME sniffing).
    - [x] `Referrer-Policy: strict-origin-when-cross-origin`.
    - [x] `Permissions-Policy` (deshabilitar cámara, micrófono, geolocalización, pagos).

- [x] **Fase 4: Hardening en Código Frontend (XSS, Iframe Sandbox y Links)**
  - [x] Restringir en `src/contracts/apod.contract.ts` que los esquemas de URL exijan estrictamente protocolo `https://`.
  - [x] Agregar atributos `sandbox="allow-scripts allow-same-origin allow-presentation"` a todos los elementos `<iframe>`.
  - [x] Estandarizar todos los enlaces con `target="_blank"` con `rel="noopener noreferrer"`.

- [x] **Fase 5: Verificación Zero-Trust**
  - [x] Auditoría de seguridad de dependencias: `pnpm audit` (0 vulnerabilidades).
  - [x] Auditoría de diseño: `pnpm run check:design` (0 anti-patrones).
  - [x] Pruebas unitarias: `pnpm test` (22 suites y 29 tests pasados al 100%).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Verificación en navegador local con Playwright.

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-006-security-hardening-and-audit`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-006-security-hardening.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
