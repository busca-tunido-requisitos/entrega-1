# Clasificación de requisitos

## Requisitos de producto
| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|---|---|---|---|
| RP-01 | El sistema debe permitir a los usuarios estudiantes filtrar ofertas de pensiones según universidad de destino, presupuesto mensual máximo y servicios incluidos (agua, luz, gas, internet). | Funcional | Filtrar pensiones por universidad, precio y servicios |
| RP-02 | El sistema debe responder a las consultas de filtrado y búsqueda de pensiones en un tiempo máximo de 1.5 segundos bajo condiciones normales de carga de red. | No funcional | Filtrar pensiones por universidad, precio y servicios |
| RP-03 | El sistema debe permitir a los propietarios registrar una pensión ingresando título, descripción, dirección física, precio mensual, monto de garantía y fotografías obligatorias (mínimo 3). | Funcional | Publicar oferta en catálogo y mapa interactivo |
| RP-04 | El sistema debe calcular automáticamente y mostrar la distancia peatonal estimada (en metros y minutos a pie) entre la pensión seleccionada y el campus universitario de referencia. | Funcional | Calcular distancias peatonales y presentar opciones |
| RP-05 | El sistema debe permitir a los estudiantes autenticados enviar una solicitud formal de arriendo adjuntando mensaje de presentación y seleccionando la habitación de interés. | Funcional | Completar y enviar solicitud formal de reserva |
| RP-06 | El sistema debe validar que el solicitante cuente con un correo institucional activo (`.edu` o dominio universitario reconocido) antes de remitir la solicitud al dueño. | Funcional | Verificar perfil estudiantil y despachar notificación al dueño |
| RP-07 | El sistema debe disponer de una bandeja de gestión para el arrendador donde pueda visualizar las solicitudes recibidas y marcar su estado como "Aceptada" o "Rechazada" junto a un comentario opcional. | Funcional | Evaluar perfil del postulante y responder solicitud |
| RP-08 | El sistema debe generar y almacenar un comprobante digital en formato descargable con identificador único de reserva cuando una solicitud sea aprobada por el arrendador. | Funcional | Confirmar reserva y emitir comprobante digital |
| RP-09 | El sistema debe proteger los datos personales de contacto de ambas partes (teléfono y correo personal), haciéndolos visibles únicamente tras la aprobación de la solicitud de arriendo. | No funcional | Confirmar reserva y emitir comprobante digital |

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
