/** Tipos del modelo de dominio DOM-01 usados por HU-01 y HU-02. */

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
  /** Período de admisión de la habitación (semestre en curso). */
  fechaInicioAdmision: string;
  fechaFinAdmision: string;
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

/** Clase `Persona` con rol de postulante (DOM-01). */
export interface Persona {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string | null;
  correoInstitucional: string;
  correoInstitucionalVerificado: boolean;
  universidad: string | null;
  carrera: string | null;
}

/** Estados de `SolicitudReserva` según EST-01. */
export type EstadoSolicitud = 'En revisión' | 'Aprobada' | 'Rechazada' | 'Expirada';

export interface SolicitudReserva {
  id: number;
  codigoSolicitud: string;
  personaId: number;
  habitacionId: number;
  fechaLlegadaEstimada: string;
  duracionEstadiaMeses: number;
  mensajePresentacion: string;
  fechaEnvio: string;
  estado: EstadoSolicitud;
}

/** Notificación persistida por el `ServicioPush` simulado (no es clase del dominio). */
export interface Notificacion {
  id: number;
  solicitudId: number;
  destinatario: string;
  titulo: string;
  cuerpo: string;
  creadaEn: string;
  leida: boolean;
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

/** Habitación disponible dentro del rango de precio, tal como se muestra en el catálogo. */
export interface HabitacionEnCatalogo {
  id: number;
  identificadorHabitacion: string;
  precioMensual: number;
  tipoCama: string;
  tieneBanoPrivado: boolean;
}

export interface PensionEnCatalogo extends Pension {
  distanciaMetros: number;
  precioDesde: number;
  habitacionesDisponibles: number;
  habitacionesResumidas: HabitacionEnCatalogo[];
}
