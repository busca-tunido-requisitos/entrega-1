---
name: cin324-auditar-repositorio
description: Explora el repositorio de un proyecto de Ingeniería de Requisitos (CIN 324) y evalúa si están los artefactos necesarios para generar código - BPMN AS-IS y TO-BE, historias de usuario con Gherkin, modelo de dominio, diagrama de casos de uso, al menos un diagrama de estado, al menos dos diagramas de secuencia, requisitos y atributos de calidad - detallando lo que falta y pidiendo al estudiante que lo aporte o resuelva las dudas. Úsala al comenzar a generar la aplicación, cuando se pida revisar si la documentación está completa, o cuando los documentos cambiaron.
argument-hint: "[carpeta opcional a auditar]"
---

# Auditar la completitud del repositorio

Tu objetivo es responder, con evidencia, una pregunta: **¿está la documentación completa para generar la aplicación?** No evalúas la calidad fina de los artefactos (eso lo hace la rúbrica del curso), sino si existen, si se pueden leer y si tienen lo mínimo para derivar código. Eres de solo lectura: no modificas ningún archivo del estudiante.

## Paso 1 · Explorar

1. Si recibiste una carpeta como argumento, úsala; si no, usa la raíz del repositorio abierto.
2. Lista la estructura (`.md`, `.puml`, `.mmd`, `.drawio`, `.bpmn`, `.png`, `.svg`, `.jpg`) ignorando `node_modules`, `.git`, `openspec/changes/archive` y el código de la aplicación ya generada.
3. Ubica cada artefacto con las pistas de [convenciones-curso.md](./references/convenciones-curso.md): nombres de archivo de las Entregas 1 y 2, encabezados y extensiones. Si los nombres difieren, busca por contenido (por ejemplo, «Como … quiero … para», `@startuml`, `classDiagram`, `stateDiagram`, `sequenceDiagram`, `<bpmn:definitions`).
4. **Historias de usuario:** pueden estar como archivo `.md` (por ejemplo `04-historias-usuario.md`) o como issues de GitHub. Revisa primero los archivos. Si no hay o están incompletos y tienes `gh` (GitHub CLI) disponible y autenticado, consulta los issues (`gh issue list --state all --limit 100 --json number,title,body,labels`). Si hay ambas fuentes, indícalo y pregunta cuál es la fuente de verdad. Si no puedes acceder a los issues, pide al estudiante que te indique dónde están o que pegue el contenido.
5. **Imágenes:** un `.png` sin archivo fuente es evidencia válida pero menos confiable. Si puedes interpretar imágenes, ábrela y resume lo que ves (clases, actores, estados); si no puedes, dilo y pide el fuente (`.puml`, `.mmd`, `.drawio`) o una descripción en texto.

## Paso 2 · Evaluar cada artefacto

Usa los criterios de [criterios-completitud.md](./references/criterios-completitud.md). Para cada uno asigna un estado:

- **Completo** (cumple lo mínimo).
- **Parcial** (existe pero le falta algo concreto: dilo con exactitud).
- **Faltante** (no se encontró).

Registra siempre la **evidencia**: ruta del archivo (y sección o línea si ayuda). Nunca declares «completo» algo que no leíste.

Clasifica la importancia de cada elemento para generar código:

- **Bloqueante:** historias de usuario con Gherkin y modelo de dominio. Sin ellos no se puede generar código con trazabilidad.
- **Importante:** casos de uso, diagramas de estado (al menos uno) y de secuencia (al menos dos). Si faltan, la skill de validación de historias reconstruye el flujo con el estudiante, pero conviene completarlos.
- **Contexto:** BPMN AS-IS y TO-BE (dan el porqué y la trazabilidad con actividades), requisitos funcionales y no funcionales, atributos de calidad priorizados. Los no funcionales se leen pero **no se implementan**.

## Paso 3 · Entregar el informe

Muestra el informe con el formato de [plantilla-informe.md](./references/plantilla-informe.md): una tabla resumen (artefacto, estado, evidencia, qué falta), seguida de la lista de elementos faltantes o parciales y de las dudas que tengas (nombres que no calzan, historias sin Gherkin, un diagrama ilegible, etc.).

Sé concreto y breve. Ejemplos de buen detalle: «`04-historias-usuario.md` tiene 5 historias, pero HU-04 y HU-05 no traen escenarios Gherkin», «hay un solo diagrama de secuencia (DSS-01); el criterio pide al menos dos para los casos de uso importantes».

## Paso 4 · Pedir lo que falta (y esperar)

Termina con un mensaje al estudiante que:

1. Diga si se puede continuar: **sí** (sin bloqueantes), **sí, con supuestos** (faltan elementos importantes o de contexto) o **no todavía** (falta un bloqueante).
2. Para cada faltante o duda, ofrezca dos caminos: (a) agregarlo al repositorio (y volver a pedirte la auditoría) o (b) responder en el chat, en cuyo caso lo registras como **supuesto** en `.cin324/proyecto.md` (con fecha).
3. Pregunte explícitamente: «¿Quieres completar algo antes de seguir, o continuamos con estos supuestos?».

**Detente y espera la respuesta.** No avances a elegir historia ni a generar nada hasta que el estudiante responda. Si aporta archivos nuevos, vuelve a explorar solo lo que cambió y actualiza el informe.

## Al terminar

Deja resumido el resultado (mapa de rutas, estado de cada artefacto y supuestos) para que la skill orquestadora `cin324-generar-app` lo guarde en `.cin324/proyecto.md`. Si ese archivo no existe y el estudiante confirma continuar, pide permiso para crearlo con la plantilla de esa skill.
