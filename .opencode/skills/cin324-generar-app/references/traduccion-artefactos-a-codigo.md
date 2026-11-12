# De los artefactos del curso al código

Reglas para que la aplicación salga de la documentación y se pueda trazar de vuelta. Aplícalas al redactar `design.md` y `tasks.md`, y al implementar. Siempre con el alcance de **una historia**: crea solo las tablas, columnas, pantallas y endpoints que la historia necesita, y deja el resto para sus historias.

## Tabla de equivalencias

| Artefacto del curso | Qué produce en la aplicación |
|---------------------|--------------------------------|
| **Modelo de dominio** (clases, atributos, asociaciones, multiplicidades) | Una tabla por clase que la historia usa, con el mismo nombre de la clase (en minúsculas y plural o como use el stack). Atributos → columnas. Asociación 1 → clave foránea; 0..* → clave foránea en el lado «muchos»; muchos a muchos → tabla intermedia. Multiplicidad mínima 1 → `NOT NULL`. Composición → `ON DELETE CASCADE`; agregación → sin cascada. Herencia → una tabla con columna `tipo` (la opción más simple) salvo que el estudiante pida otra. |
| **Diagrama de estado** de una clase | Una columna `estado` (texto restringido a los estados del diagrama) y **una sola función** que aplica transiciones: recibe el evento, verifica que sea válido desde el estado actual, evalúa la guarda, ejecuta la acción y guarda el nuevo estado. Una transición no permitida debe fallar con un mensaje claro. El estado inicial es el valor por defecto al crear. |
| **Diagrama de secuencia de sistema** | Los mensajes del actor al sistema → rutas/endpoints (y la pantalla o formulario que los dispara). Los mensajes del sistema a un sistema externo → llamadas a un adaptador (ver abajo). Los fragmentos `alt`/`opt` → ramas condicionales con su resultado visible para el usuario. Mantén el orden de los mensajes. |
| **Caso de uso** | Una pantalla o flujo con el nombre del caso de uso, accesible por el actor correspondiente. Los `include` → funciones compartidas; los `extend` → rama condicional. |
| **Escenarios Gherkin** | **Una prueba automática por escenario**, nombrada `HU-xx · <nombre del escenario>`, con `Dado` = preparación de datos, `Cuando` = la acción, `Entonces` = las aserciones. Es el criterio de «terminado». |
| **Actividad del TO-BE** | No genera código: se registra en la trazabilidad (comentario en el módulo y en `.cin324/proyecto.md`). Si la actividad es una tarea de servicio, apunta a lógica automática; si es de usuario, a una pantalla. |
| **Requisitos funcionales** | Si no están ya cubiertos por la historia, se mencionan en `proposal.md` como contexto. Los requisitos no funcionales y atributos de calidad **no se implementan**. |

## Sistemas externos

Para cada sistema externo que aparezca en el diagrama de secuencia (calendario institucional, pasarela de pago, correo, etc.):

1. Define una interfaz con el nombre del sistema (`ServicioCalendario`, `ServicioPago`) y los mensajes del diagrama como métodos.
2. Implementa una versión simulada (`...Simulado`) que registra la llamada en consola o en una tabla `integraciones_log` y devuelve una respuesta de éxito (y, si la historia lo pide, una de error activable con una variable de entorno).
3. Selecciona la implementación por configuración, para que luego se pueda reemplazar por la real sin tocar la lógica.
4. Dilo en la guía de pruebas: «Esta integración está simulada».

## Actores y autenticación

No se implementa autenticación real. Para distinguir actores (Solicitante, EncargadoDeEventos, AdministradorDelSistema), usa un selector de rol y usuario de demostración en la parte superior de la página, o un encabezado/cookie sencilla, y deja datos de ejemplo para cada rol. Solo si una historia trata explícitamente de iniciar sesión se implementa un acceso básico.

## Estructura y estilo

- Aplicación monolítica web con páginas renderizadas en el servidor y formularios HTML. Nada de frameworks de frontend a menos que el estudiante lo pida.
- Mínimas dependencias; nombres del dominio en español como en el modelo (por ejemplo `Reserva`, `Espacio`) para que se vea la trazabilidad. Comentarios breves del tipo `// HU-02, ACT-TOBE-03` en los puntos donde se implementa algo de un artefacto.
- Migraciones SQL numeradas (`migrations/001_crear_espacios.sql`, …) aplicadas en orden al arrancar, registradas en una tabla `schema_migrations`. Cada historia agrega migraciones nuevas, sin reescribir las anteriores.
- Datos de ejemplo en un script (`seed`) idempotente.
- Una prueba de integración por escenario Gherkin, usando una base SQLite en memoria o temporal.
- `README.md` actualizado con cómo instalar, ejecutar y probar.

## Qué hacer ante vacíos

- Un atributo o regla que la historia necesita y el modelo de dominio no tiene: pregúntale al estudiante; no lo agregues en silencio. Si lo confirma, pídele que actualice el modelo (o ofrécete a proponer el cambio) y regístralo en `.cin324/proyecto.md` como supuesto.
- Un escenario de error sin mensaje definido: propón el texto y deja que el estudiante lo apruebe en la revisión de especificaciones.
