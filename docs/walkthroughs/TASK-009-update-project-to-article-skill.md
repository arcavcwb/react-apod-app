# Walkthrough Técnico - TASK-009: Actualización de Skill project-to-article con Especificación Completa (30 Secciones)

## 1. Resumen Ejecutivo

Se completó la instalación integral de la skill `project-to-article` incorporando la especificación canónica completa de 30 secciones (1.099 líneas) tanto en el workspace del proyecto (`.agents/skills/project-to-article/SKILL.md`) como en el almacenamiento global de Antigravity CLI (`~/.gemini/config/skills/project-to-article/SKILL.md`). Además, se alineó el artículo de caso de estudio técnico existente con las pautas de metadatos SEO establecidas en las secciones 18 y 26 de la especificación.

---

## 2. Cobertura de las 30 Secciones de la Skill

La especificación completa agrega y consolida:
1. **Regla de oro metodológica**: Primero investigar, después escribir (flujo estricto de 10 pasos).
2. **Inspección de proyecto y fuentes**: Clasificación de fuentes primarias, secundarias y contextuales.
3. **Construcción del modelo mental**: Identidad, problema, solución, tecnología, arquitectura, proceso, resultados y aprendizajes.
4. **Trinomio de clasificación**: Hechos vs. Inferencias vs. Recomendaciones.
5. **Prohibición absoluta de invención**: Regla de cero alucinación de métricas, benchmarks, citas o fechas.
6. **Manejo de datos faltantes**: Formato estándar `[Dato pendiente de confirmar]`.
7. **Tipologías editoriales**: Artículo técnico, case study, artículo de producto, postmortem y tutorial.
8. **Definición de audiencia y tono**: Primera persona plural ("Decidimos", "Construimos"), cero clichés corporativos ("game changer", "360", "disruptivo").
9. **Código y diagramas**: Reglas de snippets pequeños comprobables e interfaces no inventadas.
10. **Metadatos SEO y Estructura de Entrega (Secciones 18 y 26)**:
    - `SEO title` (50–60 caracteres).
    - `Meta description` (140–160 caracteres).
    - `Slug` limpio en minúsculas y guiones.
    - `Keywords` relevantes (5–10 términos).
11. **Confidencialidad (Sección 20)**: Bloqueo de API keys, tokens o secretos en publicaciones.
12. **Revisión Factual y Versiones Múltiples (Secciones 25–29)**: Checklist previo a entrega.

---

## 3. Actualización de Artefactos de Publicación

Se integró el bloque SEO obligatorio al final de `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md`:
```markdown
## SEO

**SEO title:** De 84s a 120 FPS: Optimización Extrema en React y Vite
**Meta description:** Cómo rescatamos una app React de la NASA optimizando GPU layers a 120 FPS, reduciendo imágenes un 95% y aislando cuotas 429 con Circuit Breakers.
**Slug:** de-84-segundos-a-120-fps-modernizacion-nasa-apod
**Keywords:** React, Vite, Web Performance, Core Web Vitals, GPU Compositing, Circuit Breaker, Zod, Edge CDN, Netlify, Frontend Architecture
```

---

## 4. Verificación Zero-Trust

| Verificación | Comando | Resultado |
|---|---|---|
| Pruebas Unitarias | `pnpm test` | 22 suites / 29 tests pasados (100%) |
| Compilación Estática | `pnpm run build` | `tsc && vite build` exitoso en 1.08s |

---

## 5. Trazabilidad Git Flow

- **Rama**: `feat/TASK-009-update-project-to-article-full-spec`
- **Archivos Modificados**:
  - `.agents/skills/project-to-article/SKILL.md` (especificación completa de 1.099 líneas)
  - `docs/posts/de-84-segundos-a-120-fps-modernizacion-nasa-apod.md` (bloque SEO)
- **Commit**: `feat(skills): update project-to-article with full 30-section specification`
