# Proceso de negocio — AS-IS

## Macro-proceso y proceso específico

**Gestión de Alojamiento Estudiantil** → *Búsqueda, Consulta Telefónica de Disponibilidad y Arriendo Tradicional de Pensiones Universitarias*.

## Objetivo de negocio del proceso

Permitir que los estudiantes de educación superior encuentren y arrienden una habitación para su periodo académico, asegurando a los dueños de pensiones la ocupación de sus piezas mediante acuerdos e interacciones verbales directas.

## Participantes y sus objetivos

| Participante | Objetivo en el proceso |
|--------------|------------------------|
| **Estudiante Universitario** | Encontrar una habitación asequible, cercana a su casa de estudios y con reglas claras, reduciendo la incertidumbre y el tiempo invertido en contactar avisos desactualizados. |
| **Dueño de Pensión** | Mantener sus habitaciones arrendadas continuamente a postulantes confiables, minimizando las interrupciones telefónicas a deshoras y el descontrol de cupos. |

## Diagrama AS-IS

![Proceso AS-IS](./assets/diagramas/as-is.png)

Archivo fuente: [`./assets/diagramas/as-is.bpmn`](./assets/diagramas/as-is.bpmn)

> **Nota de notación BPMN 2.0:** Todas las actividades del proceso AS-IS corresponden a **Tareas Manuales** (identificadas con el ícono normativo de mano en la esquina superior izquierda de cada actividad), dado que el proceso tradicional opera sin soporte de software y depende exclusivamente de recorridos físicos, llamadas telefónicas y libretas de papel.

---

## Actividades del Proceso AS-IS

### Carril: Estudiante Universitario
- **ACT-AS-01 — Buscar avisos informales en postes y redes:** El estudiante recorre las inmediaciones de los campus universitarios o revisa grupos informales en redes sociales para recopilar números de contacto de pensiones.
- **ACT-AS-02 — Recopilar teléfonos y llamar al dueño:** El estudiante anota los contactos y realiza llamadas telefónicas exploratorias a los propietarios.
- **ACT-AS-03 — Consultar disponibilidad y valor por teléfono:** El estudiante pregunta al dueño si tiene habitaciones libres, las condiciones de convivencia y el precio mensual.

### Carril: Dueño de Pensión
- **ACT-AS-04 — Atender llamada telefónica del estudiante:** El dueño interrumpe sus quehaceres para contestar la llamada y escuchar el requerimiento del estudiante.
- **ACT-AS-05 — Revisar disponibilidad en cuaderno manual:** El dueño revisa su libreta de papel o memoria personal para corroborar si dispone de cupo vacante.
- **Compuerta Exclusiva — ¿Tiene pieza disponible?:**
  - **Rama No:**
    - **ACT-AS-06 — Informar indisponibilidad por teléfono:** El dueño informa verbalmente que no tiene habitaciones libres y corta la llamada.
    - **ACT-AS-07 — Finalizar llamada y registrar descarte:** El dueño da por cerrada la consulta sin generar alternativas para el postulante.
    - *(Flujo retorna al Estudiante)* **ACT-AS-08 — Reiniciar búsqueda física de otros avisos:** El estudiante queda sin alojamiento y debe reiniciar el ciclo de búsqueda desde cero (**Fin: Sin arriendo**).
  - **Rama Sí:**
    - **ACT-AS-09 — Informar precio y citar a visita presencial:** El dueño informa el canon mensual, describe las normas generales y fija una cita en el inmueble.
    - **ACT-AS-10 — Recibir al estudiante en el inmueble:** El dueño espera y recibe al estudiante en la pensión para mostrar la habitación.
    - *(Flujo retorna al Estudiante)* **ACT-AS-11 — Visitar inmueble, pagar efectivo y recibir llaves:** El estudiante inspecciona la pieza, entrega el dinero en efectivo del primer mes/garantía y recibe las llaves físicas (**Fin: Arriendo presencial**).

---

## Problemas identificados

- **P1 (Estudiante): Pérdida de tiempo e incertidumbre por llamadas a ciegas:** El estudiante invierte horas o días llamando a números obsoletos para enterarse de que las piezas ya no están disponibles, sin registro formal de condiciones ni respaldo de cupo.
- **P2 (Dueño): Sobrecarga telefónica y gestión manual de inventario:** El propietario recibe constantes llamadas a deshoras para consultar piezas ya ocupadas, debiendo gestionar su disponibilidad en cuadernos físicos con riesgo de duplicar compromisos.
