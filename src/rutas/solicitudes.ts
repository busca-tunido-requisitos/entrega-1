import { Router } from 'express';
import type Database from 'better-sqlite3';
import { formatearFecha, formatearFechaHora, formatearPrecio } from '../dominio/formato';
import {
  buscarHabitacionConPension,
  buscarSolicitudPorCodigo,
  obtenerEstudianteDemo,
} from '../dominio/repositorio-solicitudes';
import {
  calcularPlazoRespuesta,
  desdeFechaHoraSqlite,
  enviarSolicitud,
  fechaIsoLocal,
  normalizarDatosSolicitud,
} from '../servicios/solicitudes';
import type { ServicioPush } from '../servicios/push';

/** HU-02 · CU-02 — Solicitar reserva (ACT-TOBE-03 + ACT-TOBE-04). */
export function rutasSolicitudes(
  db: Database.Database,
  opciones: { servicioPush: ServicioPush },
): Router {
  const router = Router();

  router.get('/solicitudes/nueva', (req, res) => {
    const habitacionId = Number(req.query.habitacionId);
    const encontrado = Number.isFinite(habitacionId)
      ? buscarHabitacionConPension(db, habitacionId)
      : null;

    if (!encontrado) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Habitación no encontrada',
        mensaje: 'La habitación indicada no existe en el catálogo.',
      });
      return;
    }

    const { habitacion, pension } = encontrado;

    if (habitacion.estadoDisponibilidad !== 'Disponible') {
      res.status(409).render('solicitud-aviso', {
        titulo: 'La habitación ya no está disponible',
        mensaje:
          'La habitación dejó de estar disponible mientras postulabas. Vuelve al catálogo para elegir otra.',
      });
      return;
    }

    res.render('solicitud-formulario', {
      habitacion,
      pension,
      persona: obtenerEstudianteDemo(db),
      datos: {
        habitacionId: habitacion.id,
        fechaLlegada: fechaIsoLocal(),
        duracionMeses: 1,
        mensaje: '',
      },
      errores: {},
      hoy: fechaIsoLocal(),
      formatearFecha,
      formatearPrecio,
    });
  });

  router.post('/solicitudes', async (req, res) => {
    const cuerpo = (req.body ?? {}) as Record<string, unknown>;
    const datos = normalizarDatosSolicitud(cuerpo);
    const resultado = await enviarSolicitud(db, opciones.servicioPush, datos);

    if (!resultado.ok) {
      if (!resultado.habitacion) {
        res.status(404).render('solicitud-aviso', {
          titulo: 'Habitación no encontrada',
          mensaje: 'La habitación solicitada no existe en el catálogo.',
        });
        return;
      }

      res.status(422).render('solicitud-formulario', {
        habitacion: resultado.habitacion,
        pension: resultado.pension,
        persona: resultado.persona ?? obtenerEstudianteDemo(db),
        datos,
        errores: resultado.errores ?? {},
        hoy: fechaIsoLocal(),
        formatearFecha,
        formatearPrecio,
      });
      return;
    }

    res.redirect(303, `/solicitudes/${encodeURIComponent(resultado.solicitud!.codigoSolicitud)}`);
  });

  router.get('/solicitudes/:codigo', (req, res) => {
    const codigo = String(req.params.codigo ?? '');
    const detalle = buscarSolicitudPorCodigo(db, codigo);

    if (!detalle) {
      res.status(404).render('solicitud-aviso', {
        titulo: 'Solicitud no encontrada',
        mensaje: `No existe ninguna solicitud con el código ${codigo}.`,
      });
      return;
    }

    res.render('solicitud-confirmacion', {
      ...detalle,
      plazo: calcularPlazoRespuesta(desdeFechaHoraSqlite(detalle.solicitud.fechaEnvio)),
      formatearFecha,
      formatearFechaHora,
      formatearPrecio,
    });
  });

  return router;
}
