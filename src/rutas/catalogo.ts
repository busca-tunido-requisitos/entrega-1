import { Router } from 'express';
import type Database from 'better-sqlite3';
import { formatearDistancia, formatearPrecio } from '../dominio/formato';
import {
  listarPensionesConHabitacionesDisponibles,
  listarUniversidades,
  rangoDePrecios,
} from '../dominio/repositorio-catalogo';
import { buscarEnCatalogo, normalizarFiltros } from '../servicios/catalogo';

/** HU-01 · CU-01 — Buscar alojamiento (ACT-TOBE-01 + ACT-TOBE-02). */
export function rutasCatalogo(db: Database.Database): Router {
  const router = Router();

  router.get('/catalogo', (req, res) => {
    const sedes = listarUniversidades(db);
    const rango = rangoDePrecios(db);
    const filtros = normalizarFiltros(
      req.query as Record<string, unknown>,
      sedes,
      rango,
    );

    const sede = sedes.find((candidata) => candidata.id === filtros.sedeId) ?? sedes[0];

    if (!sede) {
      res.status(503).render('sin-datos');
      return;
    }

    const pensiones = listarPensionesConHabitacionesDisponibles(db);
    const resultados = buscarEnCatalogo(pensiones, sede, filtros);
    const sinCoincidencias = resultados.length === 0;

    const resumen = sinCoincidencias
      ? `Sin coincidencias en un radio de ${filtros.radioKm} km de ${sede.nombre}.`
      : `${resultados.length} pensión(es) con habitaciones disponibles a menos de ${filtros.radioKm} km de ${sede.nombre}.`;

    const datosMapa = {
      sede: {
        id: sede.id,
        nombre: sede.nombre,
        latitud: sede.latitud,
        longitud: sede.longitud,
      },
      radioKm: filtros.radioKm,
      pensiones: resultados.map((pension) => ({
        id: pension.id,
        nombre: pension.nombreComercial,
        latitud: pension.latitud,
        longitud: pension.longitud,
        precioDesde: pension.precioDesde,
        distanciaMetros: pension.distanciaMetros,
      })),
    };

    // Evita cerrar el <script> si algún dato contiene "<".
    const datosMapaJson = JSON.stringify(datosMapa).replace(/</g, '\\u003c');

    res.render('catalogo', {
      sedes,
      filtros,
      resultados,
      sinCoincidencias,
      resumen,
      datosMapaJson,
      formatearPrecio,
      formatearDistancia,
    });
  });

  return router;
}
