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
