## Context

El sistema ya implementa `HU-01` (catálogo), `HU-02` (solicitud formal en `En revisión` + `ServicioPush`), `HU-03` (bandeja del dueño con `EST-01`/`EST-02` y `FichaReserva`) y `HU-04` (PDF con QR Ed25519 y chat persistente).

`HU-05 — Permisos de subarrendador` (`RP-11`, `CU-06`, `CU-03`, `DSS-03`, `EST-03`) incorpora un flujo de doble aprobación para pensiones que cuenten con un subarrendador autorizado (`Persona 0..1 – 0..* Pension`, asociación `subarrienda`). La ficha confirmada vive en `.cin324/historias/HU-05.md`.

## Goals / Non-Goals

**Goals:**
- Materializar en SQLite la asociación `subarrienda` (`pension.persona_subarrendador_id`), el atributo `SolicitudReserva.acuerdoSubarriendo` (`solicitud_reserva.acuerdo_subarriendo`) y los estados de `EST-03` (`Pendiente confirmación dueño`, `Confirmada por dueño`).
- Mantener 100% intacto el flujo directo `EST-01` de `HU-03` cuando la pensión no tiene subarrendador (`persona_subarrendador_id IS NULL`), preservando las 23 pruebas de regresión existentes.
- Implementar la bandeja del subarrendador (`/subarriendo`, `CU-06`) y adaptar la bandeja del dueño (`/bandeja`, `CU-03`) según `DSS-03` y las guardas de `EST-03`.
- Reemplazar la comprobación aislada de `estado === 'Aprobada'` en ficha PDF, check-in y chat por una ayuda compartida (`estaAprobada`) que incluya `Confirmada por dueño` y rechace `Pendiente confirmación dueño`.
- Cubrir los 3 escenarios Gherkin de `HU-05` y transiciones inválidas en `tests/subarriendo.test.ts`.

**Non-Goals:**
- Autenticación real, gestión de permisos desde UI ni asignación dinámica de subarrendadores.
- Notificaciones push reales vía FCM (se continúa usando `ServicioPushSqlite`).
- Requisitos no funcionales `RP-09` y `RP-10`.

## Decisions

### 1. Migración SQLite (`005_crear_subarrendador.sql`)
Como SQLite no permite modificar un `CHECK` existente mediante `ALTER TABLE`, la migración reconstruirá `solicitud_reserva` usando `PRAGMA legacy_alter_table = ON` y desactivando temporalmente `foreign_keys` en `aplicarMigraciones` (`src/db/conexion.ts`, reactivándolas y ejecutando `PRAGMA foreign_key_check` al salir):
- `solicitud_reserva`: mantiene sus columnas previas, agrega `acuerdo_subarriendo INTEGER CHECK (acuerdo_subarriendo IN (0, 1))` y amplía `estado` a `CHECK (estado IN ('En revisión', 'Pendiente confirmación dueño', 'Aprobada', 'Confirmada por dueño', 'Rechazada', 'Expirada'))`.
- `pension`: `ALTER TABLE pension ADD COLUMN persona_subarrendador_id INTEGER REFERENCES persona(id)`.

### 2. Perfil subarrendador de demostración (`src/db/seed.ts`)
- Se siembra el perfil demo **Matías Herrera Vidal** (`subarrendador@buscatunido.cl`, `matias.herrera@alumnos.uv.cl`) y se asigna como `persona_subarrendador_id` únicamente en **`Pensión Brasil`** (dejando las demás pensiones sin subarrendador para no alterar los escenarios de `HU-03` y `HU-04`).

### 3. Reglas de transición y guardas (`src/servicios/resoluciones.ts`)
Se implementa una única función central de validación de transiciones (`aplicarTransicionSolicitud`) junto con operaciones dedicadas por actor:
- `preAprobarPorSubarrendador(db, push, codigoSolicitud, ahora)`: exige pensión con subarrendador, `estado === 'En revisión'`, `< 48 h` desde `fechaEnvio` y habitación `Disponible`. Registra `acuerdo_subarriendo = 1` y pasa `estado` a `'Pendiente confirmación dueño'`, manteniendo la habitación `Disponible` y notificando al dueño vía `ServicioPush`.
- `rechazarPorSubarrendador(db, push, codigoSolicitud, motivo, ahora)`: exige pensión con subarrendador, `estado === 'En revisión'`, `< 48 h` y motivo no vacío. Registra `acuerdo_subarriendo = 0`, `estado = 'Rechazada'`, notifica al dueño la decisión y al estudiante con alternativas del sector.
- `aprobarSolicitud` (dueño):
  - Si la pensión tiene subarrendador y la solicitud está en `'En revisión'`, rechaza la operación indicando que falta la pre-aprobación del subarrendador.
  - Si la pensión tiene subarrendador y la solicitud está en `'Pendiente confirmación dueño'` (con `acuerdoSubarriendo === true`, `< 48 h` y habitación `Disponible`), pasa la solicitud a `'Confirmada por dueño'`, bloquea la habitación en `'Reservada'`, emite `FichaReserva` y notifica al estudiante.
  - Si la pensión no tiene subarrendador, conserva el comportamiento de `HU-03` (`'En revisión'` → `'Aprobada'`).
- `rechazarSolicitud` (dueño): permite rechazar `'Pendiente confirmación dueño'` (en pensión con subarrendador) o `'En revisión'` (en pensión sin subarrendador), pasando a `'Rechazada'`, manteniendo la habitación `'Disponible'` y enviando alternativas al estudiante.
- `expirarSolicitudesVencidas`: expira solicitudes vencidas (`> 48 h`) tanto en `'En revisión'` como en `'Pendiente confirmación dueño'`.
- `estaSolicitudAprobada(estado)`: devuelve `true` para `'Aprobada'` y `'Confirmada por dueño'`; se usa en `src/rutas/fichas.ts`, `src/servicios/fichas.ts` y `src/servicios/chat.ts`. Cuando el estado es `'Pendiente confirmación dueño'`, el aviso de ficha/chat informa explícitamente que falta la confirmación final del dueño.

### 4. Rutas, vistas y selector de rol de demostración
- `src/rutas/subarriendo.ts`:
  - `GET /subarriendo`: lista solicitudes pendientes (`En revisión`) y ya evaluadas de las pensiones con `persona_subarrendador_id` del subarrendador demo.
  - `GET /subarriendo/:codigo`: detalle de la postulación con botones **Pre-aprobar** y **Rechazar** (motivo obligatorio).
  - `POST /subarriendo/:codigo/pre-aprobar` y `POST /subarriendo/:codigo/rechazar`: ejecutan el servicio y redirigen `303` a `/subarriendo?aviso=...`.
- Vistas: `src/vistas/subarriendo.ejs` y `src/vistas/subarriendo-detalle.ejs`, y enlace **«Bandeja del subarrendador»** en la cabecera de `catalogo.ejs` y `bandeja.ejs` (selector de rol de demostración sin login).
- `src/dominio/repositorio-chat.ts`: incluye al subarrendador como participante autorizado si la pensión tiene `persona_subarrendador_id`.

### 5. Pruebas (`tests/subarriendo.test.ts`)
- `HU-05 · Doble aprobación exitosa por subarrendador y dueño`
- `HU-05 · Rechazo de postulación por el subarrendador o por el dueño`
- `HU-05 · Restricción de ficha y chat mientras falta confirmación del dueño`
- Pruebas de transición inválida: dueño intenta aprobar directamente en `En revisión` cuando existe subarrendador (debe rechazarse sin cambiar estados), y expiración de `Pendiente confirmación dueño` tras 48 h.

## Risks / Trade-offs
- **Reconstrucción de tabla con FKs en SQLite:** el ajuste controlado en `conexion.ts` con `PRAGMA legacy_alter_table = ON` y `foreign_key_check` evita corromper referencias de `notificacion`, `ficha_reserva` y `mensaje_chat`.
- **Plazo de 48 h en doble aprobación:** se mide respecto a `fechaEnvio` (o fecha de pre-aprobación); por simplicidad consistente con `HU-03` y la tabla existente sin agregar otra columna de fecha, se reutiliza `fecha_envio` para la guarda de 48 h.

## Migration Plan
1. Agregar `005_crear_subarrendador.sql` y ajustar `conexion.ts`.
2. Extender `seed.ts` de forma idempotente.
3. Implementar dominio, servicios, rutas, vistas y `tests/subarriendo.test.ts`.
4. Ejecutar `npm test` y probar el flujo manual con `npm run dev`.
