# Historias de usuario

## HU-01 — Filtrar catálogo por campus, precio y normas
Como estudiante universitario,  
quiero filtrar las pensiones según mi sede universitaria, un rango de precio en un histograma interactivo y normas de convivencia (toque de queda, visitas, mascotas),  
para encontrar rápidamente opciones viables que se ajusten a mi presupuesto y estilo de vida estudiantil sin perder tiempo en llamadas inútiles.

**Actividad TO-BE asociada:** [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03)

**Criterios de aceptación:**
- **CA1:** Al seleccionar una universidad, la lista y el mapa deben mostrar exclusivamente las pensiones ubicadas en un radio de hasta 30 km, ordenadas por cercanía en metros.
- **CA2:** Al mover los controles del histograma de precios o marcar filtros de convivencia (ej. «Permite visitas»), el catálogo debe actualizarse en tiempo real ocultando las propiedades no coincidentes.

---

## HU-02 — Conmutar disponibilidad de habitación en panel móvil
Como dueño de pensión,  
quiero cambiar el estado de cualquier habitación entre «Disponible» y «Ocupada» con un solo toque desde mi teléfono celular,  
para mantener mi oferta al día en tiempo real y evitar que me llamen estudiantes por piezas que ya fueron arrendadas.

**Actividad TO-BE asociada:** [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01)

**Criterios de aceptación:**
- **CA1:** El panel de habitaciones debe listar todas las piezas de la propiedad con un conmutador visual (switch) que actualice inmediatamente la disponibilidad pública sin recargar la pantalla.
- **CA2:** El sistema debe verificar que únicamente el dueño autenticado de la pensión tenga autorización para alterar el estado de sus habitaciones (HTTP 403 Forbidden para terceros).

---

## HU-03 — Publicar reseña comunitaria auditada
Como estudiante universitario que reside o residió en una pensión,  
quiero calificar mi experiencia evaluando limpieza, silencio, trato del dueño y velocidad del WiFi con un comentario y fechas de estadía,  
para orientar de forma transparente a otros compañeros universitarios sobre la calidad real del alojamiento.

**Actividad TO-BE asociada:** [`ACT-TOBE-06`](./02-rediseno-to-be.md#act-tobe-06)

**Criterios de aceptación:**
- **CA1:** El formulario de reseña debe exigir una calificación global obligatoria (1 a 5 estrellas) y puntuaciones específicas por categoría (limpieza, tranquilidad, trato y WiFi).
- **CA2:** Si el estudiante inició sesión con un correo institucional universitario validado (`@alumnos...`), la reseña debe publicarse automáticamente con el sello visible de «Residente Verificado».
