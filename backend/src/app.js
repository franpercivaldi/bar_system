const express = require('express');
const { sequelize, Turno } = require('./models');
const cors = require("cors");

const mesasRoutes = require('./routes/mesaRoutes');
const barRoutes = require('./routes/barRoutes');
const authRoutes = require('./routes/authRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes')
const cajaRoutes = require('./routes/cajaRoutes')
const resumenRoutes = require('./routes/resumenRoutes')
const empleadoRoutes = require('./routes/empleadoRoutes')
const valeRoutes = require('./routes/valeRoutes')

const app = express();

if (
  !process.env.RAILWAY_PROJECT_ID &&
  !process.env.RAILWAY_ENVIRONMENT_NAME &&
  !process.env.RAILWAY_SERVICE_ID
) {
  require('dotenv').config();
}

const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bar-Seleccionado'],
  })
);

app.use(express.json());

app.use('/api', barRoutes);
app.use('/api', mesasRoutes);
app.use('/api', authRoutes);
app.use('/api', comentarioRoutes)
app.use('/api', cajaRoutes)
app.use('/api', resumenRoutes)
app.use('/api', empleadoRoutes)
app.use('/api', valeRoutes)

const PORT = Number(process.env.PORT) || 3000;

const isRailwayRuntime = Boolean(
  process.env.RAILWAY_PROJECT_ID ||
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    process.env.RAILWAY_SERVICE_ID
);
if (isRailwayRuntime && !String(process.env.JWT_SECRET || '').trim()) {
  console.error(
    '❌ Falta JWT_SECRET en Variables del servicio API (Railway). Ej.: openssl rand -base64 32'
  );
  process.exit(1);
}

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('📌 Base de datos sincronizada');
    const turnosCount = await Turno.count();
    if (turnosCount === 0) {
      await Turno.bulkCreate([
        { nombre: 'Mañana', hora_inicio: '06:00:00', hora_fin: '17:00:00' },
        { nombre: 'Noche', hora_inicio: '17:00:00', hora_fin: '06:00:00' },
      ]);
      console.log('📌 Turnos iniciales creados (ids 1 y 2; necesarios para registrar mesas)');
    }
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('Error al sincronizar / iniciar:', err);
    process.exit(1);
  });
