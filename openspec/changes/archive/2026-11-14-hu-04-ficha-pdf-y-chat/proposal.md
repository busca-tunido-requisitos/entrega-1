## Why

Con la reserva aprobada (HU-03) el estudiante ya tiene un código de reserva, pero todavía no existe el comprobante oficial ni el canal para coordinar la llegada: el acuerdo con el dueño sigue siendo verbal (`ACT-AS-05`), con el riesgo de suplantación y sin evidencia verificable en la puerta de la pensión. HU-04 entrega los dos elementos reales que exige `RP-07`, `RP-08` y `RP-DER-01`: una **ficha oficial en PDF** con un **código QR firmado digitalmente** que el dueño valida en el check-in sin conexión a internet, y un **chat de coordinación** entre estudiante y arrendador habilitado solo cuando la reserva está aprobada.

## What Changes

- Botón **«Descargar ficha oficial en PDF»** en la pantalla de confirmación de una solicitud aprobada; el archivo es un PDF real (código de reserva, estudiante, inmueble, arriendo, rango de fechas) con el **código QR embebido**, firmado con **Ed25519** (`node:crypto`).
- La firma del QR cubre el código único de la reserva, el identificador del estudiante, la dirección del inmueble y el rango de fechas (`RP-DER-01`); las descargas posteriores reutilizan la misma firma.
- **Verificación en el check-in:** pantalla para el dueño que escanea el QR con la cámara del navegador o pega su contenido, comprueba la firma y la correspondencia con la reserva, y registra el ingreso (`Habitacion`: `Reservada` → `Ocupada`, transición de `EST-02`). Si la verificación falla, la habitación sigue `Reservada`.
- **Chat de coordinación real** entre postulante y arrendador, con los mensajes persistidos en `mensaje_chat`, actualización por sondeo y selector de participante de demostración.
- **Restricción del chat:** solo se habilita con la solicitud `Aprobada`; en otro caso la pantalla informa que el chat se habilita exclusivamente con la reserva confirmada y aprobada.
- Nueva clave de firma Ed25519 local (`data/clave-firma.json`, fuera del repositorio) y clave pública distribuida al cliente.

## Capabilities

### New Capabilities
- `ficha-reserva`: emisión del comprobante oficial en PDF con QR firmado y verificación de autenticidad en el check-in.
- `chat-coordinacion`: sala de chat directo entre estudiante y arrendador, habilitada solo con la reserva aprobada.

### Modified Capabilities
- Ninguna. `solicitud-reserva` y `catalogo-pensiones` no cambian sus requisitos: esta historia agrega capacidades nuevas que se apoyan en la reserva ya aprobada.

## Impact

- **Código nuevo:** servicio de firma Ed25519, servicio de generación del PDF con QR, repositorio y servicio de chat, rutas de la ficha (`/solicitudes/:codigo/ficha.pdf`), del chat (`/solicitudes/:codigo/chat`) y de verificación de llegada (`/verificar`), y sus vistas y scripts de navegador.
- **Base de datos:** migración `004_crear_chat.sql` con la tabla `mensaje_chat` (`contextualiza` y `envia` de DOM-01) e índices. La columna `codigo_qr_firmado` de `ficha_reserva` pasa a contener la firma real.
- **Dependencias:** `pdfkit` (generación del PDF) y `qrcode` (imagen del código QR), ambas de JavaScript puro, más sus tipos de TypeScript. El resto del stack no cambia.
- **Pruebas:** una prueba de integración por cada escenario Gherkin de HU-04, más la verificación del QR y la restricción del chat.
- **Fuera del alcance:** pago del mes y garantía, registro de salida de la habitación (`Ocupada` → `Disponible`), firma por una autoridad certificadora externa, autenticación real, cifrado extremo a extremo del chat y requisitos no funcionales `RP-09` y `RP-10`.
