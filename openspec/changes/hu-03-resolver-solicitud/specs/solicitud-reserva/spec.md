## ADDED Requirements

### Requirement: Aprobación de la postulación con bloqueo del cupo y emisión de la ficha de reserva
El sistema DEBE (MUST) permitir al Dueño de Pensión aprobar una `SolicitudReserva` en estado `En revisión` cuya `Habitacion` siga en estado `Disponible` y cuya `fechaEnvio` tenga menos de 48 horas. Al aprobar, el sistema DEBE (MUST) cambiar el estado de la `SolicitudReserva` a **`Aprobada`**, cambiar el estado de la `Habitacion` a **`Reservada`** de modo que deje de ofrecerse en el catálogo, crear la `FichaReserva` con su `codigoReserva` y `fechaEmision`, y despachar mediante el `ServicioPush` simulado una notificación de confirmación al postulante con el código de reserva. Si la solicitud no está `En revisión`, la `Habitacion` no está `Disponible` o han pasado más de 48 horas desde `fechaEnvio`, el sistema DEBE (MUST) impedir la aprobación, no DEBE (MUST NOT) modificar ningún estado y DEBE (MUST) informar al Dueño del motivo.

#### Scenario: Aprobación de postulación con cupo disponible
- **WHEN** el dueño de pensión tiene una solicitud de reserva pendiente de resolución para una habitación libre y aprueba la postulación del estudiante
- **THEN** la solicitud cambia al estado "Aprobada"
- **THEN** la habitación pasa a estado "Reservada" quedando bloqueada para nuevas solicitudes en el catálogo
- **THEN** se despacha una notificación de confirmación al estudiante con la ficha oficial de reserva

### Requirement: Rechazo de la postulación con motivo de incompatibilidad y alternativas del mismo sector
El sistema DEBE (MUST) permitir al Dueño de Pensión rechazar una `SolicitudReserva` en estado `En revisión` especificando un motivo de incompatibilidad obligatorio, siempre que su `fechaEnvio` tenga menos de 48 horas. Al rechazar, el sistema DEBE (MUST) cambiar el estado de la `SolicitudReserva` a **`Rechazada`**, registrar el `motivoRechazo`, mantener la `Habitacion` en estado `Disponible` para otros postulantes y despachar mediante el `ServicioPush` simulado una notificación al postulante con el rechazo y un listado curado de pensiones similares disponibles en el mismo sector.

#### Scenario: Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas
- **WHEN** el dueño de pensión evalúa una solicitud cuyas fechas coinciden con un compromiso previo y presiona la opción de rechazo especificando motivo de incompatibilidad
- **THEN** la solicitud cambia al estado "Rechazada"
- **THEN** la habitación se mantiene disponible para otros postulantes
- **THEN** se notifica al estudiante el rechazo junto a un listado curado de pensiones similares disponibles en el mismo sector

### Requirement: Bandeja de postulaciones del dueño y expiración por el plazo de 48 horas
El sistema DEBE (MUST) ofrecer al Dueño de Pensión una bandeja de postulaciones que liste las `SolicitudReserva` pendientes de sus pensiones con el resumen del postulante (nombre, carrera, universidad, fecha de ingreso, duración y mensaje de presentación). Al abrir la bandeja, el sistema DEBE (MUST) cambiar a `Expirada` toda solicitud en revisión cuya `fechaEnvio` tenga más de 48 horas, notificando la expiración al postulante. Si no hay solicitudes pendientes, la bandeja DEBE (MUST) informar que no hay postulaciones por resolver.

#### Scenario: Expiración de una postulación sin respuesta dentro del plazo de 48 horas
- **WHEN** el dueño abre su bandeja y una solicitud en revisión fue enviada hace más de 48 horas
- **THEN** la solicitud cambia al estado "Expirada"
- **THEN** el postulante recibe la notificación de expiración
- **THEN** la bandeja no muestra esa solicitud entre las pendientes
