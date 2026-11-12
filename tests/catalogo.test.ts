import { describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { crearApp } from '../src/app';
import { abrirBaseDeDatos } from '../src/db/conexion';

interface PensionPrueba {
  nombre: string;
  latitud: number;
  longitud: number;
  permiteVisitas?: boolean;
  permiteMascotas?: boolean;
  horaToqueQueda?: string | null;
}

function crearBaseDePrueba(): Database.Database {
  return abrirBaseDeDatos(':memory:');
}

function insertarSede(db: Database.Database, nombre = 'Universidad de Prueba'): number {
  const resultado = db
    .prepare(
      `INSERT INTO universidad (nombre, comuna, latitud, longitud)
       VALUES (?, 'Valparaíso', -33.0244, -71.6271)`,
    )
    .run(nombre);
  return Number(resultado.lastInsertRowid);
}

function insertarPension(db: Database.Database, pension: PensionPrueba): number {
  const resultado = db
    .prepare(
      `INSERT INTO pension (
         nombre_comercial, direccion, comuna, latitud, longitud,
         servicios_incluidos, permite_visitas, permite_mascotas, hora_toque_queda
       ) VALUES (?, 'Calle de Prueba 100', 'Valparaíso', ?, ?, 'Internet', ?, ?, ?)`,
    )
    .run(
      pension.nombre,
      pension.latitud,
      pension.longitud,
      pension.permiteVisitas ? 1 : 0,
      pension.permiteMascotas ? 1 : 0,
      pension.horaToqueQueda ?? null,
    );
  return Number(resultado.lastInsertRowid);
}

function insertarHabitacion(
  db: Database.Database,
  pensionId: number,
  precioMensual: number,
  estado: 'Disponible' | 'Reservada' | 'Ocupada' = 'Disponible',
): void {
  db.prepare(
    `INSERT INTO habitacion (
       pension_id, identificador_habitacion, precio_mensual, tipo_cama,
       tiene_bano_privado, estado_disponibilidad
     ) VALUES (?, ?, ?, '1 plaza', 1, ?)`,
  ).run(pensionId, `H-${precioMensual}`, precioMensual, estado);
}

function leerDatosCatalogo(html: string): {
  sede: { nombre: string } | null;
  pensiones: Array<{ nombre: string; distanciaMetros: number }>;
} {
  const coincidencia = /<script type="application\/json" id="datos-catalogo">([\s\S]*?)<\/script>/.exec(
    html,
  );
  if (!coincidencia) throw new Error('La página no incluye los datos del catálogo');
  return JSON.parse(coincidencia[1]);
}

describe('HU-01 · Catálogo de pensiones', () => {
  it('HU-01 · Filtrado exitoso de pensiones por sede universitaria y rango de precio', async () => {
    const db = crearBaseDePrueba();
    const sedeId = insertarSede(db);

    // Cercana, dentro del precio: debe aparecer primero.
    const cercana = insertarPension(db, {
      nombre: 'Pensión Cercana',
      latitud: -33.0214,
      longitud: -71.6271,
    });
    insertarHabitacion(db, cercana, 200000);

    // Media, dentro del precio: debe aparecer después de la cercana.
    const media = insertarPension(db, {
      nombre: 'Pensión Media',
      latitud: -33.0164,
      longitud: -71.6271,
    });
    insertarHabitacion(db, media, 150000);

    // Fuera del radio de 2 km.
    const lejana = insertarPension(db, {
      nombre: 'Pensión Lejana',
      latitud: -32.9944,
      longitud: -71.6271,
    });
    insertarHabitacion(db, lejana, 180000);

    // Dentro del radio, pero fuera del rango de precio.
    const cara = insertarPension(db, {
      nombre: 'Pensión Cara',
      latitud: -33.0204,
      longitud: -71.6271,
    });
    insertarHabitacion(db, cara, 500000);

    // Sin habitaciones Disponibles (EST-02): no debe aparecer.
    const reservada = insertarPension(db, {
      nombre: 'Pensión Reservada',
      latitud: -33.0224,
      longitud: -71.6271,
    });
    insertarHabitacion(db, reservada, 170000, 'Reservada');

    const respuesta = await request(crearApp(db))
      .get('/catalogo')
      .query({
        sede: String(sedeId),
        precioMin: '150000',
        precioMax: '250000',
        radioKm: '2',
      });

    expect(respuesta.status).toBe(200);

    const datos = leerDatosCatalogo(respuesta.text);
    const nombres = datos.pensiones.map((pension) => pension.nombre);

    expect(nombres).toEqual(['Pensión Cercana', 'Pensión Media']);
    expect(datos.sede?.nombre).toBe('Universidad de Prueba');
    expect(datos.pensiones[0].distanciaMetros).toBeLessThan(
      datos.pensiones[1].distanciaMetros,
    );

    db.close();
  });

  it('HU-01 · Búsqueda sin coincidencias por restricciones excesivas de convivencia', async () => {
    const db = crearBaseDePrueba();
    const sedeId = insertarSede(db);

    // Cerca de la sede, pero no permite mascotas.
    const sinMascotas = insertarPension(db, {
      nombre: 'Pensión Sin Mascotas',
      latitud: -33.0214,
      longitud: -71.6271,
      permiteMascotas: false,
    });
    insertarHabitacion(db, sinMascotas, 180000);

    // Permite mascotas, pero está fuera del radio de 2 km.
    const conMascotas = insertarPension(db, {
      nombre: 'Pensión Con Mascotas',
      latitud: -32.9944,
      longitud: -71.6271,
      permiteMascotas: true,
    });
    insertarHabitacion(db, conMascotas, 180000);

    const respuesta = await request(crearApp(db)).get('/catalogo').query({
      sede: String(sedeId),
      permiteMascotas: '1',
      radioKm: '2',
    });

    expect(respuesta.status).toBe(200);
    expect(respuesta.text).toContain(
      'No se encontraron habitaciones disponibles con ese criterio',
    );
    expect(respuesta.text).toContain('flexibiliza las normas');

    const datos = leerDatosCatalogo(respuesta.text);
    expect(datos.pensiones).toHaveLength(0);

    db.close();
  });
});
