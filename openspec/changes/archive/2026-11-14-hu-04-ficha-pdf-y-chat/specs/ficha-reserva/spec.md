## ADDED Requirements

### Requirement: Emisión de la ficha oficial de reserva en PDF con código QR firmado
El sistema DEBE (MUST) emitir, para una `SolicitudReserva` en estado `Aprobada`, un comprobante oficial en formato PDF descargable que contenga el código de reserva, los datos del estudiante, los datos del inmueble y del arriendo y el rango de fechas. La ficha DEBE (MUST) incorporar un código QR con la firma digital del comprobante, que cubra el código único de la reserva, el identificador del estudiante, la dirección del inmueble y el rango de fechas, y DEBE (MUST) permitir validar la autenticidad de la reserva sin conexión a internet. Las descargas posteriores DEBEN (MUST) reutilizar la misma ficha y la misma firma.

#### Scenario: Emisión de ficha oficial con código criptográfico verificable
- **WHEN** una solicitud de reserva ha sido aprobada por el arrendador y el estudiante solicita la confirmación formal de su alojamiento
- **THEN** el sistema emite una ficha de reserva en formato PDF con los datos del inmueble y arriendo
- **THEN** la ficha incorpora un código QR firmado digitalmente que permite validar la autenticidad de la reserva sin conexión a internet
- **THEN** se habilita un canal de comunicación directo por chat entre el estudiante y el arrendador

### Requirement: Verificación del código QR firmado en el check-in
El sistema DEBE (MUST) permitir al Dueño de Pensión verificar la autenticidad de una ficha de reserva escaneando su código QR o introduciendo su contenido. La verificación DEBE (MUST) comprobar la firma digital del comprobante y que la reserva corresponda a la ficha presentada. Si la verificación es válida y la `Habitacion` está en estado `Reservada`, el sistema DEBE (MUST) registrar el ingreso y cambiar el estado de la `Habitacion` a **`Ocupada`**. Si la verificación falla, el sistema DEBE (MUST) mantener la `Habitacion` en `Reservada` e informar el error.

#### Scenario: Registro de llegada con un QR válido
- **WHEN** el dueño escanea el código QR de una ficha de reserva aprobada y la firma es válida
- **THEN** el sistema confirma la autenticidad de la reserva
- **THEN** la habitación pasa a estado "Ocupada" por el registro de llegada
