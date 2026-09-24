# Historias de usuario

## HU-01
Como estudiante universitario foráneo, quiero filtrar las pensiones disponibles según el campus donde estudio y los servicios básicos incluidos (agua, luz, gas, internet), para encontrar rápidamente opciones habitacionales que se ajusten a mis necesidades sin tener que consultar aviso por aviso.

**Actividad TO-BE asociada:** Buscar pensión y aplicar filtros

**Criterios de aceptación:**
- CA1: El usuario puede seleccionar su institución y sede desde un selector desplegable o barra de búsqueda predictiva.
- CA2: El usuario puede marcar casillas de verificación para exigir servicios incluidos específicos (agua, luz, gas, wifi).
- CA3: Los resultados se actualizan dinámicamente mostrando solo las opciones que cumplan con la totalidad de los filtros aplicados.
- CA4: Si no existen pensiones que cumplan los criterios, el sistema debe desplegar un mensaje orientativo sugiriendo flexibilizar el rango de precio o servicios.

## HU-02
Como dueño de una pensión universitaria, quiero publicar el perfil de mi inmueble especificando precios, normas de convivencia y galería de fotos, para dar a conocer mi oferta de forma transparente a estudiantes interesados sin tener que enviar información manualmente por mensajes privados.

**Actividad TO-BE asociada:** Consultar y cargar catálogo en tiempo real

**Criterios de aceptación:**
- CA1: El formulario de publicación exige el ingreso de campos obligatorios: título, dirección exacta, precio mensual, monto de garantía y al menos 3 fotografías en formato PNG o JPG.
- CA2: El arrendador puede marcar explícitamente las normas de la casa (admisión de visitas, horario de silencio, tenencia de mascotas).
- CA3: El sistema no permite publicar fichas con datos vacíos o imágenes con resolución inferior a 600x400 píxeles.
- CA4: Una vez completado el registro, la pensión queda disponible inmediatamente en el catálogo público y posicionada en el mapa del sector.

## HU-03
Como estudiante universitario, quiero visualizar la distancia y el tiempo estimado de caminata desde la pensión hasta mi facultad, para tomar una decisión informada respecto a mi traslado diario y presupuesto de transporte.

**Actividad TO-BE asociada:** Consultar y cargar catálogo en tiempo real

**Criterios de aceptación:**
- CA1: La ficha detallada de la pensión exhibe un indicador destacado con la distancia en metros (o kilómetros) hacia la sede universitaria seleccionada.
- CA2: El sistema muestra el tiempo estimado de caminata a pie calculado en base a rutas peatonales accesibles.
- CA3: La ficha incluye un mapa visual interactivo con el trazado entre el punto de origen (pensión) y el punto de destino (campus).

## HU-04
Como estudiante universitario postulante, quiero enviar una solicitud formal de reserva a través de la plataforma acreditando mi condición de alumno regular, para asegurar prioridad y seriedad en mi postulación frente al arrendador.

**Actividad TO-BE asociada:** Enviar solicitud de reserva

**Criterios de aceptación:**
- CA1: La solicitud solo puede ser enviada por usuarios cuya cuenta haya sido validada previamente con correo institucional universitario activo.
- CA2: El estudiante puede redactar un mensaje breve de presentación al dueño indicando semestre, carrera y fecha tentativa de ingreso.
- CA3: Al pulsar "Enviar Solicitud", el estado de la postulación cambia a "Enviada / En revisión" y se bloquea el envío duplicado de solicitudes a la misma habitación.
- CA4: El estudiante recibe un correo automático confirmando el despacho exitoso de su requerimiento.

## HU-05
Como dueño de pensión, quiero revisar en mi panel las solicitudes de los estudiantes postulantes y responder aceptando o rechazando cada caso con un motivo, para administrar de manera organizada y oportuna las vacantes de mis habitaciones.

**Actividad TO-BE asociada:** Revisar solicitud y perfil en la app

**Criterios de aceptación:**
- CA1: La bandeja del dueño muestra un listado de solicitudes pendientes con nombre del estudiante, carrera, universidad y fecha de postulación.
- CA2: El dueño dispone de dos botones de acción directa: "Aceptar solicitud" y "Rechazar solicitud".
- CA3: En caso de rechazo, el sistema solicita obligatoriamente seleccionar un motivo (ej. "Habitación reservada previamente", "No cumple preferencias de convivencia", "Otro con justificación").
- CA4: Al confirmar la decisión, el sistema actualiza el estado en tiempo real y notifica instantáneamente al estudiante por correo y en la plataforma.
