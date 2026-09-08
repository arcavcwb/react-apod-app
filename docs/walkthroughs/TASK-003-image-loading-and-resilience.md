# Walkthrough Técnico - TASK-003: Resiliencia de Carga de Imágenes y Mitigación de Rate Limit NASA

## 1. Resumen Ejecutivo

En esta tarea se resolvió de forma exhaustiva la problemática de carga lenta o fallida de imágenes astronómicas provocada por la saturación de cuota de la API pública de la NASA (`DEMO_KEY` con límite de 30 req/h, código HTTP 429 `OVER_RATE_LIMIT`), la desincronización de ciclo de vida del componente `ProgressiveImage`, y la presencia de videos embebidos en lugar de imágenes fijas en la galería.

Se diseñó e implementó un sistema de resiliencia con triple capa:
1. **Caché en Cliente (`localStorage`):** Consultas astronómicas por fecha inmutables (0ms y 0 consumo de cuota de red).
2. **Catálogo Oficial Curado de Respaldo:** 12 observaciones icónicas en ultra alta definición (James Webb, Hubble, Carina Nebula, Pillars of Creation, Andromeda) que se activan transparentemente si la NASA devuelve 429, timeout o falla de red.
3. **Manejo Inteligente de Medios y Miniaturas:** Extracción automática de miniaturas de YouTube/Vimeo para elementos de video con insignia visual y reproductor interactivo en el modal.

---

## 2. Diagnóstico Técnico

- **Límite de Cuota NASA Excedido (HTTP 429):** La clave compartida `DEMO_KEY` fue saturada; los servidores de NASA pueden tardar hasta 120 segundos antes de rechazar la conexión, congelando la interfaz.
- **Bucle de Estado en `Apod.tsx`:** La función de carga re-ejecutaba `setSelectedDate`, modificando la referencia del hook `useCallback` y disparando `useEffect` en un ciclo cerrado que agotó la cuota rápidamente.
- **Desincronización en `ProgressiveImage`:** Al cambiar la prop `src`, `loaded` y `error` no se reinicializaban. Si una imagen fallaba o ya estaba cargada, la siguiente imagen no ejecutaba el flujo de transición ni mostraba el skeleton.
- **Videos Embebidos como Imágenes en `Gallery.tsx`:** Los elementos con `media_type === 'video'` apuntaban a URLs de YouTube que causaban fallos en etiquetas `<img>`.

---

## 3. Arquitectura y Cambios Implementados

### A. Contrato Zod y Sanitización HTTPS (`src/contracts/apod.contract.ts`)
- Agregado campo `thumbnail_url: z.string().url().optional().nullable()`.
- Sanitización reactiva de URLs antiguas de NASA (`http://` a `https://`) para evitar bloqueos por contenido mixto.

### B. Catálogo Curado de Respaldo (`src/services/curatedApod.ts`)
- Muestrario de 12 observaciones espaciales en resolución completa (STScI/NASA/ESA) con metadatos reales para servir de fallback determinista.

### C. Servicio Astronómico Resiliente (`src/services/nasa.service.ts`)
- Solicitud de miniaturas con `thumbs=true`.
- Cancelación preventiva tras 8 segundos de inactividad con `AbortController`.
- Almacenamiento persistente en `localStorage`:
  - Fechas históricas: TTL permanente.
  - Día de hoy: TTL de 6 horas.
  - Galería dinámica: TTL de 30 minutos.
- Helper `getMediaThumbnail(item)` con extracción automática de miniaturas de YouTube.

### D. Componente `ProgressiveImage.tsx`
- Sincronización estricta con `useEffect` ante variaciones de `src`.
- Reemplazo del atributo React 18 por `fetchpriority` en minúsculas nativo.
- Capacidad de fallback a resolución alterna (`fallbackSrc`) tras reintentos fallidos.

### E. Páginas `Apod.tsx` y `Gallery.tsx`
- Eliminación del bucle de estado; `useEffect` reacciona de forma pura a `selectedDate`.
- Banner sutil de "Modo Resiliencia" cuando la información se sirve desde el catálogo de respaldo.
- Renderizado condicional en galería: insignia de reproducción para videos e `iframe` en el modal interactivo.

---

## 4. Verificación Zero-Trust

| Verificación | Herramienta | Resultado |
|---|---|---|
| Impeccable Craft Floor | `pnpm run check:design` | 0 anti-patrones detectados, 0 emojis unicode, touch targets $\ge 48\text{px}$ |
| Pruebas Unitarias | `pnpm test` (`vitest run`) | 21 suites pasadas, 27 tests pasados (100% éxito) |
| Compilación de Producción | `pnpm run build` | Compilado limpio en `dist/` con TypeScript 7 + Vite 8 |
| Inspección E2E en Navegador | Playwright MCP | APOD, Galería, navegación, modal y conmutación a fallback verificados en vivo |

---

## 5. Trazabilidad Git Flow

- **Rama**: `feat/TASK-003-image-loading-and-rate-limit-resilience`
- **Commit**: `feat(media): enhance image loading resilience, client cache, and NASA rate-limit fallbacks`
- **Destino**: `main` vía Pull Request con squash merge.
