---
name: req-traceability-audit
description: >-
  Audit end-to-end traceability across requirements engineering deliverables:
  AS-IS activities, TO-BE activities, product requirements (RP-xx), user stories (HU-xx),
  ISO/IEC 25010 quality attributes, and BPMN diagram artifacts. Use when verifying
  consistency, checking for missing traces, or validating GitHub anchor links.
---

# Auditoría de Trazabilidad de Requisitos

Esta skill define el procedimiento y criterios normativos para auditar y garantizar la coherencia y trazabilidad bidireccional entre todos los artefactos de la especificación de requisitos del proyecto BuscaTuNido.

---

## 1. Cadena de Trazabilidad End-to-End

Toda necesidad identificada debe rastrearse a lo largo de las siguientes capas:

```
[Hallazgo Elicitación (05)] 
        ↓
[Problema AS-IS (01)] 
        ↓
[Iniciativa / Actividad TO-BE (02)] 
        ↓
[Requisito de Producto RP (03)] 
        ↓
[Historia de Usuario HU (04)] 
        ↓
[Atributo y Métrica de Calidad ISO 25010/25023 (06)]
```

---

## 2. Reglas de Validación de Trazabilidad

1. **Cobertura del AS-IS:**
   - Cada actividad manual del AS-IS (`ACT-AS-01` a `ACT-AS-05`) debe aparecer en la tabla comparativa de `02-rediseno-to-be.md` con su transformación explícita.
   - Todo problema identificado ($P_1$, $P_2$) debe ser mitigado por al menos una iniciativa de rediseño.

2. **Correspondencia del TO-BE:**
   - Cada actividad del TO-BE (`ACT-TOBE-XX`) debe estar clasificada como *User Task* o *Service Task* y reflejada exactamente en `to-be.bpmn` y `to-be.png`.
   - Cada actividad TO-BE debe vincularse a uno o más Requisitos de Producto (`RP-XX`).

3. **Completitud de Requisitos (RP):**
   - Requisitos funcionales deben apuntar a la actividad TO-BE que los origina.
   - Requisitos derivados (`RP-DER-XX`) deben declarar su requisito origen (`RP-XX`) y justificación operativa/técnica.
   - Requisitos no funcionales deben tener correspondencia con al menos una métrica de la norma ISO/IEC 25023 en `06-atributos-calidad.md`.

4. **Cobertura de Historias de Usuario (HU):**
   - Cada HU debe declarar su actividad TO-BE asociada.
   - Los criterios de aceptación deben cubrir tanto el flujo principal como los casos de excepción (rechazo, errores de validación).

5. **Integridad de Enlaces y Anclas GitHub:**
   - Todo enlace interno entre archivos debe usar rutas relativas (`./01-proceso-as-is.md`, `./02-rediseno-to-be.md`).
   - Todo enlace a una sección o actividad específica debe usar el slug completo autogenerado por GitHub (minúsculas, sin caracteres especiales, espacios convertidos a guiones, em-dashes eliminados dejando doble guion `--`).

---

## 3. Procedimiento de Auditoría Paso a Paso

### Paso 1: Extracción de Identificadores
Ejecutar búsquedas en los archivos fuente para inventariar los identificadores declarados:
- `ACT-AS-` en `01-proceso-as-is.md` y `assets/diagramas/as-is.bpmn`.
- `ACT-TOBE-` en `02-rediseno-to-be.md` y `assets/diagramas/to-be.bpmn`.
- `RP-` y `RP-DER-` en `03-requisitos.md`.
- `HU-` en `04-historias-usuario.md`.
- `MET-` en `06-atributos-calidad.md`.

### Paso 2: Matriz de Validación Cruzada
Verificar que no existan elementos huérfanos completando mentalmente o en reporte la siguiente matriz:

| ID TO-BE | Actividad TO-BE | Origen AS-IS | Requisito RP | Historia HU | Métrica ISO |
|---|---|---|---|---|---|
| ACT-TOBE-01 | Buscar pensión y filtros | ACT-AS-01 | RP-01 | HU-01 | - |
| ACT-TOBE-02 | Cargar catálogo tiempo real | ACT-AS-01 | RP-02, RP-10 | - | MET-PERF-01 |
| ACT-TOBE-03 | Enviar solicitud reserva | ACT-AS-02 | RP-03 | HU-02 | - |
| ACT-TOBE-04 | Notificación push dueño | ACT-AS-02 | RP-04, RP-10 | - | MET-PERF-01 |
| ACT-TOBE-05 | Revisar solicitud en app | ACT-AS-03 | RP-05, RP-09 | HU-03 | MET-INT-01 |
| ACT-TOBE-06 | Rechazar solicitud | ACT-AS-04 | RP-05 | HU-03 | MET-INT-01 |
| ACT-TOBE-07 | Actualizar estado rechazo | ACT-AS-04 | - | HU-03 | - |
| ACT-TOBE-08 | Ver alternativas sugeridas | ACT-AS-04 | RP-06 | - | - |
| ACT-TOBE-09 | Aprobar solicitud reserva | ACT-AS-05 | RP-05 | HU-03 | MET-INT-01 |
| ACT-TOBE-10 | Bloquear fechas y ficha PDF | ACT-AS-05 | RP-07, RP-DER-01 | HU-04 | MET-SEC-01 |
| ACT-TOBE-11 | Coordinar llegada por chat | ACT-AS-05 | RP-08 | HU-04 | - |

### Paso 3: Verificación de Formato de Anclas
Validar que no existan anclas rotas o simplificadas que no hagan scroll en GitHub:
- `grep -n "\.md#act-" *.md`
- Comprobar que cada coincidencia contenga el slug expandido de su encabezado de destino.

---

## 4. Salida de la Auditoría

Emitir un informe conciso con el siguiente formato:
- **Total actividades auditadas:** $N$
- **Total requisitos vinculados:** $M$
- **Brechas detectadas:** (Ninguna / lista de IDs no trazados)
- **Estado de enlaces internos:** (100% válidos / lista de enlaces rotos)
