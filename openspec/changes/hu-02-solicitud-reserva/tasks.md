## 1. Base de datos y datos de ejemplo

- [ ] 1.1 Crear `src/db/migrations/002_crear_solicitud_reserva.sql` con la tabla `persona` (`correo_institucional_verificado` con CHECK 0/1) y la tabla `solicitud_reserva` (`codigo_solicitud` UNIQUE, FK a `persona` y `habitacion`, `duracion_estadia_meses` CHECK 1–12, `estado` CHECK en los cuatro estados de EST-01).
- [ ] 1.2 Agregar en la misma migración la tabla `notificacion` (FK a `solicitud_reserva` con `ON DELETE CASCADE`, `leida` CHECK 0/1) y los índices por `persona_id`, `habitacion_id`, `estado` y `solicitud_id`.
- [ ] 1.3 Agregar `fecha_inicio_admision` y `fecha_fin_admision` a `habitacion` con `ALTER TABLE`, `NOT NULL` y valor por defecto, para no romper las filas existentes.
- [ ] 1.4 Extender `src/db/seed.ts` con el cálculo del semestre vigente, los rangos de admisión de todas las habitaciones de ejemplo y el perfil demo verificado (`Camila Rojas Fuentes`, `camila.rojas@uv.cl`, Universidad de Valparaíso), en una carga idempotente.
- [ ] 1.5 Verificar que `npm run db:seed` corra dos veces sin duplicar el perfil ni cambiar los códigos de habitación, y que las filas preexistentes de `habitacion` reciban el rango del semestre.

## 2. Dominio y servicios

- [ ] 2.1 Agregar a `src/dominio/tipos.ts` `Persona`, `EstadoSolicitud`, `SolicitudReserva` y `Notificacion`, y ampliar `Habitacion` con `fechaInicioAdmision` y `fechaFinAdmision`.
- [ ] 2.2 Ampliar `PensionEnCatalogo` con las habitaciones disponibles del rango (`id`, `identificadorHabitacion`, `precioMensual`, `tipoCama`, `tieneBanoPrivado`) y ajustar `buscarEnCatalogo` para poblarlas.
- [ ] 2.3 Implementar `src/dominio/repositorio-solicitudes.ts`: buscar habitación con su pensión, obtener el perfil demo verificado, insertar la solicitud con código `SOL-<año>-<secuencial>`, buscar por código y listar notificaciones por solicitud.
- [ ] 2.4 Implementar `normalizarDatosSolicitud` y `validarSolicitud` en `src/servicios/solicitudes.ts` con las guardas: campos obligatorios, duración entera 1–12, fecha dentro de `[fechaInicioAdmision, fechaFinAdmision]`, perfil verificado y habitación `Disponible`.
- [ ] 2.5 Implementar `enviarSolicitud(db, push, datos, ahora)`: transacción de inserción con reintento único ante código duplicado, estado `En revisión` y push posterior al commit sin revertir la solicitud.
- [ ] 2.6 Implementar `calcularPlazoRespuesta` y `formatearFechaHora` para mostrar el plazo de 48 horas y las fechas válidas en formato `dd/mm/aaaa`.
- [ ] 2.7 Implementar `src/servicios/push.ts` con la interfaz `ServicioPush`, `MensajePush` y `ServicioPushSqlite`, que registra la notificación con el destinatario derivado del nombre de la pensión.

## 3. Rutas y pantallas

- [ ] 3.1 Crear `src/rutas/solicitudes.ts` con `GET /solicitudes/nueva` (formulario con pensión, habitación, perfil demo, fechas válidas y fecha inicial de hoy; `404` si no existe y `409` si no está `Disponible`).
- [ ] 3.2 Agregar `POST /solicitudes` con validación, `422` re-renderizando el formulario con errores y valores ingresados, y `303` a `/solicitudes/:codigo` cuando la postulación se registra.
- [ ] 3.3 Agregar `GET /solicitudes/:codigo` con la confirmación: código, estado `En revisión`, datos de la habitación y pensión, y plazo máximo de 48 horas.
- [ ] 3.4 Montar las rutas en `src/app.ts` y permitir inyectar `servicioPush` en `crearApp(db, opciones)` con `ServicioPushSqlite` como valor por defecto.
- [ ] 3.5 Crear `src/vistas/solicitud-formulario.ejs` y `src/vistas/solicitud-confirmacion.ejs` en español, con insignia de correo verificado, mensajes de error por campo, fechas válidas y sin dependencias de JavaScript.
- [ ] 3.6 Modificar `src/vistas/parciales/lista.ejs` para listar cada habitación disponible de la tarjeta con su identificador, precio, cama y baño, y un botón «Solicitar reserva» por habitación.
- [ ] 3.7 Revisar el estilo en `public/` para que el formulario, la confirmación y la lista de habitaciones sigan la línea visual del catálogo, sin romper el mapa ni los filtros de HU-01.

## 4. Pruebas de los escenarios Gherkin

- [ ] 4.1 Crear `tests/solicitudes.test.ts` con base `:memory:`, migraciones aplicadas, `sembrarDatos` y un `ServicioPush` espía inyectado en `crearApp`.
- [ ] 4.2 Escribir `HU-02 · Envío exitoso de solicitud formal con antecedentes completos`: verifica `303`, la solicitud en `En revisión` con código único y `fechaEnvio`, exactamente una notificación al dueño y la confirmación con el plazo de 48 horas.
- [ ] 4.3 Escribir `HU-02 · Intento de postulación con fecha de ingreso fuera del periodo lectivo`: acota el rango de admisión de la habitación de prueba, envía una fecha posterior y verifica `422`, cero solicitudes nuevas, cero notificaciones y el mensaje con las fechas válidas.
- [ ] 4.4 Agregar pruebas de las guardas restantes: campos obligatorios vacíos, duración fuera de 1–12, perfil sin correo verificado y habitación ya no `Disponible`, todas sin registrar solicitud ni notificación.
- [ ] 4.5 Ejecutar `npm test` y confirmar que los escenarios de HU-01 siguen pasando junto con los nuevos.

## 5. Cierre de la historia

- [ ] 5.1 Probar el recorrido manual con `npm run dev`: catálogo → «Solicitar reserva» → formulario → confirmación, y verificar el registro en `data/app.db` y en la tabla `notificacion`.
- [ ] 5.2 Verificar que el comando único del `README.md` siga siendo válido; no agregar comandos ni dependencias porque la historia no las introduce.
- [ ] 5.3 Registrar en `.cin324/proyecto.md` la historia como implementada y pasar a la validación del sistema.
