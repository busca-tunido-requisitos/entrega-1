## Why

HU-02 ya deja la postulación del estudiante registrada y notificada, pero la solicitud queda detenida en «En revisión»: el dueño no tiene dónde revisarla ni cómo resolverla, y el cupo nunca se bloquea. En el proceso AS-IS esa resolución era un cuaderno manual y un acuerdo verbal (`ACT-AS-03`, `ACT-AS-04` y `ACT-AS-05`), con visitas a ciegas y sin trazabilidad. HU-03 lleva la resolución al móvil: el dueño revisa la ficha del postulante y aprueba o rechaza con un toque, el catálogo refleja de inmediato el cupo bloqueado y el estudiante recibe la confirmación o el rechazo con alternativas.

## What Changes

- Nueva **bandeja de postulaciones del dueño** (`/bandeja`) con el resumen de cada solicitud pendiente: nombre, carrera, universidad, fechas de ingreso, duración y mensaje de presentación (CA1).
- Pantalla de detalle por solicitud con las dos acciones de resolución: **Aprobar** y **Rechazar** (con motivo de incompatibilidad obligatorio).
- Al **aprobar**: la solicitud pasa a `Aprobada`, la habitación pasa a `Reservada` y deja de ofrecerse en el catálogo, se emite la `FichaReserva` con su código de reserva y se despacha la notificación push de confirmación al estudiante (CA2).
- Al **rechazar**: la solicitud pasa a `Rechazada` con su `motivoRechazo`, la habitación sigue `Disponible` para otros postulantes y se despacha al estudiante la notificación de rechazo con un listado curado de pensiones similares en el mismo sector (CA2).
- Las solicitudes en revisión con más de 48 h desde `fechaEnvio` se marcan `Expirada` al abrir la bandeja, según la transición de `EST-01`.
- Datos de ejemplo: un `Persona` con rol de arrendador que administra las pensiones de ejemplo. Las postulaciones de prueba se crean desde el catálogo («Solicitar reserva»), de modo que la bandeja refleje el flujo real.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `solicitud-reserva`: se amplía con los requisitos de resolución de la postulación (aprobación con bloqueo de cupo y emisión de ficha, rechazo con motivo y alternativas, y expiración por el plazo de 48 h).

## Impact

- **Código nuevo:** rutas `GET /bandeja`, `GET /bandeja/:codigo`, `POST /bandeja/:codigo/aprobar` y `POST /bandeja/:codigo/rechazar`; servicio de resolución con las guardas de `EST-01` y `EST-02`; repositorio de bandeja, ficha y alternativas; vistas EJS de bandeja y detalle.
- **Base de datos:** migración `003_crear_resolucion_solicitud.sql` con la tabla `ficha_reserva`, la columna `motivo_rechazo` en `solicitud_reserva` y la columna `persona_dueno_id` en `pension` (asociación `administra` de DOM-01). El `seed` agrega el dueño de demostración y una solicitud de ejemplo en revisión.
- **Pruebas:** una prueba de integración por cada escenario Gherkin de HU-03, más las guardas (solicitud ya resuelta, fuera del plazo de 48 h, habitación no disponible y rechazo sin motivo).
- **Dependencias:** ninguna nueva; se reutilizan Express, EJS, better-sqlite3, Vitest y el adaptador `ServicioPush` de HU-02.
- **Fuera del alcance:** ficha PDF con QR verificable, chat de coordinación y registro de llegada (HU-04); autenticación real, control de acceso por roles, FCM real y requisitos no funcionales `RP-09` y `RP-10`.
