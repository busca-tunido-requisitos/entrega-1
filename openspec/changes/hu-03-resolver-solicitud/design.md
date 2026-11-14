## Context

HU-01 dejó el catálogo con filtros y mapa; HU-02 dejó el formulario de postulación, el registro de la `SolicitudReserva` en estado `En revisión` y el adaptador `ServicioPush` simulado (`src/servicios/push.ts`). La base ya tiene `universidad`, `pension`, `habitacion`, `persona`, `solicitud_reserva` y `notificacion`, con migraciones numeradas en `src/db/migrations` y siembra idempotente en `src/db/seed.ts`.

HU-03 implementa `CU-03 — Resolver solicitud` (actor: Dueño de Pensión; actor externo: FCM simulado) con las actividades `ACT-TOBE-05`, `ACT-TOBE-06`, `ACT-TOBE-07`, `ACT-TOBE-08` y `ACT-TOBE-09`. El flujo sigue `DSS-01` (fragmento `alt` aprobación/rechazo) y las guardas salen de `EST-01` (solicitud) y `EST-02` (habitación). La ficha confirmada está en `.cin324/historias/HU-03.md`.

Restricciones: una historia por cambio, sin autenticación real (rol de demostración), sistemas externos simulados mediante adaptadores, e interfaz y artefactos en español.

## Goals / Non-Goals

**Goals:**
- Derivar de `DOM-01` la tabla `ficha_reserva`, el atributo `motivoRechazo` de `SolicitudReserva` y la asociación `administra Persona – Pension`.
- Implementar las transiciones de `EST-01` (En revisión → Aprobada / Rechazada / Expirada) y de `EST-02` (Disponible → Reservada) con sus guardas.
- Ofrecer la bandeja del dueño con el resumen del postulante y la pantalla de detalle con las dos acciones.
- Emitir la `FichaReserva` al aprobar y notificar al postulante con el código de reserva.
- Mantener la habitación `Disponible` al rechazar y notificar un listado curado de alternativas del mismo sector.
- Cubrir cada escenario Gherkin con una prueba de integración nombrada `HU-03 · <escenario>`.

**Non-Goals:**
- Ficha PDF, QR verificable, chat y registro de llegada (`HU-04`, `DSS-02`).
- Autenticación real, RBAC, FCM real y requisitos no funcionales `RP-09`/`RP-10`.
- Modificar los requisitos de la capacidad `catalogo-pensiones`: el bloqueo del cupo se refleja en el filtro de habitaciones `Disponible`, no en nuevas reglas del catálogo.
- Nuevas dependencias o comandos, por lo que no se modifica `README.md`.

## Decisions

### 1. Tablas derivadas del modelo de dominio

Migración `src/db/migrations/003_crear_resolucion_solicitud.sql`, aplicada automáticamente por `abrirBaseDeDatos`.

**`ficha_reserva`** — clase `FichaReserva` (asociación `genera`, `SolicitudReserva 1 – 0..1 FichaReserva`):

| Columna | Tipo | Restricción | Origen |
|---------|------|-------------|--------|
| `id` | INTEGER | PK AUTOINCREMENT | — |
| `solicitud_id` | INTEGER | NOT NULL UNIQUE REFERENCES `solicitud_reserva(id)` | FK en el lado 1 |
| `codigo_reserva` | TEXT | NOT NULL UNIQUE | `codigoReserva` |
| `fecha_emision` | TEXT | NOT NULL, ISO `YYYY-MM-DD HH:MM:SS` | `fechaEmision` |
| `codigo_qr_firmado` | TEXT | NOT NULL | `codigoQRFirmado` (simulado en esta historia) |
| `estado_ficha` | TEXT | NOT NULL DEFAULT 'Emitida', CHECK en (`Emitida`, `Anulada`) | `estadoFicha` |

**`solicitud_reserva`** — se agrega una columna con `ALTER TABLE`:

- `motivo_rechazo TEXT NULL` (supuesto 6: el motivo de incompatibilidad es obligatorio solo al rechazar).

**`pension`** — se agrega una columna con `ALTER TABLE`:

- `persona_dueno_id INTEGER NULL REFERENCES persona(id)`.

Materializa la asociación `administra Persona – Pension 1 a 0..*` (cada pensión tiene un arrendador responsable; una persona puede administrar varias). Es `NULL` porque el `seed` de HU-01 no definía dueños y las filas existentes no deben romperse.

### 2. Dueño de demostración

No hay login. `obtenerDuenoDemo(db)` devuelve el `Persona` referenciado por `pension.persona_dueno_id` con menor `id`. El `seed` crea un único arrendador de ejemplo:

- `nombre_completo`: `Rodrigo Pérez Soto`
- `correo_electronico`: `dueno@buscatunido.cl`
- `correo_institucional`: `rodrigo.perez@ejemplo.cl` (verificado)
- `universidad`: `Universidad de Valparaíso`

y lo asigna como `persona_dueno_id` de todas las pensiones de ejemplo, de modo que su bandeja muestra las postulaciones de todo el catálogo. El rol de «Dueño» no se modela con un atributo nuevo: se expresa con la asociación `administra`, como decide `08-modelo-dominio.md`.

### 3. Servicio de resolución

`src/servicios/resoluciones.ts` expone:

- `aprobarSolicitud(db, push, codigoSolicitud, ahora = new Date())` → `{ ok: true; solicitud; ficha } | { ok: false; errores; motivo }`.
- `rechazarSolicitud(db, push, codigoSolicitud, motivo, ahora = new Date())` → `{ ok: true; solicitud; alternativas } | { ok: false; errores; motivo }`.
- `expirarSolicitudesVencidas(db, push, ahora = new Date())` → marca `Expirada` las solicitudes en revisión con más de 48 h y notifica al postulante.

Guardas (de `EST-01` y `EST-02`):

- `solicitudInexistente`: el código no existe.
- `solicitudNoResoluble`: la solicitud no está en `En revisión` (ya fue aprobada, rechazada o expirada).
- `plazoVencido`: han pasado más de 48 h desde `fechaEnvio`.
- `habitacionNoDisponible`: la habitación ya no está `Disponible` (otra solicitud la bloqueó). Solo aplica a la aprobación.
- `motivoObligatorio`: el rechazo exige un motivo no vacío.

La aprobación se ejecuta en una transacción: actualizar la solicitud a `Aprobada`, actualizar la habitación a `Reservada` e insertar la `FichaReserva`. Solo si la transacción termina bien se envía la notificación push (fuera de la transacción, igual que en HU-02: si el push falla, la resolución queda registrada y el error se registra en consola).

El rechazo se ejecuta en una transacción: actualizar la solicitud a `Rechazada` con su `motivo_rechazo`. La habitación no se toca.

**Código de reserva:** `RES-<codigoSolicitud>` (por ejemplo `RES-SOL-2026-0001`), único y legible, para que el estudiante pueda dictarlo.

**Firma QR simulada:** `codigo_qr_firmado` se calcula como `QR-<codigoReserva>-<fechaEmision compacta>`; el sellado criptográfico real y el PDF son de HU-04.

**Alternativas (ACT-TOBE-08):** habitaciones `Disponible` distintas de la rechazada, en la misma comuna (sector) que la pensión original y con `precio_mensual` no mayor al de la habitación rechazada, ordenadas por precio ascendente y limitadas a 5. Se devuelven con el nombre de la pensión, la comuna, el identificador de la habitación y el precio mensual.

**Expiración diferida:** no hay tarea programada; `expirarSolicitudesVencidas` se ejecuta al abrir la bandeja. Es la forma más simple de evaluar la transición `after (48 h)` sin infraestructura adicional.

### 4. Rutas y vistas

`src/rutas/bandeja.ts`, montado en `crearApp(db, opciones)`:

| Método y ruta | Comportamiento |
|---------------|----------------|
| `GET /bandeja` | Expira las solicitudes vencidas y lista las pendientes del dueño con el resumen del postulante; muestra aparte las ya resueltas. `404` si no hay dueño de demostración configurado. |
| `GET /bandeja/:codigo` | Ficha de la solicitud: datos del postulante, habitación, pensión, fechas y mensaje; con los botones **Aprobar** y **Rechazar**. `404` si la solicitud no existe o no es del dueño. |
| `POST /bandeja/:codigo/aprobar` | Resuelve la aprobación con las guardas; `303` a la bandeja con el aviso de resultado. |
| `POST /bandeja/:codigo/rechazar` | Resuelve el rechazo exigiendo el motivo; `303` a la bandeja con el aviso de resultado. |

Se usa POST-Redirect-GET. Los resultados se comunican con un parámetro `?aviso=aprobada|rechazada|expirada|error`, porque el taller no usa sesiones.

`crearApp` mantiene el segundo parámetro `{ servicioPush }` introducido en HU-02, de modo que las pruebas de HU-01 y HU-02 siguen intactas.

**Catálogo:** la tarjeta de cada pensión sigue listando sus habitaciones; al quedar `Reservada`, la habitación desaparece del catálogo porque `listarPensionesConHabitacionesDisponibles` solo trae habitaciones `Disponible`. En la cabecera del catálogo se agrega el enlace **«Bandeja del dueño»** para llegar a la bandeja de demostración.

### 5. Pruebas

`tests/resoluciones.test.ts`, con base `:memory:`, migraciones aplicadas, `sembrarDatos` y un `ServicioPush` espía inyectado en `crearApp`:

1. `HU-03 · Aprobación de postulación con cupo disponible`: solicitud `En revisión` + habitación `Disponible` → `303`, solicitud `Aprobada`, habitación `Reservada`, una `FichaReserva` creada, una notificación al postulante con el código de reserva y el catálogo sin esa habitación.
2. `HU-03 · Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas`: rechazo con motivo → `303`, solicitud `Rechazada` con `motivoRechazo`, habitación sigue `Disponible`, notificación al postulante que incluye el rechazo y el listado de alternativas.
3. Guardas: aprobar una solicitud ya resuelta, aprobar fuera del plazo de 48 h, aprobar cuando la habitación no está disponible y rechazar sin motivo; en todos los casos no cambia ningún estado y no se envía notificación.

## Risks / Trade-offs

- **Aprobar dos veces la misma habitación** → la guarda `habitacionNoDisponible` y la transacción de SQLite serializan las decisiones; el segundo postulante recibe un error y la habitación no queda bloqueada dos veces.
- **Solicitud fuera de plazo** → la expiración diferida y la guarda `plazoVencido` cubren los dos caminos (la bandeja expira, la resolución rechaza).
- **El push falla tras resolver** → la resolución queda registrada y el error se informa al dueño; la notificación es simulada y puede reconstruirse.
- **Alternativas sin criterio de presupuesto explícito** → se usa el precio de la habitación rechazada como techo y la misma comuna como sector, criterio documentado en la ficha.
- **La expiración depende de que se abra la bandeja** → decisión consciente del taller: sin tareas programadas, el plazo se evalida al revisar la bandeja.
- **Dueño de demostración único** → no hay RBAC; el modelo `Persona` con la asociación `administra` permite más de un dueño si el `seed` creara más.

## Migration Plan

1. Agregar `003_crear_resolucion_solicitud.sql`; se aplica sola en el siguiente arranque y queda registrada en `schema_migrations`.
2. Ejecutar `npm run db:seed` para crear el dueño de demostración y una solicitud de ejemplo en revisión.
3. Verificar con `npm test` (los escenarios nuevos y los de HU-01 y HU-02) y `npm run dev` sobre `data/app.db`.
4. Reversión: eliminar la migración 003 y su fila en `schema_migrations`; como los datos son de ejemplo, también es válido borrar `data/app.db` y volver a sembrar.

## Open Questions

- Ninguna pendiente: motivo de rechazo, emisión de la ficha, criterio de alternativas, expiración y Dueño de demostración quedaron decididos en `.cin324/historias/HU-03.md`.
