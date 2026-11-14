## 1. Base de datos y dependencias

- [x] 1.1 Crear `src/db/migrations/004_crear_chat.sql` con la tabla `mensaje_chat` (`solicitud_id` con `ON DELETE CASCADE`, `persona_id` FK, `contenido_texto`, `fecha_hora_envio`, `leido` con CHECK 0/1) e índices por `solicitud_id` y `(solicitud_id, id)`.
- [x] 1.2 Agregar `data/clave-firma.json` y `data/clave-firma.json` al `.gitignore` para que la clave de firma no se versione.
- [x] 1.3 Instalar `pdfkit` y `qrcode` como dependencias y `@types/pdfkit` y `@types/qrcode` como tipos de desarrollo, sin dependencias nativas.

## 2. Servicios de ficha, firma y chat

- [x] 2.1 Implementar `src/servicios/firma.ts` con Ed25519: generación y persistencia del par de claves en `data/clave-firma.json`, `construirPayload`, `firmarPayload`, `verificarFirma` y `clavePublicaBase64`.
- [x] 2.2 Implementar `src/servicios/fichas.ts`: `generarFichaPdf` con `pdfkit` y el QR con `qrcode`, reutilizando la firma guardada en `ficha_reserva.codigo_qr_firmado`.
- [x] 2.3 Implementar `src/servicios/fichas.ts` con la verificación del contenido firmado: comprobación de firma, búsqueda de la reserva y comprobación de correspondencia.
- [x] 2.4 Implementar `src/dominio/repositorio-chat.ts`: participantes de la solicitud (postulante y arrendador), alta de mensaje y listado incremental de mensajes.
- [x] 2.5 Implementar `src/servicios/chat.ts`: `chatHabilitado` (solo con solicitud `Aprobada`), `crearMensaje` con las guardas de participante y texto, y `listarMensajes`.

## 3. Rutas y pantallas

- [x] 3.1 Crear `src/rutas/fichas.ts` con `GET /solicitudes/:codigo/ficha.pdf` (PDF descargable, `403` si la reserva no está aprobada) y `GET /api/clave-publica`.
- [x] 3.2 Crear `src/rutas/chat.ts` con `GET /solicitudes/:codigo/chat`, `POST /solicitudes/:codigo/chat` y `GET /solicitudes/:codigo/chat/mensajes` para el sondeo.
- [x] 3.3 Crear `src/rutas/verificacion.ts` con `GET /verificar` (pantalla de check-in) y `POST /verificar/llegada` (verificación y registro de llegada).
- [x] 3.4 Crear `src/vistas/chat.ejs` y `src/vistas/verificar.ejs` en español, con la sala de chat, el selector de participante de demostración, el escaneo con `BarcodeDetector` y el pegado manual.
- [x] 3.5 Añadir en la pantalla de confirmación de la solicitud el botón «Descargar ficha oficial en PDF» y el enlace al chat, activos solo cuando la reserva está aprobada.
- [x] 3.6 Crear `public/chat.js` (sondeo de mensajes) y `public/verificador.js` (escaneo con cámara y pegado manual) y revisar el estilo en `public/estilos.css`.

## 4. Pruebas de los escenarios Gherkin

- [x] 4.1 Crear `tests/ficha-chat.test.ts` con base `:memory:`, migraciones aplicadas, `sembrarDatos` y una solicitud aprobada de apoyo.
- [x] 4.2 Escribir `HU-04 · Emisión de ficha oficial con código criptográfico verificable`: verifica la respuesta `200` con `Content-Type: application/pdf`, la cabecera `%PDF`, el contenido firmado `BTN1|` guardado en la ficha, el chat habilitado y un mensaje persistido.
- [x] 4.3 Escribir `HU-04 · Intento de acceso al canal de chat sin contar con reserva aprobada`: verifica la respuesta `403` con el mensaje de restricción y que no se registran mensajes.
- [x] 4.4 Agregar pruebas de la verificación del QR: contenido manipulado rechazado con la habitación en `Reservada` y contenido válido registrando el ingreso con la habitación en `Ocupada`.
- [x] 4.5 Ejecutar `npm test` y confirmar que los escenarios de HU-01, HU-02 y HU-03 siguen pasando junto con los nuevos.

## 5. Cierre de la historia

- [x] 5.1 Probar el recorrido manual con `npm run dev`: descargar el PDF, abrir el QR en otra pestaña, verificar la llegada y usar el chat entre ambos participantes.
- [x] 5.2 Actualizar el `README.md` con el recorrido de HU-04 y con las nuevas dependencias (el taller sí documenta aquí el PDF descargable y el chat).
- [x] 5.3 Registrar en `.cin324/proyecto.md` la historia como implementada y pasar a la validación del sistema.
