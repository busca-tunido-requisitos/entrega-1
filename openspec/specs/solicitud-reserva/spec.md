# solicitud-reserva

## Purpose

Envío de la postulación formal del estudiante a una habitación disponible, con las guardas de `EST-01`, y notificación push simulada al dueño de la pensión; resolución de la postulación por el dueño (aprobación con bloqueo de cupo y ficha de reserva, rechazo con motivo y alternativas del mismo sector) y expiración por el plazo de 48 horas. Capacidad introducida por HU-02 y ampliada por HU-03.

## Requirements

### Requirement: Registro de la solicitud formal de reserva en estado En revisión
El sistema DEBE (MUST) permitir al Estudiante enviar una postulación formal a una `Habitacion` en estado `Disponible`, indicando la fecha de llegada estimada, la duración estimada de la estadía en meses enteros y un mensaje de presentación, siendo los tres campos obligatorios. El envío DEBE (MUST) exigir que el perfil del Estudiante tenga `correoInstitucionalVerificado` y que la `Habitacion` siga en estado `Disponible`. Al registrar la solicitud, el sistema DEBE (MUST) crear una `SolicitudReserva` con un `codigoSolicitud` único, su `fechaEnvio` y estado **`En revisión`**, sin modificar el estado de la `Habitacion`. Inmediatamente después, el sistema DEBE (MUST) despachar una notificación push al dueño de la `Pension` a través del `ServicioPush` simulado y DEBE (MUST) informar al Estudiante el código de su solicitud y el plazo máximo de 48 horas para recibir respuesta, calculado desde `fechaEnvio`.

#### Scenario: Envío exitoso de solicitud formal con antecedentes completos
- **WHEN** una habitación se encuentra con estado `Disponible` en el catálogo, el estudiante foráneo ha completado su perfil con correo institucional verificado y envía una postulación indicando fecha de ingreso, duración estimada de estadía y mensaje de presentación
- **THEN** la solicitud se registra con estado "En revisión"
- **THEN** se despacha una notificación push inmediata al dueño de la pensión
- **THEN** se informa al estudiante el plazo máximo de 48 horas para recibir respuesta

### Requirement: Rechazo de la postulación con fecha de ingreso fuera del periodo de admisión
El sistema DEBE (MUST) validar que la fecha de llegada estimada esté dentro del rango definido por `fechaInicioAdmision` y `fechaFinAdmision` de la `Habitacion`. Si la fecha es extemporánea, el sistema DEBE (MUST) impedir el envío de la postulación, no DEBE (MUST NOT) crear ninguna `SolicitudReserva`, no DEBE (MUST NOT) notificar al dueño y DEBE (MUST) mostrar al Estudiante las fechas válidas de inicio de estadía definidas por la pensión.

#### Scenario: Intento de postulación con fecha de ingreso fuera del periodo lectivo
- **WHEN** una habitación admite arriendos exclusivamente para el semestre académico en curso y el estudiante intenta enviar una solicitud indicando una fecha de ingreso extemporánea
- **THEN** el sistema impide el envío de la postulación
- **THEN** notifica al estudiante las fechas válidas de inicio de estadía definidas por la pensión

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
