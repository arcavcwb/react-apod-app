# Walkthrough Técnico - TASK-019: Traducción de la explicación

## 1. Problema reportado

"Los traductores solo traducen los botones y eso, el contenido no cambia de idioma" (usuario, 2026-09-15). La interfaz estaba en tres idiomas, pero la explicación de la NASA seguía siempre en inglés.

Decisión del usuario: **el título y los créditos siguen en inglés; solo se traduce la explicación**, al español y al portugués de Brasil.

## 2. Diseño

| Pieza | Decisión |
|---|---|
| Proveedor | DeepL (plan gratuito: 1.000.000 de caracteres al mes; una explicación ronda los 1.200) |
| Endpoint | Edge Function `GET /api/translate?date=YYYY-MM-DD&lang=es\|pt-BR`. Recibe fecha e idioma, **nunca texto**: pide la explicación a la NASA, así la clave no sirve para traducir otras cosas |
| Clave | `DEEPL_API_KEY`, solo en el servidor (sin prefijo `VITE_`); las claves gratuitas terminan en `:fx` y usan `api-free.deepl.com` |
| Contratos | Zod con `safeParse` en la respuesta de la NASA, la de DeepL y la de `/api/translate` en el cliente |
| Caché | CDN de Netlify (`durable`, un año; una hora para el día actual; `Netlify-Vary: query=date\|lang`), `localStorage` del lector y peticiones en curso compartidas |
| Desarrollo local | Un middleware de Vite ejecuta el mismo núcleo con las claves de `.env` y guarda las traducciones en memoria |
| Honestidad | Etiqueta «Traducción automática del texto de la NASA.» con «Ver original» / «Ver traducción»; ante cualquier fallo, el original en inglés con su nota |

## 3. Cambios

- `src/contracts/translation.contract.ts`: idiomas, respuesta de DeepL y respuesta de `/api/translate`.
- `netlify/edge-functions/translate/core.ts`: valida fecha e idioma, comprueba la clave antes de pedir nada, obtiene la explicación de la NASA y la traduce; cada fallo tiene nombre (`bad-request`, `not-configured`, `not-found`, `quota`, `upstream`) y su estado HTTP.
- `netlify/edge-functions/translate/translate.ts`: la Edge Function, con las cabeceras de caché.
- `vite.config.ts`: `/api/translate` en el servidor de desarrollo. `tsconfig.json` permite importar con extensión `.ts`, como exige Deno.
- `src/services/translation.service.ts` y `src/Hooks/useExplanation.ts`: traducción con caché y estados `original`, `translated`, `waiting` (hasta 2 s, con líneas de carga) y `translating` (el original con «Traduciendo…» hasta que llega).
- `ExplanationText` en el texto del día y en la tarjeta «Leer todo»; extracto traducido en la portada.
- Textos nuevos en los tres idiomas; `PRODUCT.md`, `README.md`, `.env.example` y brief de diseño con la nueva regla.

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `pnpm exec tsc --noEmit` | 0 errores |
| `pnpm test` | 46 tests en 10 archivos (nuevos: núcleo con DeepL simulado, validación de fecha e idioma, cada fallo, servicio con caché, contrato y peticiones compartidas) |
| `pnpm test:e2e` | 27 pasan, 1 omitido a propósito (nuevos: traduce la explicación y no el título, «Ver original», caída al original sin traducción) |
| `vite build` | correcto; `DEEPL` no aparece en el paquete del cliente |
| DeepL real en local, 2026-09-07 | español en 1,9 s, portugués en 0,9 s; la nota final de la NASA también se traduce |
| Navegador con la clave real | texto del día, tarjeta y portada traducidos en escritorio y móvil; en inglés no hay peticiones |
| Peticiones | una por página; un segundo navegador con el mismo día no gasta caracteres (748 en total para dos visitas) |
| Consumo durante las pruebas | unos 10.700 caracteres de 1.000.000 |

## 5. Pendiente

- Tras el merge, comprobar la traducción en producción; si responde `not-configured`, activar el ámbito *Functions* de `DEEPL_API_KEY` en Netlify.
- La vista previa al compartir (Open Graph) sigue con la explicación en inglés: no se sabe en qué idioma lee quien recibe el enlace.
- Pendientes de TASK-018 en `task.md`.
