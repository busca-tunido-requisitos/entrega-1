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

*Nota: Las tareas del proceso TO-BE distinguen rigurosamente los tres tipos de marcadores BPMN 2.0:*
- **User Task (Tarea de Usuario)**: *Ingresar datos de la pensión y cargar fotografías*, *Filtrar pensiones por universidad, precio y servicios*, *Completar y enviar solicitud formal de reserva*, *Evaluar perfil del postulante y responder solicitud*.
- **Service Task (Tarea de Servicio)**: *Validar consistencia de datos y georreferenciar dirección*, *Publicar oferta en catálogo y mapa interactivo*, *Calcular distancias peatonales y presentar opciones*, *Verificar perfil estudiantil y despachar notificación al dueño*, *Notificar rechazo con motivo al estudiante*, *Confirmar reserva y emitir comprobante digital*.
- **Manual Task (Tarea Manual)**: *Realizar check-in presencial y entrega de llaves*.

## Actividades que cambian del AS-IS al TO-BE
| Actividad en el AS-IS | Actividad en el TO-BE | Qué cambia |
|---|---|---|
| Buscar afiches y avisos en inmediaciones universitarias | Filtrar pensiones por universidad, precio y servicios | Se sustituye la búsqueda física aleatoria por un motor de búsqueda digital centralizado con filtros de distancia a campus, rango de precio y servicios. |
| Contactar al dueño por mensajería (WhatsApp) | Publicar oferta en catálogo y mapa interactivo | El arrendador no responde individualmente por chat a cada postulante; publica una oferta visible globalmente en un catálogo geolocalizado. |
| Evaluar fotografías y condiciones informales | Calcular distancias peatonales y presentar opciones | El sistema calcula automáticamente la cercanía real y tiempos de traslado hacia la facultad del estudiante, eliminando la ambigüedad geográfica. |
| Coordinar visita presencial al inmueble | Completar y enviar solicitud formal de reserva | El estudiante postula formalmente mediante un formulario estructurado con sus antecedentes universitarios en lugar de coordinaciones informales de palabra. |
| Anotar cita de visita en cuaderno de postulantes | Verificar perfil estudiantil y despachar notificación al dueño | Se reemplaza la anotación manual en cuaderno por una validación de datos del alumno y una notificación automatizada directa al propietario. |
| Mostrar habitación y explicar normas de convivencia | Evaluar perfil del postulante y responder solicitud | El dueño visualiza la información de los postulantes en su bandeja de entrada y aprueba o rechaza antes de concretar la visita final, evitando pérdidas de tiempo. |
| Efectuar pago en efectivo o transferencia de garantía | Confirmar reserva y emitir comprobante digital | La formalización de la reserva genera un comprobante digital auditable en la plataforma, evitando pagos informales en efectivo sin respaldo legal. |
