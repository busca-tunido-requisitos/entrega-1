# Análisis de rediseño y propuesta TO-BE

## Mejoras identificadas por participante

| Participante | Objetivo | Problema | Mejora deseada |
|--------------|----------|----------|-----------------|
| **Estudiante Universitario** | Encontrar alojamiento accesible, cercano y con normas claras. | Pérdida de tiempo llamando a avisos obsoletos, sin saber si hay piezas libres ni las reglas reales de la casa. | Consultar en tiempo real un catálogo georreferenciado por universidad con filtros de precio, servicios incluidos, normas de convivencia y reseñas auditadas. |
| **Dueño de Pensión** | Mantener habitaciones ocupadas y administrar eficientemente los cupos. | Descontrol con cuadernos físicos y saturación telefónica por consultas de piezas ya arrendadas. | Conmutar la disponibilidad de habitaciones (libre/ocupada) con un solo toque desde su celular y recibir contacto directo solo de interesados calificados. |

---

## Iniciativas de rediseño

### Iniciativa 1 — Búsqueda y Filtrado de Pensiones con Autoservicio
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-01`](./01-proceso-as-is.md#act-as-01) y [`ACT-AS-02`](./01-proceso-as-is.md#act-as-02) (Estudiante).
- **Heurística aplicada:** **Empoderamiento (Autoservicio)** + **Tecnología Integral** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** Otorga autonomía al estudiante para filtrar directamente por sede universitaria, distancia y precio, eliminando la necesidad de llamar al dueño para consultar disponibilidad básica.
- **Efecto esperado (tiempo/costo/calidad/flexibilidad):** Reduce el tiempo de búsqueda de días a minutos; disminuye el costo de llamadas telefónicas; eleva la calidad de la información mostrada y flexibiliza la comparación desde dispositivos móviles.

### Iniciativa 2 — Conmutación de Disponibilidad Móvil y Reseñas Verificadas
- **Actividad(es) del AS-IS que afecta:** [`ACT-AS-03`](./01-proceso-as-is.md#act-as-03) y [`ACT-AS-04`](./01-proceso-as-is.md#act-as-04) (Dueño / Estudiante).
- **Heurística aplicada:** **Automatización de tareas** + **Adición de control** *(Reijers & Liman Mansar, 2005)*.
- **Objetivo o mejora que resuelve:** El dueño cambia el estado de cada habitación (disponible/ocupada) en su app móvil, actualizando el catálogo automáticamente; además, el sistema valida el correo institucional del estudiante para emitir reseñas verificadas, suprimiendo la asimetría de información.
- **Efecto esperado (tiempo/costo/calidad/flexibilidad):** Ahorra tiempo al dueño evitando llamadas infructuosas; garantiza un inventario actualizado en tiempo real; incrementa la calidad y veracidad de las opiniones, con mínimo costo operativo.

---

## Diagrama TO-BE

![Proceso TO-BE](./assets/diagramas/to-be.png)

Archivo fuente: [`./assets/diagramas/to-be.bpmn`](./assets/diagramas/to-be.bpmn)

> **Nota de notación BPMN 2.0:** El diagrama distingue explícitamente los tres tipos de tareas según la norma:
> - **Tareas de Usuario (`User Task`):** Ícono de silueta de persona (ejecutadas por el estudiante o dueño apoyados por la aplicación).
> - **Tareas de Servicio (`Service Task`):** Ícono de engranaje (ejecutadas automáticamente por el backend del sistema).
> - **Tareas Manuales (`Manual Task`):** Ícono de mano (acciones físicas fuera del sistema, como la visita presencial final y entrega de llaves).

---

## Actividades del Proceso TO-BE

### ACT-TOBE-01 — Conmutar disponibilidad en app móvil
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Dueño de Pensión.
- **Descripción:** El propietario activa o desactiva la disponibilidad de una habitación con un toque en su teléfono móvil al producirse un arriendo o vacancia.

### ACT-TOBE-02 — Actualizar catálogo y tasa de ocupación
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El backend actualiza la oferta visible en el catálogo y recalcula automáticamente los indicadores de ocupación del dueño.

### ACT-TOBE-03 — Filtrar por campus, precio y normas
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante selecciona su universidad, ajusta el rango de precio y selecciona filtros de convivencia (toque de queda, visitas, servicios incluidos).

### ACT-TOBE-04 — Consultar ficha con fotos, reglas y WhatsApp
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante revisa fotos, reglas detalladas y calificaciones de la pensión, iniciando chat de WhatsApp directo con el dueño si está conforme.

### ACT-TOBE-05 — Realizar visita presencial y entrega de llaves
- **Tipo:** Tarea Manual (`Manual Task`).
- **Actor:** Estudiante Universitario y Dueño de Pensión.
- **Descripción:** Visita presencial final en el inmueble para verificar la habitación y concretar la entrega de llaves.

### ACT-TOBE-06 — Publicar reseña comunitaria post-estadía
- **Tipo:** Tarea de Usuario (`User Task`).
- **Actor:** Estudiante Universitario.
- **Descripción:** El estudiante califica su experiencia evaluando limpieza, silencio, trato del dueño y calidad de WiFi tras su estadía.

### ACT-TOBE-07 — Validar correo institucional y actualizar rating
- **Tipo:** Tarea de Servicio (`Service Task`).
- **Actor:** Sistema BuscaTuNido.
- **Descripción:** El sistema valida el dominio del correo institucional (`@alumnos...`) para asignar la insignia de residente verificado y actualiza el promedio de la pensión.

---

## Actividades que cambian del AS-IS al TO-BE

| Actividad en el AS-IS | Actividad en el TO-BE | Qué cambia |
|-------------------------|--------------------------|------------|
| [`ACT-AS-01`](./01-proceso-as-is.md#act-as-01) — Buscar avisos informales en postes y redes | [`ACT-TOBE-03`](#act-tobe-03) — Filtrar por campus, precio y normas | Se sustituye la búsqueda física desordenada por un catálogo centralizado con filtros georreferenciados y normas explícitas. |
| [`ACT-AS-02`](./01-proceso-as-is.md#act-as-02) — Llamar para consultar disponibilidad y precio | [`ACT-TOBE-04`](#act-tobe-04) — Consultar ficha con fotos, reglas y WhatsApp | La información de precios, normas y contacto directo queda visible de inmediato, reduciendo llamadas exploratorias ciegas. |
| [`ACT-AS-03`](./01-proceso-as-is.md#act-as-03) — Revisar disponibilidad en cuaderno manual | [`ACT-TOBE-01`](#act-tobe-01) — Conmutar disponibilidad en app móvil | El dueño gestiona su inventario en tiempo real desde el celular con un toque, reemplazando la libreta de papel. |
| [`ACT-AS-04`](./01-proceso-as-is.md#act-as-04) — Visita presencial a ciegas y negociación verbal | [`ACT-TOBE-06`](#act-tobe-06) — Publicar reseña comunitaria post-estadía | La reputación y cumplimiento de acuerdos se transparenta mediante un sistema de evaluación auditado por pares con correo institucional. |
