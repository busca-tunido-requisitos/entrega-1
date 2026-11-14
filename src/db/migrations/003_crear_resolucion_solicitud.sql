-- HU-03 · Resolución de la postulación (ACT-TOBE-05 a ACT-TOBE-09)
-- Tablas derivadas del modelo de dominio DOM-01: FichaReserva.
-- `motivo_rechazo` completa SolicitudReserva (supuesto 6) y `persona_dueno_id`
-- materializa la asociación `administra Persona – Pension`.

CREATE TABLE IF NOT EXISTS ficha_reserva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitud_id INTEGER NOT NULL UNIQUE REFERENCES solicitud_reserva(id),
  codigo_reserva TEXT NOT NULL UNIQUE,
  fecha_emision TEXT NOT NULL,
  codigo_qr_firmado TEXT NOT NULL,
  estado_ficha TEXT NOT NULL DEFAULT 'Emitida'
    CHECK (estado_ficha IN ('Emitida', 'Anulada'))
);

-- El motivo de incompatibilidad solo se informa cuando la solicitud se rechaza.
ALTER TABLE solicitud_reserva ADD COLUMN motivo_rechazo TEXT;

-- La seeker de la asociación `administra`: cada pensión tiene un arrendador
-- responsable; puede quedar NULL en las filas sembradas antes de HU-03.
ALTER TABLE pension ADD COLUMN persona_dueno_id INTEGER REFERENCES persona(id);

CREATE INDEX IF NOT EXISTS idx_ficha_solicitud
  ON ficha_reserva (solicitud_id);

CREATE INDEX IF NOT EXISTS idx_pension_dueno
  ON pension (persona_dueno_id);
