# Informe de validación — HU-01 · Filtrar catálogo por campus, precio y normas
**Fecha:** 2026-11-11 · **Cambio de OpenSpec validado:** `hu-01-catalogo-filtros` · **Estado:** verificado en el sistema

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|------------------|
| — | Sin observaciones | — | Ninguno | Ninguno |

**Escenarios recorridos por el estudiante:**
- Filtrado exitoso de pensiones por sede universitaria y rango de precio.
- Búsqueda sin coincidencias por restricciones excesivas de convivencia.

**Casos límite probados:** precio mínimo mayor que el máximo, radio de 1 km y radio de 10 km.

**Lo que sí funcionó:**
- El catálogo muestra únicamente las pensiones con habitaciones `Disponible` dentro del radio y del rango de precio.
- El orden por cercanía y luego por precio coincide con lo confirmado en la ficha.
- El mapa y la lista muestran el mismo conjunto de pensiones.
- El estado sin coincidencias muestra el mensaje y la sugerencia de ampliar el radio o flexibilizar las normas.
- Los filtros se actualizan sin recargar la página.

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

El cambio `hu-01-catalogo-filtros` se archiva y sus especificaciones pasan a `openspec/specs/`. Después se puede iniciar la siguiente historia con `/cin324-generar-app`.
