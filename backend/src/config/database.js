const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Desactiva logs en producción
});


sequelize.authenticate()
.then(() => console.log("✅ Conectado a PostgreSQL"))
.catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));
  

module.exports = sequelize;
