# Walkthrough Técnico - TASK-018: Rediseño «Manual de normas gráficas»

## 1. Encargo

Brief del usuario del 2026-09-11 (registrado en `PRODUCT.md`): mostrar la foto del día con claridad, explorar días anteriores en una galería, compartir fácil, pensar primero en el teléfono y hacer que explorar el universo se sienta especial. Sin tableros, sin Three.js decorativo, azul noche con un solo acento.

Dirección elegida con Impeccable: «Manual de normas gráficas» (NASA 1975 sobre azul noche), después ajustada con el usuario el 2026-09-15: más redondeada y flotante, con matiz cósmico y pensada para una mano en el teléfono. Cada decisión está en `.impeccable/surfaces/src-pages-home-tsx.md`.

## 2. Cambios

### Base visual
- Public Sans en tres tamaños fluidos (sustituye a Archivo y Source Serif 4), azul noche `#030712`, blanco suave, pizarra y el azul orbital `#416ce6`, con violeta nebulosa `#7c5cf0` y cian aurora `#37c6e8` solo para bordes, brillos y líneas.
- Botones en píldora con relieve; todas las flechas comparten un diseño cósmico (anillo aurora que gira y brillo de nebulosa al pasar el puntero).
- Marca orbital y favicon nuevos; fondo de estrellas fijo con nubes de nebulosa tenues.
- Se retiran `three` y `@types/three` y la órbita 3D de la portada.

### Portada `/`
- Una sola pantalla, sin scroll: título, fecha, extracto, Ver detalles y Compartir, la foto como tarjeta flotante con la forma de la imagen y días anteriores.
- `fetchRecentApods`: los días recientes llegan en una sola consulta corta, en caché una hora.

### Día `/apod/YYYY-MM-DD`
- Escritorio en una pantalla: título, acciones y explicación a la izquierda (si no cabe, «Leer todo» abre una tarjeta); a la derecha la foto, con las flechas de día fuera de la imagen, y un carrusel 3D del mes que se desliza sin barras.
- Teléfono con scroll: título, foto, flechas con la fecha, las cuatro acciones como círculos de colores (Compartir, HD, Oficial, Aleatorio), carrusel sin flechas con indicador de posición y explicación.
- View Transitions: una miniatura crece hasta la foto; entre días, la foto que sale y la que entra se mueven de forma simétrica. Un clic durante una transición la termina y llega a su destino.

### Galería `/gallery/YYYY-MM`
- Sustituye a `/archive` (los enlaces viejos redirigen). Escritorio: páginas de miniaturas que caben en la pantalla y se pasan de lado. Teléfono: cuadrícula con scroll. Botones de mes anterior y siguiente bajo las fotos.

### Compartir
- `shareUrl`: en local los enlaces apuntan a `https://apodgallery.netlify.app` (configurable con `VITE_PUBLIC_URL`); desplegado, a su propia dirección. En WhatsApp el enlace va en su propia línea.
- Edge Function `netlify/edge-functions/apod-preview`: para `/apod/*` pide el día a la NASA desde el servidor y escribe en la página las etiquetas Open Graph y Twitter (título, fecha con extracto y foto a 1200 px por Netlify Image CDN). Si la NASA falla o tarda más de 4 s, devuelve la página sin tocar. Caché de CDN de un día.

### Cabecera e idiomas
- Hoy y Galería como selector segmentado con iconos; en el teléfono la cabecera se oculta al bajar y vuelve al subir.
- Menú de idiomas propio en el teléfono y selector segmentado en escritorio, con banderas SVG redondas (España, Estados Unidos, Brasil).

## 3. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm exec tsc --noEmit` | 0 errores |
| `pnpm test` | 37 tests en 8 archivos (nuevos: días recientes, vista previa por día, enlace público) |
| `pnpm test:e2e` | 23 pasan, 1 omitido a propósito (flechas de teclado en móvil) |
| `vite build` | correcto |
| Capturas con datos reales | 1440×900, 1280×720, 768, 390 y 360 px: sin desbordes horizontales; escritorio sin scroll en portada, día y galería |
| Edge Function contra la API real (2026-09-07) | título, extracto, imagen y URL canónica correctos; la galería queda intacta |
| Transiciones medidas en el navegador | todas llegan a `ready` y `finished`, ninguna se cancela |
| Detector Impeccable | solo avisos de desfase con `DESIGN.md` |

## 4. Pendiente

- `DESIGN.md` todavía describe la dirección anterior («Atlas de campo»); hay que regenerarlo desde el código.
- Tras el merge, compartir un día por WhatsApp en producción (las deploy previews piden inicio de sesión) y comprobar la tarjeta.
- En Netlify, `VITE_NASA_API_KEY` debe estar disponible también para Functions; sin ella la vista previa usa `DEMO_KEY`.
