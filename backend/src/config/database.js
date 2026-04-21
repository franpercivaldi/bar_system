const { Sequelize } = require('sequelize');
require('dotenv').config();

function buildSequelize() {
  const databaseUrl = process.env.DATABASE_URL;

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
