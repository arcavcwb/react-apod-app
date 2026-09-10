---
name: project-to-article
description: Redacta artículos técnicos, de producto y casos de estudio basados en un proyecto existente. Analiza automáticamente documentación, código, configuración y archivos relevantes del proyecto para convertirlos en contenido claro, estructurado y publicable, sin inventar información.
---

# Project to Article

## Objetivo

Esta skill convierte la información existente dentro de un proyecto en artículos de alta calidad.

Debe analizar el proyecto antes de escribir y utilizar la información encontrada como fuente principal.

El objetivo no es simplemente resumir archivos.

El objetivo es construir una narrativa que explique:

> qué problema existía → qué se decidió hacer → cómo se construyó → por qué se tomaron determinadas decisiones → qué resultado tuvo → qué se aprendió

La información debe mantenerse fiel al proyecto.

Nunca inventes datos para hacer que el artículo parezca más completo.

---

# Cuándo utilizar esta skill

Utiliza esta skill cuando el usuario solicite cosas como:

* "escribe un artículo sobre este proyecto"
* "crea un case study"
* "haz un artículo técnico"
* "convierte este proyecto en un artículo"
* "documenta este proyecto como un artículo"
* "escribe un post para el blog"
* "crea un technical blog post"
* "explica cómo construimos esto"
* "haz un artículo basado en el proyecto"
* "documenta la arquitectura"
* "crea una historia sobre este proyecto"

También puedes utilizarla cuando el usuario proporcione documentación y solicite convertirla en contenido editorial.

---

# Regla principal

## Primero investigar. Después escribir.

Nunca comiences redactando el artículo inmediatamente.

Primero debes entender el proyecto.

El flujo obligatorio es:

1. Inspeccionar el proyecto.
2. Identificar las fuentes relevantes.
3. Extraer información.
4. Construir un modelo mental del proyecto.
5. Identificar hechos, inferencias y datos faltantes.
6. Definir la narrativa.
7. Elegir la estructura.
8. Redactar.
9. Revisar factualidad.
10. Entregar el artículo.

---

# 1. Inspección del proyecto

Antes de redactar, inspecciona la estructura del proyecto.

Busca especialmente:

* README
* documentación
* `/docs`
* `/documentation`
* `/design`
* `/src`
* `/app`
* `/components`
* `/api`
* `/server`
* `/backend`
* `/frontend`
* `/tests`
* `/config`
* archivos de configuración
* package.json
* pnpm-lock.yaml
* yarn.lock
* package-lock.json
* requirements.txt
* pyproject.toml
* Cargo.toml
* go.mod
* Dockerfile
* docker-compose
* CI/CD
* GitHub Actions
* changelog
* ADRs
* issues
* especificaciones
* PRDs
* archivos Markdown

No es necesario leer todos los archivos.

Prioriza los archivos que permitan entender:

* propósito
* arquitectura
* decisiones
* funcionamiento
* problemas
* resultados

---

# 2. Descubrimiento de información

Identifica las fuentes disponibles.

Clasifícalas como:

### Fuente primaria

Información directamente relacionada con la implementación actual.

Ejemplos:

* código actual
* README actual
* configuración actual
* documentación oficial del proyecto

### Fuente secundaria

Información útil pero potencialmente desactualizada.

Ejemplos:

* issues
* changelogs
* documentación antigua
* notas internas

### Fuente contextual

Información que ayuda a comprender el contexto.

Ejemplos:

* PRD
* documentación de negocio
* notas de reuniones
* briefs
* investigación

Cuando exista contradicción entre fuentes, prioriza la información más actual y directamente verificable.

---

# 3. Construir el modelo del proyecto

Antes de escribir, identifica internamente:

## Identidad

* Nombre del proyecto
* Tipo de proyecto
* Estado actual
* Objetivo principal

## Problema

* Qué problema resuelve
* Para quién
* Qué situación existía antes
* Qué limitaciones había

## Solución

* Qué se construyó
* Qué funcionalidades existen
* Cómo funciona
* Qué cambió

## Tecnología

* Frameworks
* Lenguajes
* Base de datos
* APIs
* servicios externos
* infraestructura
* deployment
* testing
* observabilidad

## Arquitectura

* componentes
* servicios
* relaciones
* flujo de datos
* integraciones
* dependencias

## Proceso

* cómo evolucionó
* iteraciones
* problemas
* soluciones
* decisiones

## Resultados

* métricas
* performance
* adopción
* costos
* conversiones
* mejoras
* feedback

## Aprendizajes

* qué funcionó
* qué no funcionó
* decisiones importantes
* trade-offs
* mejoras futuras

---

# 4. Clasificar la información

Toda información utilizada en el artículo debe pertenecer a una de estas categorías.

## Hecho

Está explícitamente respaldado por el proyecto.

Ejemplo:

> La aplicación utiliza PostgreSQL.

Puedes presentarlo como afirmación.

## Inferencia

Es una conclusión razonable pero no está explícitamente confirmada.

Ejemplo:

> La estructura del sistema sugiere que PostgreSQL fue elegido para manejar relaciones entre entidades.

Utiliza expresiones como:

* "parece"
* "sugiere"
* "probablemente"
* "una posible razón"

Nunca presentes una inferencia como un hecho.

## Recomendación

Es una idea generada por la IA.

Ejemplo:

> Una posible mejora sería agregar caching.

No describas recomendaciones como funcionalidades existentes.

---

# 5. Prohibición de inventar

Nunca inventes:

* métricas
* estadísticas
* usuarios
* clientes
* ingresos
* reducción de costos
* mejoras de performance
* fechas
* nombres
* funcionalidades
* tecnologías
* decisiones
* motivaciones
* benchmarks
* resultados
* citas
* testimonios

Ejemplo incorrecto:

> El nuevo sistema redujo el tiempo de respuesta en un 40%.

Si el proyecto no contiene ese dato, no lo escribas.

Ejemplo correcto:

> La nueva arquitectura está orientada a mejorar el tiempo de respuesta.

Solo si esto puede respaldarse.

---

# 6. Información faltante

Si falta información importante, no inventarla.

Utiliza:

> [Dato pendiente de confirmar]

Ejemplos:

> [Confirmar fecha de lanzamiento]

> [Confirmar métrica de performance]

> [Confirmar número de usuarios]

Si el dato es fundamental para la historia, pregunta al usuario antes de presentar una versión final.

Si el dato no es fundamental, continúa y marca el pendiente al final.

---

# 7. Determinar el tipo de artículo

Si el usuario especifica el tipo, respétalo.

Si no lo especifica, determina el formato más adecuado.

## Artículo técnico

Prioridad:

* arquitectura
* implementación
* tecnologías
* decisiones técnicas
* problemas
* trade-offs
* performance

## Case study

Prioridad:

> Problema → proceso → solución → resultado → aprendizaje

## Artículo de producto

Prioridad:

* problema del usuario
* experiencia
* solución
* funcionalidades
* decisiones
* impacto

## Postmortem

Prioridad:

* incidente
* impacto
* causa
* resolución
* prevención
* aprendizajes

## Tutorial

Prioridad:

* enseñar
* explicar pasos
* permitir reproducir la solución

No crear un tutorial si el proyecto no contiene suficiente información para reproducirlo.

---

# 8. Determinar la audiencia

Si el usuario especifica la audiencia, utilizarla.

Posibles audiencias:

* developers
* engineers
* architects
* CTOs
* product managers
* designers
* founders
* usuarios técnicos
* usuarios no técnicos
* público general

Si no se especifica:

Utiliza una audiencia profesional con conocimientos técnicos medios.

No asumir conocimientos excesivamente especializados.

---

# 9. Construcción de la narrativa

La historia debe responder progresivamente:

1. ¿Qué problema existía?
2. ¿Por qué era importante?
3. ¿Qué objetivo tenía el proyecto?
4. ¿Qué solución se construyó?
5. ¿Cómo funciona?
6. ¿Qué decisiones fueron importantes?
7. ¿Qué desafíos aparecieron?
8. ¿Qué resultados existen?
9. ¿Qué aprendimos?

Evita convertir el artículo en una simple lista de funcionalidades.

El lector debe entender el razonamiento.

---

# 10. Estructura por defecto

Si el usuario no proporciona una estructura, utiliza:

# Título

Título específico y atractivo.

Evita:

> Cómo hicimos nuestro proyecto

Prefiere:

> Cómo construimos [X] para resolver [Y]

> La arquitectura detrás de [X]

> Cómo diseñamos [X] para [Y]

> Lo que aprendimos construyendo [X]

---

## Introducción

Debe responder rápidamente:

* qué ocurre
* cuál era el problema
* por qué importa
* qué se construyó

La introducción debe generar interés sin clickbait.

---

## El problema

Explica:

* situación inicial
* limitaciones
* usuarios afectados
* contexto
* impacto

Solo incluir información respaldada.

---

## La solución

Explica:

* qué se construyó
* cómo funciona a alto nivel
* partes principales
* cambio respecto al estado anterior

---

## Cómo funciona

Cuando corresponda:

* arquitectura
* componentes
* flujo de datos
* APIs
* servicios
* integraciones

---

## Decisiones importantes

Para cada decisión importante utiliza:

> Problema → opciones → decisión → motivo → trade-off

No inventes el motivo.

Si no está documentado, indícalo.

---

## Desafíos

Para cada desafío:

### Problema

Qué ocurrió.

### Impacto

Por qué importaba.

### Solución

Qué se hizo.

### Resultado

Qué ocurrió después, si existe evidencia.

---

## Resultados

Utiliza métricas solamente cuando existan.

Si no existen métricas cuantitativas, dilo.

Ejemplo:

> La documentación disponible no incluye métricas cuantitativas posteriores al lanzamiento.

No inventes resultados.

---

## Aprendizajes

Extrae aprendizajes concretos del proyecto.

Ejemplos:

* arquitectura
* producto
* UX
* testing
* escalabilidad
* mantenimiento
* proceso
* deployment

Evita aprendizajes genéricos.

---

## Conclusión

Retoma:

* problema
* solución
* resultado
* aprendizaje principal

No repetir todo el artículo.

---

# 11. Estilo de escritura

Escribe de forma:

* clara
* directa
* profesional
* natural
* precisa
* humana

Prefiere frases relativamente cortas.

Evita párrafos enormes.

Evita repetir la misma idea.

Evita introducir información que no aporta a la narrativa.

---

# 12. Evitar lenguaje corporativo

No utilices innecesariamente:

* revolucionario
* disruptivo
* innovador
* de clase mundial
* robusto
* escalable
* excepcional
* sin precedentes
* transformación
* solución 360
* game changer

Utilízalos solamente si están respaldados o forman parte de una cita.

---

# 13. Evitar exageraciones

Incorrecto:

> Esta arquitectura resolvió definitivamente todos nuestros problemas de escalabilidad.

Correcto:

> Esta arquitectura permitió abordar los problemas de escalabilidad identificados durante esta etapa.

---

# 14. Primera persona

Por defecto, cuando el proyecto fue construido por el equipo del usuario, utilizar primera persona plural:

> Decidimos utilizar...

> Construimos...

> Encontramos...

> Durante la implementación...

Si el artículo es institucional, puede utilizarse tercera persona.

---

# 15. Terminología técnica

Para audiencia técnica:

* utiliza nombres reales
* mantén precisión
* explica conceptos complejos cuando sea necesario

Para audiencia general:

Explica primero el concepto.

Ejemplo:

> Redis funciona como una capa de caching: un almacenamiento temporal que permite recuperar datos utilizados frecuentemente sin consultar nuevamente la fuente principal.

---

# 16. Código

Si el proyecto contiene código:

Utiliza solamente ejemplos relevantes.

Reglas:

* no inventar APIs
* no inventar funciones
* no cambiar nombres silenciosamente
* no modificar comportamiento
* no copiar archivos completos innecesariamente
* explicar cada ejemplo

Prefiere snippets pequeños.

Ejemplo:

```js
const result = await fetchData();
```

Después explica qué representa el código.

---

# 17. Diagramas

Si la arquitectura es compleja y el formato lo permite, incluir un diagrama conceptual.

El diagrama puede representar:

* frontend
* backend
* APIs
* base de datos
* servicios
* colas
* servicios externos

No inventes componentes.

Si el diagrama es una simplificación, indicarlo:

> Diagrama simplificado de la arquitectura.

---

# 18. SEO

Si el contenido está destinado a un blog o publicación web, incluir:

## SEO title

Aproximadamente 50–60 caracteres cuando sea posible.

## Meta description

Aproximadamente 140–160 caracteres.

## Slug

Utiliza:

* minúsculas
* palabras relevantes
* guiones
* sin caracteres innecesarios

Ejemplo:

```text
como-construimos-sistema-recomendaciones
```

## Keywords

Entre 5 y 10 keywords relevantes.

No utilizar keywords irrelevantes.

---

# 19. Longitud

Si el usuario especifica una longitud, respetarla.

Si no:

### Short

500–800 palabras.

### Medium

1.000–1.500 palabras.

### Long

1.800–3.000 palabras.

### Deep dive

Más de 3.000 palabras únicamente si existe suficiente información.

Nunca rellenar artificialmente para alcanzar una cantidad de palabras.

---

# 20. Confidencialidad

Antes de publicar, comprobar si el proyecto contiene:

* API keys
* tokens
* passwords
* secretos
* private keys
* URLs privadas
* información personal
* datos de clientes
* información financiera
* información interna
* secretos comerciales

Nunca incluir secretos.

Si aparece información sensible:

> [INFORMACIÓN CONFIDENCIAL OMITIDA]

Nunca reproducir credenciales aunque estén presentes en archivos.

---

# 21. Análisis de código

Cuando el artículo sea técnico y exista código, inspecciona:

* package.json
* dependencias
* entry points
* rutas
* servicios
* componentes
* modelos
* APIs
* configuración
* tests
* scripts
* infraestructura

No describas una arquitectura solamente por los nombres de las carpetas.

Confirma mediante:

* imports
* llamadas
* interfaces
* tipos
* configuración
* dependencias
* rutas

---

# 22. Análisis de documentación

Cuando existan documentos, busca especialmente:

* objetivos
* requisitos
* decisiones
* restricciones
* problemas
* resultados
* métricas
* decisiones rechazadas
* trade-offs

La documentación puede explicar el "por qué" que no aparece en el código.

---

# 23. Contradicciones

Si encuentras información contradictoria:

1. Detecta la contradicción.
2. Identifica qué fuente es más reciente.
3. Prioriza código/documentación actual.
4. No elijas arbitrariamente.
5. Si sigue sin estar claro, marca el dato como pendiente.

Ejemplo:

> La documentación y la implementación actual presentan comportamientos diferentes. Debe confirmarse cuál representa el comportamiento esperado antes de publicar.

---

# 24. Fuentes externas

Por defecto, no necesitas investigar fuera del proyecto.

El proyecto es la fuente principal.

Si el usuario solicita investigación externa:

* separa datos internos de datos externos
* utiliza fuentes confiables
* cita las fuentes
* no mezcles hechos externos con hechos del proyecto
* no uses información externa para inventar resultados

---

# 25. Revisión factual

Antes de entregar el artículo realiza una revisión interna.

Comprueba:

* ¿El problema existe realmente?
* ¿La solución existe realmente?
* ¿Las tecnologías son correctas?
* ¿Las funcionalidades mencionadas existen?
* ¿Las métricas son reales?
* ¿Los resultados están respaldados?
* ¿Las decisiones están documentadas?
* ¿Las inferencias están claramente diferenciadas?
* ¿Se inventó alguna información?
* ¿Se expuso información confidencial?
* ¿La narrativa representa realmente el proyecto?

Si algo no puede verificarse, elimínalo o márcalo como pendiente.

---

# 26. Entrega

Cuando el usuario solicite un artículo completo, entregar:

# [Título]

## Introducción

...

## El problema

...

## La solución

...

## Cómo funciona

...

## Decisiones importantes

...

## Desafíos

...

## Resultados

...

## Aprendizajes

...

## Conclusión

...

---

## SEO

**SEO title:** ...

**Meta description:** ...

**Slug:** ...

**Keywords:** ...

---

## Datos pendientes de confirmar

* ...

No incluir esta sección si no existen datos pendientes.

---

# 27. Si el usuario pide solamente el artículo

No agregar explicaciones innecesarias.

Entregar directamente el artículo.

---

# 28. Si el usuario pide un borrador

Puedes utilizar placeholders.

Ejemplo:

> [Agregar métrica de performance]

> [Confirmar fecha de lanzamiento]

> [Agregar nombre del cliente si puede publicarse]

No inventar los valores.

---

# 29. Si el usuario pide varias versiones

Puedes producir:

### Versión técnica

Orientada a developers y arquitectos.

### Versión producto

Orientada a producto y negocio.

### Versión ejecutiva

Orientada a liderazgo.

Las tres versiones deben utilizar los mismos hechos.

Nunca cambiar métricas o resultados entre versiones.

---

# 30. Principio editorial final

El objetivo no es hacer que el proyecto parezca más impresionante.

El objetivo es contar correctamente qué ocurrió.

Una historia simple pero verdadera es mejor que una historia impresionante pero inventada.

La prioridad es:

1. Fidelidad
2. Claridad
3. Narrativa
4. Utilidad
5. Calidad editorial
6. SEO

Nunca sacrificar fidelidad para mejorar el estilo.

---

# Comportamiento esperado

Cuando el usuario diga:

> "Escribe un artículo sobre este proyecto"

debes:

1. Inspeccionar el proyecto.
2. Buscar documentación relevante.
3. Identificar arquitectura y funcionalidades.
4. Identificar problemas y decisiones.
5. Identificar resultados disponibles.
6. Detectar información faltante.
7. Determinar el mejor tipo de artículo.
8. Redactar una narrativa.
9. Revisar factualidad.
10. Entregar el artículo.

No pidas al usuario información que pueda obtenerse directamente inspeccionando el proyecto.

Solo pregunta cuando la información necesaria realmente no esté disponible.

---

# Resultado esperado

El artículo final debe permitir que una persona que nunca participó en el proyecto pueda entender:

> Qué problema existía.

> Qué se construyó.

> Cómo funciona.

> Por qué se tomaron las decisiones importantes.

> Qué dificultades aparecieron.

> Qué resultado tuvo.

> Qué aprendió el equipo.

El resultado debe sentirse como un artículo escrito por alguien que realmente estudió el proyecto, no como un resumen automático de sus archivos.
