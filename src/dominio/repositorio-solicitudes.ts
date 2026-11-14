import type Database from 'better-sqlite3';
import type {
  Habitacion,
  Notificacion,
  Persona,
  Pension,
  SolicitudReserva,
} from './tipos';

/**
 * HU-02 · Acceso a datos de `SolicitudReserva`, `Persona` y de las notificaciones
 * del `ServicioPush` simulado. Todas las consultas usan el modelo de dominio DOM-01.
 */

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

interface FilaSolicitud {
  id: number;
  codigo_solicitud: string;
  persona_id: number;
  habitacion_id: number;
  fecha_llegada_estimada: string;
  duracion_estadia_meses: number;
  mensaje_presentacion: string;
  fecha_envio: string;
  estado: SolicitudReserva['estado'];
  motivo_rechazo: string | null;
}

interface FilaNotificacion {
  id: number;
  solicitud_id: number;
  destinatario: string;
  titulo: string;
  cuerpo: string;
  creada_en: string;
  leida: number;
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

/** Buscar la habitación con su pensión (asociación `contiene` de DOM-01). */
export function buscarHabitacionConPension(
  db: Database.Database,
  habitacionId: number,
): { habitacion: Habitacion; pension: Pension } | null {
  const fila = db
    .prepare(
      `SELECT id, pension_id, identificador_habitacion, precio_mensual,
              tipo_cama, tiene_bano_privado, estado_disponibilidad,
              fecha_inicio_admision, fecha_fin_admision
         FROM habitacion
        WHERE id = ?`,
    )
    .get(habitacionId) as FilaHabitacion | undefined;

  if (!fila) return null;

  const pensionFila = db
    .prepare(
      `SELECT id, nombre_comercial, direccion, comuna, latitud, longitud,
              servicios_incluidos, permite_visitas, permite_mascotas, hora_toque_queda
         FROM pension
        WHERE id = ?`,
    )
    .get(fila.pension_id) as FilaPension | undefined;

  if (!pensionFila) return null;

  return { habitacion: aHabitacion(fila), pension: aPension(pensionFila) };
}

/**
 * Perfil de estudiante de demostración: la persona con correo institucional
 * verificado de menor id. No hay autenticación real en el taller.
 */
export function obtenerEstudianteDemo(db: Database.Database): Persona | null {
  const fila = db
    .prepare(
      `SELECT id, nombre_completo, correo_electronico, telefono,
              correo_institucional, correo_institucional_verificado, universidad, carrera
         FROM persona
        WHERE correo_institucional_verificado = 1
        ORDER BY id
        LIMIT 1`,
    )
    .get() as FilaPersona | undefined;

  return fila ? aPersona(fila) : null;
}

/** Código de solicitud: `SOL-<año>-<secuencial de 4 dígitos>`. */
export function generarCodigoSolicitud(db: Database.Database, anio: number): string {
  const fila = db
    .prepare(
      `SELECT COUNT(*) AS total
         FROM solicitud_reserva
        WHERE codigo_solicitud LIKE ?`,
    )
    .get(`SOL-${anio}-%`) as { total: number };

  const secuencial = String(fila.total + 1).padStart(4, '0');
  return `SOL-${anio}-${secuencial}`;
}

export interface DatosInsercionSolicitud {
  personaId: number;
  habitacionId: number;
  fechaLlegadaEstimada: string;
  duracionEstadiaMeses: number;
  mensajePresentacion: string;
  fechaEnvio: string;
  anio: number;
}

/**
 * Inserta la solicitud en estado `En revisión` (EST-01).
 * Si el código quedó duplicado devuelve `{ ok: false }` para que el llamador
 * reintente una vez con un código recalculado.
 */
export function insertarSolicitud(
  db: Database.Database,
  datos: DatosInsercionSolicitud,
): { ok: true; solicitud: SolicitudReserva } | { ok: false } {
  const codigo = generarCodigoSolicitud(db, datos.anio);

  try {
    const resultado = db
      .prepare(
        `INSERT INTO solicitud_reserva (
           codigo_solicitud, persona_id, habitacion_id, fecha_llegada_estimada,
           duracion_estadia_meses, mensaje_presentacion, fecha_envio, estado
         ) VALUES (?, ?, ?, ?, ?, ?, ?, 'En revisión')`,
      )
      .run(
        codigo,
        datos.personaId,
        datos.habitacionId,
        datos.fechaLlegadaEstimada,
        datos.duracionEstadiaMeses,
        datos.mensajePresentacion,
        datos.fechaEnvio,
      );

    const id = Number(resultado.lastInsertRowid);
    const fila = db
      .prepare(
        `SELECT id, codigo_solicitud, persona_id, habitacion_id, fecha_llegada_estimada,
                duracion_estadia_meses, mensaje_presentacion, fecha_envio, estado,
                motivo_rechazo
           FROM solicitud_reserva
          WHERE id = ?`,
      )
      .get(id) as FilaSolicitud;

    return { ok: true, solicitud: aSolicitud(fila) };
  } catch (error) {
    const codigoError = (error as { code?: string }).code;
    if (codigoError === 'SQLITE_CONSTRAINT_UNIQUE') return { ok: false };
    throw error;
  }
}

export interface DetalleSolicitud {
  solicitud: SolicitudReserva;
  persona: Persona;
  habitacion: Habitacion;
  pension: Pension;
}

/** Buscar una solicitud por su código, con su postulante, habitación y pensión. */
export function buscarSolicitudPorCodigo(
  db: Database.Database,
  codigo: string,
): DetalleSolicitud | null {
  const fila = db
    .prepare(
      `SELECT id, codigo_solicitud, persona_id, habitacion_id, fecha_llegada_estimada,
              duracion_estadia_meses, mensaje_presentacion, fecha_envio, estado,
              motivo_rechazo
         FROM solicitud_reserva
        WHERE codigo_solicitud = ?`,
    )
    .get(codigo) as FilaSolicitud | undefined;

  if (!fila) return null;

  const personaFila = db
    .prepare(
      `SELECT id, nombre_completo, correo_electronico, telefono,
              correo_institucional, correo_institucional_verificado, universidad, carrera
         FROM persona
        WHERE id = ?`,
    )
    .get(fila.persona_id) as FilaPersona | undefined;

  const habitacionPension = buscarHabitacionConPension(db, fila.habitacion_id);

  if (!personaFila || !habitacionPension) return null;

  return {
    solicitud: aSolicitud(fila),
    persona: aPersona(personaFila),
    habitacion: habitacionPension.habitacion,
    pension: habitacionPension.pension,
  };
}

/** Notificaciones despachadas por el `ServicioPush` simulado para una solicitud. */
export function listarNotificacionesPorSolicitud(
  db: Database.Database,
  solicitudId: number,
): Notificacion[] {
  const filas = db
    .prepare(
      `SELECT id, solicitud_id, destinatario, titulo, cuerpo, creada_en, leida
         FROM notificacion
        WHERE solicitud_id = ?
        ORDER BY id`,
    )
    .all(solicitudId) as FilaNotificacion[];

  return filas.map((fila) => ({
    id: fila.id,
    solicitudId: fila.solicitud_id,
    destinatario: fila.destinatario,
    titulo: fila.titulo,
    cuerpo: fila.cuerpo,
    creadaEn: fila.creada_en,
    leida: fila.leida === 1,
  }));
}
