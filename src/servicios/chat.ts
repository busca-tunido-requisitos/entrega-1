import type Database from 'better-sqlite3';
import {
  crearMensaje,
  listarMensajes,
  obtenerParticipantes,
  type MensajeChat,
  type ParticipanteChat,
} from '../dominio/repositorio-chat';
import type { DetalleSolicitud } from '../dominio/repositorio-solicitudes';
import { formatearFechaHoraSqlite } from './solicitudes';

/**
 * HU-04 · CU-05 — Coordinar llegada (ACT-TOBE-11).
 * El canal se habilita exclusivamente cuando la reserva está aprobada.
 */

export const MENSAJE_CHAT_RESTRINGIDO =
  'El chat se habilita exclusivamente una vez confirmada y aprobada la reserva.';

export interface ResultadoMensaje {
  ok: boolean;
  mensaje?: MensajeChat;
  errores?: Record<string, string>;
}

/** El chat solo existe con la reserva aprobada. */
export function chatHabilitado(detalle: DetalleSolicitud): boolean {
  return detalle.solicitud.estado === 'Aprobada';
}

/** Participantes reales del canal de una solicitud. */
export function participantesDelChat(
  db: Database.Database,
  solicitudId: number,
): ParticipanteChat[] {
  return obtenerParticipantes(db, solicitudId);
}

/** Enviar un mensaje validando que el autor sea participante del canal. */
export function crearMensajeChat(
  db: Database.Database,
  detalle: DetalleSolicitud,
  personaId: number,
  texto: string,
  ahora: Date = new Date(),
): ResultadoMensaje {
  if (!chatHabilitado(detalle)) {
    return { ok: false, errores: { chat: MENSAJE_CHAT_RESTRINGIDO } };
  }

  const participantes = obtenerParticipantes(db, detalle.solicitud.id);
  const autor = participantes.find((participante) => participante.persona.id === personaId);

  if (!autor) {
    return {
      ok: false,
      errores: { participante: 'Solo el postulante y el arrendador pueden escribir en este chat.' },
    };
  }

  const contenido = texto.trim();
  if (contenido === '') {
    return { ok: false, errores: { texto: 'Escribe un mensaje antes de enviarlo.' } };
  }

  const mensaje = crearMensaje(
    db,
    detalle.solicitud.id,
    autor.persona.id,
    contenido,
    formatearFechaHoraSqlite(ahora),
  );

  return { ok: true, mensaje };
}

/** Mensajes del canal para mostrar y para el sondeo. */
export function listarMensajesChat(
  db: Database.Database,
  solicitudId: number,
  desdeId = 0,
): MensajeChat[] {
  return listarMensajes(db, solicitudId, desdeId);
}
