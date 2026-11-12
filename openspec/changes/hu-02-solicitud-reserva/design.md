## Context

HU-01 dejó el catálogo de pensiones con filtros, mapa y orden por cercanía (`src/rutas/catalogo.ts`, `src/servicios/catalogo.ts`, `src/dominio/repositorio-catalogo.ts`). La base SQLite ya tiene `universidad`, `pension` y `habitacion`, con migraciones numeradas en `src/db/migrations` y siembra idempotente en `src/db/seed.ts`.

HU-02 reemplaza la llamada telefónica del AS-IS (`ACT-AS-02`) por una postulación digital: `ACT-TOBE-03 — Enviar solicitud de reserva` (tarea de usuario) y `ACT-TOBE-04 — Generar notificación push de solicitud` (tarea de servicio), correspondientes a `CU-02 — Solicitar reserva`. No hay DSS para `CU-02`; el flujo se reconstruyó desde el Gherkin y el BPMN TO-BE y quedó confirmado en `.cin324/historias/HU-02.md`.

Restricciones: una historia por cambio, sin autenticación real (perfil demo), sistemas externos simulados mediante adaptadores, e interfaz y artefactos en español. La aplicación es síncrona con Express + EJS; no hay cliente JavaScript propio más allá del mapa de HU-01.

## Goals / Non-Goals

**Goals:**
- Derivar de `DOM-01` las tablas `persona` y `solicitud_reserva`, y ampliar `habitacion` con `fechaInicioAdmision` y `fechaFinAdmision`.
- Implementar el envío de la postulación con las guardas de `EST-01`: habitación `Disponible`, fecha dentro del período de admisión, perfil con correo institucional verificado y campos obligatorios.
- Registrar la `SolicitudReserva` en estado `En revisión` sin tocar el estado de la `Habitacion`.
- Simular `ACT-TOBE-04` mediante un adaptador `ServicioPush` que persiste la notificación en SQLite.
- Confirmar al estudiante el código de solicitud y el plazo de 48 horas calculado desde `fechaEnvio`.
- Cubrir cada escenario Gherkin con una prueba de integración nombrada `HU-02 · <escenario>`.

**Non-Goals:**
- Aprobación, rechazo, expiración y bloqueo del cupo (`HU-03`, `EST-01`/`EST-02` desde `En revisión`).
- Ficha PDF con QR y chat de coordinación (`HU-04`).
- Autenticación real, registro de usuarios, FCM real y requisitos no funcionales `RP-09`/`RP-10`.
- Cambios en la capacidad `catalogo-pensiones` o en la navegación existente más allá del botón por habitación.
- Nuevas dependencias o comandos, por lo que no se modifica `README.md`.

## Decisions

### 1. Tablas derivadas del modelo de dominio

Migración `src/db/migrations/002_crear_solicitud_reserva.sql`, aplicada automáticamente por `abrirBaseDeDatos`.

**`persona`** — clase `Persona` (rol estudiante):

| Columna | Tipo | Restricción | Origen |
|---------|------|-------------|--------|
| `id` | INTEGER | PK AUTOINCREMENT | — |
| `nombre_completo` | TEXT | NOT NULL | `nombreCompleto` |
| `correo_electronico` | TEXT | NOT NULL | `correoElectronico` |
| `telefono` | TEXT | NULL | `telefono` |
| `correo_institucional` | TEXT | NOT NULL | `correoInstitucional` |
| `correo_institucional_verificado` | INTEGER | NOT NULL DEFAULT 0, CHECK (0,1) | `correoInstitucionalVerificado` (nuevo, confirmado) |
| `universidad` | TEXT | NULL | `universidad` |
| `carrera` | TEXT | NULL | `carrera` |

**`solicitud_reserva`** — clase `SolicitudReserva`:

| Columna | Tipo | Restricción | Origen |
|---------|------|-------------|--------|
| `id` | INTEGER | PK AUTOINCREMENT | — |
| `codigo_solicitud` | TEXT | NOT NULL UNIQUE | `codigoSolicitud` |
| `persona_id` | INTEGER | NOT NULL REFERENCES `persona(id)` | asociación `Persona 1 – 0..* SolicitudReserva` (FK en el lado muchos) |
| `habitacion_id` | INTEGER | NOT NULL REFERENCES `habitacion(id)` | asociación `SolicitudReserva 0..* – 1 Habitacion` |
| `fecha_llegada_estimada` | TEXT | NOT NULL, ISO `YYYY-MM-DD` | `fechaLlegadaEstimada` |
| `duracion_estadia_meses` | INTEGER | NOT NULL, CHECK 1–12 | `duracionEstadiaMeses` |
| `mensaje_presentacion` | TEXT | NOT NULL | `mensajePresentacion` |
| `fecha_envio` | TEXT | NOT NULL, ISO `YYYY-MM-DD HH:MM:SS` | `fechaEnvio` |
| `estado` | TEXT | NOT NULL DEFAULT 'En revisión', CHECK en (`En revisión`, `Aprobada`, `Rechazada`, `Expirada`) | `estado` según `EST-01` |

Sin `ON DELETE CASCADE`: la solicitud es un registro histórico y no composición.

**`habitacion`** — se agregan dos columnas con `ALTER TABLE`:

- `fecha_inicio_admision TEXT NOT NULL DEFAULT '2026-01-01'`
- `fecha_fin_admision TEXT NOT NULL DEFAULT '2026-12-31'`

El `DEFAULT` existe solo para satisfacer `NOT NULL` en filas ya existentes; `sembrarDatos` sobrescribe ambos valores en cada habitación de ejemplo con el semestre vigente calculado al momento de sembrar. La tabla no se reconstruye: los datos son de ejemplo y `ALTER TABLE ADD COLUMN` es más simple y reversible.

**`notificacion`** — tabla de infraestructura, no clase del dominio. Materializa el `ServicioPush` simulado:

| Columna | Tipo | Restricción |
|---------|------|-------------|
| `id` | INTEGER | PK AUTOINCREMENT |
| `solicitud_id` | INTEGER | NOT NULL REFERENCES `solicitud_reserva(id)` ON DELETE CASCADE |
| `destinatario` | TEXT | NOT NULL |
| `titulo` | TEXT | NOT NULL |
| `cuerpo` | TEXT | NOT NULL |
| `creada_en` | TEXT | NOT NULL DEFAULT `datetime('now')` |
| `leida` | INTEGER | NOT NULL DEFAULT 0, CHECK (0,1) |

*Alternativa descartada:* guardar la notificación solo en memoria o en un archivo, porque `HU-03` necesita consumirla desde la bandeja del dueño.

### 2. Perfil de estudiante de demostración

No hay login. `obtenerEstudianteDemo(db)` devuelve la `Persona` con `correo_institucional_verificado = 1` de menor `id`. El `seed` inserta un perfil fijo y verificable:

- `nombre_completo`: `Camila Rojas Fuentes`
- `correo_institucional`: `camila.rojas@uv.cl`
- `universidad`: `Universidad de Valparaíso`
- `carrera`: `Ingeniería Civil Informática`
- `correo_institucional_verificado`: `1`

La pantalla del formulario muestra una insignia «Correo institucional verificado» y los datos del postulante. La variante «perfil sin verificar» se valida en el servicio (no se agrega un selector de rol en esta historia).

### 3. Fechas de admisión sembradas por semestre

`sembrarDatos` calcula el semestre en curso a partir de la fecha local del servidor: enero–junio → `01-01` a `07-15`; julio–diciembre → `07-16` a `12-31`. Así la demostración sigue siendo usable en cualquier fecha y la habitación sigue representando «arriendos exclusivamente para el semestre académico en curso».

Las comparaciones de fechas se hacen como cadenas ISO (`YYYY-MM-DD`), que ordenan lexicográficamente igual que cronológicamente. Se evita `Date` para no arrastrar zonas horarias.

### 4. Validación en un servicio puro y envío transaccional

`src/servicios/solicitudes.ts` expone:

- `normalizarDatosSolicitud(cuerpo)` → `{ fechaLlegada, duracionMeses, mensaje }`, convirtiendo y recortando lo recibido.
- `validarSolicitud({ datos, habitacion, persona, hoy })` → `{ valido: boolean; errores: Record<string, string> }` con las guardas de `EST-01`:
  - `camposObligatorios`: los tres campos presentes.
  - `duracionInvalida`: entero entre 1 y 12.
  - `fechaExtemporanea`: `fechaLlegada` fuera de `[fechaInicioAdmision, fechaFinAdmision]`.
  - `perfilSinVerificar`: `correoInstitucionalVerificado` falso.
  - `habitacionNoDisponible`: `estadoDisponibilidad !== 'Disponible'`.
- `enviarSolicitud(db, push, datos, ahora = new Date())` → `{ ok: true; solicitud } | { ok: false; errores; habitacion }`.

El insert ocurre dentro de una transacción de `better-sqlite3` que también registra la notificación. Si el insert falla por `codigo_solicitud` duplicado (`SQLITE_CONSTRAINT_UNIQUE`), se reintenta una vez recalculando el código. La notificación se envía con `await push.enviar(...)` después del `commit`; si el push falla, la solicitud ya está registrada y el error se registra en consola sin revertir, porque el requisito es la postulación y la notificación es simulada.

**Código de solicitud:** `SOL-<año de fechaEnvio>-<secuencial de 4 dígitos>`, con el secuencial calculado como `MAX(id)` de las solicitudes del mismo año + 1 dentro de la transacción. Se descartó UUID porque el estudiante debe dictarlo o buscarlo después.

**Plazo de respuesta:** `calcularPlazoRespuesta(fechaEnvio) = fechaEnvio + 48 h`, formateado `dd/mm/aaaa hh:mm` con `formatearFechaHora` en `src/dominio/formato.ts`. No se persiste: se deriva de `fecha_envio`, tal como se confirmó en la ficha.

### 5. Rutas, vistas y punto de entrada

`src/rutas/solicitudes.ts`, montado en `crearApp(db, opciones)`:

| Método y ruta | Comportamiento |
|---------------|----------------|
| `GET /solicitudes/nueva?habitacionId=:id` | Carga habitación, pensión y perfil demo. Si la habitación no existe o no está `Disponible`, responde `404`/`409` con vista de aviso. Renderiza el formulario con las fechas válidas y la fecha de hoy como valor inicial. |
| `POST /solicitudes` | Normaliza y valida. Si hay errores, responde `422` re-renderizando el formulario con los mensajes y lo ingresado. Si es válido, crea la solicitud y redirige `303` a `/solicitudes/:codigo`. |
| `GET /solicitudes/:codigo` | Muestra la confirmación: código, habitación, pensión, estado `En revisión` y plazo máximo de 48 h. `404` si el código no existe. |

Se usa patrón POST-Redirect-GET para que recargar no duplique postulaciones.

`crearApp` recibe un segundo parámetro opcional `{ servicioPush }` para inyectar un doble de prueba; por defecto construye `ServicioPushSqlite(db)`. Esto mantiene las pruebas de HU-01 intactas.

**Vista del catálogo:** `src/vistas/parciales/lista.ejs` agrega, dentro de cada tarjeta, la lista de habitaciones disponibles con identificador, precio, tipo de cama, baño privado y un botón **«Solicitar reserva»** que enlaza a `GET /solicitudes/nueva?habitacionId=<id>`. Para ello `PensionEnCatalogo` incorpora `habitaciones` con `id`, `identificadorHabitacion`, `precioMensual`, `tipoCama` y `tieneBanoPrivado` ya filtradas por rango de precio y estado. El mapa y el orden no cambian.

### 6. `ServicioPush` simulado

`src/servicios/push.ts`:

```ts
export interface MensajePush {
  solicitudId: number;
  destinatario: string;
  titulo: string;
  cuerpo: string;
}

export interface ServicioPush {
  enviar(mensaje: MensajePush): Promise<void>;
}
```

`ServicioPushSqlite` inserta en `notificacion`. El destinatario es el dueño de la pensión; como `Pension` no tiene correo en el modelo, se usa `dueno@<slug de la pensión>.cl` generado por el adaptador y se declara como supuesto. HU-03 leerá esta tabla en la bandeja del dueño.

*Alternativa descartada:* integrar `firebase-admin`, porque requiere credenciales reales, una dependencia nueva y no aporta al objetivo de la historia.

### 7. Pruebas

`tests/solicitudes.test.ts`, con base `:memory:`, migraciones aplicadas y `sembrarDatos`, más un `ServicioPush` espía inyectado en `crearApp`:

1. `HU-02 · Envío exitoso de solicitud formal con antecedentes completos`: `POST /solicitudes` con una habitación `Disponible` y fecha dentro del rango → `303`, una fila en `solicitud_reserva` con estado `En revisión`, una notificación con `solicitud_id` y la confirmación mostrando «48 horas».
2. `HU-02 · Intento de postulación con fecha de ingreso fuera del periodo lectivo`: rango de admisión acotado en la habitación de prueba y `POST` con fecha posterior → `422`, cero solicitudes nuevas, cero notificaciones y el texto con las fechas válidas.

`tests/catalogo.test.ts` se mantiene sin cambios; el nuevo botón no altera los filtros.

## Risks / Trade-offs

- **Doble postulación por doble clic** → POST-Redirect-GET y `codigo_solicitud` UNIQUE con reintento único.
- **Colisión del secuencial** → cálculo dentro de la transacción de escritura de SQLite (serializada) y restricción UNIQUE como red de seguridad.
- **`ALTER TABLE` con fechas por defecto ficticias** → el `seed` sobrescribe todas las habitaciones de ejemplo; una base nueva recibe el semestre vigente. Si el estudiante ya tenía datos propios, conservan el rango por defecto hasta que los edite (fuera de alcance).
- **Zonas horarias al calcular «hoy» y las 48 h** → fechas de admisión como cadenas ISO; `fecha_envio` en hora local del servidor y plazo derivado por suma de milisegundos. Documentado como supuesto del taller.
- **El push falla después del commit** → la solicitud queda registrada y se informa al estudiante; la notificación es simulada y HU-03 puede reconstruirla. Se registra el error en consola.
- **La pensión no tiene correo de dueño en el modelo** → el adaptador genera `dueno@<slug>.cl` como supuesto explícito; no se agrega un atributo no modelado.
- **Pruebas dependientes del reloj** → los casos fijan `fechaEnvio`/`hoy` mediante el parámetro `ahora` del servicio y fechas de admisión explícitas en la fila de prueba.

## Migration Plan

1. Agregar `002_crear_solicitud_reserva.sql`; se aplica sola en el siguiente arranque y queda registrada en `schema_migrations`.
2. Ejecutar `npm run db:seed` para cargar el perfil demo y el rango de admisión de las habitaciones.
3. Verificar con `npm test` (los 2 escenarios nuevos y los de HU-01) y `npm run dev` sobre `data/app.db`.
4. Reversión: restaurar una copia de `data/app.db`, eliminar la migración 002 y su fila en `schema_migrations`. Como los datos son de ejemplo, también es válido borrar `data/app.db` y volver a sembrar.

## Open Questions

- Ninguna pendiente: código de solicitud, perfil demo, fechas de admisión, plazo de 48 h y simulación del push quedaron confirmados en `.cin324/historias/HU-02.md`.
