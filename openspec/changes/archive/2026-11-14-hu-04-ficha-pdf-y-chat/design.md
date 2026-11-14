## Context

HU-01 dejó el catálogo, HU-02 el formulario de postulación y el registro de la `SolicitudReserva`, y HU-03 la bandeja del dueño con la aprobación (solicitud `Aprobada`, habitación `Reservada` y `FichaReserva` emitida con código `RES-<código de solicitud>`). La base ya tiene `persona`, `pension`, `habitacion`, `solicitud_reserva`, `notificacion` y `ficha_reserva`, con migraciones numeradas en `src/db/migrations`.

HU-04 implementa `CU-04 — Obtener comprobante` y `CU-05 — Coordinar llegada` con las actividades `ACT-TOBE-10` (tarea de servicio) y `ACT-TOBE-11` (tarea de usuario), siguiendo `DSS-02` y la transición de `EST-02` (`Reservada` → `Ocupada`). La ficha confirmada está en `.cin324/historias/HU-04.md`.

A diferencia de las historias anteriores, aquí el sistema externo **no se simula**: la firma digital y el PDF se implementan de verdad (Ed25519 con `node:crypto`, `pdfkit` y `qrcode`), sin depender de internet.

Restricciones: una historia por cambio, sin autenticación real (selector de participante de demostración) e interfaz y artefactos en español.

## Goals / Non-Goals

**Goals:**
- Emitir un PDF real descargable con los datos del inmueble y el arriendo y un código QR firmado digitalmente.
- Firmar el comprobante con Ed25519 cubriendo código de reserva, identificador del estudiante, dirección del inmueble y rango de fechas (`RP-DER-01`).
- Verificar la firma en el check-in y registrar el ingreso (`Reservada` → `Ocupada`).
- Habilitar un chat real entre postulante y arrendador, con mensajes persistidos.
- Restringir el chat cuando la reserva no está aprobada.
- Cubrir cada escenario Gherkin con una prueba de integración.

**Non-Goals:**
- Pago del mes y garantía.
- Registro de salida de la habitación (`Ocupada` → `Disponible`).
- Firma por una autoridad certificadora externa y verificación con aplicación móvil nativa.
- Autenticación real, cifrado extremo a extremo del chat y requisitos no funcionales `RP-09`/`RP-10`.

## Decisions

### 1. Tabla del chat

Migración `src/db/migrations/004_crear_chat.sql`:

**`mensaje_chat`** — clase `MensajeChat` (`contextualiza`: `SolicitudReserva 1 – 0..* MensajeChat`; `envia`: `Persona 1 – 0..* MensajeChat`):

| Columna | Tipo | Restricción | Origen |
|---------|------|-------------|--------|
| `id` | INTEGER | PK AUTOINCREMENT | — |
| `solicitud_id` | INTEGER | NOT NULL REFERENCES `solicitud_reserva(id) ON DELETE CASCADE` | FK en el lado 1 |
| `persona_id` | INTEGER | NOT NULL REFERENCES `persona(id)` | FK en el lado muchos |
| `contenido_texto` | TEXT | NOT NULL | `contenidoTexto` |
| `fecha_hora_envio` | TEXT | NOT NULL, ISO `YYYY-MM-DD HH:MM:SS` | `fechaHoraEnvio` |
| `leido` | INTEGER | NOT NULL DEFAULT 0, CHECK (0,1) | `leido` |

Índices por `solicitud_id` y por `(solicitud_id, id)`.

`ficha_reserva.codigo_qr_firmado` se conserva y pasa a contener la firma real (payload firmado) en lugar del marcador de HU-03.

### 2. Firma digital con Ed25519

`src/servicios/firma.ts`:

- `obtenerClaveFirma()`: lee `data/clave-firma.json`; si no existe, genera un par Ed25519 con `crypto.generateKeyPairSync('ed25519')` y lo guarda (clave privada en formato PEM y pública en base64). El archivo queda fuera del repositorio por `.gitignore` (`data/*.db` no cubre el JSON, por lo que se agrega `data/clave-firma.json`).
- `construirPayload(datos)`: arma `BTN1|codigoReserva|idEstudiante|direccion|fechaInicio|fechaFin` — exactamente los datos que exige `RP-DER-01`.
- `firmarPayload(payload)`: firma con la clave privada y devuelve `payload + '|' + firmaBase64`.
- `verificarFirma(contenido)`: separa el payload de la firma y comprueba la firma con la clave pública (`crypto.verify(null, ...)`).
- `clavePublicaBase64()`: se expone en `GET /api/clave-publica` y se muestra en la pantalla de verificación.

La verificación no usa ningún servicio externo: funciona sin conexión a internet. La clave pública se cachea en el navegador para poder contrastarla sin red.

### 3. Ficha en PDF

`src/servicios/fichas.ts`:

- `generarFichaPdf(detalle): Promise<Buffer>`: arma el PDF con `pdfkit` (A4) y el QR con `qrcode`.
  - Datos: código de reserva, fecha de emisión, estudiante (nombre, correo institucional, universidad, carrera), inmueble (pensión, dirección, comuna), habitación (identificador, tipo de cama, baño, precio), arriendo (fecha de ingreso, duración, rango de admisión) y el código de verificación legible.
  - QR: imagen PNG de 320 px con el contenido firmado, generada con `QRCode.toBuffer(contenido, { width: 640, margin: 1 })`.
- `ruta GET /solicitudes/:codigo/ficha.pdf`: exige solicitud `Aprobada`; responde `Content-Type: application/pdf` y `Content-Disposition: attachment; filename="RES-<código>.pdf"`. Si la solicitud no está aprobada, responde `403` con la vista de aviso.

La firma se calcula una sola vez: se guarda en `ficha_reserva.codigo_qr_firmado` y las descargas posteriores reutilizan ese valor, tal como describe `CU-04`.

### 4. Verificación en el check-in

`src/servicios/fichas.ts` + `src/rutas/verificacion.ts`:

- `GET /verificar`: pantalla del dueño para escanear o pegar el contenido del QR.
- `POST /verificar/llegada`: recibe el contenido firmado, verifica la firma con la clave pública, busca la reserva por `codigoReserva` y comprueba que la `Habitacion` siga `Reservada`. Si todo es válido, cambia la habitación a `Ocupada` y responde con la confirmación; si algo falla, mantiene `Reservada` e informa el error.

Escaneo en el navegador: `public/verificador.js` usa `BarcodeDetector` (Chrome/Edge, con cámara del dispositivo) y ofrece el pegado manual como alternativa, para que el recorrido funcione en cualquier equipo.

### 5. Chat de coordinación

`src/dominio/repositorio-chat.ts` y `src/servicios/chat.ts`:

- `obtenerParticipantes(db, solicitudId)`: devuelve el postulante y el arrendador de la pensión dueña de la habitación.
- `chatHabilitado(detalle)`: verdadero solo si la solicitud está `Aprobada`.
- `crearMensaje(db, solicitudId, personaId, texto)`: valida que la persona sea participante del chat, que el texto no esté vacío y persiste el mensaje.
- `listarMensajes(db, solicitudId, desdeId)`: mensajes para el sondeo incremental.

Rutas (`src/rutas/chat.ts`):

| Método y ruta | Comportamiento |
|---------------|----------------|
| `GET /solicitudes/:codigo/chat` | Renderiza la sala con los mensajes. Si la reserva no está aprobada, responde `403` con el aviso de que el chat se habilita exclusivamente con la reserva confirmada y aprobada. |
| `POST /solicitudes/:codigo/chat` | Envía un mensaje (participante y texto) y responde `303` a la sala. |
| `GET /solicitudes/:codigo/chat/mensajes?desde=:id` | Devuelve en JSON los mensajes posteriores a `desde`, para el sondeo. |

El selector de participante es de demostración (no hay autenticación): la lista contiene el postulante y el arrendador, y el servidor rechaza cualquier otra persona.

### 6. Pruebas

`tests/ficha-chat.test.ts`, con base `:memory:`, migraciones aplicadas, `sembrarDatos` y el `ServicioPush` espía de HU-03:

1. `HU-04 · Emisión de ficha oficial con código criptográfico verificable`: solicitud `Aprobada` → `GET /solicitudes/:codigo/ficha.pdf` responde `200`, `Content-Type: application/pdf`, el cuerpo empieza por `%PDF` y el `codigo_qr_firmado` guardado empieza por `BTN1|`; el chat responde `200` y permite enviar mensajes que quedan persistidos.
2. `HU-04 · Intento de acceso al canal de chat sin contar con reserva aprobada`: solicitud `En revisión` → el chat responde `403` con el mensaje de restricción, no se registra ningún mensaje y no se puede enviar.
3. Verificación del QR: el contenido firmado verifica correctamente; un contenido manipulado se rechaza y la habitación permanece `Reservada`; con QR válido la habitación pasa a `Ocupada`.

## Risks / Trade-offs

- **La clave de firma en el disco** → en un despliegue real sería un secreto gestionado por el servidor; en el taller se guarda en `data/clave-firma.json` y se documenta como supuesto.
- **QR largo** → el payload incluye la dirección; se acepta que el QR sea más denso, con nivel de corrección de errores por defecto.
- **Sondeo en vez de WebSocket** → con un intervalo de 3 s el chat se siente en vivo sin infraestructura adicional; es la opción más simple para el taller.
- **Sin autenticación en el chat** → cualquier persona que abra la sala puede elegir el participante; se declara como supuesto y limitation de demostración.
- **`BarcodeDetector` no está en todos los navegadores** → se ofrece el pegado manual del contenido firmado como alternativa equivalente.

## Migration Plan

1. Agregar `004_crear_chat.sql`; se aplica sola en el siguiente arranque y queda registrada en `schema_migrations`.
2. Agregar `data/clave-firma.json` a `.gitignore`.
3. Verificar con `npm test` (los escenarios nuevos y los de HU-01, HU-02 y HU-03) y `npm run dev` sobre `data/app.db`.
4. Reversión: eliminar la migración 004 y su fila en `schema_migrations`; los mensajes de ejemplo son datos de prueba.

## Open Questions

- Ninguna pendiente: contenido del QR, mecanismo de firma, verificación en el check-in, participantes del chat y restricción de acceso quedaron decididos en `.cin324/historias/HU-04.md`.
