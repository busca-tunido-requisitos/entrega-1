# Guía para probar y cerrar el ciclo

Al terminar la implementación, entrega al estudiante un mensaje con esta estructura, completado con datos reales del proyecto (comandos, URL, nombres de los escenarios). No le pidas que adivine nada.

## 1. Qué se construyó

Dos o tres líneas: historia implementada, caso de uso y entidades involucradas, y qué integraciones están simuladas.

## 2. Cómo arrancarlo

```text
Instalar:  [comando, por ejemplo: npm install  |  pip install -r requirements.txt]
Preparar:  [comando para crear la base y cargar datos de ejemplo]
Ejecutar:  [comando]
Abrir:     [URL, por ejemplo http://localhost:3000]
Probar:    [comando de las pruebas, por ejemplo: npm test  |  pytest]
```

Indica qué debería ver al abrir la aplicación y qué usuarios o roles de demostración existen.

## 3. Recorrido por los escenarios Gherkin

Una tabla con un recorrido manual por **cada escenario** de la historia:

| Escenario | Qué hacer | Qué debería ver |
|-----------|-----------|------------------|
| [Nombre del escenario] | [Pasos concretos: rol, pantalla, datos] | [Resultado esperado, con el mensaje o estado exacto] |

Incluye los escenarios de error y los cambios de estado (por ejemplo, «la reserva queda en estado Pendiente de aprobación»). Si hay una integración simulada, dile dónde ver su registro.

## 4. Pruebas automáticas

Resultado de la ejecución (cuántas pasaron) y qué escenario cubre cada prueba.

## 5. Preguntas para el estudiante

Invítalo a **validar el sistema** con `/cin324-validar-sistema`: él lo prueba como si fuera el cliente y cuenta con sus palabras lo que no es como esperaba; esa skill le indica qué artefactos deben cambiar y lo asiste para actualizarlos, con su aprobación en cada cambio. No le preguntes «¿qué quieres que arregle?» ni cambies código por una petición suelta.

- Si hay observaciones: se resuelven actualizando los artefactos (él mismo, o con la asistencia de esa skill y su aprobación en cada cambio) y después se genera un cambio `ajuste-hu-xx-…` con `/cin324-generar-app`.
- Si no hay observaciones pendientes: «¿Archivo el cambio y dejamos el sistema listo para la siguiente historia?».

## 6. Cierre (solo con confirmación)

1. Archivar con `openspec-archive-change` (el estudiante también puede escribir `/opsx-archive`).
2. Actualizar `.cin324/proyecto.md` (historia hecha, fecha, cambio, comandos).
3. Sugerir el commit: `HU-xx: <resumen> (cambio <nombre-del-cambio>)`.
4. Preguntar: ¿siguiente historia o cambio sobre lo generado?
