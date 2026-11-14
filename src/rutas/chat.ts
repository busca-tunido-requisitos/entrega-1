import { Router } from 'express';
import type Database from 'better-sqlite3';
import { formatearFechaHora } from '../dominio/formato';
import { buscarSolicitudPorCodigo } from '../dominio/repositorio-solicitudes';
import {
  chatHabilitado,
  crearMensajeChat,
  listarMensajesChat,
  MENSAJE_CHAT_RESTRINGIDO,
  participantesDelChat,
} from '../servicios/chat';

/** HU-04 · CU-05 — Coordinar llegada por chat (ACT-TOBE-11). */
export function rutasChat(db: Database.Database): Router {
  const router = Router();

  router.get('/solicitudes/:codigo/chat', (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudPorCodigo(db, codigo);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe ninguna solicitud con el código ${codigo}.`,
      });
      return;
    }

    if (!chatHabilitado(detalle)) {
      res.status(403).render('solicitud-aviso', {
        titulo: 'Chat no habilitado',
        mensaje: MENSAJE_CHAT_RESTRINGIDO,
      });
      return;
    }

    const participantes = participantesDelChat(db, detalle.solicitud.id);
    const mensajes = listarMensajesChat(db, detalle.solicitud.id);

    res.render('chat', {
      detalle,
      participantes,
      mensajes,
      error: null,
      formatearFechaHora,
    });
  });

  router.post('/solicitudes/:codigo/chat', (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const cuerpo = (req.body ?? {}) as Record<string, unknown>;
    const detalle = buscarSolicitudPorCodigo(db, codigo);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe ninguna solicitud con el código ${codigo}.`,
      });
      return;
    }

    if (!chatHabilitado(detalle)) {
      res.status(403).render('solicitud-aviso', {
        titulo: 'Chat no habilitado',
        mensaje: MENSAJE_CHAT_RESTRINGIDO,
      });
      return;
    }

    const personaId = Number(cuerpo.personaId);
    const texto = typeof cuerpo.texto === 'string' ? cuerpo.texto : '';
    const resultado = crearMensajeChat(db, detalle, personaId, texto);

    if (!resultado.ok) {
      const participantes = participantesDelChat(db, detalle.solicitud.id);
      const mensajes = listarMensajesChat(db, detalle.solicitud.id);
      const error = Object.values(resultado.errores ?? {})[0] ?? 'No se pudo enviar el mensaje.';

      res.status(422).render('chat', {
        detalle,
        participantes,
        mensajes,
        error,
        formatearFechaHora,
      });
      return;
    }

    res.redirect(303, `/solicitudes/${encodeURIComponent(codigo)}/chat`);
  });

  router.get('/solicitudes/:codigo/chat/mensajes', (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudPorCodigo(db, codigo);

    if (!detalle || !chatHabilitado(detalle)) {
      res.status(403).json({ mensajes: [], error: MENSAJE_CHAT_RESTRINGIDO });
      return;
    }

    const desde = Number(req.query.desde ?? 0);
    const mensajes = listarMensajesChat(db, detalle.solicitud.id, Number.isFinite(desde) ? desde : 0);

    res.json({ mensajes });
  });

  return router;
}
