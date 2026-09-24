# Clasificación de requisitos

## Requisitos de producto
| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|---|---|---|---|
| RP-01 | El sistema debe permitir a los usuarios estudiantes filtrar ofertas de pensiones según universidad de destino, presupuesto mensual máximo y servicios incluidos (agua, luz, gas, internet). | Funcional | Buscar pensión y aplicar filtros |
| RP-02 | El sistema debe responder a las consultas de filtrado y búsqueda de pensiones en un tiempo máximo de 1.5 segundos bajo condiciones normales de carga de red. | No funcional | Buscar pensión y aplicar filtros |
| RP-03 | El sistema debe consultar la base de datos y cargar en tiempo real el catálogo de pensiones disponibles junto con la distancia calculada al campus de estudio. | Funcional | Consultar y cargar catálogo en tiempo real |
| RP-04 | El sistema debe calcular automáticamente y mostrar la distancia peatonal estimada (en metros y minutos a pie) entre la pensión seleccionada y el campus universitario de referencia. | Funcional | Consultar y cargar catálogo en tiempo real |
| RP-05 | El sistema debe permitir a los estudiantes autenticados enviar una solicitud formal de reserva adjuntando mensaje de presentación y seleccionando la habitación de interés. | Funcional | Enviar solicitud de reserva |
| RP-06 | El sistema debe generar y despachar una notificación push automática al arrendador cuando un estudiante envíe una solicitud de reserva. | Funcional | Generar notificación push de solicitud |
| RP-07 | El sistema debe disponer de una bandeja de gestión para el arrendador donde pueda revisar la solicitud y el perfil del postulante, permitiendo aprobar o rechazar con un motivo. | Funcional | Revisar solicitud y perfil en la app |
| RP-08 | El sistema debe bloquear automáticamente las fechas de la habitación seleccionada y emitir una ficha de confirmación de reserva descargable al ser aprobada. | Funcional | Bloquear fechas y emitir ficha de confirmación |
| RP-09 | El sistema debe proteger los datos personales de contacto de ambas partes (teléfono y correo personal), haciéndolos visibles únicamente tras la aprobación de la solicitud de reserva. | No funcional | Bloquear fechas y emitir ficha de confirmación |

## Requisitos de proyecto
| ID | Requisito |
|---|---|
| RY-01 | **Control de versiones y plataforma colaborativa**: Toda la documentación de ingeniería de requisitos y artefactos asociados debe gestionarse en el repositorio oficial de GitHub de la organización `busca-tunido-requisitos`. |
| RY-02 | **Fecha límite de entrega**: Los entregables correspondientes a la Entrega 1 deben estar publicados y verificables en el repositorio antes de las 10:00 AM del jueves 24 de septiembre de 2026. |
| RY-03 | **Estándar de modelado BPMN 2.0**: Los modelos de proceso AS-IS y TO-BE deben adherir estrictamente a la notación estándar BPMN 2.0, incluyendo archivos fuente `.bpmn` editables e imágenes `.png`. |

## Requisito derivado
**Requisito origen:** RP-04 (El sistema debe calcular automáticamente y mostrar la distancia peatonal estimada en metros y minutos a pie entre la pensión seleccionada y el campus universitario de referencia).

**Requisito derivado:** El sistema debe disponer de un catálogo georreferenciado de sedes y facultades universitarias con sus coordenadas geográficas oficiales (latitud y longitud), actualizado periódicamente para permitir el cómputo de proximidad espacial contra la ubicación del inmueble.

**Justificación:** El requerimiento de usuario RP-04 exige calcular la distancia y tiempo de traslado hacia una sede universitaria. Para que este cálculo automático sea factible en tiempo de ejecución sin solicitar manualmente coordenadas al estudiante, el sistema debe necesariamente mantener una entidad interna persistente con la localización exacta de cada campus de la región. Por lo tanto, el requisito de catálogo georreferenciado de campus se deriva directamente como una necesidad técnica obligatoria para dar cumplimiento al requerimiento funcional de origen.
