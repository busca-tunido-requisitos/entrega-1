const formatoMoneda = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor: number): string {
  return formatoMoneda.format(valor);
}

export function formatearDistancia(metros: number): string {
  if (metros < 1000) return `${metros} m`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`;
}

/** Convierte 'YYYY-MM-DD' en 'dd/mm/aaaa' sin usar `Date` (evita zonas horarias). */
export function formatearFecha(fechaIso: string): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);
  if (!partes) return fechaIso;
  return `${partes[3]}/${partes[2]}/${partes[1]}`;
}

/** Convierte 'YYYY-MM-DD HH:MM:SS' en 'dd/mm/aaaa hh:mm'. */
export function formatearFechaHora(fechaHora: string): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(fechaHora);
  if (!partes) return fechaHora;
  return `${partes[3]}/${partes[2]}/${partes[1]} ${partes[4]}:${partes[5]}`;
}
