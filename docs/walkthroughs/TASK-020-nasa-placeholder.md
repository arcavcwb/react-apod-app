# Walkthrough Técnico - TASK-020: Registro de relleno de la NASA

## 1. Problema

Detectado al revisar el proyecto el 2026-10-09. La API de la NASA devuelve, para cualquier fecha, el mismo registro:

```json
{
  "date": "2026-10-08",
  "title": "NASA Science",
  "media_type": "image",
  "url": "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png",
  "hdurl": "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png",
  "explanation": "Stickney Crater, the largest crater on the martian moon Phobos…"
}
```

| Petición | Respuesta medida |
|---|---|
| `?date=` (1999, 2020 y varias de 2026) | 200 con ese registro; solo cambia `date` |
| `?start_date=` | 200 con ese registro repetido por día; más tarde, 503 |
| sin fecha (la portada) | 500 |
| `apod.nasa.gov/apod/ap260907.html` | 301 a `science.nasa.gov/apod/` |

La forma del registro es válida, así que el contrato lo aceptaba y la app lo mostraba como el día pedido: contra el principio 2 de `PRODUCT.md` («no substitute images passed off as the requested day»). Además lo guardaba: los días pasados para siempre en `localStorage`, cada traducción un año en la CDN y la vista previa al compartir un día.

La causa probable es la mudanza de APOD a `science.nasa.gov` (anunciada en el texto del 2026-09-11); no está confirmada por la NASA.

Dos fallos propios aparecieron en la misma revisión:

- `/gallery/2025-13` y `/gallery/2025-00` rompían la página con `RangeError: Invalid time value`.
- La pestaña quedaba como «NASA APOD Explorer» al abrir un día ya guardado.

## 2. Diseño

| Pieza | Decisión |
|---|---|
| Qué se rechaza | Un registro cuya `url` o `hdurl` es un archivo del tema del sitio (`/wp-content/themes/`). No se rechaza el dominio: una imagen real alojada en `science.nasa.gov/wp-content/uploads/` sigue siendo un día |
| Dónde | En `ApodItemSchema`, para que la app, `/api/translate` y la vista previa lo rechacen igual |
| Qué ve el lector | El aviso `contract` que ya existía («Respuesta inesperada»), con el enlace oficial. Sin textos nuevos |
| Caché | Prefijo `apod:v4:`; al arrancar se borra cualquier `apod:vN:` anterior. `apod:locale` no se toca |
| CDN | No hay código: el deploy la vacía |

## 3. Cambios

- `src/contracts/apod.contract.ts`: `refine` sobre el esquema.
- `src/services/nasa.service.ts`: `CACHE_PREFIX` a `v4` y purga de versiones anteriores.
- `netlify/edge-functions/apod-preview/apod-preview.ts`: valida con `ApodItemSchema` en vez de comprobar tres campos a mano; un registro de relleno deja la página sin vista previa propia.
- `netlify/edge-functions/translate/core.ts`: sin cambios; ya usaba el esquema, así que ahora responde `upstream` y no llama a DeepL.
- `src/utils/date.ts`: `isValidMonth` solo acepta meses 01 a 12.
- `src/Pages/Day.tsx`: el aviso de fecha inválida pasa a su propio componente. Antes `Day` ponía el título por defecto en un efecto que corría después del de `DayView` y lo pisaba.
- `PRODUCT.md`, `README.md` y `task.md`.

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm exec tsc --noEmit` | 0 errores |
| `pnpm test` | 54 tests en 10 archivos; 8 nuevos, y los 8 fallan sin el arreglo |
| `pnpm test:e2e` | 27 pasan, 1 omitido a propósito |
| `pnpm build` | correcto |
| `pnpm check:design` | falla igual que antes del cambio: 3 errores porque `DESIGN.md` no declara Public Sans (pendiente de TASK-018) |
| Navegador con las respuestas de la NASA grabadas ese día | `/apod/2026-10-08` y `/gallery/2026-10`: «Respuesta inesperada», ninguna imagen del logo, ninguna clave `apod:v4:` guardada |
| Navegador contra la NASA en vivo | la NASA tardó 29,6 s en un día y dio 503 en un rango; la app mostró «Sin conexión con la NASA» |
| Caché anterior | las claves `apod:v3:` desaparecen al cargar; `apod:locale` se conserva |
| `/gallery/2025-13` | «Esa fecha no está en el archivo», sin pantalla de error |
| Día ya guardado | la pestaña lleva el título del día |
| `/api/translate` en local con las claves reales | 502 `upstream`, sin gastar caracteres de DeepL |

## 5. Pendiente

- **Decisión del usuario:** de dónde salen los datos si la NASA no repara la API. Con este cambio la app es honesta, pero no muestra contenido mientras dure.
- Tras el merge, comprobar producción: el deploy vacía las traducciones y vistas previas del registro de relleno. Cuatro de esas traducciones (2026-09-07 en es y pt-BR, 2026-08-20 y 2020-01-01 en es) las dejó el propio diagnóstico.
- Los enlaces «Abrir en apod.nasa.gov» llevan ahora a la portada de `science.nasa.gov/apod/`, no al día. No se conoce el esquema de direcciones nuevo.
- El aviso de un 500 de la NASA pide revisar la conexión del lector, que no es la causa.
- Las rutas siguen sin `errorElement`: otro error de render mostraría la pantalla por defecto de React Router.
- De la revisión, sin tocar: `localStorage` sin límite, E2E que llaman a la NASA y a DeepL en local, `DESIGN.md` desactualizado y limpieza menor.
