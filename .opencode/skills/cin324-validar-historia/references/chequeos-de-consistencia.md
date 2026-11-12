# Chequeos de consistencia de una historia

Después de que el estudiante confirme las cinco preguntas, revisa esta lista. Cada hallazgo se plantea con evidencia de ambos lados y opciones de resolución. Si no encuentras nada, dilo: «No encontré inconsistencias».

| # | Chequeo | Ejemplo de inconsistencia | Opciones de resolución |
|---|---------|----------------------------|--------------------------|
| C1 | La actividad del TO-BE citada existe en la tabla/diagrama del TO-BE y realmente cambia respecto del AS-IS | La historia cita ACT-TOBE-07, que no existe | Corregir el ID en la historia; agregar la actividad al TO-BE |
| C2 | Cada historia tiene un caso de uso de origen (y viceversa) | CU-03 cita HU-06, que no existe | Corregir la tabla de casos de uso; crear la historia |
| C3 | El actor de la historia (rol) es el actor del caso de uso | Historia dice «Administrador»; el caso de uso, «EncargadoDeEventos» | Unificar el rol; separar la historia |
| C4 | Los sustantivos del Gherkin existen en el modelo de dominio con el mismo nombre | Gherkin: «Sala»; dominio: «Espacio» | Renombrar en Gherkin o en el dominio; agregar sinónimo al glosario |
| C5 | Los atributos que usa la historia existen en la clase | La historia filtra por «piso» y `Espacio` no tiene `piso` | Agregar el atributo al dominio; quitar el filtro |
| C6 | Las multiplicidades permiten lo que dice el Gherkin | Una reserva con varios espacios, pero la multiplicidad es 1 | Ajustar la multiplicidad; ajustar el escenario |
| C7 | Los estados que menciona el Gherkin existen en el diagrama de estado | Gherkin: «Aprobada»; diagrama: «Confirmada» | Alinear nombres; agregar el estado |
| C8 | Las transiciones del Gherkin coinciden con eventos, guardas y estados del diagrama | El Gherkin confirma sin aprobación una sala de 30 personas, pero el diagrama exige aprobación sobre 20 | Corregir el Gherkin; corregir la guarda |
| C9 | Los mensajes del diagrama de secuencia aparecen como acciones en el Gherkin (y viceversa) | El DSS registra en el calendario, pero ningún escenario lo menciona | Agregar escenario; quitar el mensaje |
| C10 | Hay escenarios alternativos y de error para cada variante `alt`/`opt` del diagrama | El DSS tiene rama «horario ocupado», sin escenario | Agregar el escenario |
| C11 | Cada sistema externo del DSS está como actor del caso de uso | El DSS usa «Servicio de Calendario» y el caso de uso no lo tiene | Agregar el actor al caso de uso |
| C12 | Los requisitos funcionales citados están cubiertos por los escenarios | RP-03 «notificar por correo» sin escenario | Agregar escenario; sacar el requisito de esta historia |
| C13 | El Gherkin es verificable y está en lenguaje de negocio | «Entonces el botón se pone verde» | Reescribir como resultado observable del negocio |
| C14 | La historia cabe en un ciclo (no mezcla varios objetivos) | Reservar y además cancelar y modificar | Proponer dividirla; implementar solo una parte |

## Cómo reportar

```markdown
**Inconsistencia C7 (estados):** el escenario «Reserva de sala grande» termina en **Aprobada** (`07-criterios-aceptacion.md`), pero el diagrama de la clase Reserva no tiene ese estado: usa **Confirmada** (`diagramas/est-01.puml`).
- Opción A: cambiar el Gherkin a «Confirmada» (recomendada: el diagrama es más detallado).
- Opción B: agregar el estado «Aprobada» al diagrama.
¿Cuál prefieres?
```
