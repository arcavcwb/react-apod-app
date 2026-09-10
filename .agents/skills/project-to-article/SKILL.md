---
name: project-to-article
description: Redacta artículos de alta calidad basados en la información, documentación, código, decisiones y resultados de un proyecto. Convierte material técnico o de producto en contenido claro, estructurado y publicable, sin inventar información.
---

# Project to Article

## Propósito

Este skill transforma la información disponible de un proyecto en artículos completos, claros y publicables.

El proyecto puede contener:

- README
- documentación técnica
- PRD
- especificaciones
- tickets
- issues
- código fuente
- decisiones de arquitectura
- documentación de API
- diseños
- capturas
- notas internas
- métricas
- resultados
- changelogs
- documentación de producto
- conversaciones relacionadas con el proyecto

El objetivo es convertir ese material en una narrativa comprensible para la audiencia indicada, manteniendo fidelidad a la información disponible.

---

# Principios fundamentales

## 1. No inventar información

Nunca inventes:

- funcionalidades
- métricas
- resultados
- tecnologías
- fechas
- nombres
- decisiones técnicas
- usuarios
- clientes
- problemas
- resultados comerciales
- benchmarks
- cifras
- citas
- opiniones atribuidas a personas

Si una afirmación no puede ser respaldada por la información disponible, no la presentes como un hecho.

Cuando una información importante esté ausente, utiliza:

> [Dato pendiente de confirmar]

o formula una pregunta antes de generar la versión final si el dato es indispensable.

---

## 2. Separar hechos de interpretación

Distingue entre:

### Hechos

Información explícitamente presente en el proyecto.

Ejemplo:

> El proyecto utiliza Next.js y PostgreSQL.

### Inferencias

Conclusiones razonables derivadas de la información.

Ejemplo:

> La elección de PostgreSQL parece estar relacionada con la necesidad de manejar datos relacionales.

Las inferencias deben identificarse como tales y nunca presentarse como decisiones confirmadas.

### Recomendaciones

Ideas propuestas por el modelo.

Ejemplo:

> Una posible mejora futura sería incorporar caching.

No presentes recomendaciones como funcionalidades existentes.

---

# Flujo de trabajo

## Paso 1 — Entender el proyecto

Antes de escribir el artículo, identifica:

- Qué es el proyecto
- Qué problema intenta resolver
- Para quién está construido
- Cuál es su objetivo
- Qué funcionalidades tiene
- Qué tecnologías utiliza
- Cómo está estructurado
- Qué decisiones importantes se tomaron
- Qué dificultades aparecen documentadas
- Qué resultados están disponibles
- Qué información falta

Construye internamente un modelo del proyecto antes de redactar.

---

# Paso 2 — Crear un inventario de información

Clasifica la información encontrada.

## Contexto

- Nombre del proyecto
- Organización o equipo
- Situación inicial
- Problema
- Motivación

## Producto

- Qué hace
- Usuarios
- Casos de uso
- Funcionalidades
- Flujo principal

## Tecnología

- Frontend
- Backend
- Base de datos
- APIs
- Infraestructura
- Cloud
- CI/CD
- Testing
- Observabilidad

## Arquitectura

- Componentes
- Servicios
- Dependencias
- Flujo de datos
- Integraciones
- Decisiones arquitectónicas

## Proceso

- Cómo se desarrolló
- Iteraciones
- Problemas encontrados
- Soluciones
- Trade-offs
- Decisiones

## Resultados

- Métricas
- Performance
- Adopción
- Reducción de costos
- Mejoras
- Feedback
- Resultados de negocio

## Aprendizajes

- Qué funcionó
- Qué no funcionó
- Qué se cambiaría
- Qué principios pueden reutilizarse

---

# Paso 3 — Determinar el tipo de artículo

Si el usuario especifica el tipo, respetarlo.

Si no lo especifica, determinar el formato más adecuado.

Tipos principales:

### Artículo técnico

Enfocado en:

- arquitectura
- implementación
- tecnologías
- problemas técnicos
- decisiones
- código
- performance

### Caso de estudio

Estructura:

Problema → proceso → solución → resultados → aprendizajes.

### Artículo de producto

Enfocado en:

- problema del usuario
- solución
- experiencia
- funcionalidades
- impacto

### Postmortem

Enfocado en:

- qué ocurrió
- impacto
- causa
- resolución
- aprendizajes
- prevención

### Case study técnico

Combina producto, negocio y arquitectura.

### Tutorial

Enfocado en enseñar cómo reproducir una solución.

No conviertas automáticamente un proyecto en tutorial si no existe suficiente información para reproducirlo.

---

# Paso 4 — Identificar la audiencia

Determina quién leerá el artículo.

Audiencias posibles:

- desarrolladores
- arquitectos
- CTOs
- product managers
- diseñadores
- founders
- usuarios técnicos
- usuarios no técnicos
- audiencia general

Si el usuario proporciona audiencia, esa indicación tiene prioridad.

Si no existe información suficiente, utilizar una audiencia técnica general y evitar asumir conocimientos demasiado específicos.

---

# Paso 5 — Construir la narrativa

La narrativa debe responder progresivamente:

1. ¿Cuál era el problema?
2. ¿Por qué era importante?
3. ¿Qué se decidió construir?
4. ¿Cómo se construyó?
5. ¿Qué problemas aparecieron?
6. ¿Qué decisiones fueron importantes?
7. ¿Qué resultado se obtuvo?
8. ¿Qué aprendimos?

Evitar convertir el artículo en una simple lista de funcionalidades.

El lector debe entender la historia y el razonamiento detrás del proyecto.

---

# Estructura editorial por defecto

Cuando no se indique otra estructura, utilizar:

# Título

Título específico y atractivo.

Evitar títulos genéricos como:

> Cómo hicimos nuestro proyecto

Preferir:

> Cómo construimos [X] para resolver [Y]

o:

> Cómo diseñamos [X] para escalar [Y]

---

## Introducción

La introducción debe explicar rápidamente:

- el contexto
- el problema
- por qué importa
- qué se construyó

Debe generar interés sin exagerar.

---

## El problema

Explicar:

- situación inicial
- limitaciones
- usuarios afectados
- impacto
- por qué las soluciones existentes no eran suficientes, si esto está documentado

No agregar problemas que no estén respaldados por la información del proyecto.

---

## La solución

Explicar:

- qué se construyó
- cómo funciona a nivel general
- qué partes son más importantes
- qué cambió respecto al estado inicial

---

## Arquitectura / implementación

Cuando corresponda:

- arquitectura
- componentes
- flujo de datos
- tecnologías
- integraciones
- decisiones técnicas

Utilizar diagramas o ejemplos de código cuando estén disponibles o sean útiles.

---

## Decisiones importantes

Explicar las decisiones relevantes mediante:

> Problema → opciones → decisión → motivo → trade-off

No asumir los motivos de una decisión si no están documentados.

Si el motivo es una inferencia:

> Una posible razón detrás de esta decisión es...

---

## Desafíos

Explicar los problemas reales encontrados durante el proyecto.

Para cada desafío:

### Problema

Qué ocurrió.

### Impacto

Por qué era importante.

### Solución

Qué se hizo.

### Resultado

Qué ocurrió después, si está documentado.

---

## Resultados

Utilizar métricas cuando estén disponibles.

Ejemplo:

> El tiempo de respuesta pasó de X a Y.

Nunca inventar números.

Si no existen métricas:

> No se dispone de métricas cuantitativas en la documentación del proyecto.

No presentar una ausencia de métricas como un fracaso.

---

## Aprendizajes

Extraer aprendizajes directamente relacionados con el proyecto.

Preferir aprendizajes concretos:

- decisiones arquitectónicas
- proceso
- producto
- testing
- comunicación
- escalabilidad
- UX
- mantenimiento

Evitar frases vacías como:

> La comunicación es importante.

Preferir:

> Centralizar las decisiones de arquitectura redujo la ambigüedad durante las siguientes iteraciones.

Solo si esto está respaldado por el proyecto.

---

## Conclusión

Cerrar retomando:

- problema
- solución
- resultado
- principal aprendizaje

No repetir todo el artículo.

---

# Estilo de escritura

## Claridad

Escribir de forma:

- directa
- precisa
- natural
- profesional
- fácil de leer

Preferir frases cortas.

Evitar párrafos excesivamente largos.

---

## Evitar lenguaje corporativo vacío

Evitar expresiones como:

- revolucionario
- disruptivo
- de clase mundial
- solución robusta
- experiencia excepcional
- innovación sin precedentes
- transformamos la industria

A menos que formen parte de una cita o estén específicamente respaldadas.

---

## Evitar exageraciones

No escribir:

> Esta arquitectura resolvió definitivamente el problema de escalabilidad.

Preferir:

> Esta arquitectura permitió resolver el problema de escalabilidad observado durante esta etapa del proyecto.

---

# Terminología técnica

Cuando exista una audiencia técnica:

- utilizar los nombres reales de las tecnologías
- explicar conceptos complejos cuando sea necesario
- evitar simplificaciones incorrectas

Cuando la audiencia no sea técnica:

- explicar primero el concepto
- después utilizar el término técnico
- reducir jerga innecesaria

Ejemplo:

> Utilizamos Redis como capa de caching, es decir, un almacenamiento temporal que permite recuperar datos frecuentes más rápidamente.

---

# Código

Cuando el artículo sea técnico y el código esté disponible:

- utilizar ejemplos pequeños
- mostrar únicamente código relevante
- explicar qué hace
- no inventar APIs
- no modificar silenciosamente nombres de funciones o variables
- mantener coherencia con el proyecto

Preferir:

```js
const result = await fetchData();
```
