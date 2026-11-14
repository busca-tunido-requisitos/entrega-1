import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type Database from 'better-sqlite3';
import { formatearFecha, formatearPrecio } from '../dominio/formato';
import {
  actualizarEstadoHabitacion,
  actualizarFirmaFicha,
  buscarFichaPorCodigo,
  obtenerFichaDeSolicitud,
} from '../dominio/repositorio-resoluciones';
import { buscarSolicitudPorCodigo, type DetalleSolicitud } from '../dominio/repositorio-solicitudes';
import type { FichaReserva } from '../dominio/tipos';
import { firmarFicha, verificarFirma } from './firma';

/**
 * HU-04 · CU-04 — Obtener comprobante (ACT-TOBE-10).
 * La ficha se emite en PDF real con un código QR firmado digitalmente
 * (Ed25519), verificable sin conexión a internet.
 */

/** Fecha de fin del arriendo: fecha de ingreso + duración en meses. */
export function calcularFechaFin(fechaIso: string, meses: number): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);
  if (!partes) return fechaIso;

  const anio = Number(partes[1]);
  const mes = Number(partes[2]) - 1;
  const dia = Number(partes[3]);
  const fecha = new Date(anio, mes + meses, dia);
  const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

/**
 * Contenido firmado del comprobante. Si la ficha ya tiene firma, se reutiliza
 * (las descargas posteriores no vuelven a firmarla).
 */
export function contenidoFirmado(
  db: Database.Database,
  detalle: DetalleSolicitud,
  ficha: FichaReserva,
): string {
  if (ficha.codigoQRFirmado.startsWith('BTN1|')) return ficha.codigoQRFirmado;

  const contenido = firmarFicha({
    codigoReserva: ficha.codigoReserva,
    idEstudiante: detalle.persona.id,
    direccion: detalle.pension.direccion,
    fechaInicio: detalle.solicitud.fechaLlegadaEstimada,
    fechaFin: calcularFechaFin(
      detalle.solicitud.fechaLlegadaEstimada,
      detalle.solicitud.duracionEstadiaMeses,
    ),
  });

  actualizarFirmaFicha(db, detalle.solicitud.id, contenido);
  return contenido;
}

/** Genera el PDF de la ficha oficial de reserva. */
export async function generarFichaPdf(
  db: Database.Database,
  detalle: DetalleSolicitud,
): Promise<Buffer> {
  const ficha = obtenerFichaDeSolicitud(db, detalle.solicitud.id);
  if (!ficha) throw new Error('La solicitud no tiene ficha de reserva emitida.');

  const contenido = contenidoFirmado(db, detalle, ficha);
  const qrPng = await QRCode.toBuffer(contenido, {
    width: 640,
    margin: 1,
    errorCorrectionLevel: 'M',
  });

  const fechaFin = calcularFechaFin(
    detalle.solicitud.fechaLlegadaEstimada,
    detalle.solicitud.duracionEstadiaMeses,
  );

  return new Promise<Buffer>((resolve, reject) => {
    const documento = new PDFDocument({ size: 'A4', margin: 50 });
    const trozos: Buffer[] = [];

    documento.on('data', (trozo: Buffer) => trozos.push(trozo));
    documento.on('end', () => resolve(Buffer.concat(trozos)));
    documento.on('error', reject);

    documento.fontSize(20).text('Ficha oficial de reserva');
    documento
      .fontSize(10)
      .fillColor('#4b5f75')
      .text(`BuscaTuNido · ${ficha.codigoReserva} · emitida el ${formatearFechaHoraLocal(ficha.fechaEmision)}`);
    documento.moveDown(1);

    documento.fillColor('#16324f').fontSize(12).text('Estudiante');
    documento.fontSize(10).text(detalle.persona.nombreCompleto);
    documento.text(detalle.persona.correoInstitucional);
    if (detalle.persona.universidad) {
      documento.text(
        `${detalle.persona.universidad}${detalle.persona.carrera ? ` · ${detalle.persona.carrera}` : ''}`,
      );
    }
    documento.moveDown(0.8);

    documento.fontSize(12).text('Inmueble y arriendo');
    documento.fontSize(10).text(detalle.pension.nombreComercial);
    documento.text(`${detalle.pension.direccion}, ${detalle.pension.comuna}`);
    documento.text(
      `Habitación ${detalle.habitacion.identificadorHabitacion} · ${detalle.habitacion.tipoCama} · ` +
        `${detalle.habitacion.tieneBanoPrivado ? 'baño privado' : 'baño compartido'}`,
    );
    documento.text(`Precio mensual: ${formatearPrecio(detalle.habitacion.precioMensual)}`);
    documento.text(
      `Ingreso: ${formatearFecha(detalle.solicitud.fechaLlegadaEstimada)} · ` +
        `Duración: ${detalle.solicitud.duracionEstadiaMeses} mes(es) · Fin: ${formatearFecha(fechaFin)}`,
    );
    documento.moveDown(0.8);

    documento.fontSize(12).text('Código de verificación');
    documento
      .fontSize(8)
      .text('Escanee este código en la aplicación del dueño para registrar la llegada, incluso sin conexión a internet.');

    documento.image(qrPng, { fit: [190, 190], align: 'center' });
    documento.moveDown(0.5);

    documento
      .fontSize(7)
      .fillColor('#4b5f75')
      .text('Contenido firmado (BTN1):')
      .text(contenido, { width: 480 });

    documento.end();
  });
}

function formatearFechaHoraLocal(fechaHora: string): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(fechaHora);
  if (!partes) return fechaHora;
  return `${partes[3]}/${partes[2]}/${partes[1]} ${partes[4]}:${partes[5]}`;
}

export interface ResultadoLlegada {
  ok: boolean;
  mensaje: string;
  habitacionId?: number;
  estadoHabitacion?: string;
}

/**
 * Verifica el contenido firmado del QR y registra el ingreso: la habitación
 * pasa de `Reservada` a `Ocupada` (`EST-02`). Si la verificación falla, la
 * habitación permanece `Reservada`.
 */
export function registrarLlegada(
  db: Database.Database,
  contenido: string,
): ResultadoLlegada {
  const verificacion = verificarFirma(contenido);

  if (!verificacion.valido) {
    return { ok: false, mensaje: verificacion.motivo ?? 'La verificación del QR falló.' };
  }

  const ficha = buscarFichaPorCodigo(db, verificacion.codigoReserva ?? '');
  if (!ficha) {
    return { ok: false, mensaje: 'La ficha no corresponde a ninguna reserva del sistema.' };
  }

  const detalle = buscarSolicitudPorCodigo(
    db,
    (db.prepare('SELECT codigo_solicitud FROM solicitud_reserva WHERE id = ?').get(ficha.solicitudId) as {
      codigo_solicitud: string;
    }).codigo_solicitud,
  );

  if (!detalle) {
    return { ok: false, mensaje: 'La reserva asociada a la ficha no existe.' };
  }

  if (detalle.solicitud.estado !== 'Aprobada') {
    return {
      ok: false,
      mensaje: 'La reserva no está aprobada, por lo que no se puede registrar la llegada.',
    };
  }

  if (detalle.habitacion.estadoDisponibilidad !== 'Reservada') {
    return {
      ok: false,
      mensaje:
        `La habitación ${detalle.habitacion.identificadorHabitacion} está en estado ` +
        `«${detalle.habitacion.estadoDisponibilidad}»: el ingreso ya fue registrado o el cupo no está reservado.`,
      habitacionId: detalle.habitacion.id,
      estadoHabitacion: detalle.habitacion.estadoDisponibilidad,
    };
  }

  actualizarEstadoHabitacion(db, detalle.habitacion.id, 'Ocupada');

  return {
    ok: true,
    mensaje:
      `Reserva verificada: ${detalle.persona.nombreCompleto} llegó a ` +
      `${detalle.pension.nombreComercial}, habitación ${detalle.habitacion.identificadorHabitacion}.`,
    habitacionId: detalle.habitacion.id,
    estadoHabitacion: 'Ocupada',
  };
}
