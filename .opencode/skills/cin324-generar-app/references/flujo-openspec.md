# OpenSpec en este flujo

OpenSpec es un marco de desarrollo guiado por especificaciones: antes de escribir código, el estudiante y el agente acuerdan por escrito qué se va a construir. Cada cambio vive en `openspec/changes/<cambio>/` con cuatro artefactos (esquema `spec-driven`):

| Artefacto | Qué contiene |
|-----------|---------------|
| `proposal.md` | Por qué se hace el cambio y qué cambia |
| `specs/<capacidad>/spec.md` | Requisitos y escenarios (WHEN/THEN) del cambio, como «delta» (ADDED / MODIFIED / REMOVED) |
| `design.md` | Cómo se va a construir (decisiones técnicas) |
| `tasks.md` | Lista de tareas con casillas para marcar |

Al archivar, los deltas se integran en `openspec/specs/` (las especificaciones vigentes del sistema) y el cambio queda en `openspec/changes/archive/`.

## Instalación y preparación

Requisito: Node.js 20.19 o superior si se instala con npm.

```bash
# Con Node.js (cualquier sistema)
npm install -g @fission-ai/openspec@latest

# Alternativa en macOS con Homebrew
brew install openspec

# Verificar
openspec --version
```

Dentro de la carpeta del proyecto, una sola vez:

```bash
openspec init --tools opencode
```

Esto crea `openspec/` (con `config.yaml`), seis skills `openspec-*` en `.opencode/skills/` y seis comandos `opsx-*` en `.opencode/commands/` (propose, explore, apply, sync, archive y update). Después de ejecutarlo, el estudiante debe **cerrar OpenCode y abrirlo de nuevo** para que detecte las skills y los comandos nuevos (OpenCode carga su configuración al iniciar).

> **Cómo se invocan en OpenCode:** las skills no tienen un comando `/nombre-de-skill`: el agente las carga con su herramienta de skills cuando las necesita o cuando se las nombras. Para disparar los pasos con `/`, OpenSpec genera los comandos `/opsx-*`, y este paquete agrega `/cin324-generar-app`, `/cin324-auditar-repositorio` y `/cin324-validar-historia`.

OpenSpec no genera sus skills sin permiso: nunca ejecutes `openspec init` sin que el estudiante lo autorice, y nunca crees a mano la carpeta `openspec/`.

## Qué skill / comando usar en cada paso

| Paso del flujo | Skill de OpenSpec | Comando que puede escribir el estudiante |
|----------------|-------------------|------------------------------|
| Proponer el cambio (crea proposal, specs, design y tasks) | `openspec-propose` | `/opsx-propose <nombre>` |
| Explorar una duda técnica antes de proponer (opcional) | `openspec-explore` | `/opsx-explore` |
| Implementar las tareas | `openspec-apply-change` | `/opsx-apply` |
| Actualizar los artefactos si algo cambió | `openspec-update-change` | `/opsx-update` |
| Archivar y actualizar las especificaciones vigentes | `openspec-archive-change` | `/opsx-archive` |

Si el agente no carga la skill por sí solo, nómbrala explícitamente («carga la skill `openspec-propose`») o pide al estudiante que escriba el comando `/opsx-…` correspondiente.

## Convenciones del curso para los cambios

- **Nombre del cambio:** `hu-xx-nombre-corto` para historias nuevas (por ejemplo, `hu-02-reservar-espacio`) y `ajuste-hu-xx-descripcion` para cambios sobre algo ya generado.
- **Descripción para `openspec-propose`:** la ficha confirmada de la historia (objetivo, rol, actividad TO-BE, caso de uso, escenarios Gherkin textuales, entidades, transiciones de estado, flujo de interacción, sistemas externos). Pásala completa: así la propuesta nace de los artefactos del curso.
- **Escenarios en `spec.md`:** conserva el vocabulario del Gherkin del estudiante (WHEN = Cuando, THEN = Entonces, y los `Dado` como precondición del escenario), y escribe los requisitos con «El sistema DEBE…» o en el idioma del proyecto, de forma coherente en todos los archivos.
- **Idioma:** todo en español. Para eso, `openspec/config.yaml` lleva el contexto del proyecto (ver `cin324-configurar-stack`).
- **Planificación vs implementación:** `openspec-propose` solo planifica; no escribe código. La implementación empieza únicamente cuando el estudiante lo pide después de revisar.

## Comandos del CLI útiles para revisar

```bash
openspec list                         # cambios en curso
openspec status --change <cambio>    # qué artefactos están listos
openspec show <cambio>                # muestra el cambio completo
openspec validate <cambio>            # valida la estructura (usa --strict para ser más exigente)
openspec archive <cambio> --yes       # archiva por línea de comandos (alternativa a la skill de archivado)
```

## Si el estudiante no puede instalar OpenSpec

1. Confirma el motivo (versión de Node, permisos, red de la universidad).
2. Ofrece instalar la versión binaria con el script oficial (`curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh` en macOS/Linux; en Windows, `irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex` en PowerShell).
3. Como último recurso, el estudiante puede continuar sin el CLI creando a mano los cuatro artefactos en `openspec/changes/<cambio>/` con la misma estructura; lo único que se pierde es la validación automática y el archivado.
