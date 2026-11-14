import { Router } from 'express';
import type Database from 'better-sqlite3';
import { buscarSolicitudPorCodigo } from '../dominio/repositorio-solicitudes';
import { generarFichaPdf } from '../servicios/fichas';
import { clavePublicaBase64 } from '../servicios/firma';

/** HU-04 · CU-04 — Obtener comprobante (ACT-TOBE-10). */
export function rutasFichas(db: Database.Database): Router {
  const router = Router();

  router.get('/solicitudes/:codigo/ficha.pdf', async (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudPorCodigo(db, codigo);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe ninguna solicitud con el código ${codigo}.`,
      });
      return;
    }

    if (detalle.solicitud.estado !== 'Aprobada') {
      res.status(403).render('solicitud-aviso', {
        titulo: 'La ficha oficial aún no está disponible',
        mensaje:
          'La ficha de reserva en PDF se emite cuando la solicitud está aprobada. ' +
          'Por ahora la postulación está en estado «' +
          detalle.solicitud.estado +
          '».',
      });
      return;
    }

    const pdf = await generarFichaPdf(db, detalle);
    const nombreArchivo = `RES-${detalle.solicitud.codigoSolicitud}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(pdf);
  });

  router.get('/api/clave-publica', (_req, res) => {
    res.json({ clavePublica: clavePublicaBase64() });
  });

  return router;
}
