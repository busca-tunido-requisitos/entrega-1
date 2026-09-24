---
name: user-story-evaluator
description: >-
  Evaluate, refine, and write Agile User Stories conforming to the INVEST model,
  standard user story structure (Como... quiero... para...), Given-When-Then
  (Gherkin) acceptance criteria, story point estimation (Fibonacci), and explicit
  links to BPMN activities and functional requirements. Use when creating or
  auditing user stories in requirements engineering deliverables.
---

# Evaluador y Redactor de Historias de Usuario (HU)

Esta skill proporciona las directrices y estándares para formular, refinar y auditar Historias de Usuario en el marco de la metodología ágil para el proyecto BuscaTuNido.

---

## 1. Estructura Canónica de una Historia de Usuario

Cada historia debe seguir obligatoriamente el formato estándar:

```markdown
## HU-XX — [Título corto representativo de la funcionalidad]
**Como** [rol de usuario bien definido: ej. Estudiante foráneo / Dueño de pensión],  
**quiero** [acción concreta en el software],  
**para** [beneficio o valor de negocio esperado sin ambigüedades].

**Actividad TO-BE asociada:** [`ACT-TOBE-XX`](./02-rediseno-to-be.md#slug-completo)  
**Requisito de Producto asociado:** RP-XX

**Criterios de aceptación:**
- **CA1 (Escenario positivo / Happy path):** Dado que [condición inicial], cuando [acción], entonces [resultado esperado].
- **CA2 (Escenario de excepción / Validación):** Dado que [condición anómala o error], cuando [intento], entonces [mensaje o comportamiento preventivo].
```

---

## 2. Criterios de Calidad INVEST

Al auditar o crear una historia, verificar el cumplimiento estricto del acrónimo INVEST:

1. **Independent (Independiente):** La historia puede implementarse y desplegarse sin dependencia bloqueante estricta de otra historia del mismo sprint.
2. **Negotiable (Negociable):** No es un contrato rígido; describe el problema y resultado esperado, permitiendo afinar los detalles de implementación durante el sprint planning.
3. **Valuable (Valiosa):** Proporciona un beneficio tangible para el usuario final (estudiante o arrendador), no es una mera tarea técnica de backend o base de datos.
4. **Estimable (Estimable):** El equipo de desarrollo cuenta con suficiente información para asignarle un puntaje de complejidad en la escala Fibonacci ($1, 2, 3, 5, 8, 13$).
5. **Small (Pequeña):** Tiene el tamaño adecuado para ser completada dentro de una iteración (1 a 2 semanas), dividiéndose en historias más pequeñas si excede 8 puntos.
6. **Testable (Comprobable / Testeable):** Los criterios de aceptación permiten escribir pruebas automáticas (E2E / integración) o de aceptación funcional con resultados binarios (Pasa / Falla).

---

## 3. Estructuración de Criterios de Aceptación (Gherkin / Given-When-Then)

Evitar criterios vagos como *«debe funcionar bien»* o *«debe ser rápido»*. Redactar siempre con verificación observable:

### Ejemplo de Criterio de Aceptación Bien Redactado:
```gherkin
Escenario: Aprobación de postulación con cupo disponible
  Dado que el dueño Carmen recibe una solicitud de reserva con estado "En revisión"
  Cuando presiona el botón "Aprobar" en la bandeja móvil
  Entonces el sistema cambia el estado de la reserva a "Aprobada"
  Y bloquea automáticamente las fechas de la habitación en el catálogo público
  Y envía una notificación push de confirmación al estudiante con la ficha PDF
```

---

## 4. Rúbrica de Evaluación de una HU

Evaluar cada historia de usuario con la siguiente lista de verificación antes de darla por finalizada:

- [ ] ¿El rol es un usuario final del sistema y no un actor genérico como «sistema» o «desarrollador»?
- [ ] ¿La necesidad describe el «qué» y el beneficio declara el «por qué»?
- [ ] ¿Cuenta con al menos 2 criterios de aceptación verificables?
- [ ] ¿Cubre el caso de éxito y al menos un caso de borde o excepción?
- [ ] ¿Está vinculada a su actividad del diagrama BPMN TO-BE mediante un enlace con slug válido de GitHub?
- [ ] ¿Está alineada con los requisitos de producto funcionales (`RP-XX`)?
