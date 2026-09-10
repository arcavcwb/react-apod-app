# Walkthrough Técnico - TASK-007: Instalación de Skill project-to-article

## 1. Resumen Ejecutivo

Se instaló y configuró la skill especializada `project-to-article` tanto a nivel de repositorio del proyecto (`.agents/skills/project-to-article/SKILL.md`) como a nivel global del CLI Antigravity (`~/.gemini/config/skills/project-to-article/SKILL.md`). Esta skill capacita al squad de agentes para transformar información, arquitectura, decisiones técnicas y métricas del proyecto en artículos y casos de estudio publicables de alta calidad sin inventar datos.

---

## 2. Ubicaciones de Instalación

1. **Workspace del Proyecto (Versionado en Git)**:
   - Ruta: `.agents/skills/project-to-article/SKILL.md`
   - Propósito: Compartir la skill con cualquier colaborador o subagente que clone el repositorio.

2. **Configuración Global del CLI Antigravity**:
   - Ruta: `~/.gemini/config/skills/project-to-article/SKILL.md`
   - Propósito: Disponibilidad persistente global para el CLI en todas las sesiones y proyectos de la máquina.

---

## 3. Capacidades de la Skill

- **Principio Fundamental de Verdad**: Prohibición de alucinación o invención de datos, métricas, benchmarks o tecnologías no respaldadas por el código o la documentación.
- **Separación Hechos / Inferencias / Recomendaciones**: Distinción clara entre hechos documentados, hipótesis razonadas y sugerencias futuras.
- **Formatos Editoriales Soportados**:
  - Artículos técnicos de arquitectura y performance.
  - Casos de estudio (Problema $\to$ Proceso $\to$ Solución $\to$ Resultados $\to$ Aprendizajes).
  - Postmortems y guías de producto.
- **Flujo de Trabajo Estructurado**:
  - Comprensión integral del proyecto.
  - Inventario de hechos y decisiones arquitectónicas.
  - Definición de audiencia y tono técnico claro (libre de jerga corporativa vacía).
  - Ejemplos de código reales y métricas cuantitativas comprobadas.

---

## 4. Verificación Zero-Trust

| Verificación | Comando | Resultado |
|---|---|---|
| Impeccable Design Audit | `pnpm run check:design` | 0 anti-patrones detectados |
| Pruebas Unitarias | `pnpm test` | 22 suites pasadas, 29 tests pasados (100%) |
| Compilación de Producción | `pnpm run build` | `tsc && vite build` exitoso en 1.02s |

---

## 5. Trazabilidad Git Flow

- **Rama**: `feat/TASK-007-install-project-to-article-skill`
- **Commit**: `feat(skills): install project-to-article skill for technical blogging`
