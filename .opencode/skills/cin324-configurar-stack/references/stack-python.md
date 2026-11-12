# Opción B — Python

Pensada para equipos que prefieren Python. Una sola aplicación que sirve páginas HTML y trabaja con SQLite.

## Componentes

| Pieza | Elección | Para qué |
|-------|----------|----------|
| Entorno | Python 3.11 o superior, con entorno virtual (`venv`) | Ejecutar la aplicación |
| Servidor web | FastAPI + Uvicorn | Rutas y formularios |
| Plantillas | Jinja2 | Páginas renderizadas en el servidor |
| Base de datos | SQLite con la biblioteca estándar `sqlite3` (un solo archivo `data/app.db`) | Persistencia; si el equipo ya conoce SQLAlchemy, puede usarse |
| Formularios | `python-multipart` | Recibir formularios HTML |
| Pruebas | pytest + `TestClient` de FastAPI (con httpx) | Una prueba por escenario Gherkin |

## Estructura sugerida

```text
app/
  main.py                 # crea la aplicación FastAPI y registra las rutas
  db/
    conexion.py           # abre SQLite y aplica migraciones
    migrations/           # 001_*.sql, 002_*.sql ...
    seed.py               # datos de ejemplo (idempotente)
  dominio/                # un módulo por clase del modelo de dominio
    reserva.py            # tipos, repositorio y transiciones de estado
  servicios/              # casos de uso y lógica de cada historia
  integraciones/          # interfaces y versiones simuladas de sistemas externos
  rutas/                  # rutas HTTP por caso de uso
  templates/              # plantillas Jinja2
tests/                    # una prueba por escenario Gherkin: «HU-02 · …»
requirements.txt
README.md
```

## Comandos esperados

```text
python -m venv .venv                      # crear entorno virtual (una vez)
source .venv/bin/activate                 # en Windows: .venv\Scripts\activate
pip install -r requirements.txt           # instalar dependencias
python -m app.db.seed                     # crear la base y cargar datos de ejemplo
uvicorn app.main:app --reload             # ejecutar en http://localhost:8000
pytest                                    # correr las pruebas
```

## Notas

- Las migraciones SQL se aplican al arrancar y se registran en `schema_migrations`.
- Usa transacciones (`with conexion:`) para operaciones que modifican más de una tabla.
- Para pruebas, usa una base SQLite en memoria o un archivo temporal por prueba (fixture de pytest).
- Pasa explícitamente `check_same_thread=False` o abre una conexión por solicitud, según el diseño.
