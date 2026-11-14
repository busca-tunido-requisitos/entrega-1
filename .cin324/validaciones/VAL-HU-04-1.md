# Informe de validación — HU-04 · Recibir confirmación y coordinar llegada por chat
**Fecha:** 2026-11-14 · **Cambio de OpenSpec validado:** `hu-04-ficha-pdf-y-chat` · **Estado:** verificado en el sistema

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|----------------|
| — | Sin observaciones | — | Ninguno | Ninguno |

**Escenarios recorridos:**
- Emisión de ficha oficial con código criptográfico verificable: la ficha se descarga como PDF real (`RES-<código>.pdf`, 22 KB, cabecera `%PDF`) con los datos del inmueble y el arriendo y el código QR embebido; el contenido firmado comienza con `BTN1|código de reserva|id del estudiante|dirección|fecha de ingreso|fecha de fin|firma`; el chat queda habilitado con el estudiante y el dueño.
- Intento de acceso al canal de chat sin contar con reserva aprobada: la sala responde «El chat se habilita exclusivamente una vez confirmada y aprobada la reserva», no se registra ningún mensaje y tampoco se puede descargar la ficha.

**Casos límite probados:** contenido del QR manipulado (firma inválida → la habitación permanece `Reservada`), QR válido (la habitación pasa a `Ocupada`), publicación de la clave pública y ventana de la sala con mensajes de los dos participantes.

**Lo que sí funcionó:**
- El PDF es un archivo real descargable, con la imagen del QR dentro y el código de verificación legible.
- La firma es criptográfica de verdad (Ed25519 con `node:crypto`): el QR alterado se rechaza y el original se valida.
- La verificación funciona sin internet: no interviene ningún servicio externo.
- El chat es real: los mensajes quedan en la tabla `mensaje_chat`, se ven para ambos participantes y se actualizan por sondeo sin recargar.
- La transición de `EST-02` ocurre solo con QR válido: la habitación pasa de `Reservada` a `Ocupada`.

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

El cambio `hu-04-ficha-pdf-y-chat` se archiva en `openspec/changes/archive/2026-11-14-hu-04-ficha-pdf-y-chat/` y sus requisitos quedan publicados en `openspec/specs/ficha-reserva/spec.md` y `openspec/specs/chat-coordinacion/spec.md`. Con esto quedan implementadas las cuatro historias de usuario del proyecto.
