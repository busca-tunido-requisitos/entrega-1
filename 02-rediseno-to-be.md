# Análisis de rediseño y propuesta TO-BE

## Mejoras identificadas por participante
| Participante | Objetivo | Problema | Mejora deseada |
|---|---|---|---|
| Estudiante Universitario | Encontrar pensión segura y bien ubicada | Descentralización, avisos engañosos y cobros ocultos | Catálogo centralizado con filtros de distancia a sedes universitarias, precios transparentes y servicios detallados. |
| Estudiante Universitario | Reducir riesgo de estafas y pérdidas de tiempo | Falta de respaldo en la reserva y visitas a lugares no convenientes | Ficha estandarizada con fotografías validadas y comprobante de reserva digital formalizado. |
| Dueño de Pensión (Arrendador) | Gestionar arriendos de forma ordenada | Saturación de mensajes repetitivos y postulantes informales que no asisten | Formulario de publicación estructurado y recepción de solicitudes con perfil estudiantil acreditado. |
| Dueño de Pensión (Arrendador) | Garantizar ocupación con postulantes serios | Registro manual en papel propenso a desorganización | Panel centralizado para aprobar o rechazar solicitudes con notificación automática. |

## Iniciativas de rediseño

### Iniciativa 1: Centralización y Autoservicio de Información (Information Integration & Self-Service)
- **Actividad(es) del AS-IS que afecta**: *Buscar afiches y avisos en inmediaciones universitarias* y *Contactar al dueño por mensajería (WhatsApp)*.
- **Heurística aplicada**: *Integración de información* y *Autoservicio del cliente* (Catálogo de mejores prácticas de rediseño de procesos).
- **Objetivo o mejora que resuelve**: Elimina la dispersión de avisos informales permitiendo al estudiante consultar directamente en un repositorio único con georreferenciación.
- **Efecto esperado**: **Tiempo**: Reducción de 3 semanas a minutos en la localización de opciones potenciales. **Costo**: Reducción a cero en gastos de transporte exploratorio previo.

### Iniciativa 2: Control en Origen y Estandarización de Fichas (Control Relocation & Standardization)
- **Actividad(es) del AS-IS que afecta**: *Responder mensaje y enviar fotografías del inmueble* y *Evaluar fotografías y condiciones informales*.
- **Heurística aplicada**: *Control en origen* y *Estandarización de entradas*.
- **Objetivo o mejora que resuelve**: Exige que el dueño declare de manera estructurada los servicios básicos incluidos (agua, luz, gas, wifi) y cargue fotografías obligatorias antes de habilitar la publicación.
- **Efecto esperado**: **Calidad**: Información 100% veraz y trazable. **Flexibilidad**: Comparación uniforme entre distintas alternativas habitacionales.

### Iniciativa 3: Automatización de Solicitudes y Notificaciones (Task Automation & Case Manager)
- **Actividad(es) del AS-IS que afecta**: *Anotar cita de visita en cuaderno de postulantes*, *Mostrar habitación y explicar normas de convivencia* y *Efectuar pago en efectivo o transferencia de garantía*.
- **Heurística aplicada**: *Automatización de tareas operativas* y *Flujo continuo de casos*.
- **Objetivo o mejora que resuelve**: Reemplaza el cuaderno físico por un flujo digital donde el estudiante formaliza su postulación con perfil verificado y el dueño responde con un clic, generando comprobante oficial.
- **Efecto esperado**: **Tiempo**: Confirmación de reserva en menos de 24 horas. **Calidad**: Eliminación total de citas cruzadas y respaldo digital para ambas partes.

## Diagrama TO-BE
![Proceso TO-BE](./diagramas/to-be.png)
Archivo fuente: [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)

*Nota: Las tareas del proceso TO-BE distinguen rigurosamente los marcadores estándar BPMN 2.0 (estilo Camunda / bpmn-js en blanco y negro):*
- **User Task (Tarea de Usuario — ícono de persona)**: *Buscar pensión y aplicar filtros*, *Enviar solicitud de reserva*, *Revisar solicitud y perfil en la app*, *Rechazar solicitud*, *Aprobar solicitud de reserva*, *Ver opciones alternativas sugeridas*, *Recibir confirmación y coordinar llegada por chat*.
- **Service Task (Tarea de Servicio — ícono de engranajes)**: *Consultar y cargar catálogo en tiempo real*, *Generar notificación push de solicitud*, *Actualizar estado y disparar alerta*, *Bloquear fechas y emitir ficha de confirmación*.

## Actividades que cambian del AS-IS al TO-BE
| Actividad en el AS-IS | Actividad en el TO-BE | Qué cambia |
|---|---|---|
| Buscar afiches y avisos en calle y postes | Buscar pensión y aplicar filtros | Se sustituye la búsqueda física informal por una consulta parametrizada con filtros por universidad, precio y servicios. |
| Contactar al dueño por chat (WhatsApp) | Consultar y cargar catálogo en tiempo real | El estudiante visualiza al instante el catálogo digital actualizado en vez de preguntar disponibilidad por mensaje privado. |
| Coordinar visita presencial al inmueble | Enviar solicitud de reserva | La postulación se formaliza mediante una solicitud digital estructurada con datos de alumno regular en lugar de citas informales. |
| Anotar cita en cuaderno de postulantes | Generar notificación push de solicitud | El sistema notifica de forma inmediata y automática al dueño en su dispositivo cuando ingresa una postulación. |
| Mostrar pieza y explicar normas de convivencia | Revisar solicitud y perfil en la app | El arrendador revisa previamente los antecedentes del estudiante en la plataforma antes de comprometer cupos. |
| Efectuar pago en efectivo o transferencia de garantía | Bloquear fechas y emitir ficha de confirmación | El sistema bloquea automáticamente la habitación y emite un comprobante digital auditable para ambas partes. |
