import type Database from 'better-sqlite3';
import type { Persona } from './tipos';

/**
 * HU-04 · CU-05 — Mensajes del chat de coordinación (`MensajeChat` de DOM-01).
 * Asociaciones: `contextualiza` (SolicitudReserva 1 – 0..* MensajeChat) y
 * `envia` (Persona 1 – 0..* MensajeChat).
 */

export type RolChat = 'postulante' | 'arrendador';

export interface ParticipanteChat {
  persona: Persona;
  rol: RolChat;
}

export interface MensajeChat {
  id: number;
  solicitudId: number;
  personaId: number;
  autorNombre: string;
  autorRol: RolChat | 'participante';
  contenidoTexto: string;
  fechaHoraEnvio: string;
  leido: boolean;
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

interface FilaMensaje {
  id: number;
  solicitud_id: number;
  persona_id: number;
  contenido_texto: string;
  fecha_hora_envio: string;
  leido: number;
  nombre_completo: string;
  rol: RolChat | 'participante';
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

/** Participantes del canal: el postulante y el arrendador de la pensión. */
export function obtenerParticipantes(
  db: Database.Database,
  solicitudId: number,
): ParticipanteChat[] {
  const filas = db
    .prepare(
      `SELECT p.id, p.nombre_completo, p.correo_electronico, p.telefono,
              p.correo_institucional, p.correo_institucional_verificado,
              p.universidad, p.carrera, 'postulante' AS rol
         FROM solicitud_reserva s
         JOIN persona p ON p.id = s.persona_id
        WHERE s.id = ?
       UNION ALL
       SELECT p.id, p.nombre_completo, p.correo_electronico, p.telefono,
              p.correo_institucional, p.correo_institucional_verificado,
              p.universidad, p.carrera, 'arrendador' AS rol
         FROM solicitud_reserva s
         JOIN habitacion h ON h.id = s.habitacion_id
         JOIN pension pe ON pe.id = h.pension_id
         JOIN persona p ON p.id = pe.persona_dueno_id
        WHERE s.id = ?`,
    )
    .all(solicitudId, solicitudId) as (FilaPersona & { rol: RolChat })[];

  return filas.map((fila) => ({
    persona: aPersona(fila),
    rol: fila.rol,
  }));
}

/** Registrar un mensaje del chat. */
export function crearMensaje(
  db: Database.Database,
  solicitudId: number,
  personaId: number,
  contenidoTexto: string,
  fechaHoraEnvio: string,
): MensajeChat {
  const resultado = db
    .prepare(
      `INSERT INTO mensaje_chat (
         solicitud_id, persona_id, contenido_texto, fecha_hora_envio
       ) VALUES (?, ?, ?, ?)`,
    )
    .run(solicitudId, personaId, contenidoTexto, fechaHoraEnvio);

  const id = Number(resultado.lastInsertRowid);
  const fila = db
    .prepare(
      `SELECT m.id, m.solicitud_id, m.persona_id, m.contenido_texto, m.fecha_hora_envio,
              m.leido, p.nombre_completo,
              CASE WHEN m.persona_id = s.persona_id THEN 'postulante' ELSE 'arrendador' END AS rol
         FROM mensaje_chat m
         JOIN persona p ON p.id = m.persona_id
         JOIN solicitud_reserva s ON s.id = m.solicitud_id
        WHERE m.id = ?`,
    )
    .get(id) as FilaMensaje;

  return {
    id: fila.id,
    solicitudId: fila.solicitud_id,
    personaId: fila.persona_id,
    autorNombre: fila.nombre_completo,
    autorRol: fila.rol,
    contenidoTexto: fila.contenido_texto,
    fechaHoraEnvio: fila.fecha_hora_envio,
    leido: fila.leido === 1,
  };
}

/** Mensajes posteriores a `desdeId`, para el sondeo incremental del chat. */
export function listarMensajes(
  db: Database.Database,
  solicitudId: number,
  desdeId = 0,
): MensajeChat[] {
  const filas = db
    .prepare(
      `SELECT m.id, m.solicitud_id, m.persona_id, m.contenido_texto, m.fecha_hora_envio,
              m.leido, p.nombre_completo,
              CASE WHEN m.persona_id = s.persona_id THEN 'postulante' ELSE 'arrendador' END AS rol
         FROM mensaje_chat m
         JOIN persona p ON p.id = m.persona_id
         JOIN solicitud_reserva s ON s.id = m.solicitud_id
        WHERE m.solicitud_id = ? AND m.id > ?
        ORDER BY m.id`,
    )
    .all(solicitudId, desdeId) as FilaMensaje[];

  return filas.map((fila) => ({
    id: fila.id,
    solicitudId: fila.solicitud_id,
    personaId: fila.persona_id,
    autorNombre: fila.nombre_completo,
    autorRol: fila.rol,
    contenidoTexto: fila.contenido_texto,
    fechaHoraEnvio: fila.fecha_hora_envio,
    leido: fila.leido === 1,
  }));
}
