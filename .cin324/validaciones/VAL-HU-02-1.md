# Informe de validación — HU-02 · Enviar solicitud formal de reserva
**Fecha:** 2026-11-14 · **Cambio de OpenSpec validado:** `hu-02-solicitud-reserva` · **Estado:** verificado en el sistema

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|----------------|
| — | Sin observaciones | — | Ninguno | Ninguno |

**Escenarios recorridos:**
- Envío exitoso de solicitud formal con antecedentes completos: la solicitud se registra en estado «En revisión», se despacha la notificación push al dueño y se informa el plazo máximo de 48 horas.
- Intento de postulación con fecha de ingreso fuera del periodo lectivo: el sistema impide el envío, no registra la solicitud ni notifica, y muestra las fechas válidas de inicio de estadía.

**Casos límite probados:** campos obligatorios vacíos, duración fuera del rango 1–12 meses, perfil sin correo institucional verificado, habitación que ya no está disponible, habitación inexistente (404) y siembra idempotente de los datos de ejemplo.

**Lo que sí funcionó:**
- El catálogo de HU-01 muestra las habitaciones disponibles con su botón «Solicitar reserva» y el enlace lleva a la habitación correcta.
- El formulario muestra la pensión, la habitación, el período de admisión y el perfil de demostración con la insignia «Correo institucional verificado».
- La solicitud se registra con código único `SOL-<año>-<secuencial>`, `fechaEnvio` y estado «En revisión»; la habitación conserva su estado «Disponible» (el cupo se bloquea al aprobar, en HU-03).
- La notificación push simulada queda registrada en la tabla `notificacion` con el destinatario del dueño, lista para la bandeja de HU-03.
- La confirmación informa el código de la solicitud y el plazo de 48 horas.
- El patrón POST-Redirect-GET evita postulaciones duplicadas al recargar la página.

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

El cambio `hu-02-solicitud-reserva` está archivado en `openspec/changes/archive/2026-11-14-hu-02-solicitud-reserva/` y sus requisitos están publicados en `openspec/specs/solicitud-reserva/spec.md`. Se puede iniciar la siguiente historia (HU-03) con `/cin324-generar-app`.
