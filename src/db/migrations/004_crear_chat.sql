-- HU-04 · Ficha oficial en PDF y chat de coordinación (ACT-TOBE-10 / ACT-TOBE-11)
-- Tabla derivada del modelo de dominio DOM-01: MensajeChat.
-- Asociaciones: `contextualiza` (SolicitudReserva 1 – 0..* MensajeChat)
-- y `envia` (Persona 1 – 0..* MensajeChat).

CREATE TABLE IF NOT EXISTS mensaje_chat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitud_id INTEGER NOT NULL REFERENCES solicitud_reserva(id) ON DELETE CASCADE,
  persona_id INTEGER NOT NULL REFERENCES persona(id),
  contenido_texto TEXT NOT NULL,
  fecha_hora_envio TEXT NOT NULL,
  leido INTEGER NOT NULL DEFAULT 0 CHECK (leido IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_mensaje_solicitud
  ON mensaje_chat (solicitud_id);

CREATE INDEX IF NOT EXISTS idx_mensaje_solicitud_id
  ON mensaje_chat (solicitud_id, id);
