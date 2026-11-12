## Context

Primera historia del proyecto: no existe código de aplicación todavía. El repositorio solo contiene la documentación de requisitos y la ficha confirmada `.cin324/historias/HU-01.md`. La historia corresponde a `CU-01 — Buscar alojamiento` y a las actividades `ACT-TOBE-01` (usuario) y `ACT-TOBE-02` (servicio).

Restricciones del curso: aplicación monolítica con páginas renderizadas en el servidor, TypeScript + Express + EJS + `better-sqlite3`, SQLite local, sin autenticación real y sin implementar requisitos no funcionales. Todo el vocabulario (entidades, estados, filtros) debe coincidir con el modelo de dominio.

## Goals / Non-Goals

**Goals:**
- Catálogo de pensiones filtrable por sede de la Región de Valparaíso, rango de precio y normas de convivencia.
- Cálculo de distancia en metros desde la sede elegida y orden por distancia y luego precio.
- Mapa Leaflet + OpenStreetMap sincronizado con la lista.
- Filtrado reactivo en el navegador sin recargar la página.
- Estado vacío con sugerencias.
- Datos de ejemplo idempotentes con sedes, pensiones y habitaciones `Disponible`.

**Non-Goals:**
- Enviar solicitudes de reserva (HU-02), aprobar/rechazar (HU-03), ficha PDF/QR y chat (HU-04).
- Notificaciones push, autenticación real o registro de usuarios.
- Edición de pensiones o habitaciones desde la interfaz.
- Requisitos no funcionales RP-09 y RP-10 (solo contexto).

## Decisions

### Modelo de datos derivado del dominio
| Tabla | Origen en el modelo | Columnas principales |
|-------|---------------------|----------------------|
| `universidad` | Catálogo de sedes (dato de ejemplo, no clase del dominio) | `id`, `nombre`, `comuna`, `latitud`, `longitud` |
| `pension` | `Pension` | `id`, `nombre_comercial`, `direccion`, `comuna`, `latitud`, `longitud`, `servicios_incluidos`, `permite_visitas`, `permite_mascotas`, `hora_toque_queda` |
| `habitacion` | `Habitacion` | `id`, `pension_id` (FK), `identificador_habitacion`, `precio_mensual`, `tipo_cama`, `tiene_bano_privado`, `estado_disponibilidad` |

- Se mantienen los nombres del dominio en español y `estado_disponibilidad` se restringe a `Disponible`, `Reservada` y `Ocupada` (`EST-02`). Esta historia solo lee `Disponible`; no aplica transiciones.
- `normasConvivencia` se estructura en `permite_visitas`, `permite_mascotas` y `hora_toque_queda` (texto `HH:MM`; `NULL` = sin toque de queda), según lo confirmado en la ficha.
- Una pensión aparece si tiene al menos una habitación `Disponible` dentro del rango de precio. La tarjeta muestra el precio mínimo de esas habitaciones y su identificador.

### Filtrado en servidor y actualización reactiva
- `GET /catalogo` recibe `sede`, `precioMin`, `precioMax`, `permiteVisitas`, `permiteMascotas`, `sinToqueQueda` y `radioKm`. Sin parámetros usa valores por defecto: primera sede de la lista, rango completo, radio 2 km.
- Un formulario con `data-filtros` envía los parámetros por `fetch` y reemplaza solo la lista y los marcadores del mapa, sin recargar la página. Si JavaScript falla, el mismo formulario funciona como envío normal (mejora progresiva).
- El filtrado se hace en el servidor porque es testeable con `supertest` y mantiene una sola fuente de verdad. La lista de resultados y los datos del mapa salen del mismo arreglo, de modo que no se desincronizan.

### Distancia
- Se calcula con la fórmula de Haversine en TypeScript sobre `pension.latitud/longitud` y la sede elegida; se expresa en metros y se redondea.
- Se filtra por `distancia <= radioKm * 1000` y se ordena por `distancia` ascendente y luego por `precio` ascendente.
- No se usa ninguna extensión de SQLite: el volumen de datos de ejemplo es pequeño y se filtra en memoria tras leer las pensiones con habitaciones disponibles.

### Mapa
- Leaflet y sus teselas de OpenStreetMap se cargan por CDN. El mapa recibe el mismo arreglo de resultados que la lista y centra la vista en la sede elegida.
- Si las teselas no cargan, el contenedor del mapa queda vacío; la lista y los filtros siguen funcionando (degradación, no simulación de negocio).

### Selector de rol
- Cabecera con un selector de rol de demostración (`Estudiante` por defecto). No hay login ni sesiones; el rol solo cambia la etiqueta visible en esta historia.

### Datos de ejemplo
- `seed` idempotente: inserta o actualiza sedes de la Región de Valparaíso (por ejemplo, Universidad de Valparaíso, Pontificia Universidad Católica de Valparaíso, Universidad Técnica Federico Santa María, Universidad de Playa Ancha) con coordenadas reales.
- Incluye pensiones en comunas cercanas (Valparaíso, Viña del Mar, Quilpué) con normas variadas y habitaciones `Disponible` con precios dentro y fuera del rango de ejemplo. Al menos una pensión sin mascotas para poder probar el escenario sin coincidencias.

## Risks / Trade-offs

- **Dependencia de internet para el mapa** → la lista y los filtros no dependen de las teselas; se muestra un aviso discreto si Leaflet no carga.
- **Cálculo de distancia en memoria** → adecuado para el volumen de datos de ejemplo; si creciera, se movería a SQL o a un índice geográfico.
- **Rango de precio ambigua con varias habitaciones** → se aplica a cada habitación y la pensión se muestra con el precio mínimo que cumple; queda documentado en la tarjeta.
- **`hora_toque_queda` como texto** → se valida el formato `HH:MM` al sembrar; el filtro «sin toque de queda» solo compara con `NULL`.
- **CDN de Leaflet** → si la red universitaria lo bloquea, el mapa no se ve; se documenta en el README y en la guía de pruebas.

## Migration Plan

1. Migración `001_crear_catalogo.sql`: crea `universidad`, `pension` y `habitacion` con claves foráneas y restricciones.
2. `npm run db:seed` aplica migraciones pendientes (registradas en `schema_migrations`) y carga los datos de ejemplo de forma idempotente.
3. Sin rollback automático: al ser la primera historia, borrar `data/app.db` y volver a sembrar restaura el estado.
