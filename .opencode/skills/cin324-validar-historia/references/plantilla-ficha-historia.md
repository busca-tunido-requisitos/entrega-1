# Plantilla de ficha de historia (`.cin324/historias/HU-xx.md`)

Esta ficha es el insumo para `openspec-propose`: debe ser autosuficiente (alguien que no leyó el repositorio debe poder entender qué construir). Rellena todo con lo **confirmado por el estudiante**.

````markdown
# HU-02 — Reservar un espacio disponible

**Estado:** lista para especificar  ·  **Confirmada por el estudiante:** [AAAA-MM-DD]
**Fuente de la historia:** [archivo .md o issue #n]

## Historia
Como [rol], quiero [funcionalidad], para [beneficio].

## Trazabilidad
- Actividad del TO-BE: [ACT-TOBE-03 — nombre] (tipo: [usuario / servicio / manual]). Cambio respecto del AS-IS: [qué cambia]
- Caso de uso: [CU-01 — nombre]. Actor principal: [actor]. Actores externos: [sistemas]
- Requisitos que cubre: [RP-01, RP-04]
- Diagrama de secuencia: [DSS-01 o «reconstruido desde Gherkin (supuesto)»]
- Diagrama de estado: [EST-01 de Reserva o «no aplica»]

## Entidades del modelo de dominio
| Entidad | Operación en esta historia | Atributos usados | Asociaciones y multiplicidades |
|---------|----------------------------|------------------|--------------------------------|
| [Reserva] | [crea] | [fecha, horaInicio, horaFin, estado] | [Solicitante 1 – 0..* Reserva; Reserva 0..* – 1 Espacio] |

## Cambios de estado
| Entidad | Estado origen | Evento | Guarda | Acción | Estado destino |
|---------|---------------|--------|--------|--------|----------------|
| [Reserva] | [inicial] | [reservarEspacio] | [capacidad ≤ 20] | [registrarEvento(calendario)] | [Confirmada] |

(Escribe «No aplica» si ninguna entidad de la historia tiene ciclo de vida modelado.)

## Flujo de interacción
1. [El Solicitante …]
2. [El sistema …]
3. [Sistema externo …]
4. …

**Variantes:**
- [Si …: …]

## Sistemas externos (se simulan en la implementación)
| Sistema | Mensajes | Comportamiento simulado |
|---------|----------|--------------------------|
| [Servicio de Calendario Institucional] | [registrarEvento(espacio, fecha, horario)] | [responde «eventoRegistrado»] |

## Escenarios Gherkin (texto íntegro)
```gherkin
[Pegar aquí los escenarios, tal como están en la documentación o ya corregidos]
```

## Decisiones tomadas en la validación
- [Inconsistencia o duda → qué se decidió y quién lo confirmó]

## Supuestos
- [Supuesto aceptado por el estudiante, con su motivo]

## Fuera de alcance de esta historia
- [Cosas relacionadas que no se implementan ahora (otras historias, requisitos no funcionales)]
````
