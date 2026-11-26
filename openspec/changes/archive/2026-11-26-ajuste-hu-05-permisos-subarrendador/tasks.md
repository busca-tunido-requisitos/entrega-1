## 1. Base de datos y datos de ejemplo

- [x] 1.1 Ajustar `src/db/conexion.ts` para desactivar/reactivar `foreign_keys` de forma segura alrededor de las migraciones y validar `PRAGMA foreign_key_check`.
- [x] 1.2 Crear `src/db/migrations/005_crear_subarrendador.sql` ampliando `solicitud_reserva` con `acuerdo_subarriendo` y los estados `'Pendiente confirmación dueño'` y `'Confirmada por dueño'`, y agregando `persona_subarrendador_id` a `pension`.
- [x] 1.3 Extender `src/db/seed.ts` de forma idempotente con el subarrendador de demostración asignado a `Pensión Brasil`, sin afectar las demás pensiones.

## 2. Dominio y servicios

- [x] 2.1 Ampliar `src/dominio/tipos.ts` (`EstadoSolicitud`, `acuerdoSubarriendo` en `SolicitudReserva`, `personaSubarrendadorId` en `Pension`) y crear la ayuda compartida `estaSolicitudAprobada`.
- [x] 2.2 Actualizar `src/dominio/repositorio-solicitudes.ts` y `src/dominio/repositorio-resoluciones.ts` para leer/actualizar `acuerdo_subarriendo`, listar solicitudes por subarrendador, incluir `Pendiente confirmación dueño` en la bandeja del dueño y expirar ambos estados pendientes.
- [x] 2.3 Implementar en `src/servicios/resoluciones.ts` `preAprobarPorSubarrendador`, `rechazarPorSubarrendador` y las guardas de `EST-03` en `aprobarSolicitud` y `rechazarSolicitud` (impidiendo aprobación directa del dueño en pensiones con subarrendador).
- [x] 2.4 Actualizar `src/servicios/fichas.ts`, `src/rutas/fichas.ts`, `src/servicios/chat.ts` y `src/dominio/repositorio-chat.ts` para habilitar ficha/QR/chat en `Confirmada por dueño`, restringirlos en `Pendiente confirmación dueño` e incluir al subarrendador en los participantes del chat.

## 3. Rutas y pantallas

- [x] 3.1 Crear `src/rutas/subarriendo.ts` con `GET /subarriendo`, `GET /subarriendo/:codigo`, `POST /subarriendo/:codigo/pre-aprobar` y `POST /subarriendo/:codigo/rechazar`, y montarlo en `src/app.ts`.
- [x] 3.2 Crear `src/vistas/subarriendo.ejs` y `src/vistas/subarriendo-detalle.ejs` en español, y actualizar `src/vistas/bandeja.ejs`, `src/vistas/bandeja-detalle.ejs` y `src/vistas/catalogo.ejs` con el selector de rol demo («Bandeja del subarrendador») y etiquetas de `Pendiente confirmación dueño` / `Confirmada por dueño`.

## 4. Pruebas de escenarios Gherkin y cierre

- [x] 4.1 Crear `tests/subarriendo.test.ts` con pruebas para los 3 escenarios Gherkin de `HU-05` más transiciones inválidas (aprobación directa del dueño sin pre-aprobación y expiración).
- [x] 4.2 Ejecutar `npm test` verificando que pasan las pruebas nuevas y las 23 pruebas anteriores.
- [x] 4.3 Actualizar `README.md` (sección `HU-05` y trazabilidad) y `12-trazabilidad.md` enlazando `HU-05` con su código y pruebas.
