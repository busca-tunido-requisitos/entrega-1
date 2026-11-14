-- HU-02 · Solicitud formal de reserva (ACT-TOBE-03 / ACT-TOBE-04)
-- Tablas derivadas del modelo de dominio DOM-01: Persona y SolicitudReserva.
-- `notificacion` materializa el ServicioPush simulado; no es una clase del dominio.

CREATE TABLE IF NOT EXISTS persona (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_completo TEXT NOT NULL,
  correo_electronico TEXT NOT NULL,
  telefono TEXT,
  correo_institucional TEXT NOT NULL,
  correo_institucional_verificado INTEGER NOT NULL DEFAULT 0
    CHECK (correo_institucional_verificado IN (0, 1)),
  universidad TEXT,
  carrera TEXT
);

CREATE TABLE IF NOT EXISTS solicitud_reserva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_solicitud TEXT NOT NULL UNIQUE,
  persona_id INTEGER NOT NULL REFERENCES persona(id),
  habitacion_id INTEGER NOT NULL REFERENCES habitacion(id),
  fecha_llegada_estimada TEXT NOT NULL,
  duracion_estadia_meses INTEGER NOT NULL
    CHECK (duracion_estadia_meses BETWEEN 1 AND 12),
  mensaje_presentacion TEXT NOT NULL,
  fecha_envio TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'En revisión'
    CHECK (estado IN ('En revisión', 'Aprobada', 'Rechazada', 'Expirada'))
);

CREATE TABLE IF NOT EXISTS notificacion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitud_id INTEGER NOT NULL REFERENCES solicitud_reserva(id) ON DELETE CASCADE,
  destinatario TEXT NOT NULL,
  titulo TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  creada_en TEXT NOT NULL DEFAULT (datetime('now')),
  leida INTEGER NOT NULL DEFAULT 0 CHECK (leida IN (0, 1))
);

-- El rango de admisión se agrega con ALTER TABLE para no reconstruir la tabla
-- habitacion; los valores por defecto solo existen para las filas ya sembradas
-- y son sobrescritos por `npm run db:seed`.
ALTER TABLE habitacion ADD COLUMN fecha_inicio_admision TEXT NOT NULL DEFAULT '2026-01-01';
ALTER TABLE habitacion ADD COLUMN fecha_fin_admision TEXT NOT NULL DEFAULT '2026-12-31';

CREATE INDEX IF NOT EXISTS idx_solicitud_persona
  ON solicitud_reserva (persona_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_habitacion
  ON solicitud_reserva (habitacion_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_estado
  ON solicitud_reserva (estado);

CREATE INDEX IF NOT EXISTS idx_notificacion_solicitud
  ON notificacion (solicitud_id);
