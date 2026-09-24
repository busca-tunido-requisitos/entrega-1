# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional / no funcional) | Actividad TO-BE asociada |
|----|-----------|---------------------------------|---------------------------|
| **RP-01** | El sistema debe permitir a los estudiantes filtrar el catálogo de pensiones por universidad, distancia máxima y rango de precio mediante un histograma interactivo. | Funcional | [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03) |
| **RP-02** | El sistema debe desplegar en la ficha de cada pensión las normas de convivencia explícitas (toque de queda, visitas, mascotas) y un botón de contacto directo a WhatsApp con el dueño. | Funcional | [`ACT-TOBE-04`](./02-rediseno-to-be.md#act-tobe-04) |
| **RP-03** | El sistema debe permitir a los dueños conmutar la disponibilidad de cada habitación individual (libre u ocupada) con un solo toque desde su dispositivo móvil. | Funcional | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) |
| **RP-04** | El sistema debe permitir a los estudiantes publicar reseñas multidimensionales (limpieza, tranquilidad, trato del dueño y WiFi), asignando el sello de «Residente Verificado» a usuarios con correo institucional auditado. | Funcional | [`ACT-TOBE-06`](./02-rediseno-to-be.md#act-tobe-06) |
| **RP-05** | La interfaz de usuario debe implementar un diseño responsive mobile-first con áreas táctiles mínimas de 48×48 px para botones y conmutadores. | No funcional (Usabilidad) | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) |
| **RP-06** | La API backend debe responder las consultas de catálogo geolocalizado en un tiempo menor a 300 ms en el percentil 95 bajo condiciones normales de carga. | No funcional (Rendimiento) | [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03) |

---

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| **RY-01** | La documentación del proyecto debe estar versionada íntegramente en un repositorio dentro de una organización de GitHub, vinculada a un GitHub Project. |
| **RY-02** | Los diagramas de proceso (AS-IS y TO-BE) deben cumplir con la notación estándar BPMN 2.0 y contar con su archivo fuente `.bpmn` editable en Camunda Modeler. |
| **RY-03** | El sistema debe implementarse en TypeScript utilizando NestJS para la API backend y Next.js 15 para la aplicación web. |

---

## Requisito derivado

**Requisito origen:**  
**RP-04:** *«El sistema debe permitir a los estudiantes publicar reseñas multidimensionales (limpieza, tranquilidad, trato del dueño y WiFi), asignando el sello de "Residente Verificado" a usuarios con correo institucional auditado».*

**Requisito derivado:**  
**RP-DER-01:** *«El sistema debe incorporar un validador de dominios de correo electrónico contra una lista blanca de dominios universitarios chilenos (`@alumnos.uchile.cl`, `@usach.cl`, etc.) al momento del registro de estudiantes, restringiendo la emisión del sello de verificación exclusivamente a cuentas cuyo dominio institucional haya sido contrastado positivamente».*

**Justificación:**  
Este requisito se deriva necesariamente del anterior porque la autenticidad del sello de «Residente Verificado» no puede garantizarse si la plataforma permitiera cuentas de correo genéricas (Gmail, Yahoo) sin un mecanismo algorítmico previo que certifique la pertenencia del estudiante a una institución de educación superior.
