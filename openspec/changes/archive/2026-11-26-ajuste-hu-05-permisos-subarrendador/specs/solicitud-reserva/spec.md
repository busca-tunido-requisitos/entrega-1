## ADDED Requirements

### Requirement: Pre-evaluación y doble aprobación de solicitud con subarrendador
En una `Pension` que cuente con un `Subarrendador` asignado (`subarrienda`), el sistema DEBE (MUST) seguir el ciclo de vida `EST-03`: el subarrendador debe pre-aprobar o rechazar la `SolicitudReserva` en estado `En revisión` (dentro de las 48 horas desde `fechaEnvio`). Si pre-aprueba, el sistema DEBE (MUST) registrar `acuerdoSubarriendo = true`, cambiar la solicitud a **`Pendiente confirmación dueño`** manteniendo la `Habitacion` en estado `Disponible`, y despachar una notificación push simulada al dueño informando la pre-aprobación. Solo cuando el dueño confirme la solicitud desde `Pendiente confirmación dueño` dentro del plazo de 48 horas y con la habitación `Disponible`, el sistema DEBE (MUST) cambiar la solicitud a **`Confirmada por dueño`**, bloquear la `Habitacion` en **`Reservada`**, emitir la `FichaReserva` y despachar la notificación de confirmación al estudiante. Cualquier intento de que el dueño apruebe directamente desde `En revisión` en una pensión con subarrendador DEBE (MUST) ser rechazado sin modificar estados.

#### Scenario: Doble aprobación exitosa por subarrendador y dueño
- **WHEN** existe una solicitud de reserva en estado `En revisión` para una pensión con subarrendador autorizado y habitación `Disponible`, el subarrendador pre-aprueba la solicitud y luego el dueño la confirma dentro del plazo de 48 horas
- **THEN** tras la pre-aprobación la solicitud pasa a estado "Pendiente confirmación dueño" con `acuerdoSubarriendo` registrado y se despacha una notificación push al dueño
- **THEN** tras la confirmación del dueño la solicitud pasa a estado "Confirmada por dueño", la habitación pasa a estado "Reservada" quedando bloqueada para nuevas solicitudes en el catálogo, se emite la ficha oficial de reserva y se notifica al estudiante

### Requirement: Rechazo de la postulación con subarrendador por cualquiera de los dos roles
En una `Pension` con `Subarrendador`, el sistema DEBE (MUST) permitir que el subarrendador rechace una solicitud en estado `En revisión` (registrando `acuerdoSubarriendo = false` y notificando también al dueño) o que el dueño rechace una solicitud en estado `Pendiente confirmación dueño`, exigiendo siempre un motivo obligatorio dentro del plazo de 48 horas. En ambos casos, el sistema DEBE (MUST) cambiar la solicitud a **`Rechazada`**, mantener la `Habitacion` en estado **`Disponible`** y despachar la notificación de rechazo al estudiante junto a alternativas del mismo sector.

#### Scenario: Rechazo de postulación por el subarrendador o por el dueño
- **WHEN** existe una solicitud de reserva en estado `En revisión` o `Pendiente confirmación dueño` y el subarrendador o el dueño rechaza la postulación indicando el motivo
- **THEN** la solicitud cambia al estado "Rechazada"
- **THEN** la habitación se mantiene en estado "Disponible" para otros postulantes
- **THEN** se notifica el rechazo al estudiante junto a alternativas del sector y se informa la decisión al dueño
