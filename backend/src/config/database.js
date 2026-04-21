const { Sequelize } = require('sequelize');

// En Railway las variables vienen del panel; cargar un .env del repo puede poner
// DB_HOST=localhost y romper la conexión aunque DATABASE_URL esté bien definida.
function isRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_ENVIRONMENT_NAME ||
      process.env.RAILWAY_SERVICE_ID ||
      process.env.RAILWAY_DEPLOYMENT_ID ||
      process.env.RAILWAY_REPLICA_REGION
  );
}

if (!isRailwayRuntime()) {
  require('dotenv').config();
}

function buildSequelize() {
  const rawUrl = process.env.DATABASE_URL;
  const databaseUrl = rawUrl?.trim();

  const onRailway = isRailwayRuntime();
  if (onRailway && !databaseUrl) {
    console.error(
      [
        '❌ DATABASE_URL no llega al contenedor del API en Railway.',
        '',
        'Revisá:',
        '1) La variable está en el servicio del BACKEND (API), no solo en Postgres.',
        '2) Tras guardar Variables, hacé un Redeploy (a veces no aplica hasta redeploy).',
        '3) Si usás referencia ${{ NombreServicio.DATABASE_URL }}: el nombre debe ser EXACTAMENTE el del servicio Postgres en el lienzo (si se llama "PostgreSQL" o "Postgres-xxx", usá ese nombre).',
        '4) Solución segura: abrí el servicio Postgres → Variables → copiá el valor de DATABASE_URL y pegalo en texto plano en el API (sin ${{ }}).',
        '',
        `Diagnóstico: DATABASE_URL definida=${Boolean(rawUrl)}, longitud=${rawUrl?.length ?? 0}`,
      ].join('\n')
    );
    process.exit(1);
  }

  if (
    databaseUrl &&
    (databaseUrl.startsWith('${{') || databaseUrl.includes('${{'))
  ) {
    console.error(
      '❌ DATABASE_URL parece una referencia sin resolver (sigue literal ${{ ... }}). Renombrá la referencia al nombre exacto del servicio Postgres en Railway o pegá la URL en crudo desde Variables del Postgres.'
    );
    process.exit(1);
  }

  if (!databaseUrl && !process.env.DB_HOST) {
    console.error(
      '❌ Falta conexión a PostgreSQL: definí DATABASE_URL o DB_HOST + DB_USER + DB_PASSWORD + DB_NAME (ver backend/.env.example).'
    );
    process.exit(1);
  }

  if (databaseUrl) {
    const useSsl =
      process.env.DATABASE_SSL === 'true' ||
      process.env.PGSSLMODE === 'require';

    return new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      ...(useSsl
        ? {
            dialectOptions: {
              ssl: { require: true, rejectUnauthorized: false },
            },
          }
        : {}),
    });
  }

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

const sequelize = buildSequelize();

sequelize
  .authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch((err) => console.error('❌ Error al conectar a PostgreSQL:', err));

module.exports = sequelize;
