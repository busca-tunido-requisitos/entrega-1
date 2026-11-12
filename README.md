# BuscaTuNido — catálogo de pensiones universitarias

> Plataforma colaborativa para la búsqueda, gestión y reserva transparente de pensiones universitarias en Chile.

Aplicación web del taller CIN 324 generada a partir de la documentación de requisitos. Esta primera entrega implementa **HU-01 — Filtrar catálogo por campus, precio y normas** (`CU-01`, actividades `ACT-TOBE-01` y `ACT-TOBE-02`).

## Documentación del proyecto

- Documento maestro de la Entrega 1: [`IngReq-Entrega 1.md`](./IngReq-Entrega%201.md)
- Documento maestro de la Entrega 2: [`IngReq-Entrega 2.md`](./IngReq-Entrega%202.md)
- Proceso AS-IS (`01-proceso-as-is.md`), rediseño TO-BE (`02-rediseno-to-be.md`), requisitos (`03-requisitos.md`), historias (`04-historias-usuario.md`), elicitación (`05-elicitacion.md`) y atributos de calidad (`06-atributos-calidad.md`).
- Criterios Gherkin (`07-criterios-aceptacion.md`), modelo de dominio (`08-modelo-dominio.md`), casos de uso (`09-casos-de-uso.md`), secuencia (`10-diagramas-secuencia.md`), estado (`11-diagramas-estado.md`) y trazabilidad (`12-trazabilidad.md`).
- Diagramas y fuentes: `diagramas/` y `assets/`.

La aplicación muestra un catálogo de pensiones con habitaciones disponibles, filtrable por sede universitaria de la Región de Valparaíso, rango de precio y normas de convivencia. Incluye un mapa Leaflet + OpenStreetMap, orden por cercanía, radio de búsqueda y un estado vacío con sugerencias.

## Requisitos

- Node.js 22 o superior (probado con Node 26)
- npm
- Internet para las teselas del mapa (la lista y los filtros funcionan sin conexión)

## Puesta en marcha

```bash
# 1. Instala las dependencias del proyecto (Express, EJS, better-sqlite3, Vitest, etc.)
npm install

# 2. Crea data/app.db, aplica las migraciones y carga los datos de ejemplo
#    (6 sedes, 8 pensiones y 17 habitaciones; se puede ejecutar varias veces)
npm run db:seed

# 3. Arranca la aplicación en modo desarrollo con recarga automática
#    Abre http://localhost:3000/catalogo (http://localhost:3000 redirige al catálogo)
npm run dev

# 4. Ejecuta las pruebas automáticas (una por cada escenario Gherkin de HU-01)
npm test

# 5. Compila el TypeScript a dist/ (opcional; no es necesario para npm run dev)
npm run build

# 6. Arranca la aplicación sin recarga automática (alternativa a npm run dev)
npm start
```

Si `data/app.db` no existe, al arrancar la aplicación se siembra automáticamente. Para reiniciar los datos, borra `data/app.db` y ejecuta de nuevo `npm run db:seed`.

Hay una prueba de integración por cada escenario Gherkin de HU-01:

- `HU-01 · Filtrado exitoso de pensiones por sede universitaria y rango de precio`
- `HU-01 · Búsqueda sin coincidencias por restricciones excesivas de convivencia`

## Recorrido manual de los escenarios

### Escenario 1 — Filtrado exitoso por sede y rango de precio

1. Abre http://localhost:3000/catalogo.
2. Deja la sede **Universidad de Valparaíso** y el radio **2 km**.
3. Escribe `150000` en «Precio mínimo» y `250000` en «Precio máximo».
4. Deben aparecer cuatro pensiones, en este orden por cercanía:
   1. **Pensión Los Aromos** (~355 m)
   2. **Pensión Brasil** (~900 m)
   3. **Residencial Playa Ancha** (~1,1 km)
   4. **Residencial Cerro Alegre** (~1,8 km)
5. El mapa debe mostrar un marcador por cada pensión dentro del círculo de 2 km, y la lista debe actualizarse sin recargar la página al cambiar los filtros.

### Escenario 2 — Búsqueda sin coincidencias

1. En «Sede universitaria» elige **Universidad Técnica Federico Santa María**.
2. Mantén el radio en **2 km** y el rango de precio completo.
3. Activa **«Permite mascotas»**.
4. El catálogo debe indicar «No se encontraron habitaciones disponibles con ese criterio» y sugerir ampliar el radio o flexibilizar las normas.
5. Prueba a subir el radio a **5 km**: aparecen pensiones que sí permiten mascotas.

## Datos de ejemplo

| Sede | Comuna |
|------|--------|
| Universidad de Valparaíso | Valparaíso |
| Pontificia Universidad Católica de Valparaíso | Valparaíso |
| Universidad Técnica Federico Santa María | Valparaíso |
| Universidad de Playa Ancha | Valparaíso |
| Universidad de Viña del Mar | Viña del Mar |
| Universidad Adolfo Ibáñez (sede Viña del Mar) | Viña del Mar |

Las pensiones incluyen normas variadas (visitas, mascotas y toque de queda), servicios y habitaciones `Disponible` con distintos precios. Hay al menos una pensión sin mascotas cerca de la USM para reproducir el escenario 2.

## Notas y alcance

- **Sin autenticación real:** la cabecera tiene un selector de rol de demostración con el rol Estudiante.
- **Integraciones externas:** el mapa usa teselas de OpenStreetMap solo como capa visual; no hay lógica de negocio delegada. Si no hay internet, el mapa queda sin teselas y se muestra un aviso, pero la lista y los filtros siguen operando. Las notificaciones push, la firma QR y el chat pertenecen a HU-02 a HU-04 y no se implementan aquí.
- **Requisitos no funcionales:** RP-09 (mobile-first 48×48) y RP-10 (< 400 ms) se leen como contexto y no se implementan en el taller.
- **Normas de convivencia:** `normasConvivencia` se modeló como `permite_visitas`, `permite_mascotas` y `hora_toque_queda` (vacío = sin toque de queda), según lo confirmado en la ficha `.cin324/historias/HU-01.md`.
- **Estados:** solo se muestran habitaciones `Disponible`; esta historia no aplica transiciones de `EST-02`.

## Estructura

```text
src/
  app.ts                     # aplicación Express (sin escuchar puerto)
  server.ts                  # arranque en el puerto 3000
  db/
    conexion.ts              # SQLite + migraciones en schema_migrations
    migrations/001_crear_catalogo.sql
    seed.ts                  # datos de ejemplo idempotentes
  dominio/                   # tipos, distancia (Haversine) y repositorio
  servicios/catalogo.ts      # filtros, orden y detección de sin coincidencias
  rutas/catalogo.ts          # GET /catalogo
  vistas/                    # EJS: catálogo y lista
public/                      # estilos y actualización reactiva con Leaflet
tests/                       # una prueba por escenario Gherkin
```

## Trazabilidad

- Historia: `04-historias-usuario.md` → HU-01. Ficha confirmada: `.cin324/historias/HU-01.md`.
- Criterios Gherkin: `07-criterios-aceptacion.md` → HU-01 (2 escenarios).
- Caso de uso: `09-casos-de-uso.md` → CU-01.
- Modelo de dominio: `08-modelo-dominio.md` → `Pension`, `Habitacion`.
- Estado: `11-diagramas-estado.md` → EST-02 (solo lectura de `Disponible`).
- Cambio de OpenSpec: `openspec/changes/hu-01-catalogo-filtros/`.
