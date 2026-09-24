# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de los 9 atributos de primer nivel

De acuerdo con la edición vigente del estándar **ISO/IEC 25010:2023**, se priorizan las nueve características de calidad de producto según las necesidades del contexto operativo de **BuscaTuNido** (estudiantes universitarios móviles y arrendadores particulares):

1. **Capacidad de interacción (Interaction Capability):**  
   *Justificación de máxima prioridad:* Es el factor determinante para el éxito de la plataforma. La mayoría de los dueños de pensiones son adultos mayores sin formación técnica avanzada que requieren una interfaz extremadamente simple y accesible desde el smartphone para cambiar estados de habitaciones, mientras que los estudiantes universitarios acceden en un 95% desde dispositivos móviles en movimiento.
2. **Seguridad (Security):**  
   *Justificación:* El sistema gestiona identidades de estudiantes, números de WhatsApp y control de propiedades privadas. Es imperativo asegurar el control de acceso estricto basado en roles (RBAC) para impedir que un usuario no autorizado manipule habitaciones o apruebe propuestas de pensiones ajenas, así como proteger la integridad del sello de residente verificado.
3. **Eficiencia de desempeño (Performance Efficiency):**  
   *Justificación:* La experiencia de búsqueda depende de la fluidez del mapa, la interactividad del histograma de precios de 28 barras y la inmediatez del filtrado geodésico. Si la respuesta de la API o el renderizado móvil tardan más de un par de segundos, el estudiante abandonará la plataforma.
4. **Fiabilidad (Reliability):**  
   *Justificación:* La plataforma experimenta picos críticos de demanda durante las semanas previas al inicio de cada semestre académico (febrero-marzo y julio-agosto). Debe garantizar alta disponibilidad y tolerancia a fallos en esos periodos de alta concurrencia.
5. **Adecuación funcional (Functional Suitability):**  
   *Justificación:* El software debe cumplir con exactitud las funciones comprometidas: filtrado multicriterio, conmutación de cupos de piezas, publicación de opiniones y tramitación de propuestas de corrección.
6. **Mantenibilidad (Maintainability):**  
   *Justificación:* La arquitectura modular (NestJS en backend y Next.js en frontend) debe permitir incorporar nuevas funcionalidades futuras (ej. postulaciones de pensiones comunitarias) con mínimo impacto en el código existente.
7. **Flexibilidad (Flexibility):**  
   *Justificación:* Capacidad de la interfaz web para operar de forma responsiva en diversas resoluciones de pantallas (desde teléfonos compactos de 360 px hasta monitores de escritorio).
8. **Compatibilidad (Compatibility):**  
   *Justificación:* Capacidad de interoperar transparentemente con servicios cartográficos, navegadores estándar y esquemas de apertura externa (ej. deep links a WhatsApp).
9. **Inocuidad (Safety):**  
   *Justificación:* Ocupa la menor prioridad relativa en este dominio de negocio, dado que una falla o indisponibilidad en la aplicación web no compromete directamente la integridad física de las personas, vidas humanas ni instalaciones industriales críticas.

---

## Métricas de los 3 atributos más importantes (ISO/IEC 25023)

Para cuantificar las tres características principales, se definen medidas verificables basadas en el estándar complementario **ISO/IEC 25023**:

### 1. Capacidad de interacción — Subcaracterística: Operabilidad y Facilidad de Aprendizaje (Learnability)

- **Identificador de Métrica:** `MET-INT-01` (Tasa de éxito en la gestión de disponibilidad al primer intento).
- **Descripción:** Mide la proporción de dueños de pensión que logran conmutar correctamente el estado de una habitación (de disponible a ocupada o viceversa) en la interfaz móvil sin requerir asistencia externa ni cometer errores operativos en su primera sesión.
- **Función de medición (Fórmula):**  
  $$X = \frac{A}{B}$$  
  - $A$ = Número de usuarios propietarios que completan la tarea de conmutar disponibilidad satisfactoriamente al primer intento.  
  - $B$ = Total de usuarios propietarios evaluados en la muestra de prueba.
- **Unidad y rango:** Proporción entre $0.0$ y $1.0$ (o porcentaje de $0\%$ a $100\%$).
- **Valor meta / Criterio de aceptación:**  
  $$X \ge 0.95 \quad (95\% \text{ de éxito sin capacitación previa}).$$

---

### 2. Seguridad — Subcaracterística: Controlabilidad del Acceso (Access Controllability)

- **Identificador de Métrica:** `MET-SEC-01` (Efectividad del control de acceso a operaciones de propiedad).
- **Descripción:** Evalúa la capacidad del sistema para bloquear intentos no autorizados de lectura o mutación sobre recursos protegidos (ej. un arrendador intentando editar habitaciones o aprobar propuestas de una pensión que no le pertenece, o un estudiante intentando crear una pensión directamente mediante la API).
- **Función de medición (Fórmula):**  
  $$X = 1 - \frac{A}{B}$$  
  - $A$ = Número de solicitudes no autorizadas que consiguieron vulnerar el control de acceso en auditorías o pruebas de penetración (IDOR / escalamiento de privilegios).  
  - $B$ = Total de pruebas automatizadas de acceso cruzado indebido ejecutadas sobre los endpoints protegidos.
- **Unidad y rango:** Proporción entre $0.0$ y $1.0$ (donde $1.0$ representa seguridad perfecta ante los vectores evaluados).
- **Valor meta / Criterio de aceptación:**  
  $$X = 1.00 \quad (0\text{ accesos indebidos tolerados; 100\% de bloqueos con código HTTP 403 Forbidden}).$$

---

### 3. Eficiencia de desempeño — Subcaracterística: Comportamiento Temporal (Time Behaviour)

- **Identificador de Métrica:** `MET-PERF-01` (Tiempo de respuesta de la API en búsqueda geolocalizada).
- **Descripción:** Tiempo transcurrido desde que el cliente móvil envía una solicitud de catálogo con filtros espaciales y de precio (`GET /pensions?latitude=...&longitude=...&radiusKm=30`) hasta que el backend entrega la respuesta completa serializada.
- **Función de medición (Fórmula):**  
  $$X = P_{95}(T_{\text{respuesta}})$$  
  Donde $P_{95}$ es el percentil 95 del tiempo de respuesta (en milisegundos) medido sobre una ventana de 1.000 peticiones bajo una carga simultánea de 50 usuarios concurrentes simulados.
- **Unidad y rango:** Tiempo en milisegundos (ms).
- **Valor meta / Criterio de aceptación:**  
  $$X \le 300\text{ ms} \quad (\text{Percentil 95 inferior o igual a 300 milisegundos}).$$
