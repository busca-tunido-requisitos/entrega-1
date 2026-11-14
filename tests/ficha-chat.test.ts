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

interface FilaSolicitud {
  id: number;
  codigo_solicitud: string;
  estado: string;
  habitacion_id: number;
}

interface Conteo {
  total: number;
}

function prepararBase(): { db: Database.Database; push: ServicioPushEspia } {
  const db = abrirBaseDeDatos(':memory:');
  sembrarDatos(db);
  return { db, push: new ServicioPushEspia() };
}

function habitacionDePrueba(db: Database.Database): FilaHabitacion {
  const fila = db
    .prepare(
      `SELECT id, identificador_habitacion, fecha_inicio_admision
         FROM habitacion
        WHERE estado_disponibilidad = 'Disponible'
        ORDER BY id
        LIMIT 1`,
    )
    .get() as FilaHabitacion;
  return fila;
}

/** Crea una postulación y devuelve su código. */
async function postular(
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
      mensajePresentacion: 'Solicitud de prueba para la ficha y el chat.',
    });

  expect(respuesta.status).toBe(303);
  return String(respuesta.headers.location).replace('/solicitudes/', '');
}

/** Crea una postulación ya aprobada por el dueño. */
async function postularYAprobar(
  app: ReturnType<typeof crearApp>,
  habitacion: FilaHabitacion,
): Promise<string> {
  const codigo = await postular(app, habitacion);

  const aprobacion = await request(app).post(`/bandeja/${codigo}/aprobar`).type('form').send({});
  expect(aprobacion.status).toBe(303);

  return codigo;
}

describe('HU-04 · Ficha oficial en PDF y chat de coordinación', () => {
  it('HU-04 · Emisión de ficha oficial con código criptográfico verificable', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await postularYAprobar(app, habitacion);

    // El sistema emite la ficha en PDF con los datos del inmueble y el arriendo.
    const pdf = await request(app).get(`/solicitudes/${codigo}/ficha.pdf`);

    expect(pdf.status).toBe(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');
    expect(pdf.headers['content-disposition']).toContain(`RES-${codigo}.pdf`);

    const cuerpo = pdf.body as Buffer;
    expect(cuerpo.length).toBeGreaterThan(1000);
    expect(cuerpo.subarray(0, 4).toString('utf8')).toBe('%PDF');

    // La ficha incorpora un código QR firmado digitalmente.
    const ficha = db
      .prepare('SELECT codigo_qr_firmado FROM ficha_reserva WHERE solicitud_id = (SELECT id FROM solicitud_reserva WHERE codigo_solicitud = ?)')
      .get(codigo) as { codigo_qr_firmado: string };

    expect(ficha.codigo_qr_firmado.startsWith('BTN1|')).toBe(true);
    expect(ficha.codigo_qr_firmado).toContain(`RES-${codigo}`);
    expect(ficha.codigo_qr_firmado.split('|').length).toBeGreaterThanOrEqual(7);

    // Se habilita el canal de chat entre estudiante y arrendador.
    const chat = await request(app).get(`/solicitudes/${codigo}/chat`);
    expect(chat.status).toBe(200);
    expect(chat.text).toContain('Camila Rojas Fuentes');
    expect(chat.text).toContain('Rodrigo Pérez Soto');

    const participantes = db
      .prepare(
        `SELECT p.nombre_completo
           FROM persona p
          WHERE p.id IN (SELECT persona_id FROM solicitud_reserva WHERE codigo_solicitud = ?)
             OR p.id IN (SELECT persona_dueno_id FROM pension)`,
      )
      .all(codigo) as { nombre_completo: string }[];

    const postulante = participantes[0];
    const enviar = await request(app)
      .post(`/solicitudes/${codigo}/chat`)
      .type('form')
      .send({ personaId: postulante ? 1 : 1, texto: '¿Puedo llegar el lunes a las 10?' });

    expect(enviar.status).toBe(303);

    const mensajes = db
      .prepare('SELECT contenido_texto FROM mensaje_chat WHERE solicitud_id = (SELECT id FROM solicitud_reserva WHERE codigo_solicitud = ?)')
      .all(codigo) as { contenido_texto: string }[];

    expect(mensajes).toHaveLength(1);
    expect(mensajes[0].contenido_texto).toBe('¿Puedo llegar el lunes a las 10?');

    // El sondeo entrega los mensajes por JSON.
    const sondeo = await request(app).get(`/solicitudes/${codigo}/chat/mensajes?desde=0`);
    expect(sondeo.status).toBe(200);
    expect(sondeo.body.mensajes).toHaveLength(1);
    expect(sondeo.body.mensajes[0].contenidoTexto).toBe('¿Puedo llegar el lunes a las 10?');
  });

  it('HU-04 · Intento de acceso al canal de chat sin contar con reserva aprobada', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await postular(app, habitacion);

    const chat = await request(app).get(`/solicitudes/${codigo}/chat`);
    expect(chat.status).toBe(403);
    expect(chat.text).toContain(
      'El chat se habilita exclusivamente una vez confirmada y aprobada la reserva',
    );

    const envio = await request(app)
      .post(`/solicitudes/${codigo}/chat`)
      .type('form')
      .send({ personaId: 1, texto: 'Mensaje que no debe guardarse.' });

    expect(envio.status).toBe(403);

    const mensajes = db.prepare('SELECT COUNT(*) AS total FROM mensaje_chat').get() as Conteo;
    expect(mensajes.total).toBe(0);

    // Tampoco se puede descargar la ficha mientras la reserva no esté aprobada.
    const pdf = await request(app).get(`/solicitudes/${codigo}/ficha.pdf`);
    expect(pdf.status).toBe(403);
  });

  it('HU-04 · Verifica el QR firmado y registra el ingreso del estudiante', async () => {
    const { db, push } = prepararBase();
    const habitacion = habitacionDePrueba(db);
    const app = crearApp(db, { servicioPush: push });

    const codigo = await postularYAprobar(app, habitacion);

    const solicitud = db
      .prepare('SELECT id, codigo_solicitud, estado, habitacion_id FROM solicitud_reserva WHERE codigo_solicitud = ?')
      .get(codigo) as FilaSolicitud;
    expect(solicitud.estado).toBe('Aprobada');

    // Genera la ficha para obtener el contenido firmado.
    await request(app).get(`/solicitudes/${codigo}/ficha.pdf`);

    const ficha = db
      .prepare('SELECT codigo_qr_firmado FROM ficha_reserva WHERE solicitud_id = ?')
      .get(solicitud.id) as { codigo_qr_firmado: string };
    const contenido = ficha.codigo_qr_firmado;

    // Un contenido manipulado se rechaza y la habitación sigue Reservada.
    const manipulado = contenido.slice(0, -3) + 'AAA';
    const rechazo = await request(app)
      .post('/verificar/llegada')
      .type('form')
      .send({ contenido: manipulado });

    expect(rechazo.status).toBe(400);
    expect(rechazo.text).toContain('firma digital no es válida');

    const antes = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(solicitud.habitacion_id) as { estado_disponibilidad: string };
    expect(antes.estado_disponibilidad).toBe('Reservada');

    // Con el QR válido la llegada se registra y la habitación queda Ocupada.
    const aceptacion = await request(app)
      .post('/verificar/llegada')
      .type('form')
      .send({ contenido });

    expect(aceptacion.status).toBe(200);
    expect(aceptacion.text).toContain('Reserva verificada');

    const despues = db
      .prepare('SELECT estado_disponibilidad FROM habitacion WHERE id = ?')
      .get(solicitud.habitacion_id) as { estado_disponibilidad: string };
    expect(despues.estado_disponibilidad).toBe('Ocupada');
  });

  it('HU-04 · Publica la clave pública para verificar sin conexión', async () => {
    const { db, push } = prepararBase();
    const app = crearApp(db, { servicioPush: push });

    const respuesta = await request(app).get('/api/clave-publica');

    expect(respuesta.status).toBe(200);
    expect(typeof respuesta.body.clavePublica).toBe('string');
    expect(respuesta.body.clavePublica.length).toBeGreaterThan(40);
  });
});
