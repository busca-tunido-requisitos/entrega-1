import type Database from 'better-sqlite3';
import { formatearFecha } from '../dominio/formato';
import {
  buscarHabitacionConPension,
  insertarSolicitud,
  obtenerEstudianteDemo,
} from '../dominio/repositorio-solicitudes';
import type { Habitacion, Persona, Pension, SolicitudReserva } from '../dominio/tipos';
import { generarDestinatario, type ServicioPush } from './push';

/**
 * HU-02 · CU-02 — Solicitar reserva (ACT-TOBE-03 + ACT-TOBE-04).
 * Validación pura de las guardas de EST-01 y envío de la postulación formal.
 */

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const DURACION_MINIMA_MESES = 1;
const DURACION_MAXIMA_MESES = 12;
const PLAZO_RESPUESTA_HORAS = 48;

export interface DatosSolicitud {
  habitacionId: number;
  fechaLlegada: string;
  duracionMeses: number;
  mensaje: string;
}

export interface ResultadoValidacion {
  valido: boolean;
  errores: Record<string, string>;
}

export interface ResultadoEnvio {
  ok: boolean;
  solicitud?: SolicitudReserva;
  errores?: Record<string, string>;
  habitacion?: Habitacion | null;
  pension?: Pension | null;
  persona?: Persona | null;
  /** Plazo máximo de respuesta: `fechaEnvio` + 48 h. */
  plazo?: Date;
}

function texto(valor: unknown): string {
  if (Array.isArray(valor)) return String(valor[0] ?? '');
  if (valor === undefined || valor === null) return '';
  return String(valor);
}

/** Convierte y recorta lo recibido del formulario. */
export function normalizarDatosSolicitud(cuerpo: Record<string, unknown>): DatosSolicitud {
  const habitacionId = Number(texto(cuerpo.habitacionId).trim());
  const duracion = Number(texto(cuerpo.duracionMeses).trim());

  return {
    habitacionId: Number.isFinite(habitacionId) ? habitacionId : 0,
    fechaLlegada: texto(cuerpo.fechaLlegada).trim(),
    duracionMeses: Number.isFinite(duracion) ? duracion : Number.NaN,
    mensaje: texto(cuerpo.mensajePresentacion).trim(),
  };
}

/**
 * Guardas de EST-01: campos obligatorios, duración entera 1–12, fecha dentro
 * del período de admisión, perfil con correo verificado y habitación `Disponible`.
 */
export function validarSolicitud(params: {
  datos: DatosSolicitud;
  habitacion: Habitacion | null;
  persona: Persona | null;
}): ResultadoValidacion {
  const { datos, habitacion, persona } = params;
  const errores: Record<string, string> = {};

  if (datos.fechaLlegada === '') {
    errores.fechaLlegada = 'Indica la fecha de ingreso estimada.';
  } else if (!FORMATO_FECHA.test(datos.fechaLlegada)) {
    errores.fechaLlegada = 'La fecha de ingreso debe tener el formato dd/mm/aaaa.';
  } else if (
    habitacion &&
    (datos.fechaLlegada < habitacion.fechaInicioAdmision ||
      datos.fechaLlegada > habitacion.fechaFinAdmision)
  ) {
    errores.fechaLlegada =
      `La fecha de ingreso debe estar entre el ${formatearFecha(habitacion.fechaInicioAdmision)} ` +
      `y el ${formatearFecha(habitacion.fechaFinAdmision)}, que son las fechas válidas de ` +
      'inicio de estadía definidas por la pensión.';
  }

  if (
    !Number.isInteger(datos.duracionMeses) ||
    datos.duracionMeses < DURACION_MINIMA_MESES ||
    datos.duracionMeses > DURACION_MAXIMA_MESES
  ) {
    errores.duracionMeses =
      `La duración estimada debe ser un número entero de meses entre ${DURACION_MINIMA_MESES} y ${DURACION_MAXIMA_MESES}.`;
  }

  if (datos.mensaje === '') {
    errores.mensajePresentacion = 'Escribe un mensaje de presentación para el dueño.';
  }

  if (!persona || !persona.correoInstitucionalVerificado) {
    errores.perfil =
      'Tu correo institucional no está verificado. Verifica tu perfil antes de enviar la solicitud.';
  }

  if (!habitacion) {
    errores.habitacion = 'La habitación solicitada no existe.';
  } else if (habitacion.estadoDisponibilidad !== 'Disponible') {
    errores.habitacion =
      'La habitación ya no está disponible. Vuelve al catálogo para elegir otra.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

/** Plazo máximo de respuesta: 48 h desde el envío (EST-01). */
export function calcularPlazoRespuesta(fechaEnvio: Date): Date {
  return new Date(fechaEnvio.getTime() + PLAZO_RESPUESTA_HORAS * 60 * 60 * 1000);
}

/** 'YYYY-MM-DD HH:MM:SS' en hora local, formato usado por `fecha_envio`. */
export function formatearFechaHoraSqlite(fecha: Date): string {
  const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
  return (
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())} ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`
  );
}

/** Reconstruye una `Date` local desde 'YYYY-MM-DD HH:MM:SS'. */
export function desdeFechaHoraSqlite(textoFecha: string): Date {
  const partes = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(textoFecha);
  if (!partes) return new Date(textoFecha);
  return new Date(
    Number(partes[1]),
    Number(partes[2]) - 1,
    Number(partes[3]),
    Number(partes[4]),
    Number(partes[5]),
    Number(partes[6] ?? 0),
  );
}

/** Fecha local 'YYYY-MM-DD' (para el valor inicial del formulario). */
export function fechaIsoLocal(fecha: Date = new Date()): string {
  return formatearFechaHoraSqlite(fecha).slice(0, 10);
}

/**
 * Registra la postulación en estado `En revisión` y despacha la notificación
 * push simulada al dueño. Si el push falla, la solicitud queda registrada:
 * la notificación es simulada y el requisito es la postulación.
 */
export async function enviarSolicitud(
  db: Database.Database,
  push: ServicioPush,
  datos: DatosSolicitud,
  ahora: Date = new Date(),
): Promise<ResultadoEnvio> {
  const encontrado = buscarHabitacionConPension(db, datos.habitacionId);
  const habitacion = encontrado?.habitacion ?? null;
  const pension = encontrado?.pension ?? null;
  const persona = obtenerEstudianteDemo(db);

  const validacion = validarSolicitud({ datos, habitacion, persona });
  if (!validacion.valido) {
    return { ok: false, errores: validacion.errores, habitacion, pension, persona };
  }

  const fechaEnvio = formatearFechaHoraSqlite(ahora);
  const anio = ahora.getFullYear();

  const registrar = db.transaction(() => {
    const primerIntento = insertarSolicitud(db, {
      personaId: persona!.id,
      habitacionId: habitacion!.id,
      fechaLlegadaEstimada: datos.fechaLlegada,
      duracionEstadiaMeses: datos.duracionMeses,
      mensajePresentacion: datos.mensaje,
      fechaEnvio,
      anio,
    });

    if (primerIntento.ok) return primerIntento.solicitud;

    // Código duplicado: se reintenta una vez con el código recalculado.
    const segundoIntento = insertarSolicitud(db, {
      personaId: persona!.id,
      habitacionId: habitacion!.id,
      fechaLlegadaEstimada: datos.fechaLlegada,
      duracionEstadiaMeses: datos.duracionMeses,
      mensajePresentacion: datos.mensaje,
      fechaEnvio,
      anio,
    });

    if (!segundoIntento.ok) {
      throw new Error('No se pudo generar un código de solicitud único.');
    }
    return segundoIntento.solicitud;
  });

  const solicitud = registrar();

  try {
    await push.enviar({
      solicitudId: solicitud.id,
      destinatario: generarDestinatario(pension!),
      titulo: 'Nueva solicitud de reserva',
      cuerpo:
        `${persona!.nombreCompleto} postula a la habitación ${habitacion!.identificadorHabitacion} ` +
        `de ${pension!.nombreComercial}. Fecha de ingreso: ${formatearFecha(datos.fechaLlegada)}.`,
    });
  } catch (error) {
    console.error('No se pudo despachar la notificación push simulada:', error);
  }

  return {
    ok: true,
    solicitud,
    habitacion,
    pension,
    persona,
    plazo: calcularPlazoRespuesta(ahora),
  };
}
