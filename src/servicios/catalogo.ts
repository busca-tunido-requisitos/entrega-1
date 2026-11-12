import { distanciaMetros } from '../dominio/distancia';
import type {
  FiltrosCatalogo,
  Pension,
  PensionEnCatalogo,
  Universidad,
} from '../dominio/tipos';

const RADIO_POR_DEFECTO_KM = 2;
const RADIO_MINIMO_KM = 0.5;
const RADIO_MAXIMO_KM = 20;

function texto(valor: unknown): string {
  if (Array.isArray(valor)) return String(valor[0] ?? '');
  if (valor === undefined || valor === null) return '';
  return String(valor);
}

function numero(valor: unknown, porDefecto: number): number {
  const limpio = texto(valor).trim();
  if (limpio === '') return porDefecto;
  const valorNumerico = Number(limpio);
  return Number.isFinite(valorNumerico) ? valorNumerico : porDefecto;
}

function indicador(valor: unknown): boolean {
  const limpio = texto(valor).toLowerCase();
  return limpio === '1' || limpio === 'true' || limpio === 'on' || limpio === 'si';
}

/**
 * HU-01 · Normaliza los parámetros de GET /catalogo y aplica los valores por defecto:
 * primera sede, rango completo de precios y radio de 2 km.
 */
export function normalizarFiltros(
  consulta: Record<string, unknown>,
  sedes: Universidad[],
  rango: { minimo: number; maximo: number },
): FiltrosCatalogo {
  const sedePedida = numero(consulta.sede, sedes[0]?.id ?? 0);
  const sedeId = sedes.some((sede) => sede.id === sedePedida)
    ? sedePedida
    : (sedes[0]?.id ?? 0);

  const precioMin = Math.max(0, numero(consulta.precioMin, rango.minimo));
  const precioMax = Math.max(precioMin, numero(consulta.precioMax, rango.maximo));

  const radioKm = Math.min(
    RADIO_MAXIMO_KM,
    Math.max(RADIO_MINIMO_KM, numero(consulta.radioKm, RADIO_POR_DEFECTO_KM)),
  );

  return {
    sedeId,
    precioMin,
    precioMax,
    permiteVisitas: indicador(consulta.permiteVisitas),
    permiteMascotas: indicador(consulta.permiteMascotas),
    sinToqueQueda: indicador(consulta.sinToqueQueda),
    radioKm,
  };
}

function cumpleNormas(pension: Pension, filtros: FiltrosCatalogo): boolean {
  if (filtros.permiteVisitas && !pension.permiteVisitas) return false;
  if (filtros.permiteMascotas && !pension.permiteMascotas) return false;
  if (filtros.sinToqueQueda && pension.horaToqueQueda !== null) return false;
  return true;
}

/**
 * HU-01 · Aplica los filtros de CU-01 y devuelve las pensiones ordenadas
 * por distancia ascendente y, a igual distancia, por precio ascendente.
 */
export function buscarEnCatalogo(
  pensiones: Pension[],
  sede: Universidad,
  filtros: FiltrosCatalogo,
): PensionEnCatalogo[] {
  const resultados: PensionEnCatalogo[] = [];

  for (const pension of pensiones) {
    if (!cumpleNormas(pension, filtros)) continue;

    const habitaciones = pension.habitaciones.filter(
      (habitacion) =>
        habitacion.precioMensual >= filtros.precioMin &&
        habitacion.precioMensual <= filtros.precioMax,
    );
    if (habitaciones.length === 0) continue;

    const distancia = Math.round(distanciaMetros(sede, pension));
    if (distancia > filtros.radioKm * 1000) continue;

    resultados.push({
      ...pension,
      habitaciones,
      habitacionesDisponibles: habitaciones.length,
      distanciaMetros: distancia,
      precioDesde: Math.min(...habitaciones.map((habitacion) => habitacion.precioMensual)),
    });
  }

  resultados.sort(
    (a, b) => a.distanciaMetros - b.distanciaMetros || a.precioDesde - b.precioDesde,
  );

  return resultados;
}
