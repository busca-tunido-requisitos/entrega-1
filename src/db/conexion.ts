import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DIRECTORIO_MIGRACIONES = path.join(process.cwd(), 'src', 'db', 'migrations');

interface FilaMigracion {
  nombre: string;
}

/**
 * Abre SQLite y aplica las migraciones pendientes.
 * En pruebas se usa ':memory:'; en desarrollo, data/app.db.
 */
export function abrirBaseDeDatos(ruta?: string): Database.Database {
  const rutaBase = ruta ?? process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'app.db');

  if (rutaBase !== ':memory:') {
    fs.mkdirSync(path.dirname(rutaBase), { recursive: true });
  }

  const db = new Database(rutaBase);
  db.pragma('foreign_keys = ON');
  aplicarMigraciones(db);
  return db;
}

/** Aplica en orden los .sql pendientes y los registra en schema_migrations. */
export function aplicarMigraciones(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      nombre TEXT PRIMARY KEY,
      aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const aplicadas = new Set(
    (db.prepare('SELECT nombre FROM schema_migrations').all() as FilaMigracion[]).map(
      (fila) => fila.nombre,
    ),
  );

  const archivos = fs
    .readdirSync(DIRECTORIO_MIGRACIONES)
    .filter((archivo) => archivo.endsWith('.sql'))
    .sort();

  const registrar = db.prepare('INSERT INTO schema_migrations (nombre) VALUES (?)');

  for (const archivo of archivos) {
    if (aplicadas.has(archivo)) continue;

    const sql = fs.readFileSync(path.join(DIRECTORIO_MIGRACIONES, archivo), 'utf8');
    const aplicar = db.transaction(() => {
      db.exec(sql);
      registrar.run(archivo);
    });
    aplicar();
  }
}
