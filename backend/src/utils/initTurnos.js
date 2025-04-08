const sequelize = require('../config/database');
const Turno = require('../models/turnoModel');

const initTurnos = async () => {
  try {
    await sequelize.sync({ force: true }); // Forzar sincronización

    const turnos = [
      { nombre: 'Mañana', hora_inicio: '06:00:00', hora_fin: '17:00:00' },
      { nombre: 'Noche', hora_inicio: '17:00:00', hora_fin: '06:00:00' }
    ];

    for (const turno of turnos) {
      await Turno.create(turno);
      console.log(`Turno '${turno.nombre}' creado.`);
    }

    console.log('Inicialización de turnos completada.');
    process.exit();
  } catch (error) {
    console.error('Error al inicializar turnos:', error);
    process.exit(1);
  }
};

initTurnos();
