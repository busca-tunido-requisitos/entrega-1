import type Database from 'better-sqlite3';
import type { Habitacion, Pension, Universidad } from './tipos';

interface FilaUniversidad {
  id: number;
  nombre: string;
  comuna: string;
  latitud: number;
  longitud: number;
}

interface FilaPension {
  id: number;
  nombre_comercial: string;
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  servicios_incluidos: string;
  permite_visitas: number;
  permite_mascotas: number;
  hora_toque_queda: string | null;
}

interface FilaHabitacion {
  id: number;
  pension_id: number;
  identificador_habitacion: string;
  precio_mensual: number;
  tipo_cama: string;
  tiene_bano_privado: number;
  estado_disponibilidad: Habitacion['estadoDisponibilidad'];
  fecha_inicio_admision: string;
  fecha_fin_admision: string;
}

export function listarUniversidades(db: Database.Database): Universidad[] {
  const filas = db
    .prepare(
      `SELECT id, nombre, comuna, latitud, longitud
         FROM universidad
        ORDER BY nombre`,
    )
    .all() as FilaUniversidad[];

  return filas.map((fila) => ({ ...fila }));
}

/** Rango de precios de las habitaciones disponibles, para los valores por defecto del formulario. */
export function rangoDePrecios(db: Database.Database): { minimo: number; maximo: number } {
  const fila = db
    .prepare(
      `SELECT MIN(precio_mensual) AS minimo, MAX(precio_mensual) AS maximo
         FROM habitacion
        WHERE estado_disponibilidad = 'Disponible'`,
    )
    .get() as { minimo: number | null; maximo: number | null };

  return { minimo: fila.minimo ?? 0, maximo: fila.maximo ?? 0 };
}

/** Lee las pensiones con sus habitaciones en estado Disponible (EST-02), sin transiciones. */
export function listarPensionesConHabitacionesDisponibles(
  db: Database.Database,
): Pension[] {
  const pensiones = db
    .prepare(
      `SELECT id, nombre_comercial, direccion, comuna, latitud, longitud,
              servicios_incluidos, permite_visitas, permite_mascotas, hora_toque_queda
         FROM pension
        ORDER BY nombre_comercial`,
    )
    .all() as FilaPension[];

  const habitaciones = db
    .prepare(
      `SELECT id, pension_id, identificador_habitacion, precio_mensual,
              tipo_cama, tiene_bano_privado, estado_disponibilidad,
              fecha_inicio_admision, fecha_fin_admision
         FROM habitacion
        WHERE estado_disponibilidad = 'Disponible'
        ORDER BY precio_mensual`,
    )
    .all() as FilaHabitacion[];

  const porPension = new Map<number, Habitacion[]>();
  for (const fila of habitaciones) {
    const habitacion: Habitacion = {
      id: fila.id,
      pensionId: fila.pension_id,
      identificadorHabitacion: fila.identificador_habitacion,
      precioMensual: fila.precio_mensual,
      tipoCama: fila.tipo_cama,
      tieneBanoPrivado: fila.tiene_bano_privado === 1,
      estadoDisponibilidad: fila.estado_disponibilidad,
      fechaInicioAdmision: fila.fecha_inicio_admision,
      fechaFinAdmision: fila.fecha_fin_admision,
    };

    const lista = porPension.get(fila.pension_id) ?? [];
    lista.push(habitacion);
    porPension.set(fila.pension_id, lista);
  }

  return pensiones.map((fila) => ({
    id: fila.id,
    nombreComercial: fila.nombre_comercial,
    direccion: fila.direccion,
    comuna: fila.comuna,
    latitud: fila.latitud,
    longitud: fila.longitud,
    serviciosIncluidos: fila.servicios_incluidos,
    permiteVisitas: fila.permite_visitas === 1,
    permiteMascotas: fila.permite_mascotas === 1,
    horaToqueQueda: fila.hora_toque_queda,
    habitaciones: porPension.get(fila.id) ?? [],
  }));
}
