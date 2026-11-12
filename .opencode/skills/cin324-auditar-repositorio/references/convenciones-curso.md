# Cómo se ve la documentación del curso

Pistas para encontrar cada artefacto. Los equipos pueden haber usado otros nombres: si no aparece con estos, busca por contenido.

## Estructura habitual del repositorio

| Archivo (Entrega 1) | Contenido |
|---------------------|-----------|
| `IngReq-Entrega 1.md` | Documento maestro con el índice de los demás |
| `01-proceso-as-is.md` | Proceso AS-IS: participantes, diagrama BPMN (`./diagramas/as-is.png` y `as-is.bpmn`), problemas |
| `02-rediseno-to-be.md` | Iniciativas de rediseño, diagrama TO-BE (`to-be.png` y `to-be.bpmn`), tabla de actividades que cambian (con IDs como `ACT-TOBE-03`) |
| `03-requisitos.md` | Requisitos de producto (RP-xx, funcional/no funcional, actividad TO-BE asociada) y de proyecto (RY-xx), requisito derivado |
| `04-historias-usuario.md` | Historias `HU-xx` («Como … quiero … para …») con actividad del TO-BE asociada y criterios de aceptación |
| `05-elicitacion.md` | Técnicas de elicitación y evidencia |
| `06-atributos-calidad.md` | Priorización de atributos ISO 25010 y métricas de los tres principales |

| Archivo (Entrega 2) | Contenido |
|---------------------|-----------|
| `IngReq-Entrega 2.md` | Documento maestro: equipo, responsabilidades, uso de IA, índice |
| `07-criterios-aceptacion.md` | Escenarios Gherkin por historia, en bloques ` ```gherkin ` con `Característica`, `Escenario`, `Dado`, `Cuando`, `Entonces` |
| `08-modelo-dominio.md` | Diagrama de clases del dominio (`modelo-dominio.puml`/`.png`), descripción de clases, asociaciones, decisiones |
| `09-casos-de-uso.md` | Actores, diagrama de casos de uso, tabla `CU-xx` ↔ `HU-xx` |
| `10-diagramas-secuencia.md` | `DSS-xx`: diagramas de secuencia de sistema, con CU y HU asociados |
| `11-diagramas-estado.md` | `EST-xx`: diagramas de estado de clases con ciclo de vida y tabla de transiciones |
| `12-trazabilidad.md` | Matriz requisito ↔ historia ↔ CU ↔ DSS ↔ EST ↔ clases |

Carpeta de diagramas: `diagramas/`.

## Pistas por contenido

| Artefacto | Qué buscar |
|-----------|-------------|
| BPMN | Archivos `.bpmn`, `<bpmn:definitions`, `<bpmn2:`, imágenes llamadas `as-is`/`to-be`; tareas de usuario, de servicio y manuales |
| Historias de usuario | Frases «Como … quiero … para …», IDs `HU-xx`, issues con etiquetas como `user-story` |
| Gherkin | `Característica:` / `Feature:`, `Escenario:` / `Scenario:`, líneas que empiezan con `Dado`, `Cuando`, `Entonces`, `Given`, `When`, `Then` |
| Modelo de dominio | `@startuml` con `class`, o `classDiagram` (Mermaid), o imagen llamada `modelo-dominio`; asociaciones con multiplicidades (`"1" -- "0..*"`) |
| Casos de uso | `@startuml` con `actor` y `usecase` o `(…)`, `rectangle`; imagen `casos-de-uso`; IDs `CU-xx` |
| Diagrama de estado | `state`, `[*] -->`, `stateDiagram-v2`; imagen `est-xx` o `estado-…`; IDs `EST-xx`; tabla de transiciones |
| Diagrama de secuencia | `participant`, `actor`, `->`, `-->`, `alt`/`opt`/`loop`, o `sequenceDiagram`; IDs `DSS-xx` |
| Requisitos | Tablas con `RP-xx`/`RY-xx`/`RF-xx`, columnas funcional / no funcional |
| Atributos de calidad | Lista priorizada de los nueve atributos de primer nivel de ISO 25010: adecuación funcional, eficiencia de desempeño, compatibilidad, usabilidad (capacidad de interacción), fiabilidad, seguridad, mantenibilidad, flexibilidad, protección (safety) |

## Artefactos de apoyo del flujo

| Archivo | Para qué |
|---------|----------|
| `.cin324/proyecto.md` | Estado del proyecto entre sesiones (lo crea el flujo) |
| `.cin324/historias/HU-xx.md` | Ficha confirmada de cada historia |
| `openspec/` | Especificaciones y cambios de OpenSpec |
