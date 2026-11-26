# ficha-reserva

## Purpose

Emisión del comprobante oficial de la reserva en PDF con un código QR firmado digitalmente (Ed25519) y verificación de su autenticidad en el check-in, sin necesidad de conexión a internet. Capacidad introducida por HU-04.
## Requirements
### Requirement: Emisión de la ficha oficial de reserva en PDF con código QR firmado
El sistema DEBE (MUST) emitir, para una `SolicitudReserva` en estado `Aprobada` o `Confirmada por dueño`, un comprobante oficial en formato PDF descargable que contenga el código de reserva, los datos del estudiante, los datos del inmueble y del arriendo y el rango de fechas. Si la solicitud se encuentra en estado `Pendiente confirmación dueño` o cualquier otro estado no aprobado, el sistema DEBE (MUST) impedir la descarga y mantener restringida la emisión de la ficha. La ficha DEBE (MUST) incorporar un código QR con la firma digital del comprobante verificable sin conexión a internet, reutilizando la misma firma en descargas posteriores.

#### Scenario: Restricción de ficha y chat mientras falta confirmación del dueño
- **WHEN** el subarrendador pre-aprobó una solicitud pero esta sigue en estado "Pendiente confirmación dueño" y el estudiante intenta descargar la ficha oficial en PDF o abrir el chat de coordinación
- **THEN** el sistema impide el acceso y mantiene la habitación en estado "Disponible"
- **THEN** informa que la reserva aún requiere confirmación final del dueño

### Requirement: Verificación del código QR firmado en el check-in
El sistema DEBE (MUST) permitir al Dueño de Pensión verificar la autenticidad de una ficha de reserva escaneando su código QR o introduciendo su contenido. La verificación DEBE (MUST) comprobar la firma digital del comprobante y que la reserva corresponda a la ficha presentada. Si la verificación es válida y la `Habitacion` está en estado `Reservada`, el sistema DEBE (MUST) registrar el ingreso y cambiar el estado de la `Habitacion` a **`Ocupada`**. Si la verificación falla, el sistema DEBE (MUST) mantener la `Habitacion` en `Reservada` e informar el error.

#### Scenario: Registro de llegada con un QR válido
- **WHEN** el dueño escanea el código QR de una ficha de reserva aprobada y la firma es válida
- **THEN** el sistema confirma la autenticidad de la reserva
- **THEN** la habitación pasa a estado "Ocupada" por el registro de llegada

