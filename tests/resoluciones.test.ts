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
  precio_mensual: number;
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

/** Habitación disponible del centro de Valparaíso (con alternativas en el sector). */
function habitacionDePrueba(db: Database.Database): FilaHabitacion {
  const fila = db
    .prepare(
      `SELECT h.id, h.identificador_habitacion, h.precio_mensual,
              h.fecha_inicio_admision, h.fecha_fin_admision
         FROM habitacion h
         JOIN pension p ON p.id = h.pension_id
        WHERE h.estado_disponibilidad = 'Disponible'
          AND p.comuna = 'Valparaíso'
        ORDER BY h.precio_mensual DESC
        LIMIT 1`,
    )
    .get() as FilaHabitacion;
  return fila;
}

async function crearSolicitudPendiente(
  app: ReturnType<typeof crearApp>,
  habitacion: FilaHabitacion,
): Promise<string> {
  const respuesta = await request(app)
    .post('/solicitudes')
    .type('form')
    .send({
      habitacionId: habitacion.id,
      fechaLlegada: habitacion.fecha_inicio_admision,
      duracionMeses: 3,
      mensajePresentacion: 'Soy estudiante foráneo y me interesa esta habitación.',
    });

  expect(respuesta.status).toBe(303);
  return String(respuesta.headers.location).replace('/solicitudes/', '');
}

describe('HU-03 · Resolución de postulaciones de reserva', () => {
  it('HU-03 · Aprobación de postulación con cupo disponible', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    const respuesta = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});

    expect(respuesta.status).toBe(303);
    expect(respuesta.headers.location).toBe('/bandeja?aviso=aprobada');

    // La solicitud queda Aprobada y la habitación queda Reservada (EST-01 / EST-02).
    const solicitud = db
      .prepare('SELECT estado, motivo_rechazo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; motivo_rechazo: string | null };
    expect(solicitud.estado).toBe('Aprobada');
    expect(solicitud.motivo_rechazo).toBeNull();

    const habitacionDespues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habitacionDespues.estado_disponibilidad).toBe('Reservada');

    // Se emite la ficha de reserva con su código.
    const ficha = db
      .prepare('SELECT codigo_reserva, estado_ficha FROM ficha_reserva')
      .all() as { codigo_reserva: string; estado_ficha: string }[];
    expect(ficha).toHaveLength(1);
    expect(ficha[0].codigo_reserva).toBe(`RES-${codigo}`);
    expect(ficha[0].estado_ficha).toBe('Emitida');

    // Se notifica al postulante con el código de reserva.
    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Reserva aprobada');
    expect(notificaciones).toHaveLength(1);
    expect(notificaciones[0].cuerpo).toContain(ficha[0].codigo_reserva);

    // La habitación bloqueada deja de ofrecerse en el catálogo.
    const catalogo = await request(app).get('/catalogo?sede=1&precioMin=0&precioMax=999999&radioKm=20');
    expect(catalogo.status).toBe(200);
    expect(catalogo.text).not.toContain(habitacion.identificador_habitacion);
  });

  it('HU-03 · Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    const respuesta = await request(app)
      .post(`/bandeja/${codigo}/rechazar`)
      .type('form')
      .send({ motivo: 'Las fechas coinciden con un compromiso previo.' });

    expect(respuesta.status).toBe(303);
    expect(respuesta.headers.location).toBe('/bandeja?aviso=rechazada');

    // La solicitud queda Rechazada con su motivo.
    const solicitud = db
      .prepare('SELECT estado, motivo_rechazo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; motivo_rechazo: string | null };
    expect(solicitud.estado).toBe('Rechazada');
    expect(solicitud.motivo_rechazo).toBe('Las fechas coinciden con un compromiso previo.');

    // La habitación se mantiene disponible para otros postulantes.
    const habitacionDespues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habitacionDespues.estado_disponibilidad).toBe('Disponible');

    // Se notifica el rechazo con el listado de alternativas del mismo sector.
    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Solicitud rechazada');
    expect(notificaciones).toHaveLength(1);
    expect(notificaciones[0].cuerpo).toContain('Las fechas coinciden con un compromiso previo.');
    expect(notificaciones[0].cuerpo).toContain('Alternativas en el mismo sector:');

    const alternativas = db
      .prepare(
        `SELECT pe.nombre_comercial
           FROM habitacion h
           JOIN pension pe ON pe.id = h.pension_id
          WHERE h.estado_disponibilidad = 'Disponible'
            AND h.id <> ?
            AND pe.comuna = (SELECT pe2.comuna
                               FROM habitacion h2
                               JOIN pension pe2 ON pe2.id = h2.pension_id
                              WHERE h2.id = ?)
            AND h.precio_mensual <= (SELECT precio_mensual FROM habitacion WHERE id = ?)`,
      )
      .all(habitacion.id, habitacion.id, habitacion.id) as { nombre_comercial: string }[];

    expect(alternativas.length).toBeGreaterThan(0);
    expect(notificaciones[0].cuerpo).toContain(alternativas[0].nombre_comercial);
  });

  it('HU-03 · No permite aprobar dos veces la misma solicitud', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    const primera = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});
    expect(primera.status).toBe(303);

    const segunda = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});
    expect(segunda.status).toBe(303);
    expect(String(segunda.headers.location)).toContain('aviso=error');

    const solicitud = db
      .prepare('SELECT estado FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string };
    expect(solicitud.estado).toBe('Aprobada');

    const fichas = db.prepare('SELECT COUNT(*) AS total FROM ficha_reserva').get() as Conteo;
    expect(fichas.total).toBe(1);

    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Reserva aprobada');
    expect(notificaciones).toHaveLength(1);
  });

  it('HU-03 · No permite aprobar una solicitud fuera del plazo de 48 horas', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    db.prepare(
      `UPDATE solicitud_reserva SET fecha_envio = datetime('now', '-3 days') WHERE codigo_solicitud = ?`,
    ).run(codigo);

    const respuesta = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});
    expect(respuesta.status).toBe(303);
    expect(String(respuesta.headers.location)).toContain('aviso=error');

    const solicitud = db
      .prepare('SELECT estado FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string };
    expect(solicitud.estado).toBe('En revisión');

    const habitacionDespues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habitacionDespues.estado_disponibilidad).toBe('Disponible');

    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Reserva aprobada');
    expect(notificaciones).toHaveLength(0);
  });

  it('HU-03 · No permite aprobar cuando la habitación ya no está disponible', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    db.prepare("UPDATE habitacion SET estado_disponibilidad = 'Reservada' WHERE id = ?").run(
      habitacion.id,
    );

    const respuesta = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});
    expect(respuesta.status).toBe(303);
    expect(String(respuesta.headers.location)).toContain('aviso=error');

    const solicitud = db
      .prepare('SELECT estado FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string };
    expect(solicitud.estado).toBe('En revisión');

    const fichas = db.prepare('SELECT COUNT(*) AS total FROM ficha_reserva').get() as Conteo;
    expect(fichas.total).toBe(0);
  });

  it('HU-03 · No permite rechazar sin motivo de incompatibilidad', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    const respuesta = await request(app)
      .post(`/bandeja/${codigo}/rechazar`)
      .type('form')
      .send({ motivo: '   ' });

    expect(respuesta.status).toBe(303);
    expect(String(respuesta.headers.location)).toContain('aviso=error');

    const solicitud = db
      .prepare('SELECT estado, motivo_rechazo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; motivo_rechazo: string | null };
    expect(solicitud.estado).toBe('En revisión');
    expect(solicitud.motivo_rechazo).toBeNull();

    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Solicitud rechazada');
    expect(notificaciones).toHaveLength(0);
  });

  it('HU-03 · Muestra en la bandeja el resumen del postulante', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    await crearSolicitudPendiente(app, habitacion);

    const respuesta = await request(app).get('/bandeja');

    expect(respuesta.status).toBe(200);
    expect(respuesta.text).toContain('Camila Rojas Fuentes');
    expect(respuesta.text).toContain('Ingeniería Civil Informática');
    expect(respuesta.text).toContain('Universidad de Valparaíso');
    expect(respuesta.text).toContain(habitacion.identificador_habitacion);
  });

  it('HU-03 · Expira las postulaciones que superaron las 48 horas al abrir la bandeja', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudPendiente(app, habitacion);

    db.prepare(
      `UPDATE solicitud_reserva SET fecha_envio = datetime('now', '-3 days') WHERE codigo_solicitud = ?`,
    ).run(codigo);

    const respuesta = await request(app).get('/bandeja');
    expect(respuesta.status).toBe(200);

    const solicitud = db
      .prepare('SELECT estado FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string };
    expect(solicitud.estado).toBe('Expirada');

    const notificaciones = push.mensajes.filter((m) => m.titulo === 'Solicitud expirada');
    expect(notificaciones).toHaveLength(1);

    // Ya no figura entre las pendientes.
    expect(respuesta.text).not.toContain('Revisar y resolver');
  });
});
