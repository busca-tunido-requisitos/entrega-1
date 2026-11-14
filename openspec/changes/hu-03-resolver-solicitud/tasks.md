## 1. Base de datos y datos de ejemplo

- [x] 1.1 Crear `src/db/migrations/003_crear_resolucion_solicitud.sql` con la tabla `ficha_reserva` (`solicitud_id` UNIQUE, `codigo_reserva` UNIQUE, `estado_ficha` CHECK `Emitida`/`Anulada`).
- [x] 1.2 Agregar en la misma migración la columna `motivo_rechazo` a `solicitud_reserva` y la columna `persona_dueno_id` (FK a `persona`) a `pension`, ambas con `ALTER TABLE`.
- [x] 1.3 Extender `src/db/seed.ts` con el dueño de demostración (`Rodrigo Pérez Soto`), asignándolo como `persona_dueno_id` de todas las pensiones de ejemplo.
- [x] 1.4 Verificar que `npm run db:seed` siga siendo idempotente: no duplica el dueño ni las solicitudes de ejemplo.

## 2. Dominio y servicios

- [x] 2.1 Agregar a `src/dominio/tipos.ts` los tipos `FichaReserva`, `EstadoFicha`, `ResolucionSolicitud` y `AlternativaPension`, y ampliar `SolicitudReserva` con `motivoRechazo`.
- [x] 2.2 Implementar `src/dominio/repositorio-resoluciones.ts`: listar solicitudes del dueño (pendientes y resueltas), obtener la solicitud con postulante, habitación y pensión, insertar la `FichaReserva`, actualizar estados y listar las alternativas del mismo sector.
- [x] 2.3 Implementar en `src/servicios/resoluciones.ts` las guardas de `EST-01`/`EST-02` (`solicitudInexistente`, `solicitudNoResoluble`, `plazoVencido`, `habitacionNoDisponible`, `motivoObligatorio`).
- [x] 2.4 Implementar `aprobarSolicitud` con la transacción que cambia la solicitud a `Aprobada`, bloquea la habitación en `Reservada` y emite la `FichaReserva`, y notifica al postulante con el código de reserva.
- [x] 2.5 Implementar `rechazarSolicitud` con la transacción que cambia la solicitud a `Rechazada` y registra el motivo, sin modificar la habitación, y notifica el rechazo con las alternativas.
- [x] 2.6 Implementar `expirarSolicitudesVencidas` (más de 48 h desde `fechaEnvio`) con la notificación de expiración al postulante.

## 3. Rutas y pantallas

- [x] 3.1 Crear `src/rutas/bandeja.ts` con `GET /bandeja` (expira vencidas y lista pendientes y resueltas) y `GET /bandeja/:codigo` (ficha de la solicitud con las acciones de resolver).
- [x] 3.2 Agregar `POST /bandeja/:codigo/aprobar` y `POST /bandeja/:codigo/rechazar` con validación, `303` a la bandeja y aviso del resultado por parámetro.
- [x] 3.3 Crear `src/vistas/bandeja.ejs` y `src/vistas/bandeja-detalle.ejs` en español, con el resumen del postulante (nombre, carrera, universidad, fechas, duración y mensaje), el motivo de rechazo obligatorio y los botones de resolución.
- [x] 3.4 Montar las rutas en `src/app.ts` conservando la inyección de `servicioPush` de HU-02.
- [x] 3.5 Agregar el enlace «Bandeja del dueño» en la cabecera del catálogo y revisar el estilo en `public/` para que las nuevas pantallas sigan la línea visual, sin romper el mapa ni los filtros de HU-01.

## 4. Pruebas de los escenarios Gherkin

- [x] 4.1 Crear `tests/resoluciones.test.ts` con base `:memory:`, migraciones aplicadas, `sembrarDatos` y un `ServicioPush` espía inyectado en `crearApp`.
- [x] 4.2 Escribir `HU-03 · Aprobación de postulación con cupo disponible`: verifica `303`, la solicitud `Aprobada`, la habitación `Reservada` y ausente del catálogo, la `FichaReserva` creada y la notificación al postulante con el código de reserva.
- [x] 4.3 Escribir `HU-03 · Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas`: verifica `303`, la solicitud `Rechazada` con `motivoRechazo`, la habitación `Disponible`, la notificación con el rechazo y el listado de alternativas.
- [x] 4.4 Agregar pruebas de las guardas: solicitud ya resuelta, solicitud fuera del plazo de 48 h, habitación no disponible y rechazo sin motivo, todas sin modificar estados ni notificar.
- [x] 4.5 Ejecutar `npm test` y confirmar que los escenarios de HU-01 y HU-02 siguen pasando junto con los nuevos.

## 5. Cierre de la historia

- [x] 5.1 Probar el recorrido manual con `npm run dev`: abrir la bandeja, revisar una solicitud, aprobarla y comprobar el bloqueo en el catálogo; abrir otra y rechazarla con motivo y alternativa.
- [x] 5.2 Verificar que el comando único del `README.md` siga siendo válido; no agregar comandos ni dependencias porque la historia no las introduce.
- [x] 5.3 Registrar en `.cin324/proyecto.md` la historia como implementada y pasar a la validación del sistema.
