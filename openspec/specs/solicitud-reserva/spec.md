# solicitud-reserva

## Purpose

Envío de la postulación formal del estudiante a una habitación disponible, con las guardas de `EST-01`, y notificación push simulada al dueño de la pensión. Capacidad introducida por HU-02.

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
