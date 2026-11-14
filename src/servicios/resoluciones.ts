import type Database from 'better-sqlite3';
import {
  actualizarEstadoHabitacion,
  actualizarEstadoSolicitud,
  insertarFichaReserva,
  listarAlternativas,
  listarSolicitudesVencidas,
} from '../dominio/repositorio-resoluciones';
import { buscarSolicitudPorCodigo } from '../dominio/repositorio-solicitudes';
import type {
  AlternativaPension,
  FichaReserva,
  SolicitudReserva,
} from '../dominio/tipos';
import {
  calcularPlazoRespuesta,
  desdeFechaHoraSqlite,
  formatearFechaHoraSqlite,
} from './solicitudes';
import type { ServicioPush } from './push';

/**
 * HU-03 · CU-03 — Resolver solicitud (ACT-TOBE-05 a ACT-TOBE-09).
 * Aplica las guardas de `EST-01` (solicitud) y `EST-02` (habitación).
 */

const PLAZO_RESPUESTA_HORAS = 48;

export interface ResultadoResolucion {
  ok: boolean;
  solicitud?: SolicitudReserva;
  ficha?: FichaReserva;
  alternativas?: AlternativaPension[];
  errores?: Record<string, string>;
  /** Mensaje breve para mostrar al dueño en la bandeja. */
  mensaje?: string;
}

/** ¿La solicitud superó el plazo de 48 horas desde su envío? */
export function plazoVencido(fechaEnvio: string, ahora: Date): boolean {
  const limite = new Date(ahora.getTime() - PLAZO_RESPUESTA_HORAS * 60 * 60 * 1000);
  return desdeFechaHoraSqlite(fechaEnvio).getTime() < limite.getTime();
}

/**
 * Aprobar una postulación: la solicitud pasa a `Aprobada`, la habitación a
 * `Reservada` (cupo bloqueado), se emite la `FichaReserva` y se notifica al
 * postulante con el código de reserva.
 */
export async function aprobarSolicitud(
  db: Database.Database,
  push: ServicioPush,
  codigoSolicitud: string,
  ahora: Date = new Date(),
): Promise<ResultadoResolucion> {
  const detalle = buscarSolicitudPorCodigo(db, codigoSolicitud);

  if (!detalle) {
    return { ok: false, errores: { solicitud: 'La solicitud no existe.' } };
  }

  const solicitud = detalle.solicitud;

  if (solicitud.estado !== 'En revisión') {
    return {
      ok: false,
      errores: {
        solicitud: `La solicitud ya está en estado «${solicitud.estado}» y no se puede volver a resolver.`,
      },
    };
  }

  if (plazoVencido(solicitud.fechaEnvio, ahora)) {
    return {
      ok: false,
      errores: {
        solicitud:
          'La solicitud superó el plazo de 48 horas desde su envío, por lo que ya no se puede aprobar.',
      },
    };
  }

  if (detalle.habitacion.estadoDisponibilidad !== 'Disponible') {
    return {
      ok: false,
      errores: {
        habitacion:
          'La habitación ya no está disponible porque otra postulación fue aprobada primero.',
      },
    };
  }

  const fechaEmision = formatearFechaHoraSqlite(ahora);

  const registrar = db.transaction(() => {
    actualizarEstadoSolicitud(db, solicitud.id, 'Aprobada');
    actualizarEstadoHabitacion(db, detalle.habitacion.id, 'Reservada');
    return insertarFichaReserva(db, solicitud.id, solicitud.codigoSolicitud, fechaEmision);
  });

  const ficha = registrar();

  try {
    await push.enviar({
      solicitudId: solicitud.id,
      destinatario: detalle.persona.correoElectronico,
      titulo: 'Reserva aprobada',
      cuerpo:
        `Tu solicitud ${solicitud.codigoSolicitud} fue aprobada por ` +
        `${detalle.pension.nombreComercial}. Código de reserva: ${ficha.codigoReserva}.`,
    });
  } catch (error) {
    console.error('No se pudo despachar la notificación push simulada:', error);
  }

  return {
    ok: true,
    solicitud: { ...solicitud, estado: 'Aprobada', motivoRechazo: null },
    ficha,
    mensaje: `Solicitud aprobada. Cupo bloqueado y ficha ${ficha.codigoReserva} emitida.`,
  };
}

/**
 * Rechazar una postulación: la solicitud pasa a `Rechazada` con su motivo y la
 * habitación sigue `Disponible`. Se notifica al postulante con alternativas
 * del mismo sector (ACT-TOBE-08).
 */
export async function rechazarSolicitud(
  db: Database.Database,
  push: ServicioPush,
  codigoSolicitud: string,
  motivo: string,
  ahora: Date = new Date(),
): Promise<ResultadoResolucion> {
  const detalle = buscarSolicitudPorCodigo(db, codigoSolicitud);

  if (!detalle) {
    return { ok: false, errores: { solicitud: 'La solicitud no existe.' } };
  }

  const solicitud = detalle.solicitud;
  const motivoLimpio = motivo.trim();

  if (solicitud.estado !== 'En revisión') {
    return {
      ok: false,
      errores: {
        solicitud: `La solicitud ya está en estado «${solicitud.estado}» y no se puede volver a resolver.`,
      },
    };
  }

  if (plazoVencido(solicitud.fechaEnvio, ahora)) {
    return {
      ok: false,
      errores: {
        solicitud:
          'La solicitud superó el plazo de 48 horas desde su envío, por lo que ya no se puede rechazar.',
      },
    };
  }

  if (motivoLimpio === '') {
    return {
      ok: false,
      errores: { motivo: 'Indica el motivo de incompatibilidad del rechazo.' },
    };
  }

  const registrar = db.transaction(() => {
    actualizarEstadoSolicitud(db, solicitud.id, 'Rechazada', motivoLimpio);
  });
  registrar();

  const alternativas = listarAlternativas(db, detalle.habitacion.id);

  const listaAlternativas =
    alternativas.length > 0
      ? alternativas
          .map(
            (alternativa) =>
              `${alternativa.pensionNombre} (${alternativa.comuna}), habitación ` +
              `${alternativa.identificadorHabitacion} a $${alternativa.precioMensual.toLocaleString('es-CL')}`,
          )
          .join('; ')
      : 'No hay otras habitaciones disponibles en el sector por ahora.';

  try {
    await push.enviar({
      solicitudId: solicitud.id,
      destinatario: detalle.persona.correoElectronico,
      titulo: 'Solicitud rechazada',
      cuerpo:
        `Tu solicitud ${solicitud.codigoSolicitud} fue rechazada. Motivo: ${motivoLimpio}. ` +
        `Alternativas en el mismo sector: ${listaAlternativas}`,
    });
  } catch (error) {
    console.error('No se pudo despachar la notificación push simulada:', error);
  }

  return {
    ok: true,
    solicitud: { ...solicitud, estado: 'Rechazada', motivoRechazo: motivoLimpio },
    alternativas,
    mensaje: 'Solicitud rechazada. La habitación sigue disponible para otros postulantes.',
  };
}

/**
 * Expirar las postulaciones en revisión que superaron las 48 h (`after (48 h)`
 * de `EST-01`). Se evalúa al abrir la bandeja: no hay tareas programadas.
 */
export async function expirarSolicitudesVencidas(
  db: Database.Database,
  push: ServicioPush,
  ahora: Date = new Date(),
): Promise<number> {
  const limite = new Date(ahora.getTime() - PLAZO_RESPUESTA_HORAS * 60 * 60 * 1000);
  const vencidas = listarSolicitudesVencidas(db, formatearFechaHoraSqlite(limite));

  for (const solicitud of vencidas) {
    const detalle = buscarSolicitudPorCodigo(db, solicitud.codigoSolicitud);
    if (!detalle) continue;

    actualizarEstadoSolicitud(db, solicitud.id, 'Expirada');

    try {
      await push.enviar({
        solicitudId: solicitud.id,
        destinatario: detalle.persona.correoElectronico,
        titulo: 'Solicitud expirada',
        cuerpo:
          `Tu solicitud ${solicitud.codigoSolicitud} expiró porque el dueño de la pensión ` +
          'no respondió dentro de las 48 horas.',
      });
    } catch (error) {
      console.error('No se pudo despachar la notificación push simulada:', error);
    }
  }

  return vencidas.length;
}

/** Plazo de respuesta restante de una solicitud en revisión. */
export function plazoRestante(fechaEnvio: string): Date {
  return calcularPlazoRespuesta(desdeFechaHoraSqlite(fechaEnvio));
}
