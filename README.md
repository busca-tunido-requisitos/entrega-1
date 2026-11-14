# BuscaTuNido — catálogo de pensiones universitarias

> Plataforma colaborativa para la búsqueda, gestión y reserva transparente de pensiones universitarias en Chile.

Aplicación web del taller CIN 324 generada a partir de la documentación de requisitos. Implementa las cuatro historias de usuario del proyecto:

| Historia | Qué permite | Caso de uso |
|----------|-------------|-------------|
| **HU-01** | Catálogo filtrable por sede, precio y normas, con mapa y orden por cercanía | CU-01 |
| **HU-02** | Solicitud formal de reserva con plazo de respuesta de 48 h | CU-02 |
| **HU-03** | Bandeja del dueño: aprobar o rechazar la postulación y bloquear el cupo | CU-03 |
| **HU-04** | Ficha oficial en **PDF con QR firmado digitalmente** y **chat** de coordinación | CU-04, CU-05 |

## Documentación del proyecto

- Documento maestro de la Entrega 1: [`IngReq-Entrega 1.md`](./IngReq-Entrega%201.md)
- Documento maestro de la Entrega 2: [`IngReq-Entrega 2.md`](./IngReq-Entrega%202.md)
- Proceso AS-IS (`01-proceso-as-is.md`), rediseño TO-BE (`02-rediseno-to-be.md`), requisitos (`03-requisitos.md`), historias (`04-historias-usuario.md`), elicitación (`05-elicitacion.md`) y atributos de calidad (`06-atributos-calidad.md`).
- Criterios Gherkin (`07-criterios-aceptacion.md`), modelo de dominio (`08-modelo-dominio.md`), casos de uso (`09-casos-de-uso.md`), secuencia (`10-diagramas-secuencia.md`), estado (`11-diagramas-estado.md`) y trazabilidad (`12-trazabilidad.md`).
- Diagramas y fuentes: `diagramas/` y `assets/`.

## Requisitos

- Node.js 22 o superior (probado con Node 22)
- npm
- Internet **solo** para las teselas del mapa: el catálogo, la ficha en PDF, el QR y el chat funcionan sin conexión

## Puesta en marcha

```bash
# 1. Instala las dependencias (Express, EJS, better-sqlite3, pdfkit, qrcode, Vitest)
npm install

# 2. Crea data/app.db, aplica las migraciones y carga los datos de ejemplo
#    (6 sedes, 8 pensiones, 17 habitaciones, estudiante y dueño de demostración)
npm run db:seed

# 3. Arranca la aplicación en modo desarrollo con recarga automática
#    Abre http://localhost:3000/catalogo (http://localhost:3000 redirige al catálogo)
npm run dev

# 4. Ejecuta las pruebas automáticas (una por cada escenario Gherkin)
npm test

# 5. Compila el TypeScript a dist/ (opcional; no es necesario para npm run dev)
npm run build

# 6. Arranca la aplicación sin recarga automática (alternativa a npm run dev)
npm start
```

> **En equipos sin herramientas de compilación** (Visual Studio Build Tools), `better-sqlite3` no
> puede recompilarse. Instala las dependencias con `npm ci --ignore-scripts`: el paquete trae su
> binario precompilado y funciona igual.

Si `data/app.db` no existe, al arrancar la aplicación se siembra automáticamente. Para reiniciar los datos, borra `data/app.db` y ejecuta de nuevo `npm run db:seed`.

## Pruebas automáticas

```bash
npm test
```

Hay una prueba de integración por cada escenario Gherkin de las cuatro historias:

- `HU-01 · Filtrado exitoso de pensiones por sede universitaria y rango de precio`
- `HU-01 · Búsqueda sin coincidencias por restricciones excesivas de convivencia`
- `HU-02 · Envío exitoso de solicitud formal con antecedentes completos`
- `HU-02 · Intento de postulación con fecha de ingreso fuera del periodo lectivo`
- `HU-03 · Aprobación de postulación con cupo disponible`
- `HU-03 · Rechazo de postulación por incompatibilidad de fechas y sugerencia de alternativas`
- `HU-04 · Emisión de ficha oficial con código criptográfico verificable`
- `HU-04 · Intento de acceso al canal de chat sin contar con reserva aprobada`

## Recorrido manual de los escenarios

### HU-01 · Catálogo

1. Abre http://localhost:3000/catalogo.
2. Deja la sede **Universidad de Valparaíso** y el radio en **2 km**.
3. Escribe `150000` en «Precio mínimo» y `250000` en «Precio máximo».
4. Deben aparecer cuatro pensiones, en orden por cercanía: **Los Aromos** (~355 m), **Brasil** (~900 m), **Playa Ancha** (~1,1 km) y **Cerro Alegre** (~1,8 km).
5. El mapa muestra un marcador por cada pensión dentro del círculo, y la lista se actualiza sin recargar al cambiar los filtros.
6. Sin coincidencias (sede **Universidad Técnica Federico Santa María**, radio **2 km**, **«Permite mascotas»**): el catálogo avisa que no encontró habitaciones y sugiere ampliar el radio o flexibilizar las normas.

### HU-02 · Solicitud formal

1. En el catálogo, elige una habitación y pulsa **«Solicitar reserva»**.
2. El formulario muestra la pensión, la habitación, el período de admisión y el perfil **Camila Rojas** con la insignia «Correo institucional verificado».
3. Escribe una fecha dentro del período, una duración de 1 a 12 meses y un mensaje, y pulsa **«Enviar solicitud»**.
4. Se muestra la confirmación con el código `SOL-<año>-<secuencial>` y el plazo de 48 horas; en la base de datos la solicitud queda en estado **En revisión**.
5. Con una fecha fuera del período (por ejemplo `2027-01-15`) el envío se bloquea y aparecen las fechas válidas.

### HU-03 · Bandeja del dueño

1. En la cabecera del catálogo, entra a **«Bandeja del dueño»**.
2. La bandeja lista las postulaciones pendientes con el resumen del postulante (nombre, carrera, universidad, fechas, habitación y mensaje).
3. **Aprobar**: la solicitud queda `Aprobada`, la habitación `Reservada` y desaparece del catálogo; el estudiante recibe la notificación con el código de reserva `RES-<código>`.
4. **Rechazar**: se exige un motivo; la solicitud queda `Rechazada` con ese motivo, la habitación sigue disponible y el estudiante recibe la notificación con una lista de alternativas del mismo sector.

### HU-04 · Ficha PDF y chat

1. Con la reserva **aprobada**, abre http://localhost:3000/solicitudes/SOL-2026-0001 y pulsa **«Descargar ficha oficial en PDF»**: se descarga `RES-SOL-2026-0001.pdf` con los datos del inmueble y el arriendo y el **código QR firmado**.
2. Pulsa **«Abrir chat de coordinación»**: la sala muestra al estudiante y al dueño; envía un mensaje como cada uno y comprueba que aparece en el otro lado (se actualiza solo cada 3 segundos).
3. Como dueño, entra en **«Registrar llegada (escanear QR)»** (http://localhost:3000/verificar): escanea el QR con la cámara —o pega su contenido— y verifica la firma. Con un QR válido la habitación pasa de `Reservada` a `Ocupada`; con un contenido alterado se rechaza y la habitación sigue `Reservada`.
4. Con una postulación **sin aprobar**, el chat responde «El chat se habilita exclusivamente una vez confirmada y aprobada la reserva».

## Datos de ejemplo

| Sede | Comuna |
|------|--------|
| Universidad de Valparaíso | Valparaíso |
| Pontificia Universidad Católica de Valparaíso | Valparaíso |
| Universidad Técnica Federico Santa María | Valparaíso |
| Universidad de Playa Ancha | Valparaíso |
| Universidad de Viña del Mar | Viña del Mar |
| Universidad Adolfo Ibáñez (sede Viña del Mar) | Viña del Mar |

Las pensiones incluyen normas variadas (visitas, mascotas y toque de queda), servicios y habitaciones `Disponible` con distintos precios. Hay al menos una pensión sin mascotas cerca de la USM para reproducir el escenario 2 de HU-01.

Perfiles de demostración (`persona`):

- **Camila Rojas Fuentes** — estudiante postulante, con `correoInstitucionalVerificado`.
- **Rodrigo Pérez Soto** — dueño de las pensiones de ejemplo (asociación `administra`).

## Notas y alcance

- **Sin autenticación real:** el rol y el participante del chat se eligen con selectores de demostración.
- **Integraciones externas:** el mapa usa teselas de OpenStreetMap solo como capa visual; sin internet el mapa queda sin teselas y se muestra un aviso, pero el resto sigue operando. Las notificaciones push se **simulan** (se guardan en la tabla `notificacion`).
- **Firma y QR reales:** el comprobante se firma con **Ed25519** (`node:crypto`), no con un simulador. La clave privada se genera en `data/clave-firma.json` (fuera del repositorio) y la clave pública se publica en `/api/clave-publica` para contrastar la firma sin conexión a internet.
- **Chat real:** los mensajes se guardan en `mensaje_chat` y se actualizan por sondeo; el canal solo existe con la reserva aprobada.
- **Requisitos no funcionales:** RP-09 (mobile-first 48×48) y RP-10 (< 400 ms) se leen como contexto y no se implementan en el taller.
- **Estados:** la habitación pasa de `Disponible` a `Reservada` al aprobar y a `Ocupada` al registrar la llegada con un QR válido. El registro de salida (`Ocupada` → `Disponible`) queda fuera de alcance.

## Estructura

```text
src/
  app.ts                     # aplicación Express (sin escuchar puerto)
  server.ts                  # arranque en el puerto 3000
  db/
    conexion.ts              # SQLite + migraciones en schema_migrations
    migrations/00[1-4]_*.sql # catálogo, solicitudes, resolución y chat
    seed.ts                  # datos de ejemplo idempotentes
  dominio/                   # tipos, distancia (Haversine) y repositorios
  servicios/
    catalogo.ts              # filtros, orden y detección de sin coincidencias
    solicitudes.ts           # postulación y guardas de HU-02
    resoluciones.ts          # aprobación, rechazo y expiración de HU-03
    fichas.ts                # PDF con QR y verificación de llegada
    firma.ts                 # firma digital Ed25519
    chat.ts                  # canal de coordinación de HU-04
    push.ts                  # adaptador de notificaciones push simuladas
  rutas/                     # catálogo, solicitudes, bandeja, chat, fichas y verificación
  vistas/                    # EJS: catálogo, formularios, bandeja, chat y verificación
public/                      # estilos, mapa de Leaflet, chat en vivo y lector de QR
tests/                       # una prueba por escenario Gherkin
```

## Trazabilidad

| Historia | Ficha | Caso de uso | Actividades TO-BE | Cambio de OpenSpec |
|----------|-------|-------------|-------------------|--------------------|
| HU-01 | `.cin324/historias/HU-01.md` | CU-01 | ACT-TOBE-01, ACT-TOBE-02 | `openspec/changes/archive/2026-11-12-hu-01-catalogo-filtros/` |
| HU-02 | `.cin324/historias/HU-02.md` | CU-02 | ACT-TOBE-03, ACT-TOBE-04 | `openspec/changes/archive/2026-11-14-hu-02-solicitud-reserva/` |
| HU-03 | `.cin324/historias/HU-03.md` | CU-03 | ACT-TOBE-05 a ACT-TOBE-09 | `openspec/changes/archive/2026-11-14-hu-03-resolver-solicitud/` |
| HU-04 | `.cin324/historias/HU-04.md` | CU-04, CU-05 | ACT-TOBE-10, ACT-TOBE-11 | `openspec/changes/hu-04-ficha-pdf-y-chat/` |
