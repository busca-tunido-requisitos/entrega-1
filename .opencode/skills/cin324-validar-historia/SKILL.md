---
name: cin324-validar-historia
description: Analiza una historia de usuario y su consistencia con los demás artefactos del proyecto (actividad del TO-BE, caso de uso, entidades del modelo de dominio, cambios de estado y flujo de interacción tipo diagrama de secuencia), le hace al estudiante preguntas de confirmación con una propuesta ya resuelta, detecta y resuelve inconsistencias, y deja una ficha de historia confirmada lista para generar especificaciones. Úsala antes de implementar cualquier historia de usuario, o cuando se pida validar o revisar la consistencia de una historia.
argument-hint: "HU-xx"
---

# Validar una historia antes de implementarla

Vas a preparar una historia de usuario para que se pueda implementar sin ambigüedades. El estudiante ya documentó todo en su repositorio: tu trabajo es **leer, cruzar y confirmar**, no inventar. Aunque la respuesta a una pregunta sea evidente en los documentos, **pregúntala igual con tu propuesta** para que el estudiante la confirme: así se asegura de que entiende y acepta lo que se va a construir.

No modifiques los documentos del curso. Si algo está mal en ellos, señálalo y deja que el estudiante decida (o te pida proponer el cambio).

## Paso 1 · Reunir lo que dice la documentación

Con el identificador de la historia (por ejemplo `HU-02`), recopila, usando la ubicación guardada en `.cin324/proyecto.md` (o las pistas de `cin324-auditar-repositorio/references/convenciones-curso.md` si no existe):

1. **La historia:** texto «Como … quiero … para …», prioridad, actividad del TO-BE asociada, criterios de aceptación. Puede estar en un `.md` o en un issue de GitHub.
2. **Gherkin:** todos los escenarios de la historia (en el documento de criterios, junto a la historia o en el issue).
3. **TO-BE:** la actividad citada por la historia, sus vecinas en el diagrama y la tabla «actividades que cambian» (y si es tarea de usuario, de servicio o manual).
4. **Caso de uso:** el `CU-xx` cuya «historia de origen» es esta historia, sus actores y relaciones (`include`/`extend`).
5. **Modelo de dominio:** las clases cuyos nombres o atributos aparecen en la historia y el Gherkin, con sus asociaciones y multiplicidades.
6. **Diagrama de estado:** si alguna de esas clases tiene un `EST-xx`, sus estados, eventos, guardas y acciones.
7. **Diagrama de secuencia:** el `DSS-xx` del caso de uso (mensajes, sistemas externos, fragmentos `alt`/`opt`).
8. **Requisitos:** los funcionales (RP/RF) que la historia cubre. Los no funcionales solo se anotan como contexto.

## Paso 2 · Hacer las cinco preguntas de confirmación

Presenta un solo mensaje con las cinco preguntas, cada una con **lo que encontraste** y **tu propuesta**. Formato y banco de preguntas en [preguntas-de-confirmacion.md](./references/preguntas-de-confirmacion.md). Las cinco son:

1. **¿Con qué actividad del TO-BE se relaciona?** (y qué cambia respecto del AS-IS)
2. **¿Qué caso de uso está relacionado?** (actor principal, actores externos, include/extend)
3. **¿Qué entidades del modelo de dominio gestiona?** (crea, lee, modifica o elimina; atributos y asociaciones que intervienen)
4. **¿Qué cambios de estado debe producir?** (solo si alguna entidad tiene diagrama de estado: estado origen, evento, guarda, acción, estado destino)
5. **¿Cuál es el flujo de interacción con el usuario?** (pasos numerados actor ↔ sistema ↔ sistemas externos, como si fuera el diagrama de secuencia de sistema, incluyendo las variantes de error)

Si falta un artefacto (por ejemplo, no hay diagrama de secuencia), no lo esquives: **reconstruye tú la propuesta** a partir del Gherkin y del caso de uso, indica que es una reconstrucción y pide confirmación.

Pídele al estudiante que responda cada punto con «confirmo», «corrijo: …» o una duda. **Detente y espera.**

## Paso 3 · Resolver inconsistencias

Con las respuestas, compara lo confirmado contra los documentos con la lista de [chequeos-de-consistencia.md](./references/chequeos-de-consistencia.md). Si encuentras una inconsistencia (por ejemplo, la historia habla de un «Equipo» que el modelo de dominio llama «Recurso», o el Gherkin deja la reserva «Aprobada» cuando el diagrama de estado solo tiene «Confirmada»):

- Explícala en una frase, con la evidencia de ambos lados.
- Plantea las opciones («¿actualizamos el diagrama o el Gherkin?») y una recomendación.
- Registra la decisión en la ficha (sección «Decisiones»). Si implica cambiar un documento, ofrécete a proponer el texto, pero cámbialo solo si el estudiante lo pide.
- Si hay varias, pregúntalas todas juntas, ordenadas por importancia. Repite hasta que no quede ninguna sin resolver.

Si la inconsistencia no se puede resolver ahora, regístrala como **supuesto** con el nombre de quien lo acepta, y avísale al estudiante que la implementación se basará en ese supuesto.

## Paso 4 · Dejar la ficha confirmada

1. Crea `.cin324/historias/HU-xx.md` con la plantilla de [plantilla-ficha-historia.md](./references/plantilla-ficha-historia.md), con todo lo confirmado (incluidos Gherkin textual, entidades, transiciones, flujo, sistemas externos, decisiones y supuestos).
2. Muéstrasela al estudiante y pregúntale: «¿La ficha representa exactamente lo que quieres construir?». **Espera la confirmación.**
3. Cuando confirme, marca la historia como «lista para especificar» en `.cin324/proyecto.md` y devuelve el control a la skill `cin324-generar-app` (o dile al estudiante que el siguiente paso es proponer el cambio con OpenSpec).

## Cómo preguntar bien

- Máximo cinco preguntas principales, más las de inconsistencias. No preguntes lo que ya está respondido sin mostrar tu propuesta.
- Una pregunta, una propuesta, una forma fácil de responder.
- Usa el vocabulario del estudiante (nombres de clases, actividades y mensajes tal como están en sus documentos).
- No pidas decisiones técnicas (frameworks, bases de datos) aquí: eso es del stack.
