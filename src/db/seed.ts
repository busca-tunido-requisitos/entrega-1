import type Database from 'better-sqlite3';
import { abrirBaseDeDatos } from './conexion';

interface SedeSemilla {
  nombre: string;
  comuna: string;
  latitud: number;
  longitud: number;
}

interface HabitacionSemilla {
  identificador: string;
  precioMensual: number;
  tipoCama: string;
  banoPrivado: boolean;
}

interface PensionSemilla {
  nombreComercial: string;
  direccion: string;
  comuna: string;
  latitud: number;
  longitud: number;
  servicios: string;
  permiteVisitas: boolean;
  permiteMascotas: boolean;
  horaToqueQueda: string | null;
  habitaciones: HabitacionSemilla[];
}

// Sedes de la Región de Valparaíso con coordenadas aproximadas (dato de ejemplo, no clase del dominio).
const SEDES: SedeSemilla[] = [
  { nombre: 'Universidad de Valparaíso', comuna: 'Valparaíso', latitud: -33.0244, longitud: -71.6271 },
  {
    nombre: 'Pontificia Universidad Católica de Valparaíso',
    comuna: 'Valparaíso',
    latitud: -33.0359,
    longitud: -71.6197,
  },
  {
    nombre: 'Universidad Técnica Federico Santa María',
    comuna: 'Valparaíso',
    latitud: -33.0361,
    longitud: -71.5946,
  },
  {
    nombre: 'Universidad de Playa Ancha',
    comuna: 'Valparaíso',
    latitud: -33.0238,
    longitud: -71.6406,
  },
  {
    nombre: 'Universidad de Viña del Mar',
    comuna: 'Viña del Mar',
    latitud: -33.0247,
    longitud: -71.5489,
  },
  {
    nombre: 'Universidad Adolfo Ibáñez (sede Viña del Mar)',
    comuna: 'Viña del Mar',
    latitud: -33.026,
    longitud: -71.5335,
  },
];

const PENSIONES: PensionSemilla[] = [
  {
    nombreComercial: 'Pensión Los Aromos',
    direccion: 'Av. Colón 1240',
    comuna: 'Valparaíso',
    latitud: -33.027,
    longitud: -71.625,
    servicios: 'Agua, luz, gas, internet, lavandería',
    permiteVisitas: true,
    permiteMascotas: true,
    horaToqueQueda: '23:30',
    habitaciones: [
      { identificador: 'A-101', precioMensual: 150000, tipoCama: '1 plaza', banoPrivado: true },
      { identificador: 'A-102', precioMensual: 180000, tipoCama: '2 plazas', banoPrivado: false },
      { identificador: 'A-103', precioMensual: 220000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
  {
    nombreComercial: 'Residencial Cerro Alegre',
    direccion: 'Calle Urriola 480',
    comuna: 'Valparaíso',
    latitud: -33.04,
    longitud: -71.625,
    servicios: 'Agua, luz, internet',
    permiteVisitas: false,
    permiteMascotas: false,
    horaToqueQueda: '22:00',
    habitaciones: [
      { identificador: 'B-201', precioMensual: 200000, tipoCama: '1 plaza', banoPrivado: false },
      { identificador: 'B-202', precioMensual: 250000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
  {
    nombreComercial: 'Pensión Brasil',
    direccion: 'Av. Brasil 1780',
    comuna: 'Valparaíso',
    latitud: -33.03,
    longitud: -71.621,
    servicios: 'Agua, luz, gas, internet',
    permiteVisitas: true,
    permiteMascotas: false,
    horaToqueQueda: '23:00',
    habitaciones: [
      { identificador: 'C-301', precioMensual: 190000, tipoCama: '1 plaza', banoPrivado: true },
      { identificador: 'C-302', precioMensual: 240000, tipoCama: '2 plazas', banoPrivado: false },
    ],
  },
  {
    nombreComercial: 'Residencial Playa Ancha',
    direccion: 'Av. Playa Ancha 760',
    comuna: 'Valparaíso',
    latitud: -33.025,
    longitud: -71.639,
    servicios: 'Agua, luz, internet, cocina compartida',
    permiteVisitas: true,
    permiteMascotas: false,
    horaToqueQueda: null,
    habitaciones: [
      { identificador: 'D-401', precioMensual: 160000, tipoCama: '1 plaza', banoPrivado: false },
      { identificador: 'D-402', precioMensual: 210000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
  {
    nombreComercial: 'Pensión Viña Centro',
    direccion: 'Calle Quillota 340',
    comuna: 'Viña del Mar',
    latitud: -33.026,
    longitud: -71.55,
    servicios: 'Agua, luz, gas, internet',
    permiteVisitas: true,
    permiteMascotas: true,
    horaToqueQueda: null,
    habitaciones: [
      { identificador: 'E-501', precioMensual: 180000, tipoCama: '1 plaza', banoPrivado: true },
      { identificador: 'E-502', precioMensual: 230000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
  {
    nombreComercial: 'Hogar Universitario Reñaca',
    direccion: 'Av. Borgoño 15200',
    comuna: 'Viña del Mar',
    latitud: -33.03,
    longitud: -71.54,
    servicios: 'Agua, luz, gas, internet, limpieza',
    permiteVisitas: false,
    permiteMascotas: true,
    horaToqueQueda: '23:00',
    habitaciones: [
      { identificador: 'F-601', precioMensual: 250000, tipoCama: '1 plaza', banoPrivado: true },
      { identificador: 'F-602', precioMensual: 300000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
  {
    nombreComercial: 'Pensión Quilpué',
    direccion: 'Av. Freire 950',
    comuna: 'Quilpué',
    latitud: -33.048,
    longitud: -71.44,
    servicios: 'Agua, luz, gas, internet',
    permiteVisitas: true,
    permiteMascotas: true,
    horaToqueQueda: null,
    habitaciones: [
      { identificador: 'G-701', precioMensual: 120000, tipoCama: '1 plaza', banoPrivado: false },
      { identificador: 'G-702', precioMensual: 140000, tipoCama: '2 plazas', banoPrivado: false },
    ],
  },
  {
    nombreComercial: 'Residencial España',
    direccion: 'Av. España 1510',
    comuna: 'Valparaíso',
    latitud: -33.0365,
    longitud: -71.598,
    servicios: 'Agua, luz, internet',
    permiteVisitas: false,
    permiteMascotas: false,
    horaToqueQueda: '22:00',
    habitaciones: [
      { identificador: 'H-801', precioMensual: 170000, tipoCama: '1 plaza', banoPrivado: false },
      { identificador: 'H-802', precioMensual: 230000, tipoCama: '2 plazas', banoPrivado: true },
    ],
  },
];

interface FilaId {
  id: number;
}

/**
 * Perfil de estudiante de demostración (HU-02).
 * No hay autenticación real en el taller: el correo institucional ya viene verificado.
 */
const PERFIL_DEMO = {
  nombreCompleto: 'Camila Rojas Fuentes',
  correoElectronico: 'camila.rojas.contacto@example.cl',
  telefono: '+56 9 0000 0000',
  correoInstitucional: 'camila.rojas@uv.cl',
  universidad: 'Universidad de Valparaíso',
  carrera: 'Ingeniería Civil Informática',
};

/**
 * Semestre académico en curso: enero–junio → 01-01 a 07-15; julio–diciembre →
 * 07-16 a 12-31. Las habitaciones admiten arriendos solo en ese período.
 */
export function calcularSemestreEnCurso(fecha: Date = new Date()): {
  inicio: string;
  fin: string;
} {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;

  if (mes <= 6) {
    return { inicio: `${anio}-01-01`, fin: `${anio}-07-15` };
  }
  return { inicio: `${anio}-07-16`, fin: `${anio}-12-31` };
}

/** Carga idempotente de los datos de ejemplo de HU-01 y HU-02. */
export function sembrarDatos(db: Database.Database): void {
  const semestre = calcularSemestreEnCurso();
  const upsertSede = db.prepare(`
    INSERT INTO universidad (nombre, comuna, latitud, longitud)
    VALUES (@nombre, @comuna, @latitud, @longitud)
    ON CONFLICT (nombre) DO UPDATE SET
      comuna = excluded.comuna,
      latitud = excluded.latitud,
      longitud = excluded.longitud
  `);

  const upsertPension = db.prepare(`
    INSERT INTO pension (
      nombre_comercial, direccion, comuna, latitud, longitud,
      servicios_incluidos, permite_visitas, permite_mascotas, hora_toque_queda
    )
    VALUES (
      @nombreComercial, @direccion, @comuna, @latitud, @longitud,
      @servicios, @permiteVisitas, @permiteMascotas, @horaToqueQueda
    )
    ON CONFLICT (nombre_comercial) DO UPDATE SET
      direccion = excluded.direccion,
      comuna = excluded.comuna,
      latitud = excluded.latitud,
      longitud = excluded.longitud,
      servicios_incluidos = excluded.servicios_incluidos,
      permite_visitas = excluded.permite_visitas,
      permite_mascotas = excluded.permite_mascotas,
      hora_toque_queda = excluded.hora_toque_queda
  `);

  const upsertHabitacion = db.prepare(`
    INSERT INTO habitacion (
      pension_id, identificador_habitacion, precio_mensual, tipo_cama,
      tiene_bano_privado, estado_disponibilidad,
      fecha_inicio_admision, fecha_fin_admision
    )
    VALUES (
      @pensionId, @identificador, @precioMensual, @tipoCama, @banoPrivado, 'Disponible',
      @fechaInicioAdmision, @fechaFinAdmision
    )
    ON CONFLICT (pension_id, identificador_habitacion) DO UPDATE SET
      precio_mensual = excluded.precio_mensual,
      tipo_cama = excluded.tipo_cama,
      tiene_bano_privado = excluded.tiene_bano_privado,
      fecha_inicio_admision = excluded.fecha_inicio_admision,
      fecha_fin_admision = excluded.fecha_fin_admision
  `);

  const buscarSede = db.prepare('SELECT id FROM universidad WHERE nombre = ?');
  const buscarPension = db.prepare('SELECT id FROM pension WHERE nombre_comercial = ?');

  const insertarPerfilDemo = db.prepare(`
    INSERT INTO persona (
      nombre_completo, correo_electronico, telefono, correo_institucional,
      correo_institucional_verificado, universidad, carrera
    )
    SELECT @nombreCompleto, @correoElectronico, @telefono, @correoInstitucional,
           1, @universidad, @carrera
     WHERE NOT EXISTS (
       SELECT 1 FROM persona WHERE correo_institucional = @correoInstitucional
     )
  `);

  const carga = db.transaction(() => {
    for (const sede of SEDES) {
      upsertSede.run(sede);
    }

    for (const pension of PENSIONES) {
      upsertPension.run({
        ...pension,
        permiteVisitas: pension.permiteVisitas ? 1 : 0,
        permiteMascotas: pension.permiteMascotas ? 1 : 0,
      });

      const fila = buscarPension.get(pension.nombreComercial) as FilaId;
      for (const habitacion of pension.habitaciones) {
        upsertHabitacion.run({
          pensionId: fila.id,
          identificador: habitacion.identificador,
          precioMensual: habitacion.precioMensual,
          tipoCama: habitacion.tipoCama,
          banoPrivado: habitacion.banoPrivado ? 1 : 0,
          fechaInicioAdmision: semestre.inicio,
          fechaFinAdmision: semestre.fin,
        });
      }
    }

    // Perfil de estudiante de demostración (HU-02): se inserta una sola vez.
    insertarPerfilDemo.run(PERFIL_DEMO);

    // Comprobación de que las sedes quedaron cargadas (evita silencios si se edita la lista).
    for (const sede of SEDES) {
      if (!buscarSede.get(sede.nombre)) {
        throw new Error(`No se pudo sembrar la sede ${sede.nombre}`);
      }
    }
  });

  carga();
}

if (require.main === module) {
  const db = abrirBaseDeDatos();
  sembrarDatos(db);

  const sedes = db.prepare('SELECT COUNT(*) AS total FROM universidad').get() as { total: number };
  const pensiones = db.prepare('SELECT COUNT(*) AS total FROM pension').get() as { total: number };
  const habitaciones = db.prepare('SELECT COUNT(*) AS total FROM habitacion').get() as { total: number };
  const personas = db.prepare('SELECT COUNT(*) AS total FROM persona').get() as { total: number };

  console.log(
    `Datos de ejemplo cargados: ${sedes.total} sedes, ${pensiones.total} pensiones, ` +
      `${habitaciones.total} habitaciones y ${personas.total} perfil(es) de estudiante.`,
  );
  db.close();
}
