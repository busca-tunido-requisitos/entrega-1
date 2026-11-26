## Why

Hasta ahora, las postulaciones registradas por `HU-02` pasan directamente a resolución del dueño (`HU-03`, `EST-01`). En pensiones donde un residente autorizado actúa como subarrendador (`HU-05`, `RP-11`), el sistema necesita incorporar su pre-evaluación previa y exigir la doble aprobación (subarrendador + dueño) antes de bloquear el cupo, emitir la ficha oficial y habilitar el chat de coordinación.

## What Changes

- Se incorpora el rol de **Subarrendador** sobre `Persona` mediante la asociación opcional `subarrienda` (`Persona 0..1 – 0..* Pension`).
- Se agrega el atributo `acuerdoSubarriendo` (`booleano | null`) en `SolicitudReserva` y el flujo de estados de `EST-03` (`En revisión` → `Pendiente confirmación dueño` → `Confirmada por dueño`, además de `Rechazada` y `Expirada` tras 48 h).
- Nueva bandeja y acciones del subarrendador (`/subarriendo`, `CU-06`, `DSS-03`): pre-aprobar o rechazar una solicitud `En revisión`, notificando siempre la decisión al dueño mediante `ServicioPush` simulado.
- Adaptación de la bandeja del dueño (`/bandeja`, `CU-03`): en pensiones con subarrendador, el dueño solo puede confirmar solicitudes en `Pendiente confirmación dueño` (rechazando intentos directos desde `En revisión`); al confirmar, la solicitud pasa a `Confirmada por dueño`, la habitación pasa a `Reservada`, se emite `FichaReserva` y se notifica al estudiante.
- Adaptación de ficha PDF/check-in (`HU-04`, `CU-04`) y chat (`HU-04`, `CU-05`) para aceptar `Confirmada por dueño` además de `Aprobada`, manteniendo bloqueado el acceso cuando está en `Pendiente confirmación dueño`.
- Datos de ejemplo (`seed.ts`): un `Persona` subarrendador de demostración asignado a `Pensión Brasil`, conservando sin subarrendador el resto de pensiones para no alterar los escenarios existentes de `HU-01`–`HU-04`.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `solicitud-reserva`: incorpora la pre-evaluación del subarrendador (`acuerdoSubarriendo`, `Pendiente confirmación dueño`, `Confirmada por dueño`), notificación al dueño y guardas de doble aprobación (`EST-03`).
- `ficha-reserva`: acepta el estado `Confirmada por dueño` (equivalente a `Aprobada`) para emisión de PDF y verificación de llegada, restringiendo la emisión en `Pendiente confirmación dueño`.
- `chat-coordinacion`: habilita el chat en `Confirmada por dueño` además de `Aprobada`, restringiéndolo mientras falte confirmación del dueño.

## Impact

- **Base de datos:** migración `src/db/migrations/005_crear_subarrendador.sql` (reconstrucción segura de `solicitud_reserva` con `acuerdo_subarriendo` y el `CHECK` de `estado` ampliado a `Pendiente confirmación dueño` y `Confirmada por dueño`, más `persona_subarrendador_id` en `pension`). Ajuste en `src/db/conexion.ts` para desactivar/reactivar claves foráneas al correr migraciones y verificación de integridad.
- **Código:** ampliación de `src/dominio/tipos.ts`, `src/dominio/repositorio-resoluciones.ts`, `src/dominio/repositorio-solicitudes.ts` y `src/dominio/repositorio-chat.ts`; lógica de `EST-03` en `src/servicios/resoluciones.ts` (y habilitación en `src/servicios/fichas.ts`, `src/rutas/fichas.ts`, `src/servicios/chat.ts`); nuevas rutas `src/rutas/subarriendo.ts` y vistas `src/vistas/subarriendo.ejs` y `src/vistas/subarriendo-detalle.ejs`.
- **Pruebas:** nuevas pruebas en `tests/subarriendo.test.ts` (una por cada escenario Gherkin de `HU-05` + guardas de transición inválida), manteniendo pasando las 23 pruebas anteriores.
- **Fuera del alcance:** autenticación real, RBAC, asignación dinámica de subarrendadores desde la interfaz, FCM real y requisitos no funcionales `RP-09` y `RP-10`.
