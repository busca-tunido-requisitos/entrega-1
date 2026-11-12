/** Tipos del modelo de dominio DOM-01 usados por HU-01. */

export interface Universidad {
  id: number;
  nombre: string;
  comuna: string;
  latitud: number;
  longitud: number;
}

export type EstadoHabitacion = 'Disponible' | 'Reservada' | 'Ocupada';

export interface Habitacion {
  id: number;
  pensionId: number;
  identificadorHabitacion: string;
  precioMensual: number;
  tipoCama: string;
  tieneBanoPrivado: boolean;
  estadoDisponibilidad: EstadoHabitacion;
}

export interface Pension {
  id: number;
  nombreComercial: string;
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  serviciosIncluidos: string;
  permiteVisitas: boolean;
  permiteMascotas: boolean;
  horaToqueQueda: string | null;
  habitaciones: Habitacion[];
}

export interface FiltrosCatalogo {
  sedeId: number;
  precioMin: number;
  precioMax: number;
  permiteVisitas: boolean;
  permiteMascotas: boolean;
  sinToqueQueda: boolean;
  radioKm: number;
}

export interface PensionEnCatalogo extends Pension {
  distanciaMetros: number;
  precioDesde: number;
  habitacionesDisponibles: number;
}
