# Atributos de calidad (ISO 25010)

## Priorización de los 9 atributos de primer nivel
1. **Usabilidad (Usability)**: Máxima prioridad. La plataforma debe ser accesible e intuitiva tanto para estudiantes universitarios como para dueños de pensión (muchos de ellos adultos mayores con distintas competencias tecnológicas), asegurando que la publicación y búsqueda de alojamientos no requieran capacitación previa.
2. **Adecuación Funcional (Functional Suitability)**: Segunda prioridad. Garantiza que el conjunto de funciones provistas (filtros de distancia a sedes, desglose obligatorio de servicios básicos, flujo de postulación y emisión de comprobantes) satisfaga de manera completa y correcta las necesidades declaradas por los usuarios.
3. **Seguridad (Security)**: Tercera prioridad. Protección estricta de datos personales de contacto, mitigación de suplantación de identidad mediante verificación de correos institucionales universitarios y prevención de estafas en ofertas habitacionales.
4. **Rendimiento y Eficiencia de Desempeño (Performance Efficiency)**: Capacidad de respuesta veloz en la carga del catálogo geolocalizado y optimización en la entrega de galerías fotográficas bajo conexiones móviles.
5. **Fiabilidad (Reliability)**: Alta disponibilidad operativa y tolerancia a fallos, particularmente crítica durante los meses peak de matrícula universitaria y búsqueda de arriendo (enero a marzo).
6. **Mantenibilidad (Maintainability)**: Modularidad y claridad arquitectónica del código para facilitar la incorporación de futuras capacidades (como sistema de reputación o firmas digitales) sin degradar el núcleo.
7. **Compatibilidad (Compatibility)**: Coexistencia adecuada con múltiples navegadores y capacidad de interoperar con servicios externos de geocodificación y cartografía digital.
8. **Portabilidad (Portability)**: Diseño responsive adaptable a dispositivos móviles (smartphones de distintas resoluciones) y ordenadores de escritorio.
9. **Flexibilidad e Inclusividad (Flexibility)**: Adaptabilidad del sistema ante variaciones en normativas de convivencia o modalidades de arriendo (año corrido vs. arriendo marzo-diciembre).

---

## Métricas de los 3 atributos más importantes

### 1. Usabilidad
- **Métrica: Tasa de Éxito en la Realización de Tareas Clave (Task Completion Rate - TCR)**
  - **Definición**: Porcentaje de usuarios que logran completar de forma autónoma y sin errores críticos los flujos principales del sistema (publicar una pensión completa o enviar una solicitud formal de reserva).
  - **Fórmula de cálculo**:  
    $$\text{TCR} = \left( \frac{\text{Número de tareas completadas exitosamente}}{\text{Número total de intentos de tarea}} \right) \times 100$$
  - **Unidad de medida**: Porcentaje (%).
  - **Método de medición**: Pruebas de usabilidad con muestra de 10 usuarios representativos (5 estudiantes foráneos y 5 arrendadores de pensión) cronometrando el flujo guiado.
  - **Umbral de aceptación**: $\ge 90\%$ de éxito en el primer intento sin asistencia externa.

### 2. Adecuación Funcional
- **Métrica: Ratio de Completitud Funcional y Exactitud de Filtrado (Functional Completeness & Accuracy Ratio - FCAR)**
  - **Definición**: Proporción de requisitos funcionales críticos especificados que se encuentran implementados y operando sin discrepancias contra los casos de prueba de aceptación.
  - **Fórmula de cálculo**:  
    $$\text{FCAR} = \left( \frac{\text{Requisitos funcionales verificados conformes}}{\text{Total de requisitos funcionales especificados}} \right) \times 100$$
  - **Unidad de medida**: Porcentaje (%).
  - **Método de medición**: Ejecución de la matriz de trazabilidad y suites de pruebas de aceptación (historias de usuario HU-01 a HU-05 y RP-01 a RP-08).
  - **Umbral de aceptación**: $100\%$ de los requisitos funcionales calificados como obligatorios deben estar completamente operativos.

### 3. Seguridad
- **Métrica: Índice de Exposición No Autorizada de Datos Personales (Unauthorized Data Exposure Rate - UDER)**
  - **Definición**: Frecuencia de incidentes o peticiones en las que datos personales sensibles de contacto (teléfono celular, correo personal o dirección exacta de la habitación) se revelen a usuarios no autenticados o que no cuenten con una solicitud formal aceptada.
  - **Fórmula de cálculo**:  
    $$\text{UDER} = \left( \frac{\text{Peticiones con fuga de datos de contacto no autorizada}}{\text{Total de consultas a endpoints de pensión}} \right) \times 100$$
  - **Unidad de medida**: Porcentaje (%).
  - **Método de medición**: Auditoría de seguridad y pruebas de penetración automáticas sobre las respuestas de la API pública y vistas del catálogo.
  - **Umbral de aceptación**: $0\%$ (cero tolerancia a filtración de información de contacto privado sin autorización explícita).
