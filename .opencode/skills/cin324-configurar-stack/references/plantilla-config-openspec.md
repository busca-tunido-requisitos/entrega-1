# Contexto de OpenSpec para el proyecto (`openspec/config.yaml`)

OpenSpec lee este archivo cada vez que genera los artefactos de un cambio. El campo `context` es contexto que el agente **no puede deducir leyendo el código**; `rules` son reglas por artefacto. No copies documentación general del proyecto: eso ya está en el repositorio.

Después de `openspec init`, el archivo trae `schema: spec-driven` y comentarios de ejemplo. **Conserva `schema` y agrega o reemplaza solo `context` y `rules`.**

```yaml
schema: spec-driven

context: |
  Proyecto del curso CIN 324 (Ingeniería de Requisitos): aplicación web sencilla
  generada historia por historia desde la documentación del repositorio.
  Idioma: escribe todos los artefactos de OpenSpec y los textos de la interfaz en español.
  Stack: [TypeScript + Express + EJS + better-sqlite3 + Vitest | Python + FastAPI + Jinja2 + sqlite3 + pytest].
  Base de datos: SQLite (archivo local). Migraciones SQL numeradas en [ruta], registradas en schema_migrations.
  Artefactos del curso (fuente de verdad, no modificar sin permiso del estudiante):
  historias y Gherkin en [ruta], modelo de dominio en [ruta], casos de uso en [ruta],
  diagramas de secuencia en [ruta], diagramas de estado en [ruta].
  Fichas confirmadas de cada historia en .cin324/historias/HU-xx.md: son el insumo de cada propuesta.
  Alcance: una historia por cambio. No se implementan requisitos no funcionales ni autenticación real
  (usar selector de rol de demostración). Los sistemas externos se simulan mediante adaptadores.

rules:
  proposal:
    - Citar la historia (HU-xx), la actividad del TO-BE y el caso de uso de origen.
    - Indicar explícitamente qué queda fuera del alcance.
  specs:
    - Un requisito por cada regla del Gherkin y un escenario por cada escenario Gherkin, con el mismo vocabulario del dominio.
    - Los nombres de entidades, estados y mensajes deben coincidir con el modelo de dominio y los diagramas.
  design:
    - Derivar tablas del modelo de dominio, transiciones del diagrama de estado y rutas del diagrama de secuencia.
    - Declarar qué integraciones externas se simulan y cómo.
  tasks:
    - Tareas pequeñas y verificables, que incluyan datos de ejemplo, lógica, pantallas y una prueba por escenario Gherkin.
    - Como última tarea, actualizar el README con cómo instalar, ejecutar y probar.
```

Sustituye los textos entre corchetes con los valores reales del proyecto. Mantén `context` por debajo de 50 KB (en la práctica, bastan unas 15 líneas).

## Verificación

```bash
openspec context --json    # muestra el contexto de trabajo resuelto (debe listar la raíz de openspec/)
```

Si el YAML no es válido, OpenSpec ignora el contexto o las reglas afectadas: revisa la indentación (espacios, no tabulaciones) y que ninguna regla de `rules` contenga «: » (dos puntos seguidos de un espacio) sin comillas, porque YAML la interpreta como clave y valor.
