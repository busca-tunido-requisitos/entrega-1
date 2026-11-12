# Criterios de completitud

Mínimo exigido para dar cada artefacto por **Completo**. Si no llega al mínimo pero existe, es **Parcial** y debes decir qué falta. Si no se encuentra, es **Faltante**.

| # | Artefacto | Importancia | Mínimo para «Completo» |
|---|-----------|-------------|--------------------------|
| 1 | **BPMN AS-IS** | Contexto | Diagrama del proceso actual (imagen y/o `.bpmn`) con carriles, tareas y flujo legibles. |
| 2 | **BPMN TO-BE** | Contexto | Diagrama del proceso rediseñado y una lista o tabla de actividades que cambian, idealmente con identificador (ACT-TOBE-xx). Imagen y/o `.bpmn`. |
| 3 | **Historias de usuario** | **Bloqueante** | Al menos una historia en formato «Como … quiero … para …», con identificador (HU-xx), en archivo `.md` o como issue de GitHub. Idealmente cada una con su actividad del TO-BE asociada. |
| 4 | **Criterios Gherkin** | **Bloqueante** | Cada historia a desarrollar tiene escenarios con `Dado`/`Cuando`/`Entonces`: al menos uno principal y uno alternativo o de error. Puede estar en el mismo documento de la historia (o en el issue) o en un archivo aparte. |
| 5 | **Modelo de dominio** | **Bloqueante** | Diagrama de clases en PlantUML (`.puml`) y/o PNG con al menos las clases que usan las historias, atributos y asociaciones con multiplicidad. Sin métodos ni detalles de implementación. |
| 6 | **Diagrama de casos de uso** | Importante | Actores, límite del sistema y casos de uso. Cada historia a desarrollar tiene su caso de uso, o se puede deducir cuál es. |
| 7 | **Diagramas de estado** | Importante | **Al menos uno**, de una clase del dominio con ciclo de vida, con estados, transiciones y eventos. Si una historia modifica el estado de una entidad y esa entidad no tiene diagrama, repórtalo como parcial para esa historia. |
| 8 | **Diagramas de secuencia** | Importante | **Al menos dos**, de casos de uso importantes (idealmente con integración a otro sistema). Si la historia a desarrollar no tiene diagrama, la validación de historia reconstruirá el flujo con el estudiante. |
| 9 | **Requisitos funcionales y no funcionales** | Contexto | Lista de requisitos clasificados. Los no funcionales se leen para entender el contexto pero **no se implementan**. |
| 10 | **Atributos de calidad priorizados** | Contexto | Priorización de los atributos de calidad (ISO 25010). Se registra, no se implementa. |

## Chequeos rápidos de consistencia (solo señalar, no resolver)

Durante la auditoría, anota si ves alguna de estas situaciones y repórtalas como **dudas** para el estudiante:

- Una historia no indica su actividad del TO-BE, o cita una que no está en la tabla del TO-BE.
- Una historia menciona un concepto que no existe en el modelo de dominio.
- Hay diagramas con nombres de clases o mensajes distintos para lo mismo (por ejemplo `Sala` y `Espacio`).
- El Gherkin habla de estados (por ejemplo «queda Pendiente de aprobación») que no aparecen en el diagrama de estado de esa clase.
- Hay historias en archivo y en issues con contenido diferente.
- Un diagrama solo está como imagen y no se puede interpretar con certeza.
- Hay más de un modelo de dominio o versiones antiguas de un diagrama.

Estas dudas se resolverán a fondo, historia por historia, en `cin324-validar-historia`. Aquí solo se listan.
