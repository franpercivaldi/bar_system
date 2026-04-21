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
  const databaseUrl = process.env.DATABASE_URL?.trim();

  const onRailway = isRailwayRuntime();
  if (onRailway && !databaseUrl) {
    console.error(
      '❌ En Railway el backend necesita DATABASE_URL en Variables del servicio API (referencia o valor copiado del servicio PostgreSQL). No uses DB_HOST=localhost.'
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
