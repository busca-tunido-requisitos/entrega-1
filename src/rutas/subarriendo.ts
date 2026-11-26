import { Router } from 'express';
import type Database from 'better-sqlite3';
import { formatearFecha, formatearFechaHora, formatearPrecio } from '../dominio/formato';
import {
  buscarSolicitudDelSubarrendador,
  listarSolicitudesDelSubarrendador,
  obtenerSubarrendadorDemo,
} from '../dominio/repositorio-resoluciones';
import {
  expirarSolicitudesVencidas,
  plazoRestante,
  preAprobarPorSubarrendador,
  rechazarPorSubarrendador,
} from '../servicios/resoluciones';
import type { ServicioPush } from '../servicios/push';

export function rutasSubarriendo(
  db: Database.Database,
  opciones: { servicioPush: ServicioPush },
): Router {
  const router = Router();

  router.get('/subarriendo', async (req, res) => {
    const subarrendador = obtenerSubarrendadorDemo(db);

    if (!subarrendador) {
      res.status(503).render('solicitud-aviso', {
        titulo: 'No hay subarrendador de demostración',
        mensaje:
          'No se encontró un subarrendador asignado a las pensiones de ejemplo. ' +
          'Ejecuta «npm run db:seed» para cargarlo.',
      });
      return;
    }

    const expiradas = await expirarSolicitudesVencidas(db, opciones.servicioPush);
    const { pendientes, evaluadas } = listarSolicitudesDelSubarrendador(db, subarrendador.id);

    res.render('subarriendo', {
      subarrendador,
      pendientes,
      evaluadas,
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

  router.get('/subarriendo/:codigo', (req, res) => {
    const subarrendador = obtenerSubarrendadorDemo(db);

    if (!subarrendador) {
      res.status(503).render('solicitud-aviso', {
        titulo: 'No hay subarrendador de demostración',
        mensaje: 'Ejecuta «npm run db:seed» para cargar el subarrendador de ejemplo.',
      });
      return;
    }

    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudDelSubarrendador(db, codigo, subarrendador.id);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe una postulación con el código ${codigo} para tu pensión de subarriendo.`,
      });
      return;
    }

    res.render('subarriendo-detalle', {
      subarrendador,
      ...detalle,
      plazo: plazoRestante(detalle.solicitud.fechaEnvio),
      formatearFecha,
      formatearFechaHora,
      formatearPrecio,
    });
  });

  router.post('/subarriendo/:codigo/pre-aprobar', async (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const resultado = await preAprobarPorSubarrendador(db, opciones.servicioPush, codigo);

    if (resultado.ok) {
      res.redirect(303, '/subarriendo?aviso=pre-aprobada');
      return;
    }

    const mensaje =
      Object.values(resultado.errores ?? {})[0] ?? 'No se pudo pre-aprobar la solicitud.';
    res.redirect(303, `/subarriendo?aviso=error&mensaje=${encodeURIComponent(mensaje)}`);
  });

  router.post('/subarriendo/:codigo/rechazar', async (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const cuerpo = (req.body ?? {}) as Record<string, unknown>;
    const motivo = typeof cuerpo.motivo === 'string' ? cuerpo.motivo : '';
    const resultado = await rechazarPorSubarrendador(db, opciones.servicioPush, codigo, motivo);

    if (resultado.ok) {
      res.redirect(303, '/subarriendo?aviso=rechazada');
      return;
    }

    const mensaje =
      Object.values(resultado.errores ?? {})[0] ?? 'No se pudo rechazar la solicitud.';
    res.redirect(303, `/subarriendo?aviso=error&mensaje=${encodeURIComponent(mensaje)}`);
  });

  return router;
}
