# Walkthrough Técnico - TASK-014: Hero Split Fullscreen (100vh), Retiro de Navbar en Home y Animación 3D Estelar

## 1. Resumen Ejecutivo

En respuesta al feedback urgente del usuario ("sigo insistiendo quítale el navbar, haz un hero con dos bloques internos: del lado izquierdo el título y del lado derecho la animación... que todo quepa en el vh, aquí en mi laptop se ve pésimo"):

Se completó una reingeniería exhaustiva del diseño y la arquitectura de pantalla en la página de inicio (`/`):
1. **Supresión del Navbar y Footer en Home:** En `Layout.tsx`, se aisló condicionalmente la ruta raíz (`/`) para conceder el 100% del viewport vertical (`h-screen`, `h-[100dvh]`, `overflow-hidden`), eliminando el navbar superior y el footer en la página principal para evitar desplazamientos indeseados. Las páginas internas (`/apod`, `/gallery`, `/about`) preservan su barra de navegación y pie para mantener la navegabilidad del sistema.
2. **Arquitectura Split-Screen en Dos Bloques Internos (`Home.tsx`):**
   - **Bloque Izquierdo:** Identidad de la NASA, título monumental ("Explora la Frontera del Cosmos"), subtítulo humano y accesible, y tres botones ergonómicos de navegación directa (`Foto de Hoy`, `Archivo Cósmico`, `Acerca de la Misión`) que cumplen rigurosamente la regla de touch targets $\ge 48\text{px}$ y contraste WCAG 2.1 AA.
   - **Bloque Derecho:** Escena Three.js a pantalla completa dentro de su columna (`w-full h-full`), adaptada dinámicamente con `ResizeObserver`.
3. **Elevación Visual Radical de la Animación 3D (`Orbital3DSystem.tsx`):**
   - Eliminación de elementos 2D HTML desalineados en el centro.
   - Sol radiante en 3D volumétrico con múltiples coronas solares concéntricas translúcidas (`AdditiveBlending`) y pulso armónico.
   - Planetas con sombreado rico y halo atmosférico (Fresnel), luna orbitando en tiempo real, sonda espacial con paneles solares y gigante gaseoso con doble anillo planetario concéntrico (estilo Saturno).
   - Parallax interactivo de cámara suavizado con `lerp` al mover el ratón.
   - Click directo en los planetas para navegar fluidamente hacia las secciones de la app.
4. **Encaje Perfecto en Laptops (1366×768 y 1440×900):** Todo el contenido y la animación se aprecian íntegramente dentro de un solo viewport vertical sin barras de desplazamiento.

---

## 2. Decisiones Técnicas y Arquitectura

### 2.1. Condicionamiento del Viewport en `Layout.tsx`
- Se implementó `useLocation` para detectar de forma reactiva la ruta `/`.
- Si `isHome === true`, se omite el renderizado de `NavBar`, `SideDrawer`, `BackDrop` y `Footer`, entregando un contenedor `h-screen h-[100dvh] overflow-hidden` que aprovecha cada pixel de la pantalla sin desbordamiento.
- En rutas interiores, la navegación tradicional HUD sigue garantizando la exploración completa de la app.

### 2.2. Motor Three.js Responsivo (`Orbital3DSystem.tsx`)
- Se reemplazaron dimensiones fijas en píxeles por un canvas dinámico gestionado mediante `ResizeObserver`.
- Raycasting interactivo: detecta el paso del cursor sobre las mallas celestes, desacelera suavemente la velocidad orbital para facilitar la interacción y proyecta coordenadas 2D para etiquetas HUD flotantes.
- Enfoque defensivo para pruebas unitarias: `try / catch` envolviendo `new THREE.WebGLRenderer` para garantizar ejecución determinista en entornos JSDOM.

---

## 3. Verificación Zero-Trust

| Verificación | Comando | Resultado |
|---|---|---|
| Impeccable Design Audit | `echo y \| pnpm run check:design` | **0 anti-patrones** |
| Pruebas Unitarias | `pnpm test` | **22 suites pasadas / 29 tests pasados (100%)** |
| Compilación Estática | `pnpm run build` | **`tsc && vite build` exitoso en 4.22s** |
| Verificación Visual Desktop | `playwright` | Verificado en 1440×900 y 1366×768 (Laptop compacto) |

---

## 4. Trazabilidad Git Flow

- **Rama Feature:** `feat/TASK-014-hero-split-fullscreen-orbital-redesign`
- **Archivos Modificados:**
  - `src/Components/Layout/Layout.tsx`: Condicionamiento del viewport y retiro de navbar/footer en `/`.
  - `src/Components/OrbitalSystem/orbital3d.config.ts`: Nombres y descripciones editoriales humanas.
  - `src/Components/OrbitalSystem/Orbital3DSystem.tsx`: Escena 3D WebGL con sol radiante, coronas volumétricas, anillos y resize dinámico.
  - `src/Pages/Home.tsx`: Hero Split en dos bloques contenidos en 100vh.
  - `task.md`: Checklist del ciclo operativo.
  - `docs/walkthroughs/TASK-014-hero-split-fullscreen-orbital.md`: Reporte técnico de la tarea.
