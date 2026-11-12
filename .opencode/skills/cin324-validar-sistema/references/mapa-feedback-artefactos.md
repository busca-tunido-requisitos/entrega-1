# Mapa: del feedback al artefacto que se debe modificar

Usa este mapa en el paso 4. Los nombres de archivo son los habituales del curso; si el equipo usó otros, busca por contenido (ver `cin324-auditar-repositorio/references/convenciones-curso.md`). Indica siempre el archivo real del repositorio.

## 1. Síntoma → artefacto principal → artefactos afectados

| # | Qué observa el estudiante | Artefacto principal | Artefactos afectados (qué verificar) |
|---|----------------------------|----------------------|----------------------------------------|
| S1 | Una **regla de negocio, condición, cálculo o resultado** distinto (por ejemplo, «me deja reservar dos veces el mismo horario») | `07-criterios-aceptacion.md`: el escenario Gherkin (Dado, Cuando, Entonces) o uno nuevo. Si es el criterio de la historia, también `04-historias-usuario.md` | `10-diagramas-secuencia.md` (ramas `alt`/`opt` y mensajes), `11-diagramas-estado.md` (guardas y acciones, si cambia un estado), `09-casos-de-uso.md` (flujos alternativos), `03-requisitos.md` (el requisito asociado), `12-trazabilidad.md` |
| S2 | Los **pasos o el orden de la interacción** no son los esperados (qué pide el sistema, qué confirma, quién hace qué) | `10-diagramas-secuencia.md`: el `DSS-xx` del caso de uso | `07-criterios-aceptacion.md` (los Cuando y Entonces deben seguir los mismos pasos), `09-casos-de-uso.md` (descripción del caso de uso), `02-rediseno-to-be.md` (si cambia el tipo o el orden de una actividad), `12-trazabilidad.md` |
| S3 | **Estado equivocado** de un objeto, o una transición permitida o prohibida que no debería serlo | `11-diagramas-estado.md`: el `EST-xx` (estados, eventos, guardas, acciones y tabla de transiciones) | `07-criterios-aceptacion.md` (los estados que menciona el Gherkin, C7 y C8), `10-diagramas-secuencia.md` (mensajes que cambian el estado), `08-modelo-dominio.md` (atributo de estado de la clase), `09-casos-de-uso.md` |
| S4 | **Datos**: falta o sobra un campo, es obligatorio u opcional, la relación entre entidades o la cantidad permitida no es la esperada | `08-modelo-dominio.md`: clase, atributos, asociaciones y multiplicidades (y su `.puml` o `.png`) | `07-criterios-aceptacion.md` (datos de los escenarios, C4 a C6), `10-diagramas-secuencia.md` (datos en los mensajes), `11-diagramas-estado.md` (si la clase tiene `EST-xx`), `03-requisitos.md` y `04-historias-usuario.md` (si el dato es un requisito), `12-trazabilidad.md` |
| S5 | **Roles y permisos**: alguien puede o no puede hacer algo que esperaba lo contrario | `09-casos-de-uso.md`: actores y relaciones. También el rol de la historia en `04-historias-usuario.md` | `02-rediseno-to-be.md` (carril o participante de la actividad), `07-criterios-aceptacion.md`, `10-diagramas-secuencia.md` (actor), `12-trazabilidad.md` |
| S6 | **Falta una funcionalidad** (por ejemplo, «no hay cómo cancelar») | Primero verifica si pertenece a otra historia no generada (tipo E). Si no existe: `04-historias-usuario.md` (nueva historia) | `03-requisitos.md`, `07-criterios-aceptacion.md`, `09-casos-de-uso.md`, `10-diagramas-secuencia.md`, `11-diagramas-estado.md` si hay ciclo de vida, `02-rediseno-to-be.md` si es una actividad nueva, `12-trazabilidad.md` |
| S7 | Una **integración externa** (calendario, correo, pago) se comporta distinto | `10-diagramas-secuencia.md`: los mensajes con el sistema externo | `02-rediseno-to-be.md` (tarea de servicio), `09-casos-de-uso.md` (actor externo, C11), `07-criterios-aceptacion.md` (C9), `03-requisitos.md`. Recuerda que las integraciones se simulan |
| S8 | El sistema **no refleja el proceso de negocio** (una decisión, el orden de actividades, qué se automatiza) | `02-rediseno-to-be.md`: el BPMN TO-BE y la tabla de actividades (y sus `.bpmn` y `.png`) | `01-proceso-as-is.md` (comparación con el AS-IS), `03-requisitos.md`, `04-historias-usuario.md`, `09-casos-de-uso.md`, `10-diagramas-secuencia.md`, `07-criterios-aceptacion.md`, `12-trazabilidad.md` |
| S9 | **Nombres o textos**: el sistema usa palabras distintas a las del negocio, o un mensaje con otro texto | Si es de vocabulario: `08-modelo-dominio.md` (nombre de la clase o del atributo). Si es el texto exacto de un mensaje: `07-criterios-aceptacion.md` (el Entonces con el mensaje) | `07`, `09`, `10`, `11` y `04` para que usen el mismo nombre en todos (C4) |
| S10 | **Prioridad o alcance**: «esto debería hacerlo ahora» o «esto sobra en esta historia» | `04-historias-usuario.md` (prioridad MoSCoW y alcance de la historia) | `03-requisitos.md`, `07-criterios-aceptacion.md` (C14), `12-trazabilidad.md` |

## 2. Síntomas que no cambian artefactos

| Qué observa | Tipo | Qué decirle |
|-------------|------|--------------|
| Apariencia (colores, disposición, estilo) | E | Ningún artefacto del curso lo especifica. Si le importa para validar, que lo exprese como **resultado observable del negocio** en un escenario Gherkin (C13), no como «el botón verde» |
| Rendimiento, seguridad real, disponibilidad, etc. | E | Se registran en `06-atributos-calidad.md` y `03-requisitos.md`, pero no se implementan en este ejercicio |
| Error al instalar o arrancar, datos de ejemplo que faltan, uso del rol equivocado | F | Ayudarle a resolverlo siguiendo el `README.md` del proyecto; no hay artefactos que cambiar |
| Los artefactos son claros y el sistema no los cumple | D | Ningún artefacto cambia: se regenera con `/cin324-generar-app`, aportando la evidencia |

## 3. Propagación: si cambias X, revisa Y

| Si el estudiante cambia… | Debe revisar también… |
|---------------------------|--------------------------|
| El **TO-BE** (`02`) | `03`, `04`, `09`, `10`, `07`, `12` y la comparación con el AS-IS (`01`) |
| Una **historia** o su prioridad (`04`) | `07`, `09` (historia de origen), `03`, `12` |
| Un **escenario Gherkin** (`07`) | `10` (cada rama debe tener su escenario, C10), `11` (guardas y estados), `09`, `12` |
| El **modelo de dominio** (`08`) | `07`, `10`, `11`, `04`, `03`, `12` |
| Un **caso de uso** (`09`) | `04` (rol), `10`, `07`, `02`, `12` |
| Un **diagrama de secuencia** (`10`) | `07` (C9, C10), `09` (C11), `02`, `12` |
| Un **diagrama de estado** (`11`) | `07` (C7, C8), `10`, `08`, `09`, `12` |
| La **matriz de trazabilidad** (`12`) | Es consecuencia: se actualiza al final, para reflejar todo lo anterior |

Cuando el cambio afecta un diagrama, recuérdale actualizar **la fuente (`.puml`, `.mmd`, `.bpmn`) y la imagen exportada**, para que no queden desalineadas.

## 4. Cuándo el cambio es una historia nueva

Si la observación pide un objetivo distinto al de la historia validada (otra funcionalidad completa, otro rol con otro propósito), no lo mezcles: recomiéndale crear una historia nueva con sus artefactos (S6) y generarla en su propio ciclo.

## 5. Ejemplos resueltos

**Ejemplo 1 · tipo C (inconsistencia entre artefactos).**
Feedback: «Reservé una sala de 30 personas y me la confirmó sola; yo esperaba que pidiera aprobación».
Evidencia: `07-criterios-aceptacion.md`, escenario «Reserva de sala» termina en «Confirmada»; `EST-01` exige «Pendiente de aprobación» para más de 20 personas. El sistema siguió el Gherkin.
Qué debe hacer: decidir cuál de los dos es la regla correcta. Si es la del diagrama, modificar el escenario Gherkin (principal). Revisar `10` (rama de aprobación), `09` (flujo alternativo) y `12`.

**Ejemplo 2 · tipo E (otra historia).**
Feedback: «No encuentro cómo cancelar una reserva».
Evidencia: la cancelación es HU-04, aún no generada. Qué debe hacer: nada en los artefactos; generar HU-04 en el siguiente ciclo.

**Ejemplo 3 · tipo B (brecha de especificación).**
Feedback: «Al reservar no me pide el equipo que necesito».
Evidencia: ni la historia, ni el Gherkin, ni el modelo de dominio relacionan la reserva con equipos. Qué debe hacer: decidir si la reserva incluye equipo; si sí, modificar `08` (asociación Reserva–Equipo, principal) y revisar `07`, `10`, `11`, `04`, `03` y `12`.

**Ejemplo 4 · tipo D (defecto de generación).**
Feedback: «Tras aprobar, la reserva queda en Pendiente en vez de Confirmada».
Evidencia: `EST-01` y el escenario «Aprobación» son claros y coherentes, y el código no hace la transición. Qué debe hacer: ningún artefacto; pedir el ajuste con `/cin324-generar-app` citando el escenario.
