## MODIFIED Requirements

### Requirement: Chat de coordinación habilitado con la reserva aprobada
El sistema DEBE (MUST) habilitar un canal de chat bidireccional entre el postulante y el arrendador (incluyendo al subarrendador autorizado si existe) de una `SolicitudReserva` en estado `Aprobada` o `Confirmada por dueño`, para coordinar la llegada presencial. Los mensajes DEBEN (MUST) quedar almacenados en la base de datos y asociarse a la solicitud y a su autor.

#### Scenario: Habilitación del canal de chat con doble aprobación confirmada
- **WHEN** una solicitud de reserva en pensión con subarrendador alcanza el estado "Confirmada por dueño"
- **THEN** el sistema habilita el canal de comunicación directo por chat para coordinar la llegada presencial

### Requirement: Restricción del acceso al chat sin reserva aprobada
El sistema DEBE (MUST) restringir el acceso al canal de chat cuando la `SolicitudReserva` no está en estado `Aprobada` ni `Confirmada por dueño` (incluyendo `Pendiente confirmación dueño`), y DEBE (MUST) informar que el chat se habilita exclusivamente una vez confirmada y aprobada la reserva. En ese caso el sistema DEBE (MUST NOT) permitir el envío de mensajes.

#### Scenario: Intento de acceso al chat en estado Pendiente confirmación dueño
- **WHEN** una solicitud está en estado "Pendiente confirmación dueño" y el estudiante intenta abrir o enviar mensajes en la sala de chat
- **THEN** el acceso al canal de comunicación se restringe
- **THEN** se informa que la reserva aún requiere confirmación final del dueño
