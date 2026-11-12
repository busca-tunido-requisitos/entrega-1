import type { Universidad } from './tipos';

const RADIO_TIERRA_METROS = 6_371_000;

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

/** Distancia en metros entre una sede y una pensión (fórmula de Haversine). */
export function distanciaMetros(
  origen: Pick<Universidad, 'latitud' | 'longitud'>,
  destino: { latitud: number; longitud: number },
): number {
  const dLatitud = aRadianes(destino.latitud - origen.latitud);
  const dLongitud = aRadianes(destino.longitud - origen.longitud);

  const a =
    Math.sin(dLatitud / 2) ** 2 +
    Math.cos(aRadianes(origen.latitud)) *
      Math.cos(aRadianes(destino.latitud)) *
      Math.sin(dLongitud / 2) ** 2;

  return RADIO_TIERRA_METROS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
