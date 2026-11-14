import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * HU-04 · Firma digital del comprobante de reserva (RP-DER-01).
 *
 * La firma se hace con Ed25519 usando `node:crypto`: la clave privada del
 * sistema firma el comprobante y la clave pública se distribuye al cliente
 * para verificarla. No interviene ningún servicio externo, de modo que la
 * validación funciona sin conexión a internet.
 */

const RUTA_CLAVE = path.join(process.cwd(), 'data', 'clave-firma.json');
const PREFIJO = 'BTN1';

export interface ClaveFirma {
  privadaPem: string;
  publicaBase64: string;
}

export interface DatosFicha {
  codigoReserva: string;
  idEstudiante: number;
  direccion: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface ResultadoVerificacion {
  valido: boolean;
  payload?: string;
  codigoReserva?: string;
  motivo?: string;
}

/** Lee el par de claves o lo genera la primera vez. */
export function obtenerClaveFirma(): ClaveFirma {
  if (fs.existsSync(RUTA_CLAVE)) {
    return JSON.parse(fs.readFileSync(RUTA_CLAVE, 'utf8')) as ClaveFirma;
  }

  const par = crypto.generateKeyPairSync('ed25519');
  const clave: ClaveFirma = {
    privadaPem: par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
    publicaBase64: par.publicKey.export({ type: 'spki', format: 'der' }).toString('base64'),
  };

  fs.mkdirSync(path.dirname(RUTA_CLAVE), { recursive: true });
  fs.writeFileSync(RUTA_CLAVE, JSON.stringify(clave, null, 2), 'utf8');
  return clave;
}

/** Clave pública (base64) que el cliente usa para contrastar la firma. */
export function clavePublicaBase64(): string {
  return obtenerClaveFirma().publicaBase64;
}

/**
 * Payload firmado: `BTN1|código de reserva|id del estudiante|dirección|
 * fecha de ingreso|fecha de fin|firma`. Son los datos que exige `RP-DER-01`.
 */
export function construirPayload(datos: DatosFicha): string {
  const direccion = datos.direccion.replace(/\|/g, ' ').trim();
  return [
    PREFIJO,
    datos.codigoReserva,
    String(datos.idEstudiante),
    direccion,
    datos.fechaInicio,
    datos.fechaFin,
  ].join('|');
}

/** Firma el payload con la clave privada del sistema. */
export function firmarPayload(payload: string): string {
  const clave = obtenerClaveFirma();
  const privada = crypto.createPrivateKey(clave.privadaPem);
  const firma = crypto.sign(null, Buffer.from(payload, 'utf8'), privada);
  return `${payload}|${firma.toString('base64')}`;
}

/** Firma el comprobante a partir de sus datos. */
export function firmarFicha(datos: DatosFicha): string {
  return firmarPayload(construirPayload(datos));
}

/** Comprueba la firma y devuelve los datos que cubre. */
export function verificarFirma(contenido: string): ResultadoVerificacion {
  const limpio = (contenido ?? '').trim();
  const partes = limpio.split('|');

  if (partes.length < 7) {
    return {
      valido: false,
      motivo: 'El contenido no tiene el formato de un código QR de ficha de reserva.',
    };
  }

  const firma = partes.pop() as string;
  const payload = partes.join('|');

  if (!payload.startsWith(`${PREFIJO}|`)) {
    return {
      valido: false,
      motivo: 'El código QR no corresponde a una ficha de reserva de BuscaTuNido.',
    };
  }

  const clave = obtenerClaveFirma();
  const publica = crypto.createPublicKey({
    key: Buffer.from(clave.publicaBase64, 'base64'),
    format: 'der',
    type: 'spki',
  });

  let firmaValida = false;
  try {
    firmaValida = crypto.verify(
      null,
      Buffer.from(payload, 'utf8'),
      publica,
      Buffer.from(firma, 'base64'),
    );
  } catch {
    firmaValida = false;
  }

  if (!firmaValida) {
    return {
      valido: false,
      motivo: 'La firma digital no es válida: el comprobante fue alterado o está incompleto.',
    };
  }

  const [, codigoReserva] = partes;
  return { valido: true, payload, codigoReserva };
}
