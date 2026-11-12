-- HU-01 · Catálogo de pensiones (ACT-TOBE-01 / ACT-TOBE-02)
-- Tablas derivadas del modelo de dominio DOM-01.
-- Las sedes universitarias son un catálogo de datos de ejemplo (no una clase del dominio).

CREATE TABLE IF NOT EXISTS universidad (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  comuna TEXT NOT NULL,
  latitud REAL NOT NULL,
  longitud REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS pension (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_comercial TEXT NOT NULL UNIQUE,
  direccion TEXT NOT NULL,
  comuna TEXT NOT NULL,
  latitud REAL NOT NULL,
  longitud REAL NOT NULL,
  servicios_incluidos TEXT NOT NULL DEFAULT '',
  permite_visitas INTEGER NOT NULL DEFAULT 0 CHECK (permite_visitas IN (0, 1)),
  permite_mascotas INTEGER NOT NULL DEFAULT 0 CHECK (permite_mascotas IN (0, 1)),
  hora_toque_queda TEXT CHECK (
    hora_toque_queda IS NULL
    OR hora_toque_queda GLOB '[0-2][0-9]:[0-5][0-9]'
  )
);

CREATE TABLE IF NOT EXISTS habitacion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pension_id INTEGER NOT NULL REFERENCES pension(id) ON DELETE CASCADE,
  identificador_habitacion TEXT NOT NULL,
  precio_mensual INTEGER NOT NULL CHECK (precio_mensual >= 0),
  tipo_cama TEXT NOT NULL,
  tiene_bano_privado INTEGER NOT NULL DEFAULT 0 CHECK (tiene_bano_privado IN (0, 1)),
  estado_disponibilidad TEXT NOT NULL DEFAULT 'Disponible'
    CHECK (estado_disponibilidad IN ('Disponible', 'Reservada', 'Ocupada')),
  UNIQUE (pension_id, identificador_habitacion)
);

CREATE INDEX IF NOT EXISTS idx_habitacion_estado
  ON habitacion (estado_disponibilidad);
