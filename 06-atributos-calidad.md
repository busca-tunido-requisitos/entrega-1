# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de los 9 atributos de primer nivel

1. **Capacidad de interacción:** Máxima prioridad, debido a que los dueños son mayoritariamente adultos mayores que requieren interfaces simples y los estudiantes foráneos operan desde dispositivos móviles para buscar y reservar.
2. **Seguridad:** Crítica para asegurar control de acceso por roles (RBAC) e impedir que un arrendador modifique propiedades o solicitudes ajenas, además de proteger la información personal en las postulaciones de reserva.
3. **Eficiencia de desempeño:** Esencial para que el catálogo geolocalizado en tiempo real, el envío de solicitudes y el despacho de notificaciones push respondan de forma instantánea.
4. **Fiabilidad:** Necesaria para garantizar alta disponibilidad del servicio durante los periodos de alta demanda de matrícula universitaria (febrero-marzo).
5. **Adecuación funcional:** Asegura el cumplimiento correcto de las funciones de filtrado, solicitud de reserva, emisión de fichas en PDF y chat de coordinación.
6. **Mantenibilidad:** Permite extender y mantener modularmente la arquitectura desacoplada de NestJS y Next.js.
7. **Flexibilidad:** Capacidad de la interfaz para adaptarse responsivamente a diferentes modelos de teléfonos inteligentes y tamaños de pantalla.
8. **Compatibilidad:** Interoperabilidad con navegadores web móviles modernos y sistemas de notificaciones push estándar.
9. **Inocuidad (Safety):** Menor prioridad relativa al tratarse de un servicio de software informativo y de reservas que no involucra riesgos físicos ni maquinaria.

---

## Métricas de los 3 atributos más importantes (ISO/IEC 25023)

### 1. Capacidad de interacción — Capacidad de aprendizaje (Learnability)
- **Métrica:** Tasa de éxito en la resolución de solicitudes de reserva (aprobar/rechazar) al primer intento sin ayuda externa (`MET-INT-01`).
- **Fórmula de medición:**  
  $$X = \frac{A}{B}$$  
  - $A$ = Número de dueños de pensión que resuelven una postulación correctamente al primer intento desde su celular.  
  - $B$ = Total de dueños evaluados en la muestra de prueba.
- **Valor meta:** $X \ge 0.95$ ($95\%$ de éxito intuitivo sin capacitación previa).

### 2. Seguridad — Controlabilidad del acceso (Access Controllability)
- **Métrica:** Efectividad en el bloqueo de accesos no autorizados sobre reservas y operaciones de propiedad (`MET-SEC-01`).
- **Fórmula de medición:**  
  $$X = 1 - \frac{A}{B}$$  
  - $A$ = Número de peticiones no autorizadas que lograron consultar o alterar reservas ajenas en pruebas de penetración (IDOR).  
  - $B$ = Total de pruebas automatizadas ejecutadas sobre endpoints protegidos.
- **Valor meta:** $X = 1.00$ ($0$ accesos indebidos tolerados; $100\%$ de rechazos con HTTP 403 Forbidden).

### 3. Eficiencia de desempeño — Comportamiento temporal (Time Behaviour)
- **Métrica:** Tiempo de respuesta de la API backend en consultas de catálogo y despacho de solicitudes (`MET-PERF-01`).
- **Fórmula de medición:**  
  $$X = P_{95}(T_{\text{respuesta}})$$  
  - Medido como el percentil 95 del tiempo de respuesta (en ms) para 1.000 solicitudes con 50 usuarios concurrentes.
- **Valor meta:** $X \le 400\text{ ms}$ (Percentil 95 inferior o igual a 400 milisegundos).
