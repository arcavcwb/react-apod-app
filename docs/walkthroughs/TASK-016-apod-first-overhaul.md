# Walkthrough Técnico - TASK-016: APOD primero, datos honestos y atlas de campo

## 1. Resumen

La app giraba alrededor de una escena Three.js decorativa y mostraba la foto del día en una franja inferior. Cuando la API fallaba, presentaba fotos de stock de Unsplash rotuladas como imágenes del James Webb, con créditos de la NASA inventados, como si fueran "la observación de hoy". Esta tarea pone la imagen real en el centro, elimina todo dato inventado y rehace la interfaz con el sistema visual "Atlas de campo".

Decisiones del usuario (2026-09-11):

- Público: aficionados a la astronomía y visitantes de portafolio por igual.
- La foto del día es el héroe; el orrery 3D se conserva como sección secundaria diferida.
- Interfaz trilingüe: español, inglés y portugués de Brasil.
- Mundo visual elegido en la ronda de Impeccable: "Atlas de campo" (semilla `17cb43fd`).

## 2. Skills del proyecto usadas

Las skills vivían en `.agents/skills` (formato Antigravity) y Claude Code no las cargaba. Se enlazaron en `.claude/skills/` con symlinks relativos, sin duplicar contenido:

| Skill | Aplicación |
|---|---|
| `impeccable` (v0.1.5, nivel usuario) | `PRODUCT.md`, ronda de dirección, contrato de superficie, piso de calidad, detector, revisión final y `DESIGN.md` |
| `contract-first-api` | Contrato Zod endurecido, `safeParse`, errores tipados en vez de `any` |
| `web-vitals-heavy-media` | Lámina de tamaño fijo (CLS 0), `fetchpriority="high"`, `srcset`, miniaturas diferidas, estados de error con reintento |
| `playwright-e2e-suite` | Suite E2E con selectores accesibles en 390x844 y 1280x720 |
| `vite-modernizer` | TypeScript estricto, sin `allowJs`, dependencias muertas fuera |
| `ponytail` | Sin librería de i18n, share con enlaces planos, `input type=range` y `type=date` nativos, ~45 archivos eliminados |

## 3. Datos

- **Contrato** (`src/contracts/apod.contract.ts`): https forzado, créditos sin saltos de línea, `media_type` `other` para días interactivos, `url` opcional. Solo la fecha es obligatoria.
- **Servicio** (`src/services/nasa.service.ts`): sin catálogo de respaldo ni circuit breaker. Devuelve `{ data, error }` con `error` en `rate-limit | not-found | network | contract`.
- **Menos consultas**: la `DEMO_KEY` de la NASA hoy permite 10 solicitudes por hora (cabecera `x-ratelimit-limit: 10`, medida el 2026-09-11). Un mes se pide en una sola consulta y alimenta la caché de cada día; tras ver un día, el mes se precarga en inactividad, así que moverse por el mes no consume cuota.
- **Caché**: días y meses pasados sin expiración; lo que incluye hoy, 1 hora. Al arrancar se purgan las cachés `apod_cache_*` de versiones anteriores, que podían contener imágenes sustitutas guardadas como reales.
- **Fechas** (`src/utils/date.ts`): "hoy" se calcula en `America/New_York`, la zona en que publica la NASA.

## 4. Interfaz

- **Lámina del día** (`DayView`): imagen completa (`object-contain`) dentro de una moldura graduada de tamaño fijo; código de lámina `AP260911` en el margen; notación con fecha, número de día desde 1995, título, crédito y acciones; "próxima imagen en unas N h" solo cuando es la de hoy.
- **Regla de fechas** (`DateRuler`): `input type=range` graduado por día; arrastrar previsualiza la fecha (y el título si el mes está en caché) y soltar navega. Operable con teclado; conserva el foco y el scroll.
- **Viaje por días**: botones anterior y siguiente, campo de fecha nativo, aleatorio, flechas del teclado y barra fija inferior en móvil.
- **Archivo** (`/archive/YYYY-MM`): calendario mensual con celdas enlazadas (antes: 12 tarjetas aleatorias sin acceso por teclado y un "Cargar más" que repetía los mismos 6 ítems de la caché). Transición de vista de miniatura a lámina.
- **Orrery**: reescrito en la paleta del atlas, sin telemetría inventada, en un chunk propio que se descarga al acercarse, pausado fuera de pantalla y con los tres destinos como enlaces normales.
- **i18n**: diccionarios tipados (TypeScript exige las mismas claves en los tres idiomas), detección por navegador, selección recordada, `<html lang>` actualizado. El texto de la NASA va con `lang="en"`.
- **Marca**: se retiró la insignia de la NASA (uso restringido); retícula SVG propia y aviso de proyecto independiente.
- **Rutas heredadas**: `/apod?date=` y `/gallery` redirigen.

## 5. Plataforma

- React Router con data router (`createBrowserRouter`), `ScrollRestoration` por ruta.
- Fuentes Source Serif 4 y Archivo autoalojadas (OFL), sin terceros en tiempo de ejecución.
- CSP sin `unsafe-inline` en scripts; `remote_images` sin Unsplash; caché inmutable para `/assets/*`.
- Fuera `axios`, `react-share`, `@testing-library/jest-dom` y `package-lock.json` (el proyecto usa pnpm).
- CI en GitHub Actions: build, unit y E2E en cada PR.

## 6. Verificación

| Verificación | Comando | Resultado |
|---|---|---|
| Tipos | `pnpm exec tsc` | 0 errores en modo `strict` |
| Unit y componentes | `pnpm test` | 6 archivos, 32 tests |
| E2E | `pnpm test:e2e` | PENDIENTE |
| Detector Impeccable | `impeccable detect --json src index.html` | 0 hallazgos |
| Bundle | `pnpm build` | JS inicial 369 KB (117 KB gzip), antes 896 KB (244 KB gzip); Three.js aparte, 545 KB diferidos |

## 7. Pendiente para producción

- Configurar `VITE_NASA_API_KEY` en Netlify: con la `DEMO_KEY` el sitio agota la cuota enseguida.
- Decidir si conviene un proxy en Netlify para ocultar la clave y compartir caché.
