## 1. Estructura del proyecto

- [x] 1.1 Crear `package.json` con los scripts `dev`, `build`, `db:seed` y `test`, y las dependencias Express, EJS, better-sqlite3, tsx, TypeScript, Vitest y supertest.
- [x] 1.2 Crear `tsconfig.json` en modo estricto y la estructura `src/{db,rutas,servicios,dominio,vistas}`, `tests/` y `data/`.
- [x] 1.3 Crear `src/app.ts` (aplicación Express sin escuchar puerto) y `src/server.ts` (arranque en el puerto 3000), con EJS como motor de vistas y formularios `urlencoded`.

## 2. Base de datos y datos de ejemplo

- [x] 2.1 Crear la migración `src/db/migrations/001_crear_catalogo.sql` con las tablas `universidad`, `pension` y `habitacion` (claves foráneas, `estado_disponibilidad` restringido a `Disponible`, `Reservada` y `Ocupada`).
- [x] 2.2 Implementar `src/db/conexion.ts`: abre SQLite en `data/app.db` (o `:memory:` en pruebas), aplica migraciones pendientes y las registra en `schema_migrations`.
- [x] 2.3 Implementar `src/db/seed.ts` idempotente con sedes de la Región de Valparaíso con coordenadas, pensiones con normas variadas y habitaciones `Disponible` (incluida al menos una pensión sin mascotas).

## 3. Dominio y lógica de CU-01

- [x] 3.1 Definir los tipos de `Pension`, `Habitacion` y `Universidad` con los nombres del modelo de dominio, y el repositorio de lectura que devuelve pensiones con habitaciones `Disponible`.
- [x] 3.2 Implementar el cálculo de distancia en metros (Haversine) entre una sede y una pensión.
- [x] 3.3 Implementar el servicio de catálogo: filtros por sede, radio (2 km por defecto), rango de precio y normas (`permiteVisitas`, `permiteMascotas`, `sinToqueQueda`), orden por distancia y luego precio, y detección de «sin coincidencias».
- [x] 3.4 Implementar la validación y los valores por defecto de los parámetros de `GET /catalogo`.

## 4. Pantallas

- [x] 4.1 Crear la ruta `GET /catalogo` y la vista EJS con el selector de rol de demostración, el formulario de filtros, la lista de resultados y la distancia en metros.
- [x] 4.2 Añadir el contenedor del mapa Leaflet + OpenStreetMap y los marcadores de las pensiones que cumplen los filtros, centrado en la sede elegida.
- [x] 4.3 Añadir el JavaScript del navegador que envía los filtros por `fetch` y actualiza lista y mapa sin recargar (con envío normal como respaldo).
- [x] 4.4 Mostrar el estado vacío con el mensaje y la sugerencia de ampliar el radio o flexibilizar las normas.

## 5. Pruebas automáticas

- [x] 5.1 Configurar Vitest + supertest con una base SQLite en memoria y un fixture de sedes, pensiones y habitaciones.
- [x] 5.2 Escribir la prueba «HU-01 · Filtrado exitoso de pensiones por sede universitaria y rango de precio» (verifica solo las pensiones que cumplen y su orden).
- [x] 5.3 Escribir la prueba «HU-01 · Búsqueda sin coincidencias por restricciones excesivas de convivencia» (verifica el mensaje y la sugerencia).
- [x] 5.4 Ejecutar `npm test` y corregir hasta que todas las pruebas pasen.

## 6. Documentación

- [x] 6.1 Crear el `README.md` con cómo instalar, sembrar datos, ejecutar (http://localhost:3000/catalogo), probar y la nota de que el mapa requiere internet y que el rol es de demostración.
