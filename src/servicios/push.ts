import type Database from 'better-sqlite3';
import type { Pension } from '../dominio/tipos';

/**
 * HU-02 · ACT-TOBE-04 — Servicio Push (Firebase Cloud Messaging) simulado.
 * No se envía ningún push real: la notificación queda registrada en SQLite
 * para que la bandeja del dueño (HU-03) pueda consumirla.
 */

export interface MensajePush {
  solicitudId: number;
  destinatario: string;
  titulo: string;
  cuerpo: string;
}

export interface ServicioPush {
  enviar(mensaje: MensajePush): Promise<void>;
}

/** Genera el correo del dueño a partir del nombre de la pensión (supuesto del taller). */
export function generarDestinatario(pension: Pension): string {
  const base = pension.nombreComercial
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `dueno@${base || 'pension'}.cl`;
}

/** Implementación simulada: guarda la notificación en la tabla `notificacion`. */
export class ServicioPushSqlite implements ServicioPush {
  constructor(private readonly db: Database.Database) {}

  async enviar(mensaje: MensajePush): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO notificacion (solicitud_id, destinatario, titulo, cuerpo)
         VALUES (?, ?, ?, ?)`,
      )
      .run(mensaje.solicitudId, mensaje.destinatario, mensaje.titulo, mensaje.cuerpo);
  }
}
