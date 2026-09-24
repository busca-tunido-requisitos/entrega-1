# Proceso de negocio — AS-IS

## Macro-proceso y proceso específico

**Gestión de Alojamiento Estudiantil** → *Búsqueda, Consulta de Disponibilidad y Arriendo Tradicional de Habitaciones en Pensiones Universitarias*.

## Objetivo de negocio del proceso

Permitir que los estudiantes de educación superior encuentren y arrienden una habitación habitacional para su periodo académico, asegurando a los dueños de pensiones la ocupación de sus piezas disponibles mediante acuerdos informales directos.

## Participantes y sus objetivos

| Participante | Objetivo en el proceso |
|--------------|------------------------|
| **Estudiante Universitario** | Encontrar una habitación que se ajuste a su presupuesto y cercana a su casa de estudios, con servicios básicos funcionales y reglas claras, minimizando el tiempo y riesgo de estafa en la búsqueda. |
| **Dueño de Pensión** | Mantener sus habitaciones arrendadas continuamente a estudiantes confiables, evitando desocupación y gestionando los acuerdos con el menor esfuerzo operativo posible. |

## Diagrama AS-IS

![Proceso AS-IS](./assets/diagramas/as-is.png)

Archivo fuente: [`./assets/diagramas/as-is.bpmn`](./assets/diagramas/as-is.bpmn)

> **Nota de notación BPMN 2.0:** Todas las tareas del proceso AS-IS corresponden a **Tareas Manuales** (marcadas con el ícono normativo de mano en la esquina superior izquierda de cada actividad), dado que el proceso actual carece de soporte de software y se ejecuta mediante interacciones presenciales, cuadernos físicos o llamadas telefónicas.

---

## Actividades del Proceso AS-IS

### ACT-AS-01 — Buscar avisos informales en postes y redes sociales
El estudiante recorre a pie los alrededores de las universidades o revisa grupos informales en redes sociales para recopilar números de contacto de pensiones.

### ACT-AS-02 — Llamar para consultar disponibilidad y precio
El estudiante llama por teléfono al dueño para preguntar si aún tiene piezas disponibles, el precio mensual y las condiciones generales.

### ACT-AS-03 — Revisar disponibilidad en cuaderno manual
El dueño revisa su libreta de anotaciones para verificar si alguna de sus habitaciones se encuentra libre o ya fue comprometida.

### ACT-AS-04 — Realizar visita presencial para ver inmueble y reglas
Si hay cupo disponible, el estudiante visita físicamente la pensión, conoce la habitación y negocia verbalmente las normas de convivencia y servicios incluidos.

### ACT-AS-05 — Pago de mes/garantía y entrega de llaves
Ambas partes acuerdan el arriendo, el estudiante entrega el dinero en efectivo o transferencia, y el dueño le entrega las llaves de la habitación.

---

## Problemas identificados

- **P1 (Asociado al Estudiante): Pérdida de tiempo e incertidumbre por llamadas ciegas:** El estudiante gasta horas llamando a números desactualizados o anotados en postes solo para descubrir que las piezas ya fueron arrendadas, enfrentando además cobros imprevistos de luz/gas o reglas no informadas previamente.
- **P2 (Asociado al Dueño): Descontrol y sobrecarga en la gestión manual de disponibilidad:** El propietario atiende decenas de llamadas telefónicas a deshoras para consultar por piezas ya ocupadas, debiendo gestionar su inventario en libretas manuales con riesgo de comprometer el mismo cupo a dos personas.
