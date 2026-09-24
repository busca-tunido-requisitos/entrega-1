# Proceso de negocio — AS-IS

## Macro-proceso y proceso específico

Gestión Habitacional Universitaria → Búsqueda y Arriendo Tradicional de Pensión Universitaria

## Objetivo de negocio del proceso

Permitir que un estudiante universitario foráneo encuentre, evalúe y asegure una habitación en pensión para el periodo académico, y que el dueño del inmueble logre ocupar sus habitaciones disponibles asegurando el pago mensual de arriendo.

## Participantes y sus objetivos

| Participante             | Objetivo en el proceso                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Estudiante Universitario | Encontrar un alojamiento seguro, asequible y cercano a su sede de estudio antes del inicio del semestre académico.             |
| Dueño de Pensión         | Ocupar las piezas desocupadas con postulantes universitarios responsables y asegurar el cobro puntual del arriendo y garantía. |

## Diagrama AS-IS

![Proceso AS-IS](./diagramas/as-is.png)
Archivo fuente: [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)

_Nota: Las tareas del diagrama distinguen explícitamente su tipología estándar BPMN 2.0 (estilo Camunda / bpmn-js en blanco y negro):_

- **Manual Task (Tarea Manual — ícono de mano)**: Ejecutada íntegramente por una persona sin soporte informático (_Buscar afiches y avisos en calle y postes_, _Coordinar visita presencial al inmueble_, _Anotar cita en cuaderno papel de postulantes_, _Mostrar pieza y explicar normas de convivencia_, _Pagar garantía en efectivo o transferencia_, _Registrar reserva manual y entregar llaves_).
- **User Task (Tarea de Usuario — ícono de persona)**: Ejecutada por una persona interactuando con herramientas informáticas genéricas (_Contactar al dueño por chat (WhatsApp)_, _Responder chat y enviar fotos del inmueble_, _Evaluar fotos y condiciones informales_).
- **Service Task (Tarea de Servicio — ícono de engranajes)**: En este flujo tradicional no intervienen servicios automáticos de negocio.

## Problemas identificados

- **Dispersión y desactualización de la información**: El estudiante debe recorrer físicamente sectores aledaños a la universidad o revisar publicaciones informales en redes sociales sin saber si las piezas siguen realmente disponibles, provocando desgaste y pérdida de tiempo.
- **Opacidad en tarifas y servicios incluidos**: Gran parte de los avisos informales no transparentan el costo de consumos básicos (agua, luz, gas, internet), generando disputas posteriores o cobros imprevistos para el estudiante.
- **Riesgo de fraude y falta de verificación**: Ausencia de mecanismos para comprobar la veracidad de las fotos, las condiciones reales de habitabilidad y la titularidad del inmueble antes de pagar una reserva o garantía.
- **Sobrecarga y desorganización operativa del arrendador**: El propietario debe atender múltiples llamadas y mensajes repetitivos a deshora, anotando citas en cuadernos o agendas personales, lo que deriva en cruces de horarios y visitas fallidas (postulantes que no asisten).
- **Falta de acreditación de los postulantes**: El dueño no dispone de una forma ágil y estandarizada de verificar la condición de alumno regular del interesado previo a la visita presencial.
