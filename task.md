# Task Checklist - TASK-003: Resiliencia de Carga de Imágenes y Manejo de Rate Limit

- [x] **Fase 1: Preparación y Feature Branch**
  - [x] Verificar `main` limpio y sincronizado con `origin/main`.
  - [x] Crear y posicionarse en rama feature `feat/TASK-003-image-loading-and-rate-limit-resilience`.
  - [x] Ignorar `.playwright-mcp/` en `.gitignore`.

- [x] **Fase 2: Contrato y Servicio Resiliente (Contract-First & Caching)**
  - [x] Actualizar `src/contracts/apod.contract.ts` con `thumbnail_url` y sanitización a HTTPS.
  - [x] Crear catálogo curado de respaldo en `src/services/curatedApod.ts` (12 fotos icónicas JWST/Hubble con metadatos reales).
  - [x] Modernizar `src/services/nasa.service.ts`:
    - [x] Activar `thumbs=true` en los endpoints.
    - [x] Implementar caché de cliente (`localStorage` por fecha e ID).
    - [x] Implementar timeout defensivo (8s con `AbortController`).
    - [x] Conmutar transparentemente al catálogo de respaldo cuando NASA devuelva HTTP 429 (`OVER_RATE_LIMIT`) o timeout, notificando con estado `isFallback`.

- [x] **Fase 3: Reparación del Componente de Medios (ProgressiveImage)**
  - [x] Corregir ciclo de vida en `src/Components/Media/ProgressiveImage.tsx` con `useEffect` para resetear estados al cambiar `src`.
  - [x] Corregir advertencia DOM en React 18 (`fetchpriority="high"` en minúsculas).
  - [x] Implementar fallback visual elegante si la imagen remota de NASA falla tras reintento.

- [x] **Fase 4: Soporte Completo de Medios en Páginas Core**
  - [x] Corregir bucle de re-render en `src/Pages/Apod.tsx` al cambiar de fecha.
  - [x] Mostrar aviso sutil si los datos provienen del catálogo de respaldo por cuota de API.
  - [x] En `src/Pages/Gallery.tsx`:
    - [x] Manejar items con `media_type === 'video'` usando `thumbnail_url` o extractor de YouTube con badge de reproducción.
    - [x] En el modal de detalle, renderizar `iframe` interactivo si el medio es video, o `ProgressiveImage` si es imagen.

- [x] **Fase 5: Verificación Zero-Trust**
  - [x] Auditoría de diseño: `pnpm run check:design` (0 anti-patrones).
  - [x] Pruebas unitarias: `pnpm test` (21 test suites pasadas, 27 tests pasados).
  - [x] Compilación estática: `pnpm run build` (`tsc && vite build`).
  - [x] Verificación en navegador local con Playwright (APOD, Gallery, Modal de detalle).

- [x] **Gobernanza Operativa Git Flow (CRÍTICO):**
  - [x] NUNCA comitear directamente a `main`.
  - [x] Trabajar en rama feature (`git checkout -b feat/TASK-003-image-loading-and-rate-limit-resilience`).
  - [x] Si la tarea involucra UI/UX o Frontend: Ejecutar verificación Impeccable (`pnpm run check:design` o `.agents/skills/impeccable/scripts/impeccable detect`) y certificar 0 anti-patrones.
  - [x] Ejecutar pruebas unitarias y compilación estática (`build`).
  - [x] Ejecutar `git add .` y `git commit -m "..."` (Conventional Commits).
  - [x] Ejecutar `git push -u origin feat/...`.
  - [x] Crear Pull Request con `gh pr create`.
  - [x] Actualizar descripción del PR vía GitHub API (`gh api -X PATCH /repos/OWNER/REPO/pulls/PR_NUM -F body="..."`).
  - [x] Generar el reporte técnico en `docs/walkthroughs/TASK-003-image-loading-and-resilience.md`.
  - [x] Merge a `main` vía Squash y limpieza de rama (`gh pr merge --squash --delete-branch`).
