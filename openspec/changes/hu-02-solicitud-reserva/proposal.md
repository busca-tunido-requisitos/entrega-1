## Why

El estudiante foráneo ya puede encontrar pensiones con el catálogo de HU-01, pero todavía no puede postular a una habitación sin llamar por teléfono. HU-02 sustituye esa llamada exploratoria (`ACT-AS-02`) por una solicitud formal digital que llega al dueño con una notificación push, de modo que la postulación quede registrada y el estudiante conozca el plazo de respuesta.

## What Changes

- Nueva pantalla de solicitud de reserva accesible desde cada habitación `Disponible` del catálogo, con un botón **«Solicitar reserva»** por habitación.
- Formulario con fecha de ingreso, duración estimada en meses (1–12) y mensaje de presentación; los tres campos son obligatorios.
- Perfil de estudiante de demostración con `correoInstitucionalVerificado`; la postulación exige ese perfil y una insignia lo muestra en la pantalla.
- Validación de la fecha de ingreso contra el rango `fechaInicioAdmision`–`fechaFinAdmision` de la habitación y de que la habitación siga `Disponible`.
- Registro de la `SolicitudReserva` con código único, `fechaEnvio` y estado **`En revisión`**.
- Notificación push simulada al dueño mediante un adaptador `ServicioPush`; la notificación queda almacenada en SQLite.
- Confirmación al estudiante con el código de solicitud y el plazo máximo de **48 horas** calculado desde `fechaEnvio`.
- Datos de ejemplo: perfil de estudiante verificado y fechas de admisión para todas las habitaciones.

## Capabilities

### New Capabilities
- `solicitud-reserva`: postulación formal de un estudiante a una habitación disponible, con validación de perfil y fechas, registro en estado `En revisión`, notificación simulada al dueño y confirmación con plazo de respuesta.

### Modified Capabilities
- Ninguna. `catalogo-pensiones` no cambia sus requisitos; el botón «Solicitar reserva» es un punto de entrada desde la interfaz existente.

## Impact

- **Código nuevo:** ruta `GET/POST /solicitudes/nueva`, servicio de postulación, repositorio de `Persona` y `SolicitudReserva`, adaptador `ServicioPush` simulado, vistas EJS del formulario y la confirmación, y el botón por habitación en la tarjeta del catálogo.
- **Base de datos:** migración `002_crear_solicitud_reserva.sql` con las tablas `persona` y `solicitud_reserva`, las columnas `fecha_inicio_admision` y `fecha_fin_admision` en `habitacion`, y la tabla de notificaciones simuladas. El `seed` agrega el perfil demo y los rangos de admisión.
- **Pruebas:** una prueba de integración por cada escenario Gherkin de HU-02.
- **Dependencias:** ninguna nueva; se reutilizan Express, EJS, better-sqlite3 y Vitest.
- **Fuera del alcance:** aprobación o rechazo y bloqueo del cupo (HU-03); ficha PDF con QR y chat (HU-04); autenticación real, FCM real, gestión completa del perfil y requisitos no funcionales `RP-09` y `RP-10`.
