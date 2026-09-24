# Historias de usuario

## HU-01 — Filtrar catálogo por campus, precio y normas
Como estudiante universitario,  
quiero filtrar las pensiones según mi sede universitaria, un rango de precio en un histograma dinámico y normas específicas de convivencia (toque de queda, visitas, mascotas),  
para encontrar rápidamente habitaciones que se ajusten a mi presupuesto real y estilo de vida estudiantil sin perder tiempo en opciones inviables.

**Actividad TO-BE asociada:** [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03)

**Criterios de aceptación:**
- **CA1:** Al seleccionar una universidad o campus, el catálogo y el mapa deben actualizarse mostrando exclusivamente las pensiones situadas en un radio máximo de 30 km, ordenadas por cercanía.
- **CA2:** Al ajustar los límites mínimo y máximo del histograma de precios, la lista debe actualizarse en tiempo real reflejando el número de piezas disponibles en ese intervalo.
- **CA3:** Al marcar filtros de convivencia (ej. «Permite visitas» o «Sin toque de queda»), el sistema debe ocultar inmediatamente las propiedades que no cumplan con dichos criterios.
- **CA4:** Si ningún resultado coincide con los filtros combinados, el sistema debe mostrar un estado vacío amigable con opción de reiniciar filtros con un solo clic.

---

## HU-02 — Consultar ficha detallada y reglas de convivencia
Como estudiante universitario,  
quiero consultar la ficha completa de una pensión con fotos en alta resolución, inventario de piezas, reglas de la casa y servicios básicos incluidos,  
para evaluar integralmente el inmueble y evitar cobros sorpresa antes de tomar contacto con el arrendador.

**Actividad TO-BE asociada:** [`ACT-TOBE-05`](./02-rediseno-to-be.md#act-tobe-05)

**Criterios de aceptación:**
- **CA1:** La ficha debe indicar claramente con íconos el estado de cada servicio básico (agua, electricidad, gas, internet) especificando si está incluido en la mensualidad o si tiene cobro aparte.
- **CA2:** Se debe desplegar la lista de habitaciones de la pensión con su tipo (individual o compartida), tipo de baño (privado o compartido), precio mensual en CLP y estado de disponibilidad.
- **CA3:** El modal debe incluir un minimapa interactivo que muestre la ubicación exacta de la pensión y la distancia en metros a pie hasta la universidad de referencia.
- **CA4:** Los usuarios no autenticados deben visualizar una vista previa con invitación clara a iniciar sesión para acceder a las opiniones y al contacto directo.

---

## HU-03 — Contactar directamente al dueño vía WhatsApp
Como estudiante universitario interesado en una pensión,  
quiero hacer clic en un botón de contacto que abra un chat de WhatsApp con el dueño con un mensaje predefinido,  
para agendar una visita o consultar dudas específicas sin intermediarios ni demoras.

**Actividad TO-BE asociada:** [`ACT-TOBE-06`](./02-rediseno-to-be.md#act-tobe-06)

**Criterios de aceptación:**
- **CA1:** El botón de WhatsApp debe estar visible y destacado en la ficha de la pensión, visible únicamente para usuarios autenticados.
- **CA2:** Al hacer clic, debe abrir la aplicación de WhatsApp (en móviles) o WhatsApp Web (en escritorio) con el número telefónico oficial registrado por el dueño.
- **CA3:** El mensaje inicial sugerido debe incluir automáticamente el título de la pensión y la consulta de interés del estudiante para contextualizar al arrendador de inmediato.

---

## HU-04 — Publicar reseña comunitaria auditada
Como estudiante universitario que reside o residió en una pensión,  
quiero calificar mi experiencia evaluando limpieza, silencio, trato del dueño y velocidad del WiFi junto con un comentario y fechas de estadía,  
para compartir información veraz con otros estudiantes y reconocer o advertir sobre la calidad real del lugar.

**Actividad TO-BE asociada:** [`ACT-TOBE-08`](./02-rediseno-to-be.md#act-tobe-08)

**Criterios de aceptación:**
- **CA1:** El formulario de reseña debe exigir una calificación global obligatoria (1 a 5 estrellas) y puntuaciones específicas para limpieza, tranquilidad/silencio, trato del arrendador y calidad de conexión WiFi.
- **CA2:** El sistema debe limitar a una sola reseña activa por estudiante en una misma pensión, permitiendo la edición o eliminación posterior de la misma.
- **CA3:** Si el estudiante inició sesión con correo institucional universitario verificado, la reseña debe publicarse con la insignia visible de «Residente Verificado».
- **CA4:** Al publicarse la reseña, el promedio general y el conteo de reseñas de la pensión deben recalcularse automáticamente en la base de datos.

---

## HU-05 — Proponer corrección sobre datos desactualizados
Como estudiante de la comunidad universitaria,  
quiero sugerir una corrección sobre precios, normas o servicios de una pensión que conozco,  
para que el catálogo se mantenga actualizado colaborativamente en caso de datos obsoletos.

**Actividad TO-BE asociada:** [`ACT-TOBE-10`](./02-rediseno-to-be.md#act-tobe-10)

**Criterios de aceptación:**
- **CA1:** La ficha de detalle debe incluir un enlace accesible denominado «Sugerir una corrección».
- **CA2:** El modal debe permitir seleccionar los campos a corregir (precio base, normas de convivencia, servicios incluidos o contacto) y redactar una nota justificativa.
- **CA3:** Al enviar la propuesta, el sistema debe registrar el cambio con estado `PENDING` y notificar que quedará sujeta a revisión por parte del propietario.

---

## HU-06 — Conmutar disponibilidad de habitación en panel móvil
Como dueño de pensión,  
quiero cambiar el estado de cualquier habitación entre «Disponible» y «Ocupada» con un solo toque desde mi teléfono celular,  
para mantener mi inventario al día en tiempo real y evitar que me contacten estudiantes por habitaciones ya arrendadas.

**Actividad TO-BE asociada:** [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01)

**Criterios de aceptación:**
- **CA1:** El panel de habitaciones del dueño debe listar todas las piezas de la propiedad seleccionada con un switch visual claro de estado (Verde: Disponible / Gris: Ocupada).
- **CA2:** Al conmutar el switch, el sistema debe persistir el cambio inmediatamente en el backend y actualizar la disponibilidad pública sin recargar la página.
- **CA3:** La barra de métricas de ocupación superior debe actualizar automáticamente el porcentaje de ocupación y el conteo de piezas libres/ocupadas.
- **CA4:** Un propietario no debe tener permitido visualizar ni alternar habitaciones que pertenezcan a pensiones de otros arrendadores (validación estricta de propiedad).

---

## HU-07 — Revisar y resolver propuestas comunitarias en buzón
Como dueño de pensión,  
quiero revisar las sugerencias de cambio enviadas por los estudiantes mediante una vista comparativa (diff) y aceptarlas o rechazarlas,  
para mantener los datos de mi pensión actualizados con ayuda de la comunidad sin perder el control de mi publicación.

**Actividad TO-BE asociada:** [`ACT-TOBE-11`](./02-rediseno-to-be.md#act-tobe-11)

**Criterios de aceptación:**
- **CA1:** La sección de reseñas o gestión debe mostrar una insignia con el conteo de sugerencias pendientes de revisión.
- **CA2:** El drawer de propuestas debe mostrar claramente el valor actual versus el valor propuesto (diff) para cada campo sugerido.
- **CA3:** Al presionar «Aprobar y aplicar», el sistema debe consolidar los cambios en la pensión y cambiar el estado de la propuesta a `APPROVED`.
- **CA4:** Al presionar «Rechazar», se debe solicitar un motivo de rechazo opcional y marcar la propuesta como `REJECTED`, cerrando el ticket.
