# Modelo de dominio

## Diagrama

![Modelo de dominio](./diagramas/modelo-dominio.png)

Archivo fuente: [`./diagramas/modelo-dominio.puml`](./diagramas/modelo-dominio.puml)

## Descripción de las clases

| Clase | Qué representa en el negocio | Atributos |
|-------|------------------------------|-----------|
| **Estudiante** | Joven universitario foráneo que busca y arrienda alojamiento para cursar su periodo académico. | `nombreCompleto`, `correoInstitucional`, `telefono`, `universidad`, `carrera` |
| **Dueno** | Propietario o administrador que gestiona y arrienda habitaciones en su inmueble a estudiantes. | `nombreCompleto`, `correoElectronico`, `telefonoContacto`, `cuentaBancaria` |
| **Pension** | Inmueble habitacional acondicionado para hospedar a múltiples estudiantes bajo normas de convivencia compartidas. | `nombreComercial`, `direccion`, `comuna`, `coordenadasGeograficas`, `normasConvivencia`, `serviciosIncluidos` |
| **Habitacion** | Espacio habitacional individual o compartido dentro de una pensión ofrecido en arriendo mensual. | `identificadorHabitacion`, `precioMensual`, `tipoCama`, `tieneBanoPrivado`, `estadoDisponibilidad` |
| **SolicitudReserva** | Postulación formal enviada por un estudiante para comprometer una habitación específica en un rango de fechas. | `codigoSolicitud`, `fechaLlegadaEstimada`, `duracionEstadiaMeses`, `mensajePresentacion`, `fechaEnvio`, `estado` |
| **FichaReserva** | Comprobante oficial de confirmación emitido tras la aprobación de la solicitud, con respaldo criptográfico. | `codigoReserva`, `fechaEmision`, `codigoQRFirmado`, `estadoFicha` |
| **MensajeChat** | Comunicación directa y registrada entre el estudiante y el arrendador para coordinar la llegada presencial. | `contenidoTexto`, `fechaHoraEnvio`, `leido` |

## Asociaciones

| Asociación | Clases | Multiplicidades | Justificación |
|------------|--------|-----------------|----------------|
| **administra** | Dueno – Pension | 1 a 1..* | Un dueño gestiona una o varias pensiones universitarias; cada pensión cuenta obligatoriamente con un arrendador responsable. |
| **compone** | Pension – Habitacion | 1 a 1..* | Una pensión se compone estructuralmente de una o más habitaciones; cada habitación pertenece de manera exclusiva a una única pensión. |
| **postula** | Estudiante – SolicitudReserva | 1 a 0..* | Un estudiante puede enviar múltiples solicitudes de reserva a lo largo de su vida académica; cada postulación es emitida por un único estudiante. |
| **solicita** | SolicitudReserva – Habitacion | 0..* a 1 | Múltiples solicitudes pueden competir por una misma habitación; cada solicitud apunta específicamente a una habitación individual. |
| **genera** | SolicitudReserva – FichaReserva | 1 a 0..1 | Una postulación formal aprobada genera exactamente una ficha oficial de reserva; solicitudes pendientes o rechazadas no generan ficha. |
| **habilita** | SolicitudReserva – MensajeChat | 1 a 0..* | Una solicitud formal confirmada habilita un hilo de mensajes de chat; cada mensaje pertenece al contexto de la reserva coordinada. |
| **emite** | Estudiante – MensajeChat | 1 a 0..* | El estudiante envía mensajes dentro del canal de chat habilitado por su reserva aprobada. |
| **emite** | Dueno – MensajeChat | 1 a 0..* | El arrendador envía mensajes dentro del canal de chat para coordinar la llegada del residente. |

## Decisiones de modelado

- **Modelado de roles:** Los roles de `Estudiante` y `Dueno` se modelaron como clases independientes de negocio y no como subtipos de una clase abstracta `Usuario`, debido a que sus atributos del dominio (carrera y correo institucional versus cuenta bancaria y datos de cobro), sus responsabilidades contractuales y sus ciclos de vida dentro del sistema son completamente disjuntos.
- **Uso de Composición (`Pension` $\rightarrow$ `Habitacion`):** Se utilizó relación de **composición fuerte** (rombo relleno) entre `Pension` y `Habitacion` porque una habitación carece de existencia semántica, física y de arriendo si la pensión es dada de baja. La habitación comparte el ciclo de vida del inmueble que la contiene.
- **Relaciones de asociación simple:** Las entidades `SolicitudReserva`, `FichaReserva` y `MensajeChat` se modelaron mediante asociaciones navegables estándar, garantizando que el comprobante y los registros de conversación mantengan validez histórica y trazabilidad legal aunque el estado de disponibilidad de la habitación cambie a lo largo del tiempo.
