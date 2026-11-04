# Diagramas de estado

## EST-01 — Ciclo de vida de SolicitudReserva

- **Clase del dominio:** [`SolicitudReserva`](./08-modelo-dominio.md)
- **Diagramas de secuencia relacionados:** [`DSS-01`](./10-diagramas-secuencia.md)

![EST-01](./diagramas/est-01.png)

Archivo fuente: [`./diagramas/est-01.puml`](./diagramas/est-01.puml)

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| `[*]` (Inicio) | `enviarSolicitud()` | — | `emitirComprobanteIngreso()` | `Ingresada` |
| `Ingresada` | `abrirDetalle()` | — | `registrarLectura()` | `EnEvaluacion` |
| `Ingresada` | `cancelarSolicitud()` | `[estado == Ingresada]` | `liberarIntento()` | `Cancelada` |
| `Ingresada` | `vencerPlazo()` | `[tiempoEspera > 48h]` | `alertarExpiracion()` | `Expirada` |
| `EnEvaluacion` | `presionarAprobar()` | `[cupoDisponible == true]` | `bloquearCupoYGenerarFicha()` | `Aprobada` |
| `EnEvaluacion` | `presionarRechazar()` | — | `alertarYBuscarAlternativas()` | `Rechazada` |
| `Aprobada` | — | — | — | `[*]` (Fin) |
| `Rechazada` | — | — | — | `[*]` (Fin) |
| `Cancelada` | — | — | — | `[*]` (Fin) |
| `Expirada` | — | — | — | `[*]` (Fin) |

---

## EST-02 — Ciclo de vida de Habitacion

- **Clase del dominio:** [`Habitacion`](./08-modelo-dominio.md)
- **Diagramas de secuencia relacionados:** [`DSS-01`](./10-diagramas-secuencia.md)

![EST-02](./diagramas/est-02.png)

Archivo fuente: [`./diagramas/est-02.puml`](./diagramas/est-02.puml)

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| `[*]` (Inicio) | `publicarHabitacion()` | — | `habilitarEnCatalogo()` | `Disponible` |
| `Disponible` | `confirmarAprobacionReserva()` | `[cupoLibre == true]` | `retirarDeCatalogoPublico()` | `Reservada` |
| `Disponible` | `suspenderPorRefaccion()` | — | `ocultarEnBusqueda()` | `EnMantenimiento` |
| `EnMantenimiento` | `finalizarReparacion()` | — | `reactivarEnCatalogo()` | `Disponible` |
| `Reservada` | `registrarCheckIn()` | `[qrValido == true]` | `iniciarContratoArriendo()` | `Ocupada` |
| `Reservada` | `rescindirReserva()` | — | `restablecerEnCatalogo()` | `Disponible` |
| `Ocupada` | `registrarCheckOut()` | — | `habilitarNuevaTemporada()` | `Disponible` |
| `Disponible` | `darDeBajaInmueble()` | — | `cerrarOferta()` | `[*]` (Fin) |
