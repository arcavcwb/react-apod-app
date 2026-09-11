# Walkthrough Técnico - TASK-017: Carga del archivo mensual

## 1. Problema reportado

"El archivo tiene problemas de renderizado; las imágenes tardan y algunas no se ven" (usuario, 2026-09-11, sobre https://apodgallery.netlify.app).

## 2. Diagnóstico con datos reales de producción

| Medición | Resultado |
|---|---|
| Consulta de un mes entero a `api.nasa.gov` | 5,0 s, 5,5 s, 6,8 s y 38,4 s en cuatro pruebas |
| Consulta de una semana | cerca de 1,7 s (entre 1,3 y 5,3 s en paralelo) |
| Miniatura vía Netlify Image CDN (sin caché) | entre 0,3 y 0,9 s |
| Timeout de la app | 10 s: un mes lento terminaba en error de red |
| Días de video `.mp4` alojados en la NASA | sin miniatura; se veían como cuadros vacíos con la etiqueta equivocada |

La lentitud venía de la API de la NASA con rangos largos, no de las imágenes.

## 3. Cambios

- `fetchApodMonth` pide el mes en semanas paralelas. Cada semana se entrega al llegar (`onProgress`), se reintenta una vez si falla por red y el mes se guarda en caché completo solo cuando llegan todas.
- `useApodMonth` expone `partial`; el calendario pinta cada semana en cuanto llega.
- Timeout de 15 s por consulta.
- Las miniaturas aparecen con un fundido suave. Si el CDN falla, se usa la imagen original de la NASA; si esa también falla, "Sin vista previa".
- Los días de video sin miniatura muestran la marca de play, con "VIDEO" en la notación de la fila en móvil.
- El aviso "Cargando el mes…" pasa bajo el título, donde se ve.
- El título de las celdas se ajusta a la escala tipográfica de `DESIGN.md` (aviso del detector).

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm exec tsc` | 0 errores |
| `pnpm test` | 34 tests (nuevos: rangos semanales, semana abierta en el mes actual, progreso, reintento y fallo) |
| `pnpm test:e2e` | 19 pasan, 1 omitido a propósito |
| Detector Impeccable | 0 hallazgos |
| Julio 2026 con la API real | primer día visible en 1,7–3,4 s (antes 5–38 s); 28 de 28 miniaturas cargadas |

## 5. Pendiente

Un proxy con caché en el borde de Netlify (función con `Netlify-CDN-Cache-Control`) haría instantáneo cada mes pasado para todos los visitantes después del primero, y además ocultaría la clave. Queda como decisión abierta en `PRODUCT.md`.
