### Historia de usuarios (`04-historias-usuario.md`, `07-criterios-aceptacion.md`)
- Se agrega `HU-05 — Permisos de subarrendador` (`CA1`: notificación al dueño; `CA2`: aprobación conjunta de subarrendador y dueño).
- Se agregan 3 escenarios Gherkin para doble aprobación, rechazo y bloqueo de ficha/chat sin confirmación del dueño.

### Modelo de dominio (`08-modelo-dominio.md`, `diagramas/modelo-dominio.puml`)
- Se agrega el atributo `acuerdoSubarriendo` en `SolicitudReserva`.
- Se incorpora el rol `Subarrendador` sobre `Persona` con la asociación `subarrienda` (`Persona 0..1 – 0..* Pension`).

### Casos de uso (`09-casos-de-uso.md`, `diagramas/casos-de-uso.puml`)
- Se agrega el actor `Subarrendador` (vinculado a `CU-05` y `CU-06`).
- Se agrega `CU-06 — Pre-evaluar solicitud de subarriendo` conectado a `Servicio Push (FCM)`.

### Diagrama de secuencia (`10-diagramas-secuencia.md`, `diagramas/dss-03.puml`)
- Se crea `DSS-03 — Resolución de postulación de reserva con subarrendador` con las ramas `alt` de doble aprobación y rechazos entre subarrendador, dueño y estudiante.

### Diagramas de estado (`11-diagramas-estado.md`, `diagramas/est-03.puml`)
- Se agrega `EST-03 — Ciclo de vida de SolicitudReserva con subarrendador` (`En revisión` → `Pendiente confirmación dueño` → `Confirmada por dueño` / `Rechazada` / `Expirada`).

### Trazabilidad (`12-trazabilidad.md`)
- Se actualiza la matriz enlazando `RP-11` con `HU-05`, `CU-06`, `DSS-03`, `EST-03` y las entidades afectadas.
