import { crearApp } from './app';
import { abrirBaseDeDatos } from './db/conexion';
import { sembrarDatos } from './db/seed';

const PUERTO = Number(process.env.PORT ?? 3000);
const db = abrirBaseDeDatos();

const totalSedes = db.prepare('SELECT COUNT(*) AS total FROM universidad').get() as {
  total: number;
};

if (totalSedes.total === 0) {
  sembrarDatos(db);
  console.log('Base vacía: se cargaron los datos de ejemplo de la Región de Valparaíso.');
}

const app = crearApp(db);

app.listen(PUERTO, () => {
  console.log(`BuscaTuNido en http://localhost:${PUERTO}/catalogo`);
});
