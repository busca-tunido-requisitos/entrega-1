## Why

Los estudiantes foráneos pierden horas recorriendo avisos físicos, redes sociales y llamando a números desactualizados para descubrir si una pensión tiene cupo o cumple sus reglas de convivencia (HU-01). Esta historia sustituye esa búsqueda manual por un catálogo georreferenciado con filtros por sede universitaria, precio y normas, que muestra la disponibilidad real y ordena las opciones por cercanía.

## What Changes

- Nueva página de catálogo de pensiones para el rol **Estudiante**, con filtros por sede universitaria de la Región de Valparaíso, rango de precio mensual y normas de convivencia (permite visitas, permite mascotas, toque de queda).
- Radio de búsqueda de 2 km por defecto, ampliable por el estudiante, medido desde la sede elegida.
- Mapa interactivo con Leaflet + OpenStreetMap que marca las pensiones que cumplen los filtros.
- Lista ordenada por distancia ascendente y, a igual distancia, por precio ascendente.
- Actualización instantánea de lista y mapa al cambiar cualquier filtro, sin recargar la página.
- Estado vacío: cuando no hay coincidencias, mensaje claro y sugerencia de ampliar el radio o flexibilizar las normas.
- Datos de ejemplo: sedes de la Región de Valparaíso con coordenadas, pensiones y habitaciones `Disponible`.
- Normas de convivencia estructuradas (`permiteVisitas`, `permiteMascotas`, `horaToqueQueda`) para que el filtro sea verificable.
- Selector de rol de demostración con el rol Estudiante (sin autenticación real).

## Capabilities

### New Capabilities
- `catalogo-pensiones`: búsqueda y filtrado multicriterio de pensiones disponibles, cálculo de distancia a la sede, orden del catálogo, mapa interactivo y estado sin coincidencias.

### Modified Capabilities
- Ninguna: es la primera historia del proyecto y `openspec/specs/` está vacío.

## Impact

- **Código nuevo:** estructura TypeScript + Express + EJS + better-sqlite3, migraciones en `src/db/migrations`, `seed` idempotente, ruta `GET /catalogo` y su vista, módulo de dominio `pension`/`habitacion`, cálculo de distancia y filtros en el servidor, filtrado reactivo en el navegador.
- **Dependencias:** `express`, `ejs`, `better-sqlite3`, `tsx`, `typescript`, `vitest`, `supertest`; Leaflet y sus teselas se cargan por CDN (OpenStreetMap). Si no hay internet, el mapa se degrada sin teselas y la lista sigue funcionando.
- **Base de datos:** nuevas tablas `pension`, `habitacion` y `universidad` (catálogo de sedes como datos de ejemplo), con sus migraciones y datos sembrados.
- **Pruebas:** una prueba de integración por cada escenario Gherkin de HU-01 (`HU-01 · …`).
- **Fuera del alcance:** HU-02 (enviar solicitud), HU-03 (aprobar/rechazar), HU-04 (ficha PDF, QR y chat); notificaciones push; autenticación real; requisitos no funcionales RP-09 (mobile-first 48×48) y RP-10 (< 400 ms), que solo se leen como contexto.
