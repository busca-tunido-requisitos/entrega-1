# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de los 9 atributos de primer nivel

1. **Capacidad de interacción:** Máxima prioridad, debido a que los dueños son mayoritariamente adultos mayores que requieren interfaces simples y los estudiantes operan desde dispositivos móviles.
2. **Seguridad:** Crítica para asegurar control de acceso por roles (RBAC) e impedir que un arrendador modifique propiedades ajenas, además de proteger la legitimidad del sello de estudiante verificado.
3. **Eficiencia de desempeño:** Esencial para que el catálogo geolocalizado, los mapas y el histograma respondan de forma instantánea en conexiones móviles.
4. **Fiabilidad:** Necesaria para garantizar alta disponibilidad del servicio durante los periodos de alta demanda de matrícula universitaria (febrero-marzo).
5. **Adecuación funcional:** Asegura el cumplimiento correcto de las funciones de filtrado, contacto y conmutación de cupos de piezas.
6. **Mantenibilidad:** Permite extender y mantener modularmente la arquitectura desacoplada de NestJS y Next.js.
7. **Flexibilidad:** Capacidad de la interfaz para adaptarse responsivamente a diferentes modelos de teléfonos inteligentes y tamaños de pantalla.
8. **Compatibilidad:** Interoperabilidad con navegadores web móviles modernos y enlaces de apertura directa a WhatsApp.
9. **Inocuidad (Safety):** Menor prioridad relativa al tratarse de un servicio de software informativo que no involucra riesgos físicos ni maquinaria.

---

## Métricas de los 3 atributos más importantes (ISO/IEC 25023)

### 1. Capacidad de interacción — Operabilidad (Learnability)
- **Métrica:** Tasa de éxito en la conmutación de disponibilidad de habitaciones al primer intento sin ayuda externa (`MET-INT-01`).
- **Fórmula de medición:**  
  $$X = \frac{A}{B}$$  
  - $A$ = Número de dueños de pensión que conmutan la disponibilidad correctamente al primer intento.  
  - $B$ = Total de dueños evaluados en la muestra de prueba.
- **Valor meta:** $X \ge 0.95$ ($95\%$ de éxito intuitivo sin capacitación previa).

### 2. Seguridad — Controlabilidad del acceso (Access Controllability)
- **Métrica:** Efectividad en el bloqueo de accesos no autorizados sobre operaciones de propiedad (`MET-SEC-01`).
- **Fórmula de medición:**  
  $$X = 1 - \frac{A}{B}$$  
  - $A$ = Número de peticiones no autorizadas que lograron vulnerar el control de acceso en pruebas de seguridad (IDOR).  
  - $B$ = Total de pruebas automatizadas ejecutadas sobre endpoints protegidos.
- **Valor meta:** $X = 1.00$ ($0$ accesos indebidos tolerados; $100\%$ de rechazos con HTTP 403 Forbidden).

### 3. Eficiencia de desempeño — Comportamiento temporal (Time Behaviour)
- **Métrica:** Tiempo de respuesta de la API backend en consultas de catálogo geolocalizado (`MET-PERF-01`).
- **Fórmula de medición:**  
  $$X = P_{95}(T_{\text{respuesta}})$$  
  - Medido como el percentil 95 del tiempo de respuesta (en ms) para 1.000 solicitudes con 50 usuarios concurrentes.
- **Valor meta:** $X \le 300\text{ ms}$ (Percentil 95 inferior o igual a 300 milisegundos).
