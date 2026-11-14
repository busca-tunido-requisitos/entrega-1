# Estado del proyecto — generación de la aplicación

## Proyecto
- Nombre: BuscaTuNido
- Repositorio de documentación: esta carpeta (`entrega-1`)
- Última auditoría: 2026-11-11 — resultado: completo, con supuestos acordados

## Mapa de artefactos (rutas detectadas)
| Artefacto | Ruta(s) | Estado |
|-----------|---------|--------|
| BPMN AS-IS | `01-proceso-as-is.md`, `assets/diagramas/as-is.bpmn` / `.png` | completo |
| BPMN TO-BE | `02-rediseno-to-be.md`, `assets/diagramas/to-be.bpmn` / `.png` | completo |
| Historias de usuario | `04-historias-usuario.md` (HU-01 a HU-04) | completo |
| Criterios Gherkin | `07-criterios-aceptacion.md` (2 escenarios por historia) | completo |
| Modelo de dominio | `diagramas/modelo-dominio.puml` + tabla de `08-modelo-dominio.md` | completo (PNG es vista simplificada; la tabla es el detalle completo) |
| Casos de uso | `09-casos-de-uso.md`, `diagramas/casos-de-uso.puml` (CU-01 a CU-05) | completo |
| Diagramas de estado | `11-diagramas-estado.md`, `diagramas/est-01.puml`, `diagramas/est-02.puml` | completo |
| Diagramas de secuencia | `10-diagramas-secuencia.md`, `diagramas/dss-01.puml`, `diagramas/dss-02.puml` | completo |
| Requisitos y atributos de calidad | `03-requisitos.md`, `06-atributos-calidad.md` | completo |
| Trazabilidad | `12-trazabilidad.md` | completa |

**Fuente de verdad de diagramas:** los `.puml` de `diagramas/` y la tabla de `08-modelo-dominio.md`. Los PNG son vistas; `assets/diagramas/casos_de_uso_1.png` es una versión antigua y no se usa.

## Supuestos acordados (confirmados por el estudiante el 2026-11-11)
1. **HU-01 — mapa:** mapa interactivo con **Leaflet + OpenStreetMap**; requiere internet al usar la app.
2. **HU-01 — sedes:** catálogo precargado como datos de ejemplo con universidades/sedes de la **Región de Valparaíso** (nombre, comuna, coordenadas). El estudiante elige su sede de una lista; no escribe coordenadas. La distancia en metros se calcula desde la sede elegida hasta `Pension.coordenadasGeograficas`.
3. **HU-01 — normas:** `normasConvivencia` se estructura en `permiteVisitas` (sí/no), `permiteMascotas` (sí/no) y `horaToqueQueda` (hora; vacío = sin toque de queda).
4. **Estados de la habitación:** al aprobar queda **`Reservada`**; pasa a **`Ocupada`** solo al registrar la llegada con QR válido (como `EST-02`). Se corregirá la redacción de HU-03 CA2 y RP-07, que dicen «ocupada».
5. **HU-02 — fechas válidas:** `Habitacion` agrega `fechaInicioAdmision` y `fechaFinAdmision` para validar la fecha de ingreso y mostrar las fechas admitidas.
6. **HU-03 — motivo de rechazo:** `SolicitudReserva` agrega `motivoRechazo`.
7. **HU-03 / HU-04 — ficha:** `FichaReserva` se genera al aprobar la solicitud y se reutiliza en cada descarga.
8. **HU-01 / HU-02 — sin entidad nueva:** `Universidad`/`Campus` no se agrega como clase del dominio; es un catálogo de datos de ejemplo con coordenadas.
9. **HU-02 — perfil verificado:** se usa un perfil de estudiante demo con `correoInstitucionalVerificado`; no hay registro ni autenticación real.
10. **HU-02 — fechas de admisión:** `Habitacion` tiene `fechaInicioAdmision` y `fechaFinAdmision`, sembradas para todas las habitaciones de ejemplo.

> Los supuestos 3 y 6 siguen pendientes de reflejarse en el modelo de dominio; el supuesto 5 se reflejó el 2026-11-12 en `08-modelo-dominio.md` y `modelo-dominio.puml` (con su PNG regenerado).

## Stack (se define una sola vez)
- Lenguaje y framework: TypeScript + Express + EJS
- Base de datos: SQLite — archivo `data/app.db`; migraciones en `src/db/migrations`
- Pruebas: Vitest + supertest (una prueba por escenario Gherkin)
- Cómo instalar: `npm install`
- Cómo sembrar datos de ejemplo: `npm run db:seed`
- Cómo ejecutar: `npm run dev` — URL: http://localhost:3000
- Cómo probar: `npm test`
- Nota: RY-03 pide TypeScript + NestJS + Next.js 15; la app del taller usa Express + EJS por simplicidad (diferencia consciente, confirmada el 2026-11-11).

## Historias
| Historia | Estado | Cambio de OpenSpec | Fecha | Observaciones |
|----------|--------|--------------------|-------|----------------|
| HU-01 | hecha — validada sin observaciones | `hu-01-catalogo-filtros` (archivado) | 2026-11-12 | 19/19 tareas y 2/2 pruebas; cambio en `openspec/changes/archive/2026-11-12-hu-01-catalogo-filtros/` |
| HU-02 | hecha — validada sin observaciones y archivada | `hu-02-solicitud-reserva` (archivado en `openspec/changes/archive/2026-11-14-hu-02-solicitud-reserva`) | 2026-11-14 | 27/27 tareas y 11/11 pruebas; especificación vigente en `openspec/specs/solicitud-reserva/spec.md`; formulario de postulación con código `SOL-<año>-<secuencial>` y push simulado en `notificacion` |
| HU-03 | pendiente | — | — | Depende de HU-02 (solicitudes) |
| HU-04 | pendiente | — | — | Depende de HU-03 (reserva aprobada) |

## Validaciones
| Historia | Informe | Estado | Fecha |
|----------|---------|--------|-------|
| HU-01 | `.cin324/validaciones/VAL-HU-01-1.md` | sin observaciones | 2026-11-11 |
| HU-02 | `.cin324/validaciones/VAL-HU-02-1.md` | sin observaciones | 2026-11-14 |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| — | — | — | — |
