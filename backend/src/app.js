const express = require('express');
const { sequelize } = require('./models');
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

// variables de entorno 
require("dotenv").config();

// Habilita CORS para el frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true               // para cookies o auth headers
}));

app.use(express.json());

app.use('/api', barRoutes);
app.use('/api', mesasRoutes);
app.use('/api', authRoutes);
app.use('/api', comentarioRoutes)
app.use('/api', cajaRoutes)
app.use('/api', resumenRoutes)
app.use('/api', empleadoRoutes)
app.use('/api', valeRoutes)

sequelize.sync({ alter: true }).then(() => {
  console.log('📌 Base de datos sincronizada');
  app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
});
