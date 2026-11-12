# Opción A — TypeScript

Pensada para equipos que ya usan JavaScript/TypeScript. Una sola aplicación que sirve páginas HTML y trabaja con SQLite.

## Componentes

| Pieza | Elección | Para qué |
|-------|----------|----------|
| Entorno | Node.js 20 LTS o superior | Ejecutar la aplicación |
| Lenguaje | TypeScript (modo estricto) | Tipos que reflejan el modelo de dominio |
| Servidor web | Express | Rutas y formularios |
| Plantillas | EJS | Páginas renderizadas en el servidor |
| Base de datos | SQLite con `better-sqlite3` (síncrona, un solo archivo `data/app.db`) | Persistencia |
| Ejecución en desarrollo | `tsx` (con `npm run dev`) | Recarga al guardar |
| Pruebas | Vitest + supertest | Una prueba por escenario Gherkin |
| Formato | Sin herramientas extra al inicio | Simplicidad |

## Estructura sugerida

```text
src/
  app.ts                  # crea la aplicación Express (sin escuchar puerto, para las pruebas)
  server.ts               # arranca el servidor
  db/
    conexion.ts           # abre SQLite y aplica migraciones
    migrations/           # 001_*.sql, 002_*.sql ...
    seed.ts               # datos de ejemplo (idempotente)
  dominio/                # una carpeta o archivo por clase del modelo de dominio
    reserva.ts            # tipos, repositorio y transiciones de estado
  servicios/              # casos de uso y lógica de cada historia
  integraciones/          # interfaces y versiones simuladas de sistemas externos
  rutas/                  # rutas HTTP por caso de uso
  vistas/                 # plantillas EJS
tests/                    # una prueba por escenario Gherkin: «HU-02 · …»
README.md
package.json
tsconfig.json
```

## Comandos esperados (package.json)

```text
npm install       # instalar dependencias
npm run db:seed   # crear la base y cargar datos de ejemplo
npm run dev       # ejecutar en http://localhost:3000
npm test          # correr las pruebas
```

## Notas

- Las migraciones SQL se aplican al arrancar y se registran en `schema_migrations`.
- Usa transacciones para operaciones que modifican más de una tabla.
- Para pruebas, abre una base SQLite en memoria (`:memory:`) o un archivo temporal por prueba.
- Si `better-sqlite3` falla al instalar en Windows (compilación nativa), sugiere Node 20 LTS o 22 LTS, que traen binarios precompilados, o usar el módulo `node:sqlite` de Node.js recientes como alternativa.
