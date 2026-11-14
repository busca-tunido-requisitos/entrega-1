import type Database from 'better-sqlite3';
import type {
  AlternativaPension,
  EstadoSolicitud,
  FichaReserva,
  Habitacion,
  Persona,
  Pension,
  SolicitudReserva,
} from './tipos';
import type { DetalleSolicitud } from './repositorio-solicitudes';

/**
 * HU-03 · Acceso a datos de la resolución de postulaciones: bandeja del dueño,
 * ficha de reserva, cambios de estado y alternativas del mismo sector.
 */

interface FilaSolicitud {
  id: number;
  codigo_solicitud: string;
  persona_id: number;
  habitacion_id: number;
  fecha_llegada_estimada: string;
  duracion_estadia_meses: number;
  mensaje_presentacion: string;
  fecha_envio: string;
  estado: EstadoSolicitud;
  motivo_rechazo: string | null;
}

interface FilaPersona {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono: string | null;
  correo_institucional: string;
  correo_institucional_verificado: number;
  universidad: string | null;
  carrera: string | null;
}

interface FilaHabitacion {
  id: number;
  pension_id: number;
  identificador_habitacion: string;
  precio_mensual: number;
  tipo_cama: string;
  tiene_bano_privado: number;
  estado_disponibilidad: Habitacion['estadoDisponibilidad'];
  fecha_inicio_admision: string;
  fecha_fin_admision: string;
}

interface FilaPension {
  id: number;
  nombre_comercial: string;
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  servicios_incluidos: string;
  permite_visitas: number;
  permite_mascotas: number;
  hora_toque_queda: string | null;
}

interface FilaFicha {
  id: number;
  solicitud_id: number;
  codigo_reserva: string;
  fecha_emision: string;
  codigo_qr_firmado: string;
  estado_ficha: FichaReserva['estadoFicha'];
}

function aPersona(fila: FilaPersona): Persona {
  return {
    id: fila.id,
    nombreCompleto: fila.nombre_completo,
    correoElectronico: fila.correo_electronico,
    telefono: fila.telefono,
    correoInstitucional: fila.correo_institucional,
    correoInstitucionalVerificado: fila.correo_institucional_verificado === 1,
    universidad: fila.universidad,
    carrera: fila.carrera,
  };
}

function aHabitacion(fila: FilaHabitacion): Habitacion {
  return {
    id: fila.id,
    pensionId: fila.pension_id,
    identificadorHabitacion: fila.identificador_habitacion,
    precioMensual: fila.precio_mensual,
    tipoCama: fila.tipo_cama,
    tieneBanoPrivado: fila.tiene_bano_privado === 1,
    estadoDisponibilidad: fila.estado_disponibilidad,
    fechaInicioAdmision: fila.fecha_inicio_admision,
    fechaFinAdmision: fila.fecha_fin_admision,
  };
}

function aPension(fila: FilaPension): Pension {
  return {
    id: fila.id,
    nombreComercial: fila.nombre_comercial,
    direccion: fila.direccion,
    comuna: fila.comuna,
    latitud: fila.latitud,
    longitud: fila.longitud,
    serviciosIncluidos: fila.servicios_incluidos,
    permiteVisitas: fila.permite_visitas === 1,
    permiteMascotas: fila.permite_mascotas === 1,
    horaToqueQueda: fila.hora_toque_queda,
    habitaciones: [],
  };
}

function aSolicitud(fila: FilaSolicitud): SolicitudReserva {
  return {
    id: fila.id,
    codigoSolicitud: fila.codigo_solicitud,
    personaId: fila.persona_id,
    habitacionId: fila.habitacion_id,
    fechaLlegadaEstimada: fila.fecha_llegada_estimada,
    duracionEstadiaMeses: fila.duracion_estadia_meses,
    mensajePresentacion: fila.mensaje_presentacion,
    fechaEnvio: fila.fecha_envio,
    estado: fila.estado,
    motivoRechazo: fila.motivo_rechazo,
  };
}

/** Dueño de demostración: la persona que administra las pensiones de ejemplo. */
export function obtenerDuenoDemo(db: Database.Database): Persona | null {
  const fila = db
    .prepare(
      `SELECT p.id, p.nombre_completo, p.correo_electronico, p.telefono,
              p.correo_institucional, p.correo_institucional_verificado,
              p.universidad, p.carrera
         FROM persona p
        WHERE EXISTS (
          SELECT 1 FROM pension pe WHERE pe.persona_dueno_id = p.id
        )
        ORDER BY p.id
        LIMIT 1`,
    )
    .get() as FilaPersona | undefined;

  return fila ? aPersona(fila) : null;
}

const CONSULTA_DETALLE = `
  SELECT s.id AS s_id, s.codigo_solicitud, s.persona_id, s.habitacion_id,
         s.fecha_llegada_estimada, s.duracion_estadia_meses, s.mensaje_presentacion,
         s.fecha_envio, s.estado, s.motivo_rechazo,
         p.id AS p_id, p.nombre_completo, p.correo_electronico, p.telefono,
         p.correo_institucional, p.correo_institucional_verificado,
         p.universidad, p.carrera,
         h.id AS h_id, h.pension_id, h.identificador_habitacion, h.precio_mensual,
         h.tipo_cama, h.tiene_bano_privado, h.estado_disponibilidad,
         h.fecha_inicio_admision, h.fecha_fin_admision,
         pe.id AS pe_id, pe.nombre_comercial, pe.direccion, pe.comuna,
         pe.latitud, pe.longitud, pe.servicios_incluidos, pe.permite_visitas,
         pe.permite_mascotas, pe.hora_toque_queda
    FROM solicitud_reserva s
    JOIN persona p    ON p.id = s.persona_id
    JOIN habitacion h ON h.id = s.habitacion_id
    JOIN pension pe   ON pe.id = h.pension_id
`;

interface FilaDetalle extends FilaSolicitud {
  p_id: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono: string | null;
  correo_institucional: string;
  correo_institucional_verificado: number;
  universidad: string | null;
  carrera: string | null;
  h_id: number;
  pension_id: number;
  identificador_habitacion: string;
  precio_mensual: number;
  tipo_cama: string;
  tiene_bano_privado: number;
  estado_disponibilidad: Habitacion['estadoDisponibilidad'];
  fecha_inicio_admision: string;
  fecha_fin_admision: string;
  pe_id: number;
  nombre_comercial: string;
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  servicios_incluidos: string;
  permite_visitas: number;
  permite_mascotas: number;
  hora_toque_queda: string | null;
}

function aDetalle(fila: FilaDetalle): DetalleSolicitud {
  return {
    solicitud: aSolicitud(fila),
    persona: aPersona({
      id: fila.p_id,
      nombre_completo: fila.nombre_completo,
      correo_electronico: fila.correo_electronico,
      telefono: fila.telefono,
      correo_institucional: fila.correo_institucional,
      correo_institucional_verificado: fila.correo_institucional_verificado,
      universidad: fila.universidad,
      carrera: fila.carrera,
    }),
    habitacion: aHabitacion({
      id: fila.h_id,
      pension_id: fila.pension_id,
      identificador_habitacion: fila.identificador_habitacion,
      precio_mensual: fila.precio_mensual,
      tipo_cama: fila.tipo_cama,
      tiene_bano_privado: fila.tiene_bano_privado,
      estado_disponibilidad: fila.estado_disponibilidad,
      fecha_inicio_admision: fila.fecha_inicio_admision,
      fecha_fin_admision: fila.fecha_fin_admision,
    }),
    pension: aPension({
      id: fila.pe_id,
      nombre_comercial: fila.nombre_comercial,
      direccion: fila.direccion,
      comuna: fila.comuna,
      latitud: fila.latitud,
      longitud: fila.longitud,
      servicios_incluidos: fila.servicios_incluidos,
      permite_visitas: fila.permite_visitas,
      permite_mascotas: fila.permite_mascotas,
      hora_toque_queda: fila.hora_toque_queda,
    }),
  };
}

/** Postulaciones del dueño, separadas entre pendientes y ya resueltas. */
export function listarSolicitudesDelDueno(
  db: Database.Database,
  duenoId: number,
): { pendientes: DetalleSolicitud[]; resueltas: DetalleSolicitud[] } {
  const filas = db
    .prepare(
      `${CONSULTA_DETALLE} WHERE pe.persona_dueno_id = ? ORDER BY s.fecha_envio DESC`,
    )
    .all(duenoId) as FilaDetalle[];

  const pendientes: DetalleSolicitud[] = [];
  const resueltas: DetalleSolicitud[] = [];

  for (const fila of filas) {
    const detalle = aDetalle(fila);
    if (detalle.solicitud.estado === 'En revisión') {
      pendientes.push(detalle);
    } else {
      resueltas.push(detalle);
    }
  }

  return { pendientes, resueltas };
}

/** Buscar una postulación del dueño por su código. */
export function buscarSolicitudDelDueno(
  db: Database.Database,
  codigo: string,
  duenoId: number,
): DetalleSolicitud | null {
  const fila = db
    .prepare(`${CONSULTA_DETALLE} WHERE s.codigo_solicitud = ? AND pe.persona_dueno_id = ?`)
    .get(codigo, duenoId) as FilaDetalle | undefined;

  return fila ? aDetalle(fila) : null;
}

/** Crear la ficha de reserva de una solicitud aprobada (`genera`). */
export function insertarFichaReserva(
  db: Database.Database,
  solicitudId: number,
  codigoSolicitud: string,
  fechaEmision: string,
): FichaReserva {
  const codigoReserva = `RES-${codigoSolicitud}`;
  const compacto = fechaEmision.replace(/[^0-9]/g, '');

  const resultado = db
    .prepare(
      `INSERT INTO ficha_reserva (
         solicitud_id, codigo_reserva, fecha_emision, codigo_qr_firmado, estado_ficha
       ) VALUES (?, ?, ?, ?, 'Emitida')`,
    )
    .run(solicitudId, codigoReserva, fechaEmision, `QR-${codigoReserva}-${compacto}`);

  const id = Number(resultado.lastInsertRowid);
  const fila = db
    .prepare(
      `SELECT id, solicitud_id, codigo_reserva, fecha_emision, codigo_qr_firmado, estado_ficha
         FROM ficha_reserva
        WHERE id = ?`,
    )
    .get(id) as FilaFicha;

  return {
    id: fila.id,
    solicitudId: fila.solicitud_id,
    codigoReserva: fila.codigo_reserva,
    fechaEmision: fila.fecha_emision,
    codigoQRFirmado: fila.codigo_qr_firmado,
    estadoFicha: fila.estado_ficha,
  };
}

/** Cambiar el estado de la solicitud (y registrar el motivo si se rechaza). */
export function actualizarEstadoSolicitud(
  db: Database.Database,
  solicitudId: number,
  estado: EstadoSolicitud,
  motivoRechazo: string | null = null,
): void {
  db.prepare(
    `UPDATE solicitud_reserva
        SET estado = ?,
            motivo_rechazo = CASE WHEN ? IS NULL THEN motivo_rechazo ELSE ? END
      WHERE id = ?`,
  ).run(estado, motivoRechazo, motivoRechazo, solicitudId);
}

/** Cambiar el estado de la habitación (`Disponible` → `Reservada`). */
export function actualizarEstadoHabitacion(
  db: Database.Database,
  habitacionId: number,
  estado: Habitacion['estadoDisponibilidad'],
): void {
  db.prepare('UPDATE habitacion SET estado_disponibilidad = ? WHERE id = ?').run(
    estado,
    habitacionId,
  );
}

/**
 * Alternativas del mismo sector (misma comuna) con precio no mayor al de la
 * habitación rechazada, ordenadas por precio ascendente (ACT-TOBE-08).
 */
export function listarAlternativas(
  db: Database.Database,
  habitacionRechazadaId: number,
  limite = 5,
): AlternativaPension[] {
  const filas = db
    .prepare(
      `SELECT pe.id AS pension_id, pe.nombre_comercial, pe.comuna,
              h.id AS habitacion_id, h.identificador_habitacion, h.precio_mensual
         FROM habitacion h
         JOIN pension pe ON pe.id = h.pension_id
        WHERE h.estado_disponibilidad = 'Disponible'
          AND h.id <> ?
          AND pe.comuna = (SELECT pe2.comuna
                             FROM habitacion h2
                             JOIN pension pe2 ON pe2.id = h2.pension_id
                            WHERE h2.id = ?)
          AND h.precio_mensual <= (SELECT precio_mensual FROM habitacion WHERE id = ?)
        ORDER BY h.precio_mensual ASC
        LIMIT ?`,
    )
    .all(habitacionRechazadaId, habitacionRechazadaId, habitacionRechazadaId, limite) as {
    pension_id: number;
    nombre_comercial: string;
    comuna: string;
    habitacion_id: number;
    identificador_habitacion: string;
    precio_mensual: number;
  }[];

  return filas.map((fila) => ({
    pensionId: fila.pension_id,
    pensionNombre: fila.nombre_comercial,
    comuna: fila.comuna,
    habitacionId: fila.habitacion_id,
    identificadorHabitacion: fila.identificador_habitacion,
    precioMensual: fila.precio_mensual,
  }));
}

/** Solicitudes en revisión cuyo plazo de 48 h ya venció. */
export function listarSolicitudesVencidas(
  db: Database.Database,
  limiteInferior: string,
): SolicitudReserva[] {
  const filas = db
    .prepare(
      `SELECT id, codigo_solicitud, persona_id, habitacion_id, fecha_llegada_estimada,
              duracion_estadia_meses, mensaje_presentacion, fecha_envio, estado,
              motivo_rechazo
         FROM solicitud_reserva
        WHERE estado = 'En revisión'
          AND fecha_envio < ?
        ORDER BY fecha_envio`,
    )
    .all(limiteInferior) as FilaSolicitud[];

  return filas.map(aSolicitud);
}

/** Ficha de reserva de una solicitud (`genera`, 1 – 0..1). */
export function obtenerFichaDeSolicitud(
  db: Database.Database,
  solicitudId: number,
): FichaReserva | null {
  const fila = db
    .prepare(
      `SELECT id, solicitud_id, codigo_reserva, fecha_emision, codigo_qr_firmado, estado_ficha
         FROM ficha_reserva
        WHERE solicitud_id = ?`,
    )
    .get(solicitudId) as FilaFicha | undefined;

  if (!fila) return null;

  return {
    id: fila.id,
    solicitudId: fila.solicitud_id,
    codigoReserva: fila.codigo_reserva,
    fechaEmision: fila.fecha_emision,
    codigoQRFirmado: fila.codigo_qr_firmado,
    estadoFicha: fila.estado_ficha,
  };
}

/** Guardar la firma real del comprobante en la ficha. */
export function actualizarFirmaFicha(
  db: Database.Database,
  solicitudId: number,
  contenido: string,
): void {
  db.prepare('UPDATE ficha_reserva SET codigo_qr_firmado = ? WHERE solicitud_id = ?').run(
    contenido,
    solicitudId,
  );
}

/** Buscar una ficha por su código de reserva. */
export function buscarFichaPorCodigo(
  db: Database.Database,
  codigoReserva: string,
): FichaReserva | null {
  const fila = db
    .prepare(
      `SELECT id, solicitud_id, codigo_reserva, fecha_emision, codigo_qr_firmado, estado_ficha
         FROM ficha_reserva
        WHERE codigo_reserva = ?`,
    )
    .get(codigoReserva) as FilaFicha | undefined;

  if (!fila) return null;

  return {
    id: fila.id,
    solicitudId: fila.solicitud_id,
    codigoReserva: fila.codigo_reserva,
    fechaEmision: fila.fecha_emision,
    codigoQRFirmado: fila.codigo_qr_firmado,
    estadoFicha: fila.estado_ficha,
  };
}
