const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define('Turno', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false }
}, { tableName: 'turnos', timestamps: false });

module.exports = Turno;