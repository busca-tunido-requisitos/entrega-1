import { describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { crearApp } from '../src/app';
import { abrirBaseDeDatos } from '../src/db/conexion';
import { sembrarDatos } from '../src/db/seed';
import type { MensajePush, ServicioPush } from '../src/servicios/push';

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
}

function prepararBase(): { db: Database.Database; push: ServicioPushEspia } {
  const db = abrirBaseDeDatos(':memory:');
  sembrarDatos(db);
  return { db, push: new ServicioPushEspia() };
}

function habitacionConSubarrendador(db: Database.Database): FilaHabitacion {
  return db
    .prepare(
      `SELECT h.id, h.identificador_habitacion, h.fecha_inicio_admision
         FROM habitacion h
         JOIN pension pe ON pe.id = h.pension_id
        WHERE h.estado_disponibilidad = 'Disponible'
          AND pe.persona_subarrendador_id IS NOT NULL
        ORDER BY h.id
        LIMIT 1`,
    )
    .get() as FilaHabitacion;
}

async function crearSolicitudEnSubarriendo(
  app: ReturnType<typeof crearApp>,
  habitacion: FilaHabitacion,
): Promise<string> {
  const respuesta = await request(app)
    .post('/solicitudes')
    .type('form')
    .send({
      habitacionId: habitacion.id,
      fechaLlegada: habitacion.fecha_inicio_admision,
      duracionMeses: 4,
      mensajePresentacion: 'Postulación para habitación administrada con subarrendador.',
    });

  expect(respuesta.status).toBe(303);
  return String(respuesta.headers.location).replace('/solicitudes/', '');
}

describe('HU-05 · Permisos de subarrendador', () => {
  it('HU-05 · Doble aprobación exitosa por subarrendador y dueño', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionConSubarrendador(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudEnSubarriendo(app, habitacion);

    const subBandeja = await request(app).get('/subarriendo');
    expect(subBandeja.status).toBe(200);
    expect(subBandeja.text).toContain(codigo);

    const preAprobacion = await request(app)
      .post(`/subarriendo/${codigo}/pre-aprobar`)
      .type('form')
      .send({});
    expect(preAprobacion.status).toBe(303);
    expect(preAprobacion.headers.location).toBe('/subarriendo?aviso=pre-aprobada');

    const trasPre = db
      .prepare('SELECT estado, acuerdo_subarriendo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; acuerdo_subarriendo: number | null };
    expect(trasPre.estado).toBe('Pendiente confirmación dueño');
    expect(trasPre.acuerdo_subarriendo).toBe(1);

    const pushDueno = push.mensajes.filter((m) => m.titulo === 'Pre-aprobación del subarrendador');
    expect(pushDueno).toHaveLength(1);
    expect(pushDueno[0].destinatario).toBe('dueno@buscatunido.cl');

    const habAntes = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habAntes.estado_disponibilidad).toBe('Disponible');

    const bandejaDueno = await request(app).get('/bandeja');
    expect(bandejaDueno.status).toBe(200);
    expect(bandejaDueno.text).toContain(codigo);

    const confirmacionDueno = await request(app)
      .post(`/bandeja/${codigo}/aprobar`)
      .type('form')
      .send({});
    expect(confirmacionDueno.status).toBe(303);
    expect(confirmacionDueno.headers.location).toBe('/bandeja?aviso=aprobada');

    const trasDueno = db
      .prepare('SELECT estado, acuerdo_subarriendo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; acuerdo_subarriendo: number | null };
    expect(trasDueno.estado).toBe('Confirmada por dueño');
    expect(trasDueno.acuerdo_subarriendo).toBe(1);

    const habDespues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(habDespues.estado_disponibilidad).toBe('Reservada');

    const catalogo = await request(app).get('/catalogo?sede=1&precioMin=0&precioMax=999999&radioKm=20');
    expect(catalogo.status).toBe(200);
    expect(catalogo.text).not.toContain(habitacion.identificador_habitacion);

    const ficha = db
      .prepare(
        `SELECT codigo_reserva, estado_ficha
           FROM ficha_reserva
          WHERE solicitud_id = (SELECT id FROM solicitud_reserva WHERE codigo_solicitud = ?)`,
      )
      .get(codigo) as { codigo_reserva: string; estado_ficha: string } | undefined;
    expect(ficha?.codigo_reserva).toBe(`RES-${codigo}`);
    expect(ficha?.estado_ficha).toBe('Emitida');

    const pdf = await request(app).get(`/solicitudes/${codigo}/ficha.pdf`);
    expect(pdf.status).toBe(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');

    const chat = await request(app).get(`/solicitudes/${codigo}/chat`);
    expect(chat.status).toBe(200);
    expect(chat.text).toContain('Matías Herrera Vidal');
  });

  it('HU-05 · Rechazo de postulación por el subarrendador o por el dueño', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionConSubarrendador(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo1 = await crearSolicitudEnSubarriendo(app, habitacion);
    const rechazoSub = await request(app)
      .post(`/subarriendo/${codigo1}/rechazar`)
      .type('form')
      .send({ motivo: 'Incompatibilidad de horarios de estudio.' });

    expect(rechazoSub.status).toBe(303);
    expect(rechazoSub.headers.location).toBe('/subarriendo?aviso=rechazada');

    const sol1 = db
      .prepare('SELECT estado, acuerdo_subarriendo, motivo_rechazo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo1) as { estado: string; acuerdo_subarriendo: number | null; motivo_rechazo: string };
    expect(sol1.estado).toBe('Rechazada');
    expect(sol1.acuerdo_subarriendo).toBe(0);
    expect(sol1.motivo_rechazo).toBe('Incompatibilidad de horarios de estudio.');

    const hab1 = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(hab1.estado_disponibilidad).toBe('Disponible');

    expect(
      push.mensajes.some((m) => m.titulo === 'Decisión del subarrendador: rechazo'),
    ).toBe(true);
    expect(
      push.mensajes.some(
        (m) =>
          m.titulo === 'Solicitud rechazada' &&
          m.cuerpo.includes('Alternativas en el mismo sector:'),
      ),
    ).toBe(true);

    const codigo2 = await crearSolicitudEnSubarriendo(app, habitacion);
    await request(app).post(`/subarriendo/${codigo2}/pre-aprobar`).type('form').send({});
    const rechazoDueno = await request(app)
      .post(`/bandeja/${codigo2}/rechazar`)
      .type('form')
      .send({ motivo: 'La habitación entra en mantención.' });

    expect(rechazoDueno.status).toBe(303);
    expect(rechazoDueno.headers.location).toBe('/bandeja?aviso=rechazada');

    const sol2 = db
      .prepare('SELECT estado, motivo_rechazo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo2) as { estado: string; motivo_rechazo: string };
    expect(sol2.estado).toBe('Rechazada');
    expect(sol2.motivo_rechazo).toBe('La habitación entra en mantención.');

    const hab2 = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(hab2.estado_disponibilidad).toBe('Disponible');
  });

  it('HU-05 · Restricción de ficha y chat mientras falta confirmación del dueño', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionConSubarrendador(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudEnSubarriendo(app, habitacion);
    await request(app).post(`/subarriendo/${codigo}/pre-aprobar`).type('form').send({});

    const pdf = await request(app).get(`/solicitudes/${codigo}/ficha.pdf`);
    expect(pdf.status).toBe(403);
    expect(pdf.text).toContain('requiere confirmación final del dueño');

    const chat = await request(app).get(`/solicitudes/${codigo}/chat`);
    expect(chat.status).toBe(403);
    expect(chat.text).toContain('requiere confirmación final del dueño');

    const hab = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(hab.estado_disponibilidad).toBe('Disponible');
  });

  it('HU-05 · Rechaza aprobación directa del dueño sin pre-aprobación del subarrendador', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionConSubarrendador(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudEnSubarriendo(app, habitacion);

    const intentoDirecto = await request(app)
      .post(`/bandeja/${codigo}/aprobar`)
      .type('form')
      .send({});

    expect(intentoDirecto.status).toBe(303);
    expect(intentoDirecto.headers.location).toContain('/bandeja?aviso=error');

    const solicitud = db
      .prepare('SELECT estado, acuerdo_subarriendo FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string; acuerdo_subarriendo: number | null };
    expect(solicitud.estado).toBe('En revisión');
    expect(solicitud.acuerdo_subarriendo).toBeNull();

    const hab = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(habitacion.id) as { estado_disponibilidad: string };
    expect(hab.estado_disponibilidad).toBe('Disponible');
  });

  it('HU-05 · Expira solicitudes en Pendiente confirmación dueño tras 48 horas', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionConSubarrendador(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await crearSolicitudEnSubarriendo(app, habitacion);
    await request(app).post(`/subarriendo/${codigo}/pre-aprobar`).type('form').send({});

    db.prepare(
      `UPDATE solicitud_reserva
          SET fecha_envio = datetime('now', '-49 hours', 'localtime')
        WHERE codigo_solicitud = ?`,
    ).run(codigo);

    const bandeja = await request(app).get('/bandeja');
    expect(bandeja.status).toBe(200);

    const solicitud = db
      .prepare('SELECT estado FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as { estado: string };
    expect(solicitud.estado).toBe('Expirada');
  });
});
