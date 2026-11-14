import { Router } from 'express';
import type Database from 'better-sqlite3';
import { registrarLlegada } from '../servicios/fichas';
import { clavePublicaBase64 } from '../servicios/firma';

/**
 * HU-04 · CU-04 — Verificación presencial sin conexión (DSS-02, fragmento `opt`).
 * El dueño escanea el QR de la ficha y el sistema registra el ingreso.
 */
export function rutasVerificacion(db: Database.Database): Router {
  const router = Router();

  router.get('/verificar', (_req, res) => {
    res.render('verificar', {
      clavePublica: clavePublicaBase64(),
      resultado: null,
    });
  });

  router.post('/verificar/llegada', (req, res) => {
    const cuerpo = (req.body ?? {}) as Record<string, unknown>;
    const contenido = typeof cuerpo.contenido === 'string' ? cuerpo.contenido : '';
    const resultado = registrarLlegada(db, contenido);

    res.status(resultado.ok ? 200 : 400).render('verificar', {
      clavePublica: clavePublicaBase64(),
      resultado,
    });
  });

  return router;
}
