const sequelize = require('../config/database');
const Bar = require('./bar');
const Turno = require('./turno');
const Usuario = require('./usuario');
const Mesa = require('./mesa');
const Comentario = require('./comentario');
const Empleado = require('./empleado');
const Vale = require('./vale');


// Relación: Un Bar tiene muchas Mesas
Bar.hasMany(Mesa, { foreignKey: 'bar_id' });
Mesa.belongsTo(Bar, { foreignKey: 'bar_id' });

// Relación: Un Bar tiene muchos Usuarios
Bar.hasMany(Usuario, { foreignKey: 'bar_id' });
Usuario.belongsTo(Bar, { foreignKey: 'bar_id' });

// Relación: Un Turno tiene muchas Mesas
Turno.hasMany(Mesa, { foreignKey: 'turno_id' });
Mesa.belongsTo(Turno, { foreignKey: 'turno_id' });

// Relación: Un Bar tiene muchos Comentarios
Bar.hasMany(Comentario, { foreignKey: 'bar_id' });
Comentario.belongsTo(Bar, { foreignKey: 'bar_id' });

Empleado.hasMany(Vale,     { foreignKey:'empleado_id', onDelete:'CASCADE', onUpdate:'CASCADE' });
Vale.belongsTo(Empleado,   { foreignKey:'empleado_id' });

module.exports = { sequelize, Bar, Turno, Usuario, Mesa, Comentario, Empleado, Vale };
