# Plantilla de `.cin324/proyecto.md`

Crea este archivo la primera vez, después de la auditoría, y actualízalo al terminar cada ciclo. Es la memoria del proyecto entre sesiones: mantenlo corto y exacto.

```markdown
# Estado del proyecto — generación de la aplicación

## Proyecto
- Nombre: [nombre del proyecto]
- Repositorio de documentación: [esta carpeta]
- Última auditoría: [AAAA-MM-DD] — resultado: [completo / con supuestos]

## Mapa de artefactos (rutas detectadas)
| Artefacto | Ruta(s) | Estado |
|-----------|---------|--------|
| BPMN AS-IS | [ruta] | [completo / parcial / faltante] |
| BPMN TO-BE | [ruta] | [...] |
| Historias de usuario | [archivo .md o "issues de GitHub"] | [...] |
| Criterios Gherkin | [ruta] | [...] |
| Modelo de dominio | [ruta .puml / .png] | [...] |
| Casos de uso | [ruta] | [...] |
| Diagramas de estado | [rutas] | [...] |
| Diagramas de secuencia | [rutas] | [...] |
| Requisitos y atributos de calidad | [rutas] | [...] |

## Supuestos acordados (por elementos faltantes o dudosos)
- [Supuesto 1, con fecha y quién lo confirmó]

## Stack (se define una sola vez)
- Lenguaje y framework: [TypeScript + Express / Python + FastAPI]
- Base de datos: SQLite — archivo [ruta]
- Pruebas: [Vitest / pytest]
- Cómo instalar: [comando]
- Cómo ejecutar: [comando] — URL: [http://localhost:xxxx]
- Cómo probar: [comando]

## Historias
| Historia | Estado | Cambio de OpenSpec | Fecha | Observaciones |
|----------|--------|--------------------|-------|----------------|
| HU-01 | [pendiente / en curso / hecha] | [hu-01-nombre] | [AAAA-MM-DD] | [ ] |

## Validaciones
| Historia | Informe | Estado | Fecha |
|----------|---------|--------|-------|
| [HU-02] | [`.cin324/validaciones/VAL-HU-02-1.md`] | [pendiente de edición / artefactos editados / verificado en el sistema] | [AAAA-MM-DD] |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
```
