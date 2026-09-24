# Análisis de rediseño y propuesta TO-BE

## Mejoras identificadas por participante

| Participante | Objetivo | Problema | Mejora deseada |
|--------------|----------|----------|-----------------|
| **Estudiante Universitario** | Encontrar alojamiento accesible, cercano y con normas claras. | Pérdida de tiempo llamando a avisos obsoletos, sin saber si hay piezas libres ni las reglas reales de la casa. | Consultar en tiempo real un catálogo georreferenciado por universidad con filtros de precio, servicios incluidos y normas explícitas de convivencia. |
| **Estudiante Universitario** | Certeza sobre la calidad del servicio (internet, ambiente y trato). | Imposibilidad de auditar la veracidad del aviso y calidad de los servicios antes de arrendar. | Visualizar calificaciones auditadas por pares universitarios con correo institucional (`@alumnos...`), evaluando limpieza, silencio, trato del dueño y WiFi. |
| **Dueño de Pensión** | Mantener habitaciones ocupadas y administrar eficientemente los cupos. | Descontrol con cuadernos físicos y saturación telefónica por consultas de piezas ya arrendadas. | Conmutar la disponibilidad de habitaciones (libre/ocupada) con un solo toque desde su celular y monitorear su porcentaje de ocupación e ingresos en tiempo real. |
| **Dueño de Pensión** | Comunicar acuerdos claros y evitar conflictos con residentes. | Desgaste en negociaciones verbales y malentendidos sobre cobros de luz/gas o visitas. | Ficha pública estandarizada con desglose de servicios básicos incluidos, reglas de convivencia y enlace directo a WhatsApp solo con estudiantes realmente interesados. |

---

## Iniciativas de rediseño

### Iniciativa 1 — Autoservicio de Búsqueda Georreferenciada con Filtros Estudiantiles
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-01`](./01-proceso-as-is.md#act-as-01) y [`ACT-AS-02`](./01-proceso-as-is.md#act-as-02) (Estudiante).
- **Heurística aplicada:** **Empoderamiento (Autoservicio)** + **Tecnología Integral** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** Otorga autonomía inmediata al estudiante para explorar pensiones según su campus de estudio, visualizando distancia exacta en metros, rango de precios mediante un histograma interactivo y normas (toque de queda, visitas, mascotas, preferencia de género).
- **Efecto esperado (Cuadrante del Diablo):**
  - *Tiempo:* Reducción drástica del tiempo de búsqueda de días a minutos.
  - *Costo:* Menor gasto en traslados físicos y llamadas telefónicas.
  - *Calidad:* Elevada precisión de los datos y geolocalización.
  - *Flexibilidad:* Alta adaptabilidad para comparar múltiples opciones desde cualquier dispositivo móvil.

### Iniciativa 2 — Conmutación Inmediata de Disponibilidad y Métricas de Ocupación para Dueños
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-03`](./01-proceso-as-is.md#act-as-03), [`ACT-AS-04`](./01-proceso-as-is.md#act-as-04) y [`ACT-AS-05`](./01-proceso-as-is.md#act-as-05) (Dueño).
- **Heurística aplicada:** **Automatización de tareas** + **Reducción de contacto** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** El dueño cambia el estado de cada habitación (disponible/ocupada) en un switch móvil; el sistema actualiza el catálogo instantáneamente y recalcula sus indicadores de ocupación, eliminando llamadas innecesarias por piezas agotadas.
- **Efecto esperado (Cuadrante del Diablo):**
  - *Tiempo:* Eliminación de interrupciones telefónicas y coordinación manual.
  - *Costo:* Costo de implementación de software compensado por nula vacancia de piezas.
  - *Calidad:* Inventario sincronizado en tiempo real sin dobles reservas.
  - *Flexibilidad:* Gestión ágil desde el teléfono móvil sin importar la ubicación del dueño.

### Iniciativa 3 — Auditoría Social Universitaria y Validación de Residentes
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-07`](./01-proceso-as-is.md#act-as-07) (Estudiante / Dueño).
- **Heurística aplicada:** **Adición de control** + **Integración** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** Permite a los estudiantes publicar reseñas multidimensionales (limpieza, tranquilidad, trato del dueño y estabilidad del WiFi). El sistema valida automáticamente el dominio del correo institucional (`@alumnos...`) para otorgar la insignia de "Residente Verificado", eliminando la asimetría de información.
- **Efecto esperado (Cuadrante del Diablo):**
  - *Tiempo:* Breve tiempo de redacción de reseña post-estadía.
  - *Costo:* Cero costo adicional de verificación para los usuarios.
  - *Calidad:* Máxima confianza comunitaria sustentada en opiniones legítimas de pares.
  - *Flexibilidad:* Sistema de feedback estandarizado y transparente.

### Iniciativa 4 — Actualización Colaborativa de Fichas (Gestión de Propuestas)
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-07`](./01-proceso-as-is.md#act-as-07) (Estudiante / Dueño).
- **Heurística aplicada:** **Triage / Caso Especial** + **Empoderamiento** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** Mecanismo colaborativo donde los estudiantes sugieren correcciones sobre normas o servicios desactualizados, y el dueño dispone de un buzón con vista diff para aprobar o rechazar la propuesta con un clic.
- **Efecto esperado (Cuadrante del Diablo):**
  - *Tiempo:* Actualización inmediata de datos sin esperar auditorías manuales.
  - *Costo:* Mantenimiento descentralizado y a costo cero del catálogo.
  - *Calidad:* Información permanentemente depurada por la comunidad.
  - *Flexibilidad:* El dueño conserva el control decisorio final sobre su inmueble.

---

## Diagrama TO-BE

![Proceso TO-BE](./assets/diagramas/to-be.png)

Archivo fuente: [`./assets/diagramas/to-be.bpmn`](./assets/diagramas/to-be.bpmn)

> **Nota de notación BPMN 2.0:** El diagrama distingue estrictamente los tipos de tareas según el estándar:
> - **Tareas de Usuario (`User Task`):** Identificadas con el ícono de silueta de persona en la esquina superior izquierda (actividades ejecutadas por el estudiante o el dueño mediante la interfaz de BuscaTuNido).
> - **Tareas de Servicio (`Service Task`):** Identificadas con el ícono de engranaje en la esquina superior izquierda (actividades ejecutadas de forma automatizada por el sistema backend/algoritmos).
> - **Tareas Manuales (`Manual Task`):** Identificadas con el ícono de mano (acciones físicas fuera del sistema, como la visita presencial final y entrega física de llaves).

---

## Actividades del Proceso TO-BE

### ACT-TOBE-01 — Conmutar disponibilidad de habitación en app móvil
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Dueño de Pensión.
- **Descripción:** El propietario accede a su panel móvil de habitaciones y activa o desactiva la disponibilidad de una pieza con un toque al producirse una vacancia.

### ACT-TOBE-02 — Actualizar catálogo y recalcular tasa de ocupación
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El backend actualiza la disponibilidad pública en el feed geográfico y recalcula automáticamente los KPIs de ocupación y rentabilidad proyectada del dueño.

### ACT-TOBE-03 — Filtrar catálogo por campus, rango de precio y normas
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante selecciona su universidad, ajusta el slider con histograma dinámico de precios y filtra por servicios incluidos (agua/luz/gas/wifi) y normas de convivencia (toque de queda, visitas, mascotas).

### ACT-TOBE-04 — Calcular distancias a campus y filtrar en tiempo real
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El motor de búsqueda calcula las distancias geodésicas en metros y tiempos de traslado caminando a las sedes universitarias, retornando las pensiones ordenadas por relevancia y proximidad.

### ACT-TOBE-05 — Consultar ficha con fotos, reglas, servicios y opiniones
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante inspecciona el modal de detalle con galería de imágenes, habitaciones disponibles, desglose de reglas de la casa y reseñas de residentes verificados.

### ACT-TOBE-06 — Contactar al dueño vía WhatsApp directo
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** Al estar conforme con el precio y las normas expuestas, el estudiante presiona el botón de contacto que abre un chat directo de WhatsApp con el propietario para agendar la visita final.

### ACT-TOBE-07 — Realizar visita presencial y entrega de llaves
- **Tipo:** Tarea Manual (`Manual Task`).
- **Actor:** Estudiante Universitario y Dueño de Pensión.
- **Descripción:** Encuentro físico en el inmueble para verificar la habitación, firmar el acuerdo y recibir las llaves de la vivienda.

### ACT-TOBE-08 — Publicar reseña multidimensional post-estadía
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante residente califica su experiencia evaluando limpieza, silencio, trato del dueño y calidad del WiFi, adjuntando fechas y tiempo de permanencia.

### ACT-TOBE-09 — Validar correo institucional y actualizar calificación
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El backend comprueba la validez del correo institucional del estudiante para asignar la insignia de residente verificado y recalcula el puntaje promedio ponderado de la pensión.

### ACT-TOBE-10 — Proponer corrección de datos o servicios
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** Desde la ficha de la pensión, el estudiante envía una propuesta de corrección sobre precios desactualizados, normas modificadas o servicios ausentes.

### ACT-TOBE-11 — Revisar diff de propuesta en buzón y resolver
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Dueño de Pensión.
- **Descripción:** El dueño abre su buzón de sugerencias, examina la comparativa visual (diff) entre los datos actuales y los propuestos, y aprueba o rechaza el cambio.

### ACT-TOBE-12 — Consolidar cambios aprobados en pensión
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El sistema aplica atómicamente las modificaciones aprobadas sobre el registro de la pensión en la base de datos, actualizando la ficha pública.

---

## Actividades que cambian del AS-IS al TO-BE

| Actividad en el AS-IS | Actividad en el TO-BE | Qué cambia |
|-------------------------|--------------------------|------------|
| [`ACT-AS-01`](./01-proceso-as-is.md#act-as-01) — Buscar avisos informales en postes y redes | [`ACT-TOBE-03`](#act-tobe-03) — Filtrar catálogo por campus, precio y normas | Se sustituye la búsqueda física aleatoria por un catálogo web centralizado con búsqueda geográfica y filtros por universidad. |
| [`ACT-AS-02`](./01-proceso-as-is.md#act-as-02) — Llamar para consultar precio y cupo | [`ACT-TOBE-04`](#act-tobe-04) — Calcular distancias y filtrar en tiempo real | Se automatiza la verificación: el sistema informa de inmediato precios, distancias y vacantes sin necesidad de llamadas telefónicas. |
| [`ACT-AS-03`](./01-proceso-as-is.md#act-as-03) — Revisar disponibilidad en cuaderno o memoria | [`ACT-TOBE-01`](#act-tobe-01) — Conmutar disponibilidad de habitación en app | El dueño administra sus cupos con un switch táctil en su smartphone en vez de libretas en papel. |
| [`ACT-AS-04`](./01-proceso-as-is.md#act-as-04) — Informar indisponibilidad al estudiante | [`ACT-TOBE-02`](#act-tobe-02) — Actualizar catálogo y recalcular ocupación | Tarea absorbida por el sistema: si una pensión o habitación no tiene cupos, no aparece disponible en el feed. |
| [`ACT-AS-05`](./01-proceso-as-is.md#act-as-05) — Informar precio y citar a visita | [`ACT-TOBE-05`](#act-tobe-05) — Consultar ficha con fotos, reglas y opiniones | La ficha web publica el precio exacto, fotos en alta resolución, servicios incluidos y normas de antemano. |
| [`ACT-AS-06`](./01-proceso-as-is.md#act-as-06) — Visita presencial a ciegas | [`ACT-TOBE-06`](#act-tobe-06) — Contactar al dueño vía WhatsApp directo | La coordinación presencial solo ocurre cuando el estudiante ya validó fotos, reglas y precios, abriendo chat directo. |
| [`ACT-AS-07`](./01-proceso-as-is.md#act-as-07) — Negociar verbalmente reglas y cobros de luz/gas | [`ACT-TOBE-08`](#act-tobe-08) y [`ACT-TOBE-10`](#act-tobe-10) — Reseñas auditadas y propuestas | Las condiciones quedan explícitas; la comunidad audita su cumplimiento mediante reseñas por pares y propuestas de corrección. |
| [`ACT-AS-08`](./01-proceso-as-is.md#act-as-08) — Pago inicial y entrega de llaves | [`ACT-TOBE-07`](#act-tobe-07) — Realizar visita presencial y entrega de llaves | Se mantiene como tarea manual de cierre, pero habiendo resuelto previamente toda la fricción de información y acuerdo. |
