# Walkthrough Técnico - TASK-022: La app cabe en la pantalla de un laptop

## 1. Problema

Reporte del usuario el 2026-10-09: «la responsividad en mi laptop no se ve bien».

El diseño de escritorio (desde 1024 px de ancho) pone el día y «Acerca de» en una sola pantalla, sin barra de desplazamiento. Estaba ajustado para pantallas de unos 800 px de alto. Un laptop deja menos a la página:

| Pantalla | Alto útil aproximado |
|---|---|
| 1920x1080 al 150 % (1280x720) | 600 |
| 1366x768 | 650 |
| 1280x800 | 680 |
| 1920x1080 al 125 % (1536x864) | 730 |

Medido en Chromium a 1366x650 y 1280x600, antes del cambio:

| Página | Qué pasaba |
|---|---|
| Día | El texto y «Leer todo» quedaban sobre el pie; la tira del mes, cortada por el borde de la pantalla. En la prueba E2E, con un título de tres líneas, el contenido pasaba del inicio del pie por 51 px a 1366x650 y por 94 px a 1280x600 |
| «Acerca de» | Bloques cortados a media línea; como la página no baja, el resto no se podía leer |
| Galería | Dos filas en 352 px: miniaturas de 182 px de ancho por unos 50 de alto, como franjas |
| Portada | Bien |

La causa en el día: la rejilla compartía filas entre las dos columnas. La fila del título (izquierda) fijaba el alto mínimo de la fotografía (derecha), y debajo iban las acciones y la tira. Con un título de tres líneas hacían falta unos 712 px de alto.

## 2. Diseño

Se mantiene la idea del diseño: una pantalla en escritorio. No se rediseña nada.

| Pieza | Decisión |
|---|---|
| Columnas del día | En escritorio, título, acciones y texto son una columna propia (`flex`); la rejilla solo tiene las filas de la derecha (fotografía, acciones, tira). Un título largo le quita sitio al texto que tiene debajo, nunca a la otra columna |
| Pantalla baja | Variante `short:` en Tailwind: `(min-width: 64rem) and (max-height: 48rem)`. Cierra el aire entre bloques en el día y en «Acerca de» |
| Títulos | `text-display` pasa a `clamp(2.25rem, min(1.45rem + 2.6vw, 7.5vh), 4.25rem)`: en una pantalla baja el título baja de tamaño. Teléfonos en vertical y escritorios altos quedan igual |
| Galería | Filas según el alto, como ya hacía: 3 desde 992 px, 2 en medio, 1 hasta 736 px. Con una fila la miniatura mide 182x198 a 1366x650 |
| «Acerca de» | Dos bloques por página en pantalla baja (antes tres): las líneas son más largas y el bloque más alto cabe |
| Límite de «una pantalla» | Sube de 480 a 576 px de alto. Por debajo la página baja como en un teléfono, y la fotografía del día toma el alto de la pantalla y se queda fija junto al texto |

## 3. Cambios

- `src/Components/Day/DayView.tsx`: la columna de texto en escritorio; la tarjeta de lectura cubre esa columna (`absolute inset-0`) y ya no necesita su posición en la rejilla.
- `tailwind.config.js`: pantalla `short` y tamaño `display` con el alto.
- `src/index.css`: límite de `.stage-lg` y la fotografía fija en la página que baja (`.day-photo`).
- `src/Pages/Gallery.tsx`: una fila en pantalla baja.
- `src/Pages/About.tsx`: dos bloques por página y menos aire en pantalla baja.
- `e2e/apod.spec.ts`: seis pruebas nuevas, «laptop screens».

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm build` (incluye `tsc`) | correcto |
| `pnpm test` | 67 tests en 11 archivos |
| `pnpm test:e2e` | 33 pasan, 7 omitidos (las seis pruebas nuevas no corren en el proyecto de teléfono) |
| Pruebas nuevas sin el arreglo | las seis fallan |
| `pnpm check:design` | falla igual que antes del cambio: los mismos 47 avisos, por el `DESIGN.md` pendiente de TASK-018 |

En navegador, contra los datos reales, el día a 1366x650, 1280x600, 1280x680, 1536x730, 1100x620, 1024x600 y 1280x577, con seis días (apaisado, vertical, vídeo, títulos de dos y tres líneas): la página no baja y nada queda sobre el pie.

| Pantalla | Fotografía (día apaisado) | Líneas de texto a la vista |
|---|---|---|
| 1280x600 | 349x228 | 5 |
| 1366x650 | 426x278 | 7 |
| 1280x680 | 471x308 | 8 |
| 1536x730 | 547x358 | 9 |

«Acerca de» a 1366x650, 1280x600, 1536x730 y 1280x577, en español e inglés, y a 1280x600 en portugués: tres páginas y ningún bloque cortado (el más alto mide 290 a 298 px; hay entre 300 y 441).

A la vista, sin cambios: el día en teléfono (390x844) y en escritorio grande (1920x950).

## 5. Pendiente

- No se probó en el laptop del usuario: no se conoce su resolución. Lo medido es Chromium a los tamaños de arriba.
- Ventanas de 1024 a 1100 px de ancho: los botones del día se parten en dos filas y la fotografía queda en 164 a 184 px de alto con 600 a 620 de pantalla. Cabe todo, pero pequeño.
- La tarjeta «Leer todo» deja ver, por sus esquinas redondeadas, un trazo del título y el borde del botón que tiene detrás. Ya pasaba en producción antes de este cambio.
- `DESIGN.md` sigue sin describir el diseño actual (TASK-018).
