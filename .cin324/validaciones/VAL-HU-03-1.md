# Informe de validación — HU-03 · Revisar solicitud y resolver postulación desde el móvil
**Fecha:** 2026-11-14 · **Cambio de OpenSpec validado:** `hu-03-resolver-solicitud` · **Estado:** verificado en el sistema

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|----------------|
| — | Sin observaciones | — | Ninguno | Ninguno |

**Escenarios recorridos:**
- Aprobación de postulación con cupo disponible: la solicitud queda `Aprobada`, la habitación `Reservada` y deja de ofrecerse en el catálogo; se emite la ficha `RES-<código de solicitud>` y se notifica al postulante con ese código.
- Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas: la solicitud queda `Rechazada` con su motivo, la habitación sigue `Disponible` y el postulante recibe el rechazo junto al listado curado de pensiones del mismo sector.

**Casos límite probados:** aprobar dos veces la misma solicitud, aprobar fuera del plazo de 48 horas, aprobar cuando la habitación ya no está disponible, rechazar sin motivo y expiración automática de una postulación sin respuesta al abrir la bandeja.

**Lo que sí funcionó:**
- La bandeja del dueño lista las postulaciones pendientes con el resumen del postulante: nombre, carrera, universidad, fecha de ingreso, duración, habitación y mensaje.
- La pantalla de detalle permite aprobar o rechazar con un solo toque, y el motivo de rechazo es obligatorio.
- Al aprobar, el cambio de estado de la habitación y de la solicitud ocurre en una sola transacción: no quedan solicitudes aprobadas con la habitación libre.
- La ficha de reserva se emite con código `RES-<código de solicitud>` y estado «Emitida»; la firma QR queda simulada, como corresponde a HU-04.
- Al rechazar, la habitación sigue disponible y puede recibir nuevas postulaciones.
- La bandeja expira las postulaciones con más de 48 horas y avisa al postulante.

## Detalle por observación

No se registraron observaciones de tipo A (cambio de requisito), B (brecha de especificación), C (inconsistencia entre artefactos), D (defecto de generación), E (fuera de alcance) ni F (entorno o datos de prueba).

## Orden sugerido de edición

No aplica: no hay artefactos que modificar.

## Cómo sabrás que terminaste

- [x] Se actualizó el artefacto principal de cada observación de tipo A, B o C (no hubo observaciones).
- [x] Revisamos cada artefacto afectado de la lista (no hubo afectados).
- [x] Los diagramas editados tienen su fuente y su imagen exportada actualizadas (no se editó ningún diagrama).
- [x] Las observaciones de tipo E o F quedaron resueltas o descartadas conscientemente (no hubo).
- [x] Se revisó la consistencia final (chequeos C1 a C14 y trazabilidad) y todo está ✔.

## Siguiente paso

El cambio `hu-03-resolver-solicitud` se archiva en `openspec/changes/archive/2026-11-14-hu-03-resolver-solicitud/` y sus requisitos quedan publicados en `openspec/specs/solicitud-reserva/spec.md`. La siguiente historia es HU-04 (ficha PDF con QR y chat de coordinación).
