## ADDED Requirements

### Requirement: Chat de coordinación habilitado con la reserva aprobada
El sistema DEBE (MUST) habilitar un canal de chat bidireccional entre el postulante y el arrendador de una `SolicitudReserva` en estado `Aprobada`, para coordinar la llegada presencial. Los mensajes DEBEN (MUST) quedar almacenados en la base de datos y asociarse a la solicitud y a su autor, y DEBEN (MUST) estar disponibles para los dos participantes del canal. El sistema DEBE (MUST) entregar la ficha oficial en PDF cuando la reserva está aprobada.

#### Scenario: Habilitación del canal de chat con la reserva confirmada
- **WHEN** una solicitud de reserva ha sido aprobada por el arrendador
- **THEN** el sistema habilita el canal de comunicación directo por chat entre el estudiante y el arrendador
- **THEN** el estudiante puede descargar la ficha oficial de reserva en PDF
- **THEN** los mensajes enviados por ambos participantes quedan registrados y se muestran en la sala

### Requirement: Restricción del acceso al chat sin reserva aprobada
El sistema DEBE (MUST) restringir el acceso al canal de chat cuando la `SolicitudReserva` no está en estado `Aprobada`, y DEBE (MUST) informar al estudiante que el chat se habilita exclusivamente una vez confirmada y aprobada la reserva. En ese caso el sistema DEBE (MUST NOT) permitir el envío de mensajes.

#### Scenario: Intento de acceso al canal de chat sin contar con reserva aprobada
- **WHEN** un estudiante foráneo tiene una postulación en estado pendiente de revisión o rechazada y intenta abrir la sala de chat de coordinación con el arrendador
- **THEN** el acceso al canal de comunicación se restringe
- **THEN** se le informa que el chat se habilita exclusivamente una vez confirmada y aprobada la reserva
