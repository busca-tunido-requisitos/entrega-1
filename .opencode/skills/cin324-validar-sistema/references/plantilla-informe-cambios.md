# Plantilla del informe de validación

Entrega este informe en el chat (paso 5). Si el estudiante lo autoriza, guárdalo también en `.cin324/validaciones/VAL-HU-xx-n.md` (n es un correlativo por historia). Rellénalo solo con datos verificados.

````markdown
# Informe de validación — HU-02 · Reservar un espacio disponible
**Fecha:** [AAAA-MM-DD]  ·  **Cambio de OpenSpec validado:** [hu-02-reservar-espacio]  ·  **Estado:** [pendiente de actualización de artefactos]

## Resumen
| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|------------------|
| OBS-1 | [una línea] | [A, B, C, D, E o F] | [archivo y sección o ID] | [archivos] |
| OBS-2 | […] | […] | […] | […] |

**Lo que sí funcionó:** [lista breve].

## Detalle por observación

### OBS-1 — [título corto]
- **Lo que dijiste:** [esperaba / pasó, con tus palabras resumidas].
- **Qué dicen hoy los artefactos:** [cita con archivo y sección o ID].
- **Diagnóstico:** [tipo y por qué, con evidencia].
- **Qué debes modificar tú:** [artefacto principal, sección o ID, y la decisión que tienes que tomar, en palabras].
- **Para mantener la consistencia, revisa:**
  - [archivo]: [qué verificar]
  - [archivo]: [qué verificar]

### OBS-2 — […]

## Orden sugerido de edición
1. [artefacto] (OBS-1, OBS-3)
2. […]
n. `12-trazabilidad.md` (al final)

## Cómo trabajamos los cambios
Elige: **A)** los editas tú; **B)** te propongo cada cambio y tú apruebas, modificas o descartas cada uno; **C)** mixto. En todos los casos, yo no toco el código y no aplico ningún cambio sin tu aprobación explícita.

## Cómo sabrás que terminaste
- [ ] Se actualizó el artefacto principal de cada observación de tipo A, B o C (por ti o con tu aprobación).
- [ ] Revisamos cada artefacto afectado de la lista.
- [ ] Los diagramas editados tienen su fuente y su imagen exportada actualizadas.
- [ ] Las observaciones de tipo E o F quedaron resueltas o descartadas conscientemente.
- [ ] Revisé la consistencia final (chequeos C1 a C14 y trazabilidad) y todo está ✔.

## Siguiente paso
Cuando todo esté revisado: haz commit de tus artefactos y ejecuta `/cin324-generar-app` para generar el ajuste. Después, vuelve a ejecutar `/cin324-validar-sistema`.
````

## Estado del informe guardado

Con permiso del estudiante, actualiza solo el campo **Estado** del archivo en `.cin324/validaciones/`: `pendiente de actualización de artefactos` → `artefactos actualizados` → `verificado en el sistema`. Nunca modifiques otro archivo.
