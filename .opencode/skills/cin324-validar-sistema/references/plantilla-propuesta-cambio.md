# Plantilla de propuesta de cambio (paso 6)

Presenta **un solo cambio por mensaje**. Sé breve y concreto: el estudiante debe poder entender qué cambia en menos de un minuto.

````markdown
## Cambio 2 de 5 — [título corto]
**Archivo:** `07-criterios-aceptacion.md` · **Sección:** HU-02, escenario «Reserva de una sala grande»
**Por qué:** [observación OBS-1 con las palabras del estudiante] y [la regla de consistencia, por ejemplo C8: el Gherkin no coincide con la guarda de EST-01].
**Efecto en otros artefactos:** [qué quedará pendiente, por ejemplo `10-diagramas-secuencia.md` (rama de aprobación) y `12-trazabilidad.md`].

**Antes**
```gherkin
[texto actual, citado del archivo]
```

**Después (propuesta)**
```gherkin
[texto propuesto]
```

¿Qué quieres hacer?
1. **Aprobar:** lo aplico tal como está.
2. **Modificar:** dime qué cambiar y te muestro la nueva propuesta.
3. **Descartar:** no se hace este cambio.
4. **Lo hago yo:** lo editas tú y me avisas.
````

## Cómo presentar según el tipo de artefacto

| Artefacto | Qué mostrar en «Antes» y «Después» |
|-----------|--------------------------------------|
| Historia de usuario o requisito | El texto de la historia (rol, objetivo, beneficio, prioridad, actividad TO-BE) o la fila de la tabla de requisitos |
| Gherkin | El escenario completo (Dado, Cuando, Entonces), o el escenario nuevo |
| Modelo de dominio | El fragmento de la fuente (`.puml` o `.mmd`) con las clases, atributos o asociaciones afectadas, y la tabla o descripción de la clase |
| Casos de uso | El fragmento de la fuente del diagrama (actores y relaciones) y la fila de la tabla `CU-xx` ↔ `HU-xx` |
| Diagrama de secuencia | Los mensajes y fragmentos (`alt`, `opt`, `loop`) que cambian, en la sintaxis del archivo; si es un diagrama nuevo, la fuente completa |
| Diagrama de estado | Los estados y transiciones que cambian en la fuente, **y** la fila o filas de la tabla de transiciones (estado origen, evento, guarda, acción, estado destino) |
| Trazabilidad | La fila o celdas de la matriz que cambian |

## Después de aplicar un cambio

1. Vuelve a leer el archivo para comprobar que quedó como lo aprobó.
2. Muestra el resultado o `git diff` del archivo.
3. Pregunta: «¿Quedó como querías?». Si no, vuelve a proponer.
4. Si fue un diagrama: «Recuerda exportar de nuevo la imagen (`.png`) desde la fuente actualizada».
5. No hagas commit: sugiere el mensaje al final del paso 7.

## Diagramas nuevos

Si hay que generar un diagrama que no existe (por ejemplo, un diagrama de secuencia o de estado), construye la fuente en la notación que ya usa el equipo (PlantUML o Mermaid), con los IDs correlativos (`DSS-03`, `EST-03`), y deriva su contenido del Gherkin, el caso de uso y el modelo de dominio. Preséntala completa en «Después» y pide aprobación antes de crear el archivo; si además hay que agregarla a un documento (`10` u `11`), propón ese cambio por separado.
