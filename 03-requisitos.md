# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional / no funcional) | Actividad TO-BE asociada |
|----|-----------|---------------------------------|---------------------------|
| **RP-01** | El sistema debe permitir a los estudiantes filtrar el catálogo de pensiones por sede universitaria, distancia geodésica y presupuesto mediante un histograma interactivo de precios. | Funcional | [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03) |
| **RP-02** | El sistema debe calcular en tiempo real la distancia en metros y el tiempo de traslado estimado hacia la universidad seleccionada para cada pensión visible. | Funcional | [`ACT-TOBE-04`](./02-rediseno-to-be.md#act-tobe-04) |
| **RP-03** | El sistema debe desplegar en la ficha de cada pensión el detalle explícito de normas de convivencia (toque de queda, visitas, fumar, mascotas, preferencia de género) y servicios incluidos (agua, luz, gas, internet). | Funcional | [`ACT-TOBE-05`](./02-rediseno-to-be.md#act-tobe-05) |
| **RP-04** | El sistema debe permitir al estudiante iniciar un chat directo de WhatsApp con el dueño de la pensión mediante un botón de enlace preconfigurado. | Funcional | [`ACT-TOBE-06`](./02-rediseno-to-be.md#act-tobe-06) |
| **RP-05** | El sistema debe permitir a los propietarios autenticados conmutar la disponibilidad de cada habitación individual (libre u ocupada) con un solo toque desde su dispositivo móvil. | Funcional | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) |
| **RP-06** | El sistema debe actualizar de forma inmediata la oferta visible y recalcular automáticamente los indicadores de tasa de ocupación e ingresos proyectados del propietario. | Funcional | [`ACT-TOBE-02`](./02-rediseno-to-be.md#act-tobe-02) |
| **RP-07** | El sistema debe permitir a los estudiantes publicar una reseña multidimensional (limpieza, tranquilidad, trato del dueño, velocidad de WiFi) con fotos y duración de estadía. | Funcional | [`ACT-TOBE-08`](./02-rediseno-to-be.md#act-tobe-08) |
| **RP-08** | El sistema debe validar el correo electrónico institucional del usuario estudiante para asignar automáticamente la insignia de «Residente Verificado» a su reseña. | Funcional | [`ACT-TOBE-09`](./02-rediseno-to-be.md#act-tobe-09) |
| **RP-09** | El sistema debe permitir a los estudiantes enviar propuestas de corrección sobre datos o servicios desactualizados de una pensión. | Funcional | [`ACT-TOBE-10`](./02-rediseno-to-be.md#act-tobe-10) |
| **RP-10** | El sistema debe proveer al propietario un buzón de sugerencias con visualización comparativa (diff de cambios) para aprobar o rechazar propuestas comunitarias. | Funcional | [`ACT-TOBE-11`](./02-rediseno-to-be.md#act-tobe-11) |
| **RP-11** | La interfaz de usuario debe implementar un diseño responsive mobile-first con áreas táctiles mínimas de 48×48 px para botones y conmutadores. | No funcional (Usabilidad) | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) y [`ACT-TOBE-03`](./02-rediseno-to-be.md#act-tobe-03) |
| **RP-12** | La API backend debe responder las consultas de catálogo geolocalizado en un tiempo menor a 300 ms en el percentil 95 bajo condiciones normales de carga. | No funcional (Eficiencia de desempeño) | [`ACT-TOBE-04`](./02-rediseno-to-be.md#act-tobe-04) |
| **RP-13** | El sistema debe implementar control de acceso basado en roles (RBAC) e impedir que un propietario modifique, visualice propuestas o altere habitaciones pertenecientes a otra pensión. | No funcional (Seguridad) | [`ACT-TOBE-01`](./02-rediseno-to-be.md#act-tobe-01) y [`ACT-TOBE-11`](./02-rediseno-to-be.md#act-tobe-11) |

---

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| **RY-01** | La documentación del proyecto debe estar versionada íntegramente en un repositorio dentro de una organización de GitHub, vinculada a un GitHub Project con seguimiento de tareas. |
| **RY-02** | El modelado de los procesos de negocio (AS-IS y TO-BE) debe cumplir con el estándar BPMN 2.0 y ser exportado como archivo fuente editable en formato `.bpmn` utilizando Camunda Modeler o bpmn.io. |
| **RY-03** | Las imágenes de los diagramas BPMN deben ser exportadas en blanco y negro, distinguiendo explícitamente los marcadores de tareas de usuario, de servicio y manuales. |
| **RY-04** | El backend del sistema debe ser desarrollado en Node.js/TypeScript utilizando el framework NestJS con Fastify y Prisma ORM sobre PostgreSQL. |
| **RY-05** | El frontend web debe ser desarrollado en TypeScript utilizando Next.js 15 (App Router) y Tailwind CSS, garantizando compatibilidad con navegadores móviles modernos. |
| **RY-06** | Todos los commits del repositorio deben respetar el estándar de Conventional Commits en formato de una sola línea concisa. |

---

## Requisito derivado

**Requisito origen:**  
**RP-07:** *«El sistema debe permitir a los estudiantes publicar una reseña multidimensional (limpieza, tranquilidad, trato del dueño, velocidad de WiFi) con fotos y duración de estadía, desplegando el sello de Residente Verificado en aquellas emitidas por estudiantes legítimos».*

**Requisito derivado:**  
**RP-DER-01:** *«El sistema debe incorporar un validador de dominios de correo electrónico contra un catálogo preconfigurado de dominios universitarios chilenos (`@alumnos.uchile.cl`, `@usach.cl`, `@uc.cl`, etc.) al momento del registro, restringiendo la emisión del sello de verificación únicamente a cuentas autenticadas cuyo dominio institucional haya sido contrastado positivamente».*

**Justificación técnica:**  
El requisito derivado surge de manera obligada a partir del requisito origen porque resulta imposible otorgar certeza criptográfica y reputacional al sello de «Residente Verificado» si la plataforma admitiera correos comerciales genéricos (como Gmail o Yahoo) sin validación de identidad estudiantil. Para que la auditoría social de pares sea fidedigna y no pueda ser manipulada por terceros o por los mismos dueños para inflar sus puntuaciones, el sistema requiere una regla algorítmica previa de validación de dominios autorizados vinculados a la entidad `University` en la base de datos.
