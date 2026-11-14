import { Router } from 'express';
import type Database from 'better-sqlite3';
import { formatearFecha, formatearFechaHora, formatearPrecio } from '../dominio/formato';
import {
  buscarSolicitudDelDueno,
  listarSolicitudesDelDueno,
  obtenerDuenoDemo,
} from '../dominio/repositorio-resoluciones';
import {
  aprobarSolicitud,
  expirarSolicitudesVencidas,
  plazoRestante,
  rechazarSolicitud,
} from '../servicios/resoluciones';
import type { ServicioPush } from '../servicios/push';

/** HU-03 · CU-03 — Resolver solicitud (ACT-TOBE-05 a ACT-TOBE-09). */
export function rutasBandeja(
  db: Database.Database,
  opciones: { servicioPush: ServicioPush },
): Router {
  const router = Router();

  router.get('/bandeja', async (req, res) => {
    const dueno = obtenerDuenoDemo(db);

    if (!dueno) {
      res.status(503).render('solicitud-aviso', {
        titulo: 'No hay dueño de demostración',
        mensaje:
          'No se encontró un arrendador asignado a las pensiones de ejemplo. ' +
          'Ejecuta «npm run db:seed» para cargarlo.',
      });
      return;
    }

    const expiradas = await expirarSolicitudesVencidas(db, opciones.servicioPush);
    const { pendientes, resueltas } = listarSolicitudesDelDueno(db, dueno.id);

    res.render('bandeja', {
      dueno,
      pendientes,
      resueltas,
      expiradas,
      aviso: typeof req.query.aviso === 'string' ? req.query.aviso : null,
      mensaje:
        typeof req.query.mensaje === 'string' && req.query.mensaje.trim() !== ''
          ? req.query.mensaje
          : null,
      formatearFecha,
      formatearFechaHora,
      formatearPrecio,
    });
  });

  router.get('/bandeja/:codigo', (req, res) => {
    const dueno = obtenerDuenoDemo(db);

    if (!dueno) {
      res.status(503).render('solicitud-aviso', {
        titulo: 'No hay dueño de demostración',
        mensaje: 'Ejecuta «npm run db:seed» para cargar el arrendador de ejemplo.',
      });
      return;
    }

    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudDelDueno(db, codigo, dueno.id);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe una postulación con el código ${codigo} en tu bandeja.`,
      });
      return;
    }

    res.render('bandeja-detalle', {
      dueno,
      ...detalle,
      plazo: plazoRestante(detalle.solicitud.fechaEnvio),
      formatearFecha,
      formatearFechaHora,
      formatearPrecio,
    });
  });

  router.post('/bandeja/:codigo/aprobar', async (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const resultado = await aprobarSolicitud(db, opciones.servicioPush, codigo);

    if (resultado.ok) {
      res.redirect(303, '/bandeja?aviso=aprobada');
      return;
    }

    const mensaje = Object.values(resultado.errores ?? {})[0] ?? 'No se pudo aprobar la solicitud.';
    res.redirect(303, `/bandeja?aviso=error&mensaje=${encodeURIComponent(mensaje)}`);
  });

  router.post('/bandeja/:codigo/rechazar', async (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const cuerpo = (req.body ?? {}) as Record<string, unknown>;
    const motivo = typeof cuerpo.motivo === 'string' ? cuerpo.motivo : '';
    const resultado = await rechazarSolicitud(db, opciones.servicioPush, codigo, motivo);

    if (resultado.ok) {
      res.redirect(303, '/bandeja?aviso=rechazada');
      return;
    }

    const mensaje = Object.values(resultado.errores ?? {})[0] ?? 'No se pudo rechazar la solicitud.';
    res.redirect(303, `/bandeja?aviso=error&mensaje=${encodeURIComponent(mensaje)}`);
  });

  return router;
}
