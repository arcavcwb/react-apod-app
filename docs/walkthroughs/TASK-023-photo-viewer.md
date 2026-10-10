# Walkthrough Técnico - TASK-023: La imagen se abre a pantalla completa

## 1. Problema

Pedido del usuario el 2026-10-09: la imagen debería abrirse en un modal.

- Un clic en la fotografía no hacía nada. La única forma de verla grande era «Alta resolución», que abre el archivo en otra pestaña y saca al lector de la app.
- En un laptop la fotografía del día queda pequeña: con todo en una pantalla (TASK-022) mide 426x278 a 1366x650 y 349x228 a 1280x600.

## 2. Diseño

| Pieza | Decisión |
|---|---|
| Qué se abre | La misma tarjeta de la fotografía (`PhotoFrame`), tan grande como deja la pantalla: entera, con sus esquinas, su brillo y su crédito |
| Con qué | `<dialog>` nativo con `showModal()`. Sin librerías. Da Escape y el foco dentro y de vuelta. Chrome para Android debería cerrarlo también con el gesto de atrás; no está probado |
| Cómo se entra | Toda la imagen es un botón (cursor de mano, sin lupa). Una marca en la esquina lo indica en pantallas táctiles |
| Cómo se sale | Escape, el botón de cerrar o un clic en cualquier parte |
| Movimiento | View transition, la misma que lleva una miniatura a su día: la tarjeta crece desde su sitio hasta el visor y vuelve. Solo se mueve la fotografía; el resto de la página se funde como una sola imagen (`zoomTransition`, `:root[data-zoom]`). Sin soporte o con movimiento reducido, abre al instante |
| Dónde | Página del día y portada. Los vídeos no: su reproductor ya tiene pantalla completa |
| Fondo | El color de fondo de la app al 97 %: queda un rastro de la página, sin competir con la imagen |
| Estado | Guardado por fecha en `PhotoFrame`: otro día llega con el visor cerrado |

Las flechas del teclado y el deslizamiento del día ignoran lo que ocurre dentro de un `dialog`. La página no se desplaza con el visor abierto (`html:has(.viewer[open])`).

## 3. Cambios

- `src/Components/Photo/PhotoFrame.tsx`: `PhotoViewer` y la propiedad `zoom` (el visor usa el propio `PhotoFrame` con `zoom={false}`).
- `src/Components/Photo/Photo.tsx`: `onZoom`; el botón solo existe cuando hay una imagen, no en el aviso de error ni en los vídeos. Una imagen ya cargada en la visita arranca nítida (la copia cargada hace de vista previa), para que no pase por borrosa al crecer.
- `src/utils/travel.ts`: `zoomTransition`.
- `src/Components/Day/DayView.tsx`: las flechas y el deslizamiento no actúan dentro del visor.
- `src/index.css`: `.viewer`.
- `src/i18n/messages.ts`: `image.zoom` e `image.close` en los tres idiomas.
- `e2e/apod.spec.ts`: tres pruebas, «the picture full screen».
- `PRODUCT.md` y `task.md`.

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm build` (incluye `tsc`) | correcto |
| `pnpm test` | 67 tests en 11 archivos |
| `pnpm test:e2e` | 39 pasan (6 nuevos: las tres pruebas en teléfono y en escritorio), 7 omitidos |
| `pnpm check:design` | falla igual que antes del cambio: los mismos 47 avisos (pendiente de TASK-018) |

En navegador, contra los datos reales:

| Pantalla | Día | En la página | En el visor |
|---|---|---|---|
| 1366x650 | apaisado (2026-10-08) | 426x278 | 920x602 |
| 1366x650 | vertical (2026-09-07) | 222x278 | 481x602 |
| 1366x650 | portada | | 812x602 |
| 390x844 | apaisado | | 366x239 |
| 390x844 | vertical | | 366x458 |

En los cinco casos: el foco va al botón de cerrar, la flecha izquierda no cambia de día, Escape cierra y devuelve el foco a la imagen, un clic cierra, y no hay errores en consola.

## 5. Pendiente

- En un teléfono real no se probaron el gesto de atrás ni el zoom con dos dedos dentro del visor.
- En un teléfono en vertical, una imagen apaisada no gana tamaño en el visor (ya ocupa el ancho); sí al girar el teléfono.
- El clic derecho sobre la imagen de la página ya no ofrece «guardar imagen» (el botón la cubre); dentro del visor sí.
- El movimiento del visor va en un segundo PR (`feat/TASK-023-viewer-morph`): el #23 ya estaba mergeado.
