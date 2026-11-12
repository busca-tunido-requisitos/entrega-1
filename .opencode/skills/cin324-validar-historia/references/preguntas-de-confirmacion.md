# Banco de preguntas de confirmación

Presenta las cinco preguntas en **un solo mensaje**, con este formato. Siempre incluye lo que encontraste y tu propuesta, y pide una respuesta corta.

```markdown
## Validación de HU-02 — Reservar un espacio disponible

Revisé la historia y los demás artefactos. Confírmame cada punto (responde «confirmo», «corrijo: …» o plantea una duda).

**1. Actividad del TO-BE**
- Encontré: la historia cita **ACT-TOBE-03 — Verificar disponibilidad en tiempo real**; en el AS-IS la actividad equivalente era ACT-AS-03 (consulta manual en planilla).
- Propongo: HU-02 implementa ACT-TOBE-03 (tarea de usuario con apoyo del sistema) y el registro de la reserva.
- ¿Confirmas?

**2. Caso de uso**
- Encontré: CU-01 — Reservar espacio (actor: Solicitante; actor externo: Servicio de Calendario Institucional; incluye CU-02 Consultar disponibilidad).
- ¿Confirmas que HU-02 corresponde a CU-01?

**3. Entidades del modelo de dominio**
- Propongo que HU-02 gestione: **Reserva** (crea), **Espacio** (consulta capacidad y disponibilidad), **Solicitante** (asocia). Atributos usados: …
- ¿Falta o sobra alguna?

**4. Cambios de estado**
- Encontré en EST-01 (Reserva): Solicitada → Confirmada [capacidad ≤ 20] / registrarEvento; Solicitada → Pendiente de aprobación [capacidad > 20].
- Propongo que HU-02 cree la Reserva en estado Solicitada y la lleve a Confirmada o Pendiente de aprobación según la capacidad.
- ¿Confirmas estas transiciones?

**5. Flujo de interacción**
1. El Solicitante elige espacio, fecha y horario.
2. El sistema verifica disponibilidad.
3. Si está ocupado, informa «horario no disponible» (fin).
4. Si no, registra la reserva y, si la capacidad es ≤ 20, registra el evento en el Calendario Institucional.
5. El sistema muestra la confirmación al Solicitante.
- (Basado en DSS-01 / reconstruido desde el Gherkin.) ¿Es este el flujo?
```

## Preguntas de apoyo por tema

Úsalas para afinar la propuesta o cuando una respuesta sea ambigua.

**TO-BE**
- ¿Esta historia implementa la actividad completa o solo una parte?
- La actividad es de usuario / servicio / manual: ¿qué parte automatiza el sistema?

**Caso de uso**
- ¿Quién inicia el caso de uso y quién participa solo como sistema externo?
- ¿Hay variantes (`extend`) que correspondan a otra historia y no deban implementarse ahora?

**Entidades**
- ¿Esta historia crea la entidad o la encuentra ya existente (datos de ejemplo)?
- ¿Qué atributos son obligatorios y cuáles opcionales?
- ¿Qué pasa con las multiplicidades (por ejemplo, un espacio con muchas reservas, una reserva con 0..* equipos)?

**Estado**
- Si la clase tiene diagrama de estado pero la historia no cambia su estado: ¿cuál es el estado inicial al crearse o consultarse?
- Si la historia necesita un estado que el diagrama no tiene: ¿se agrega al diagrama o se usa uno existente?

**Flujo**
- ¿Cuál es el mensaje o pantalla que recibe el usuario en cada caso de error del Gherkin?
- ¿Qué sistema externo participa y qué se espera de él (respuesta de éxito, de error, tiempo de espera)? Recordar que se simulará.
- ¿Hay pasos opcionales o repetidos (`opt`, `loop`)?

## Cuando falta un artefacto

| Falta | Qué hacer |
|-------|-----------|
| Actividad del TO-BE en la historia | Proponer la más probable según nombre y descripción, mostrando las candidatas |
| Caso de uso | Proponer un caso de uso (verbo + objeto) y su actor a partir de la historia |
| Diagrama de estado de una entidad con ciclo de vida | Proponer los estados que se deducen del Gherkin y preguntar si hay otros; registrar como supuesto |
| Diagrama de secuencia | Reconstruir el flujo de pasos a partir del Gherkin y del caso de uso |
| Entidad que no está en el modelo de dominio | Preguntar si es una clase nueva, un atributo o un nombre distinto de otra clase |
