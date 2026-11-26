PRAGMA legacy_alter_table = ON;

ALTER TABLE solicitud_reserva RENAME TO _solicitud_reserva_anterior;

CREATE TABLE solicitud_reserva (
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
    CHECK (
      estado IN (
        'En revisión',
        'Pendiente confirmación dueño',
        'Aprobada',
        'Confirmada por dueño',
        'Rechazada',
        'Expirada'
      )
    ),
  motivo_rechazo TEXT,
  acuerdo_subarriendo INTEGER CHECK (acuerdo_subarriendo IN (0, 1))
);

INSERT INTO solicitud_reserva (
  id,
  codigo_solicitud,
  persona_id,
  habitacion_id,
  fecha_llegada_estimada,
  duracion_estadia_meses,
  mensaje_presentacion,
  fecha_envio,
  estado,
  motivo_rechazo,
  acuerdo_subarriendo
)
SELECT
  id,
  codigo_solicitud,
  persona_id,
  habitacion_id,
  fecha_llegada_estimada,
  duracion_estadia_meses,
  mensaje_presentacion,
  fecha_envio,
  estado,
  motivo_rechazo,
  NULL
FROM _solicitud_reserva_anterior;

DROP TABLE _solicitud_reserva_anterior;

CREATE INDEX IF NOT EXISTS idx_solicitud_persona
  ON solicitud_reserva (persona_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_habitacion
  ON solicitud_reserva (habitacion_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_estado
  ON solicitud_reserva (estado);

ALTER TABLE pension ADD COLUMN persona_subarrendador_id INTEGER REFERENCES persona(id);

CREATE INDEX IF NOT EXISTS idx_pension_subarrendador
  ON pension (persona_subarrendador_id);

PRAGMA legacy_alter_table = OFF;
