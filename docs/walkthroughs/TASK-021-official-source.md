# Walkthrough Técnico - TASK-021: Los días se leen del sitio oficial de APOD

## 1. Problema

Desde la mudanza de APOD a `science.nasa.gov`, la API de la NASA (`api.nasa.gov/planetary/apod`) devuelve el mismo registro de relleno para cualquier fecha y un 500 cuando no se pide fecha. Tras TASK-020 la app lo rechaza, así que producción solo mostraba avisos de error.

Decisión del usuario (2026-10-09): no esperar a la NASA y **leer los días del sitio oficial**.

## 2. Lo que se encontró en el sitio oficial

El sitio es un WordPress y publica cada día como JSON, sin clave:

```
https://science.nasa.gov/wp-json/wp/v2/image-article?categories=22766&_fields=date,title,content
```

| Dato | Medido el 2026-10-09 |
|---|---|
| Días publicados | 11.432, desde el 16 de junio de 1995 |
| Un mes entero | una petición, 3 a 5 s, unos 500 KB |
| Una semana | alrededor de 1 s |
| Un día sin APOD (1995-06-17) | lista vacía |
| Fecha del post | hora del Este de EE. UU.; los días antiguos, a las 00:00:00 |
| `robots.txt` | permite todo |

`22766` es el id de la categoría `apod` (`/wp-json/wp/v2/categories?slug=apod`).

El JSON trae la página del día como HTML en `content.rendered`; el título, la explicación, el medio y el crédito se leen de ese marcado:

| Campo | De dónde sale |
|---|---|
| `date` | los diez primeros caracteres de `date` |
| `title` | el `<h1>` de la página. El título del post es una copia simplificada («Hoags Object», «Comet C 2017 K2») y solo se usa si no hay `<h1>` |
| `explanation` | el párrafo `media-detail-hero__description`, sin la etiqueta «Explanation:» ni el avance «Tomorrow's picture» |
| `media_type`, `url`, `hdurl` | dentro de `media-detail-hero__media`: `<source>` (archivo de vídeo), `<iframe>` (YouTube) o `<img>`; el enlace de la figura es la versión más grande. Sin bloque, el día es interactivo (`other`) |
| `copyright` | la fila de la tabla cuyo rótulo dice «Credit» o «Copyright» |

De 235 días grabados (nueve meses entre 1995 y 2026): 228 imágenes, 5 vídeos y 2 días interactivos.

## 3. Diseño

| Pieza | Decisión |
|---|---|
| Dónde se lee | En el servidor: Edge Function `/api/apod`. El navegador solo habla con su propio origen |
| Forma de la respuesta | La misma que daba la API (`ApodItem`), con sus mismos parámetros: `date`, `start_date` y `end_date`, o nada para el último día. La interfaz no cambia |
| Un solo lector | `netlify/edge-functions/apod/core.ts`, compartido por `/api/apod`, `/api/translate`, la vista previa al compartir, el servidor de desarrollo y los tests |
| Contratos | `ApodPostSchema` para lo que envía el sitio; `ApodItemSchema` para lo que sale. Un post que no se puede leer como día hace fallar la respuesta entera (`upstream`) en vez de entregar un rango incompleto |
| Caché de CDN | Días pasados: un día, más una semana sirviendo la copia mientras se renueva. Lo que alcanza a hoy (último día, semana en curso): diez minutos. Errores: sin caché |
| Clave | Ninguna. `VITE_NASA_API_KEY` deja de leerse y ya no viaja en el paquete del cliente |
| Riesgo asumido | El lector depende del marcado de la página. Si la NASA rediseña el sitio, falla con `upstream` y la app muestra su aviso; los días grabados en `src/services/__tests__/fixtures/` son la referencia para repararlo |

## 4. Cambios

- `src/contracts/apod.contract.ts`: `ApodPostSchema`.
- `netlify/edge-functions/apod/core.ts` y `apod.ts`: lector, consultas al sitio y Edge Function.
- `netlify/edge-functions/translate/core.ts` y `apod-preview/apod-preview.ts`: leen del mismo lector; desaparece la clave de la NASA.
- `vite.config.ts`: `/api/apod` en desarrollo, con memoria para lo que ya no cambia. Se retiran el comentario de Three.js y `chunkSizeWarningLimit`, que ya no aplicaban.
- `src/services/nasa.service.ts`: pide a `/api/apod`.
- `src/utils/date.ts`, `ApodHero`, `Gallery`, `About`: enlaces oficiales a `science.nasa.gov/apod/` (`?date=YYMMDD` para un día).
- `src/i18n/messages.ts`: «Abrir en science.nasa.gov», origen de los datos, aviso de demasiadas consultas sin «cupo por hora», y la frase de «Acerca de» que aún decía que las explicaciones no se traducen. Se quita el enlace a la API de la NASA.
- `netlify.toml` (`connect-src 'self'`), `index.html` (sin `preconnect` a la API) y `.env.example`.
- `tsconfig.json`: las Edge Functions entran en la comprobación de tipos.
- `e2e/nasa.ts`: la suite responde ella misma `/api/apod` y `/api/translate`; ya no sale ninguna petición. El día grabado se regeneró con el lector nuevo.
- `PRODUCT.md`, `README.md` y `task.md`.

## 5. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm exec tsc --noEmit` | 0 errores, incluidas las Edge Functions |
| `pnpm test` | 67 tests en 11 archivos; 13 nuevos sobre el lector, con siete días reales grabados |
| 235 días grabados | todos se leen; ninguno deja etiquetas ni entidades HTML en el texto |
| Coste de leer un mes | 3,6 ms de mediana para 501 KB (el límite de una Edge Function es 50 ms de CPU) |
| `pnpm test:e2e` | 27 pasan, 1 omitido a propósito |
| `pnpm build` | correcto; ni `api.nasa.gov` ni la clave aparecen en el paquete |
| `pnpm check:design` | falla igual que en `main` (pendiente de TASK-018) |
| `/api/apod` en local contra el sitio real | día: 1,1 s; último día: 2026-10-09 «Stickney Crater»; septiembre entero: 30 días en 3,1 s; 1995-06-17: 404; fecha imposible: 400 |
| Navegador en local contra el sitio real | portada, imagen, archivo de vídeo, YouTube, día interactivo, GIF de 1995 y galería muestran el contenido real, sin errores de consola |
| `/api/translate` en local con DeepL real | 2026-09-11 al español en 1,1 s |

## 6. Pendiente

- **Producción tras el merge.** Las Edge Functions no se pueden ejecutar en Netlify antes: los deploy previews piden inicio de sesión. No está comprobado que el sitio de la NASA acepte peticiones desde la red de Netlify; si las rechazara, la app mostraría sus avisos de error, como ahora.
- Los enlaces dentro de las explicaciones se pierden, como antes: la app muestra texto.
- Los días con archivo de vídeo no tienen miniatura en el carrusel del día (sí un fotograma en la galería). La página trae una imagen destacada que podría servir.
- Los días pasados siguen guardándose para siempre en el navegador. Con una fuente leída del marcado conviene revisar ese plazo.
- De la revisión general, sin tocar: `localStorage` sin límite, rutas sin `errorElement`, `DESIGN.md` desactualizado.
