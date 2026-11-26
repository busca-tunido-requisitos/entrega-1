## MODIFIED Requirements

### Requirement: Emisión de la ficha oficial de reserva en PDF con código QR firmado
El sistema DEBE (MUST) emitir, para una `SolicitudReserva` en estado `Aprobada` o `Confirmada por dueño`, un comprobante oficial en formato PDF descargable que contenga el código de reserva, los datos del estudiante, los datos del inmueble y del arriendo y el rango de fechas. Si la solicitud se encuentra en estado `Pendiente confirmación dueño` o cualquier otro estado no aprobado, el sistema DEBE (MUST) impedir la descarga y mantener restringida la emisión de la ficha. La ficha DEBE (MUST) incorporar un código QR con la firma digital del comprobante verificable sin conexión a internet, reutilizando la misma firma en descargas posteriores.

#### Scenario: Restricción de ficha y chat mientras falta confirmación del dueño
- **WHEN** el subarrendador pre-aprobó una solicitud pero esta sigue en estado "Pendiente confirmación dueño" y el estudiante intenta descargar la ficha oficial en PDF o abrir el chat de coordinación
- **THEN** el sistema impide el acceso y mantiene la habitación en estado "Disponible"
- **THEN** informa que la reserva aún requiere confirmación final del dueño
