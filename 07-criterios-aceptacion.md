# Criterios de aceptación (Gherkin)

## HU-01 — Filtrar catálogo por campus, precio y normas
Historia: Como estudiante foráneo, quiero filtrar las pensiones según mi sede universitaria, un rango de precio mensual y normas de convivencia (toque de queda, visitas, mascotas), para encontrar rápidamente opciones viables que se ajusten a mi presupuesto y estilo de vida estudiantil sin perder tiempo en llamadas inútiles.

```gherkin
Característica: Filtrado georreferenciado y multicriterio de pensiones

  Escenario: Filtrado exitoso de pensiones por sede universitaria y rango de precio
    Dado que existen pensiones universitarias con habitaciones disponibles registradas en el sector del campus seleccionado
    Y el estudiante foráneo define un rango de precio mensual entre $150.000 y $250.000
    Cuando solicita el catálogo filtrado para dicho campus y rango de precio
    Entonces el catálogo despliega únicamente las pensiones que cumplen ambos criterios
    Y las propiedades se ordenan por proximidad geográfica a la sede universitaria

  Escenario: Búsqueda sin coincidencias por restricciones excesivas de convivencia
    Dado que no existen pensiones disponibles que permitan mascotas en un radio de 2 kilómetros del campus
    Cuando el estudiante activa el filtro de convivencia "Permite mascotas"
    Entonces el catálogo indica que no se encontraron habitaciones disponibles con ese criterio
    Y sugiere ampliar el radio de búsqueda geográfica o flexibilizar las normas seleccionadas
```

---

## HU-02 — Enviar solicitud formal de reserva
Historia: Como estudiante foráneo, quiero enviar una solicitud de reserva indicando mis fechas estimadas de llegada, tiempo de estadía y un mensaje de presentación, para postular formalmente a la habitación sin depender de llamadas telefónicas exploratorias.

```gherkin
Característica: Envío de postulación formal de reserva

  Escenario: Envío exitoso de solicitud formal con antecedentes completos
    Dado que una habitación se encuentra con estado disponible en el catálogo
    Y el estudiante foráneo ha completado su perfil con correo institucional verificado
    Cuando envía una postulación indicando fecha de ingreso, duración estimada de estadía y mensaje de presentación
    Entonces la solicitud se registra con estado "En revisión"
    Y se despacha una notificación push inmediata al dueño de la pensión
    Y se informa al estudiante el plazo máximo de 48 horas para recibir respuesta

  Escenario: Intento de postulación con fecha de ingreso fuera del periodo lectivo
    Dado que una habitación admite arriendos exclusivamente para el semestre académico en curso
    Cuando el estudiante intenta enviar una solicitud indicando una fecha de ingreso extemporánea
    Entonces el sistema impide el envío de la postulación
    Y notifica al estudiante las fechas válidas de inicio de estadía definidas por la pensión
```

---

## HU-03 — Revisar solicitud y resolver postulación desde el móvil
Historia: Como dueño de pensión, quiero recibir una notificación push en mi teléfono y revisar la ficha del postulante con un resumen de su solicitud, para aprobar o rechazar la reserva con un solo toque sin interrumpir mis quehaceres cotidianos.

```gherkin
Característica: Resolución ágil de postulaciones de reserva

  Escenario: Aprobación de postulación con cupo disponible
    Dado que el dueño de pensión tiene una solicitud de reserva pendiente de resolución para una habitación libre
    Cuando el dueño aprueba la postulación del estudiante
    Entonces la solicitud cambia al estado "Aprobada"
    Y la habitación pasa a estado "Reservada" quedando bloqueada para nuevas solicitudes en el catálogo
    Y se despacha una notificación de confirmación al estudiante con la ficha oficial de reserva

  Escenario: Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas
    Dado que el dueño de pensión evalúa una solicitud cuyas fechas coinciden con un compromiso previo
    Cuando el dueño presiona la opción de rechazo especificando motivo de incompatibilidad
    Entonces la solicitud cambia al estado "Rechazada"
    Y la habitación se mantiene disponible para otros postulantes
    Y se notifica al estudiante el rechazo junto a un listado curado de pensiones similares disponibles en el mismo sector
```

---

## HU-04 — Recibir confirmación y coordinar llegada por chat
Historia: Como estudiante con reserva aprobada, quiero descargar mi comprobante oficial en PDF y acceder a una sala de chat directo con el dueño, para acordar los detalles de mi viaje, hora de llegada y entrega de la habitación con total tranquilidad.

```gherkin
Característica: Confirmación de reserva y coordinación de llegada

  Escenario: Emisión de ficha oficial con código criptográfico verificable
    Dado que una solicitud de reserva ha sido aprobada por el arrendador
    Cuando el estudiante solicita la confirmación formal de su alojamiento
    Entonces el sistema emite una ficha de reserva en formato PDF con los datos del inmueble y arriendo
    Y la ficha incorpora un código QR firmado digitalmente que permite validar la autenticidad de la reserva sin conexión a internet
    Y se habilita un canal de comunicación directo por chat entre el estudiante y el arrendador

  Escenario: Intento de acceso al canal de chat sin contar con reserva aprobada
    Dado que un estudiante foráneo tiene una postulación en estado pendiente de revisión o rechazada
    Cuando intenta abrir la sala de chat de coordinación con el arrendador
    Entonces el acceso al canal de comunicación se restringe
    Y se le informa que el chat se habilita exclusivamente una vez confirmada y aprobada la reserva
```

---

## HU-05 — Permisos de subarrendador
Historia: Como subarrendador, quiero pre-aprobar o rechazar las solicitudes de arriendo de los postulantes para la habitación que subarriendo, para participar en la evaluación de residentes con validación final del dueño de la pensión.

```gherkin
Característica: Doble aprobación de postulación entre subarrendador y dueño

  Escenario: Doble aprobación exitosa por subarrendador y dueño
    Dado que existe una solicitud de reserva en estado "En revisión" para una pensión con subarrendador autorizado y habitación "Disponible"
    Cuando el subarrendador pre-aprueba la solicitud
    Entonces la solicitud pasa a estado "Pendiente confirmación dueño" con acuerdoSubarriendo registrado
    Y se despacha una notificación push al dueño informando la pre-aprobación
    Y cuando el dueño confirma la solicitud dentro del plazo de 48 horas
    Entonces la solicitud pasa a estado "Confirmada por dueño"
    Y la habitación pasa a estado "Reservada" quedando bloqueada para nuevas solicitudes en el catálogo
    Y se emite la ficha oficial de reserva y se notifica la confirmación al estudiante

  Escenario: Rechazo de postulación por el subarrendador o por el dueño
    Dado que existe una solicitud de reserva en estado "En revisión" o "Pendiente confirmación dueño"
    Cuando el subarrendador o el dueño rechaza la postulación indicando el motivo
    Entonces la solicitud pasa a estado "Rechazada"
    Y la habitación se mantiene en estado "Disponible" para otros postulantes
    Y se notifica el rechazo al estudiante junto a alternativas del sector y se informa al dueño

  Escenario: Restricción de ficha y chat mientras falta confirmación del dueño
    Dado que el subarrendador pre-aprobó una solicitud pero esta sigue en estado "Pendiente confirmación dueño"
    Cuando el estudiante intenta descargar la ficha oficial en PDF o abrir el chat de coordinación
    Entonces el sistema impide el acceso y mantiene la habitación en estado "Disponible"
    Y informa que la reserva aún requiere confirmación final del dueño
```
