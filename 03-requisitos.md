# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional / no funcional) | Actividad TO-BE asociada |
|----|-----------|---------------------------------|---------------------------|
| **RP-01** | El sistema debe permitir a los estudiantes foráneos filtrar el catálogo de pensiones por sede universitaria, rango de precio y normas de convivencia (toque de queda, visitas, mascotas). | Funcional | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) |
| **RP-02** | El sistema debe consultar la base de datos y cargar en tiempo real las piezas disponibles georreferenciadas según los filtros aplicados. | Funcional | [`ACT-TOBE-02`](./02-rediseno-to-be.md#act-tobe-02) |
| **RP-03** | El sistema debe permitir al estudiante enviar una solicitud formal de reserva especificando fecha de llegada, duración estimada de estadía y mensaje personalizado al dueño. | Funcional | [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03) |
| **RP-04** | El sistema debe despachar una notificación push inmediata al dispositivo móvil del dueño cada vez que reciba una nueva postulación de reserva. | Funcional | [`ACT-TOBE-04`](./02-rediseno-to-be.md#act-tobe-04) |
| **RP-05** | El sistema debe proporcionar al dueño una bandeja móvil para revisar el perfil universitario del estudiante y resolver la solicitud (aprobar o rechazar) con un solo toque. | Funcional | [`ACT-TOBE-05`](./02-rediseno-to-be.md#act-tobe-05) y [`ACT-TOBE-09`](./02-rediseno-to-be.md#act-tobe-09) |
| **RP-06** | En caso de rechazo de postulación, el sistema debe desplegar al estudiante una lista curada de opciones alternativas de pensiones disponibles en el mismo sector universitario. | Funcional | [`ACT-TOBE-08`](./02-rediseno-to-be.md#act-tobe-08) |
| **RP-07** | Al aprobarse la reserva, el sistema debe actualizar el estado de la pieza a ocupada, bloquear el calendario y emitir una ficha oficial de confirmación de reserva en formato PDF. | Funcional | [`ACT-TOBE-10`](./02-rediseno-to-be.md#act-tobe-10) |
| **RP-08** | El sistema debe habilitar un canal de chat directo integrado entre el estudiante y el dueño tras confirmarse la reserva para coordinar la llegada presencial. | Funcional | [`ACT-TOBE-11`](./02-rediseno-to-be.md#act-tobe-11) |
| **RP-09** | La interfaz de usuario debe implementar un diseño responsive mobile-first con áreas táctiles mínimas de 48×48 px para botones y acciones de aprobación/rechazo. | No funcional (Usabilidad) | [`ACT-TOBE-05`](./02-rediseno-to-be.md#act-tobe-05) |
| **RP-10** | El backend debe procesar y responder las consultas de catálogo y envío de notificaciones push en un tiempo inferior a 400 ms en el percentil 95. | No funcional (Rendimiento) | [`ACT-TOBE-02`](./02-rediseno-to-be.md#act-tobe-02) y [`ACT-TOBE-04`](./02-rediseno-to-be.md#act-tobe-04) |

---

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| **RY-01** | La documentación del proyecto debe estar versionada íntegramente en un repositorio dentro de una organización de GitHub, vinculada a un GitHub Project. |
| **RY-02** | Los diagramas de proceso (AS-IS y TO-BE) deben cumplir con la notación estándar BPMN 2.0 y contar con su archivo fuente `.bpmn` editable y renderizable en Camunda Modeler y `demo.bpmn.io`. |
| **RY-03** | El sistema debe implementarse en TypeScript utilizando NestJS para la API backend y Next.js 15 para la aplicación web. |

---

## Requisito derivado

**Requisito origen:**  
**RP-07:** *«Al aprobarse la reserva, el sistema debe actualizar el estado de la pieza a ocupada, bloquear el calendario y emitir una ficha oficial de confirmación de reserva en formato PDF».*

**Requisito derivado:**  
**RP-DER-01:** *«La ficha oficial de reserva en PDF debe incorporar un código QR firmado digitalmente con los datos de la reserva (código único, identificador del estudiante, dirección del inmueble y rango de fechas), permitiendo su validación de autenticidad sin necesidad de conexión activa a internet en el momento del check-in».*

**Justificación:**  
Este requisito se deriva directamente de RP-07 porque los estudiantes foráneos pueden llegar a la ciudad universitaria sin plan de datos activo o en sectores con baja conectividad móvil; disponer de un código de verificación criptográfica sin conexión asegura tanto al estudiante como al arrendador un comprobante irrefutable que previene duplicidades y suplantaciones.
