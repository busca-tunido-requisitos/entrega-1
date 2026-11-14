import { describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { crearApp } from '../src/app';
import { abrirBaseDeDatos } from '../src/db/conexion';
import { sembrarDatos } from '../src/db/seed';
import type { MensajePush, ServicioPush } from '../src/servicios/push';

/** Doble de prueba del ServicioPush simulado: guarda los mensajes enviados. */
class ServicioPushEspia implements ServicioPush {
  readonly mensajes: MensajePush[] = [];

  async enviar(mensaje: MensajePush): Promise<void> {
    this.mensajes.push(mensaje);
  }
}

interface FilaHabitacion {
  id: number;
  identificador_habitacion: string;
  fecha_inicio_admision: string;
  fecha_fin_admision: string;
}

interface Conteo {
  total: number;
}

function prepararBase(): { db: Database.Database; push: ServicioPushEspia } {
  const db = abrirBaseDeDatos(':memory:');
  sembrarDatos(db);
  return { db, push: new ServicioPushEspia() };
}

function habitacionDisponible(db: Database.Database): FilaHabitacion {
  const fila = db
    .prepare(
      `SELECT id, identificador_habitacion, fecha_inicio_admision, fecha_fin_admision
         FROM habitacion
        WHERE estado_disponibilidad = 'Disponible'
        ORDER BY id
        LIMIT 1`,
    )
    .get() as FilaHabitacion;
  return fila;
}

function contarSolicitudes(db: Database.Database): number {
  return (db.prepare('SELECT COUNT(*) AS total FROM solicitud_reserva').get() as Conteo).total;
}

describe('HU-02 · Envío de postulación formal de reserva', () => {
  it('HU-02 · Envío exitoso de solicitud formal con antecedentes completos', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({
        habitacionId: habitacion.id,
        fechaLlegada: habitacion.fecha_inicio_admision,
        duracionMeses: 3,
        mensajePresentacion: 'Soy estudiante foráneo y busco alojamiento cerca del campus.',
      });

    expect(respuesta.status).toBe(303);
    expect(respuesta.headers.location).toMatch(/^\/solicitudes\/SOL-\d{4}-\d{4}$/);

    const solicitud = db
      .prepare(
        `SELECT id, codigo_solicitud, estado, fecha_envio, fecha_llegada_estimada,
                duracion_estadia_meses
           FROM solicitud_reserva`,
      )
      .get() as {
      id: number;
      codigo_solicitud: string;
      estado: string;
      fecha_envio: string;
      fecha_llegada_estimada: string;
      duracion_estadia_meses: number;
    };

    // La solicitud queda registrada en estado "En revisión" (EST-01).
    expect(solicitud.estado).toBe('En revisión');
    expect(solicitud.fecha_envio).toBeTruthy();
    expect(solicitud.fecha_llegada_estimada).toBe(habitacion.fecha_inicio_admision);
    expect(solicitud.duracion_estadia_meses).toBe(3);

    // Se despacha exactamente una notificación push al dueño de la pensión.
    expect(push.mensajes).toHaveLength(1);
    expect(push.mensajes[0].solicitudId).toBe(solicitud.id);
    expect(push.mensajes[0].destinatario).toContain('@');

    // La habitación no cambia de estado (el cupo se bloquea al aprobar, HU-03).
    const habitacionDespues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habitacionDespues.estado_disponibilidad).toBe('Disponible');

    // La confirmación informa el código y el plazo máximo de 48 horas.
    const confirmacion = await request(app).get(respuesta.headers.location);
    expect(confirmacion.status).toBe(200);
    expect(confirmacion.text).toContain(solicitud.codigo_solicitud);
    expect(confirmacion.text).toContain('48 horas');
    expect(confirmacion.text).toContain('En revisión');
  });

  it('HU-02 · Intento de postulación con fecha de ingreso fuera del periodo lectivo', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    // La habitación admite arriendos solo entre el 01/03/2026 y el 31/07/2026.
    db.prepare(
      'UPDATE habitacion SET fecha_inicio_admision = ?, fecha_fin_admision = ? WHERE id = ?',
    ).run('2026-03-01', '2026-07-31', habitacion.id);

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({
        habitacionId: habitacion.id,
        fechaLlegada: '2027-01-15',
        duracionMeses: 2,
        mensajePresentacion: 'Quiero Boxing Day en la habitación.',
      });

    // El sistema impide el envío de la postulación.
    expect(respuesta.status).toBe(422);
    expect(contarSolicitudes(db)).toBe(0);
    expect(push.mensajes).toHaveLength(0);

    // E informa las fechas válidas de inicio de estadía definidas por la pensión.
    expect(respuesta.text).toContain('01/03/2026');
    expect(respuesta.text).toContain('31/07/2026');
  });

  it('HU-02 · Rechaza el envío cuando faltan los campos obligatorios', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({ habitacionId: habitacion.id, fechaLlegada: '', duracionMeses: '', mensajePresentacion: '' });

    expect(respuesta.status).toBe(422);
    expect(contarSolicitudes(db)).toBe(0);
    expect(push.mensajes).toHaveLength(0);
    expect(respuesta.text).toContain('fecha de ingreso');
  });

  it('HU-02 · Rechaza el envío cuando la duración está fuera de 1 a 12 meses', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({
        habitacionId: habitacion.id,
        fechaLlegada: habitacion.fecha_inicio_admision,
        duracionMeses: 13,
        mensajePresentacion: 'Me quedo un semestre largo.',
      });

    expect(respuesta.status).toBe(422);
    expect(contarSolicitudes(db)).toBe(0);
    expect(push.mensajes).toHaveLength(0);
    expect(respuesta.text).toContain('entre 1 y 12');
  });

  it('HU-02 · Rechaza el envío si el perfil no tiene correo institucional verificado', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    db.prepare('UPDATE persona SET correo_institucional_verificado = 0').run();

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({
        habitacionId: habitacion.id,
        fechaLlegada: habitacion.fecha_inicio_admision,
        duracionMeses: 3,
        mensajePresentacion: 'Quiero postular.',
      });

    expect(respuesta.status).toBe(422);
    expect(contarSolicitudes(db)).toBe(0);
    expect(push.mensajes).toHaveLength(0);
    expect(respuesta.text).toContain('verificado');
  });

  it('HU-02 · Rechaza el envío si la habitación ya no está disponible', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    db.prepare("UPDATE habitacion SET estado_disponibilidad = 'Reservada' WHERE id = ?").run(
      habitacion.id,
    );

    const respuesta = await request(app)
      .post('/solicitudes')
      .type('form')
      .send({
        habitacionId: habitacion.id,
        fechaLlegada: habitacion.fecha_inicio_admision,
        duracionMeses: 3,
        mensajePresentacion: 'Quiero postular.',
      });

    expect(respuesta.status).toBe(422);
    expect(contarSolicitudes(db)).toBe(0);
    expect(push.mensajes).toHaveLength(0);
    expect(respuesta.text).toContain('ya no está disponible');
  });

  it('HU-02 · Muestra el formulario con el perfil verificado y las fechas válidas', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDisponible(db);
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app).get(
      `/solicitudes/nueva?habitacionId=${habitacion.id}`,
    );

    expect(respuesta.status).toBe(200);
    expect(respuesta.text).toContain('Solicitar reserva');
    expect(respuesta.text).toContain('Correo institucional verificado');
    expect(respuesta.text).toContain('Enviar solicitud');
  });

  it('HU-02 · Responde 404 cuando la habitación no existe', async () => {
    const { db, push } = prepararBase();
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app).get('/solicitudes/nueva?habitacionId=999999');

    expect(respuesta.status).toBe(404);
    expect(respuesta.text).toContain('Habitación no encontrada');
  });

  it('HU-02 · La siembra es idempotente y fija el rango de admisión del semestre', () => {
    const db = abrirBaseDeDatos(':memory:');
    sembrarDatos(db);
    sembrarDatos(db);

    const personas = db.prepare('SELECT COUNT(*) AS total FROM persona').get() as Conteo;
    const habitaciones = db.prepare('SELECT COUNT(*) AS total FROM habitacion').get() as Conteo;
    // Perfiles de demostración: estudiante (HU-02) y dueño de ↑
    expect(personas.total).toBe(2);
    expect(habitaciones.total).toBe(17);

    const rangos = db
      .prepare(
        `SELECT COUNT(DISTINCT fecha_inicio_admision) AS inicios,
                COUNT(DISTINCT fecha_fin_admision) AS fines
           FROM habitacion`,
      )
      .get() as { inicios: number; fines: number };
    expect(rangos.inicios).toBe(1);
    expect(rangos.fines).toBe(1);

    db.close();
  });
});
