# Historias de usuario

## HU-01 — Filtrar catálogo por campus, precio y normas
Como estudiante foráneo,  
quiero filtrar las pensiones según mi sede universitaria, un rango de precio mensual y normas de convivencia (toque de queda, visitas, mascotas),  
para encontrar rápidamente opciones viables que se ajusten a mi presupuesto y estilo de vida estudiantil sin perder tiempo en llamadas inútiles.

**Actividad TO-BE asociada:** [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01--buscar-pensión-y-aplicar-filtros)

**Criterios de aceptación:**
- **CA1:** Al seleccionar una universidad o campus, la lista y el mapa deben mostrar exclusivamente las pensiones ubicadas en el sector, ordenadas por cercanía en metros y precio.
- **CA2:** Al ajustar los controles de precio o activar filtros de convivencia (ej. «Permite visitas»), el catálogo debe actualizarse en tiempo real ocultando las propiedades no coincidentes.

---

## HU-02 — Enviar solicitud formal de reserva
Como estudiante foráneo,  
quiero enviar una solicitud de reserva indicando mis fechas estimadas de llegada, tiempo de estadía y un mensaje de presentación,  
para postular formalmente a la habitación sin depender de llamadas telefónicas exploratorias.

**Actividad TO-BE asociada:** [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03--enviar-solicitud-de-reserva)

**Criterios de aceptación:**
- **CA1:** El formulario de solicitud debe requerir obligatoriamente fecha de ingreso, duración estimada de estancia y un texto explicativo del postulante.
- **CA2:** Al presionar «Enviar solicitud», el sistema debe confirmar el despacho exitoso, cambiar el estado de la postulación a «En revisión» y notificar al postulante que el dueño dispone de un plazo límite para responder.

---

## HU-03 — Revisar solicitud y resolver postulación desde el móvil
Como dueño de pensión,  
quiero recibir una notificación push en mi teléfono y revisar la ficha del postulante con un resumen de su solicitud,  
para aprobar o rechazar la reserva con un solo toque sin interrumpir mis quehaceres cotidianos.

**Actividad TO-BE asociada:** [`ACT-TOBE-05`](./02-rediseno-to-be.md#act-tobe-05--revisar-solicitud-y-perfil-en-la-app), [`ACT-TOBE-06`](./02-rediseno-to-be.md#act-tobe-06--rechazar-solicitud) y [`ACT-TOBE-09`](./02-rediseno-to-be.md#act-tobe-09--aprobar-solicitud-de-reserva)

**Criterios de aceptación:**
- **CA1:** Al tocar la notificación push, la app móvil debe abrir directamente la bandeja de postulaciones mostrando nombre, carrera, universidad y fechas del solicitante.
- **CA2:** Al presionar «Aprobar», el sistema debe actualizar la pieza a ocupada, bloquear el cupo en el catálogo y notificar de inmediato al estudiante; al presionar «Rechazar», el sistema debe registrar la postulación como rechazada, mantener la habitación disponible para nuevas solicitudes y disparar la alerta de opciones alternativas al postulante.

---

## HU-04 — Recibir confirmación y coordinar llegada por chat
Como estudiante con reserva aprobada,  
quiero descargar mi comprobante oficial en PDF y acceder a una sala de chat directo con el dueño,  
para acordar los detalles de mi viaje, hora de llegada y entrega de la habitación con total tranquilidad.

**Actividad TO-BE asociada:** [`ACT-TOBE-10`](./02-rediseno-to-be.md#act-tobe-10--bloquear-fechas-y-emitir-ficha-de-confirmación) y [`ACT-TOBE-11`](./02-rediseno-to-be.md#act-tobe-11--recibir-confirmación-y-coordinar-llegada-por-chat)

**Criterios de aceptación:**
- **CA1:** Una vez aprobada la postulación, el sistema debe habilitar un botón para descargar la ficha oficial de reserva en PDF con su código de verificación.
- **CA2:** La pantalla de confirmación debe activar un chat bidireccional exclusivo entre el estudiante y el arrendador para coordinar la llegada presencial.
