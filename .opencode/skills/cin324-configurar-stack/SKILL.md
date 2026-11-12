---
name: cin324-configurar-stack
description: Define, una sola vez por proyecto y al comenzar la primera historia de usuario, el stack de desarrollo de la aplicación web (una opción TypeScript o una Python, ambas con SQLite), verifica las herramientas instaladas, registra la decisión confirmada por el estudiante y prepara el contexto de OpenSpec (openspec/config.yaml) en español. Úsala cuando se vaya a implementar la primera historia, cuando se pida elegir o cambiar el stack, o cuando falte el contexto de OpenSpec.
argument-hint: "[typescript | python (opcional)]"
---

# Configurar el stack y el contexto de OpenSpec

Se usa **una sola vez por proyecto**: antes de la primera historia. Si `.cin324/proyecto.md` ya tiene una sección «Stack» completa, no vuelvas a preguntar: dilo en una línea y termina (salvo que el estudiante pida cambiarlo; en ese caso explica que cambiar de stack después de generar código implica reescribir lo hecho y pide confirmación explícita).

Este es el único lugar donde se toman decisiones técnicas con el estudiante. Todo es para **una aplicación web sencilla**, con **SQLite** como base de datos en ambos casos, y **sin considerar los requisitos no funcionales**.

## Paso 1 · Revisar el entorno

Antes de proponer, ejecuta (con permiso del estudiante si el entorno lo pide):

```bash
node --version      # TypeScript: se necesita Node.js 20 LTS o superior
python --version    # Python: se necesita 3.11 o superior (en algunos sistemas: python3 --version)
git --version
openspec --version  # CLI de OpenSpec (se instala aparte; ver cin324-generar-app/references/flujo-openspec.md)
```

Informa qué opciones están disponibles hoy en su equipo y cuáles requieren instalar algo. No instales nada sin su permiso.

## Paso 2 · Proponer las dos opciones

Presenta ambas con la misma estructura y una recomendación sencilla (por ejemplo, «si ya conocen JavaScript, la opción A; si vienen de Python o ciencia de datos, la B»). Detalles completos en [stack-typescript.md](./references/stack-typescript.md) y [stack-python.md](./references/stack-python.md).

| | Opción A — TypeScript | Opción B — Python |
|---|---|---|
| Entorno | Node.js 20+ | Python 3.11+ |
| Servidor web | Express | FastAPI |
| Páginas | Plantillas EJS en el servidor | Plantillas Jinja2 en el servidor |
| Base de datos | SQLite con `better-sqlite3` | SQLite con la biblioteca estándar `sqlite3` (o SQLAlchemy si el equipo ya lo conoce) |
| Pruebas | Vitest + supertest | pytest + TestClient de FastAPI |
| Ejecución | `npm run dev` | `uvicorn app.main:app --reload` |

Pregunta: «¿Qué stack eligen? ¿Tienen alguna restricción (versión instalada, lenguaje que ya dominan, preferencia del equipo)?». Si el estudiante prefiere otro framework, evalúa si cumple lo esencial (web, SQLite, pruebas automáticas, ejecución local simple) y confírmalo; el curso recomienda las dos opciones propuestas porque están probadas con este flujo.

**Espera la elección.** Luego muestra un resumen de una línea de lo que se creará («Express + EJS + better-sqlite3 + Vitest, con migraciones SQL numeradas y script de datos de ejemplo») y pide confirmación explícita antes de seguir.

## Paso 3 · Registrar la decisión

Con el stack confirmado:

1. Actualiza la sección «Stack» de `.cin324/proyecto.md` (lenguaje, framework, SQLite, pruebas, comandos de instalar, ejecutar y probar). Crea el archivo con la plantilla de `cin324-generar-app/references/plantilla-estado-proyecto.md` si no existe.
2. Prepara `openspec/config.yaml` con el contexto del proyecto. Usa [plantilla-config-openspec.md](./references/plantilla-config-openspec.md): respeta el contenido que ya tenga el archivo (por ejemplo `schema: spec-driven`) y agrega o actualiza solo los campos `context` y `rules`. Si `openspec/` no existe, **no la crees a mano**: dile al estudiante que debe ejecutar `openspec init --tools opencode` (puedes hacerlo tú si lo autoriza) y retoma después.
3. **No crees todavía el esqueleto de la aplicación.** Eso ocurre en la implementación de la primera historia, siguiendo `tasks.md` de OpenSpec, para que todo quede trazado en una especificación revisada. Lo único que debe aparecer en las tareas es: estructura del proyecto, dependencias, migraciones, datos de ejemplo, pruebas y `README.md`.

## Paso 4 · Devolver el control

Informa en dos líneas qué quedó definido y que el siguiente paso es proponer la primera historia con OpenSpec (skill `cin324-generar-app`, paso 5).
