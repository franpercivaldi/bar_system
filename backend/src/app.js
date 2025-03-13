const express = require('express');
const { sequelize } = require('./models');

const mesasRoutes = require('./routes/mesaRoutes');
const barRoutes = require('./routes/barRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api', barRoutes);
app.use('/api', mesasRoutes);
app.use('/api', authRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log('📌 Base de datos sincronizada');
  app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
});
