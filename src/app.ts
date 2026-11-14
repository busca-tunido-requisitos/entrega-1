import express, { type Express } from 'express';
import path from 'node:path';
import type Database from 'better-sqlite3';
import { rutasBandeja } from './rutas/bandeja';
import { rutasCatalogo } from './rutas/catalogo';
import { rutasChat } from './rutas/chat';
import { rutasFichas } from './rutas/fichas';
import { rutasSolicitudes } from './rutas/solicitudes';
import { rutasVerificacion } from './rutas/verificacion';
import { ServicioPushSqlite, type ServicioPush } from './servicios/push';

export interface OpcionesCrearApp {
  /** Doble de prueba del push simulado; por defecto se usa `ServicioPushSqlite`. */
  servicioPush?: ServicioPush;
}

/** Crea la aplicación Express sin escuchar puerto (para usarla en pruebas). */
export function crearApp(db: Database.Database, opciones: OpcionesCrearApp = {}): Express {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(process.cwd(), 'src', 'vistas'));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/', (_req, res) => {
    res.redirect('/catalogo');
  });

  app.use(rutasCatalogo(db));
  app.use(
    rutasSolicitudes(db, {
      servicioPush: opciones.servicioPush ?? new ServicioPushSqlite(db),
    }),
  );
  app.use(
    rutasBandeja(db, {
      servicioPush: opciones.servicioPush ?? new ServicioPushSqlite(db),
    }),
  );
  app.use(rutasFichas(db));
  app.use(rutasChat(db));
  app.use(rutasVerificacion(db));

  return app;
}
