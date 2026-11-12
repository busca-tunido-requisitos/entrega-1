# Formato del informe de completitud

Usa esta estructura. Mantén los textos cortos y concretos.

```markdown
## Informe de completitud del repositorio

**Veredicto:** [Podemos continuar / Podemos continuar con supuestos / Todavía no: falta un elemento bloqueante]

### Resumen

| # | Artefacto | Estado | Evidencia | Qué falta |
|---|-----------|--------|-----------|-----------|
| 1 | BPMN AS-IS | ✅ Completo | `01-proceso-as-is.md`, `diagramas/as-is.png` | — |
| 2 | BPMN TO-BE | ⚠️ Parcial | `diagramas/to-be.png` | No hay tabla de actividades con IDs |
| 3 | Historias de usuario | ✅ Completo | `04-historias-usuario.md` (5 historias) | — |
| 4 | Criterios Gherkin | ⚠️ Parcial | `07-criterios-aceptacion.md` | HU-04 y HU-05 sin escenarios |
| 5 | Modelo de dominio | ✅ Completo | `diagramas/modelo-dominio.puml` | — |
| 6 | Casos de uso | ❌ Faltante | — | No se encontró el diagrama |
| 7 | Diagramas de estado | ✅ Completo | `diagramas/est-01.puml` (Reserva) | — |
| 8 | Diagramas de secuencia | ⚠️ Parcial | `diagramas/dss-01.puml` | Hay 1; se piden al menos 2 |
| 9 | Requisitos | ✅ Completo | `03-requisitos.md` | — |
| 10 | Atributos de calidad | ✅ Completo | `06-atributos-calidad.md` | — |

### Lo que falta o está incompleto
1. **[Elemento]** — [Qué falta exactamente y por qué importa para generar código].

### Dudas que necesito que me resuelvas
1. [Pregunta concreta, con lo que viste y lo que propones].

### Cómo seguir
Para cada punto, elige: **(a)** lo agregas al repositorio y me pides revisar de nuevo, o **(b)** me lo respondes aquí y lo registro como supuesto.
¿Completas algo antes de seguir, o continuamos con estos supuestos?
```

Notas de uso:

- Los íconos son opcionales; si el entorno no los muestra bien, usa «Completo», «Parcial», «Faltante».
- No pongas nada en «Evidencia» que no hayas leído.
- Ordena «Lo que falta» de mayor a menor importancia (bloqueante, importante, contexto).
