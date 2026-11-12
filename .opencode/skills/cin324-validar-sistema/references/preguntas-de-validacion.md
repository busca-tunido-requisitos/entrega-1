# Cómo invitar a validar, recoger el feedback y qué rechazar

## 1. Mensaje de invitación (paso 2)

Completa con datos reales del proyecto. Mantén el mensaje corto y concreto.

````markdown
Vamos a validar **HU-02 · Reservar un espacio disponible** como si fueras quien recibe el sistema. No busques errores de programación: busca cualquier cosa que no sea como esperabas.

**Cómo arrancarlo**
```text
Ejecutar:  [comando]
Abrir:     [URL]
Roles de demostración: [lista]   Datos de ejemplo: [qué hay]
```

**Qué recorrer**
| Qué hacer | Qué debería verse (según tu documentación) |
|-----------|---------------------------------------------|
| [Escenario 1: pasos concretos con rol y datos] | [resultado, estado o mensaje exacto] |
| [Escenario 2…] | […] |

**Además, mira**
1. Los **estados**: ¿cambian como en tu diagrama de estado? (por ejemplo, de Solicitada a Confirmada)
2. Los **pasos con el sistema**: ¿el orden coincide con tu diagrama de secuencia?
3. Los **datos** que se muestran o se piden: ¿están todos? ¿sobra alguno?
4. Lo que **falta**: ¿hay algo que esperabas del proceso TO-BE y no está?
5. Prueba también con **datos inválidos**, con **otro rol** y con el **caso límite** de cada regla.

**Cuéntame con tus palabras** qué hiciste, qué esperabas y qué pasó. Puedes mandarme varias observaciones juntas, y cuéntame también lo que sí funcionó.
````

## 2. Si el estudiante no sabe qué decir

- «Recorre el primer escenario de la tabla y dime si pasó lo que dice la última columna».
- «¿Hubo algún momento en que dijiste “eso no debería hacerlo”?».
- «¿Algo te pareció que sobraba, o que faltaba?».
- «Intenta hacer algo que no debería poder hacerse (por ejemplo, reservar dos veces el mismo horario). ¿Qué pasó?».

## 3. Preguntas aclaratorias (máximo tres a la vez)

- ¿Qué hiciste exactamente (rol, pantalla, datos)?
- ¿Qué esperabas que pasara, y por qué lo esperabas (¿está en algún documento tuyo?)?
- ¿Qué viste en su lugar (mensaje, estado, pantalla)?
- ¿Te pasa siempre o solo con ciertos datos?

## 4. Qué debes rechazar, y cómo

Puedes ayudar a actualizar los artefactos de especificación, pero **solo con aprobación explícita de cada cambio**. Rechaza con amabilidad estas tres cosas:

1. **Tocar el código o `openspec/`.** «El sistema se produce solo desde tus artefactos: si cambio el código, éste y tu documentación dejarían de coincidir. Corregimos la especificación y regeneramos con `/cin324-generar-app`».
2. **Aplicar cambios sin aprobarlos uno por uno** («aprueba todo», «hazlo y me cuentas»). «Te muestro cada cambio y lo aplico cuando me digas que sí; así revisas todo y aprendes a mantener la consistencia. Va rápido: te muestro el primero ahora».
3. **Cambios que él no decidió** o fuera del plan aprobado. «Eso es una decisión de negocio tuya; dime cómo debería ser y lo propongo».

Si insiste, mantén la negativa sin sermonear, repite lo que sí puedes hacer y ofrece continuar con el siguiente cambio.

Ejemplos de respuesta:

> «No cambio el código: la causa está en la especificación. Si quieres, te propongo el cambio al escenario de la sala grande en `07-criterios-aceptacion.md` y tú decides si lo apruebas».

> «Prefiero que los revises uno por uno. Este es el primero: [propuesta]. ¿Lo apruebas, lo modificamos o lo descartamos?».
