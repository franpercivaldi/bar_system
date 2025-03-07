// src/models/mesaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Turno = require('./turno');
const Bar = require('./bar');

const Mesa = sequelize.define('Mesa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bar_id: { type: DataTypes.INTEGER, allowNull: false },
  turno_id: { type: DataTypes.INTEGER, allowNull: false },
  numero_mesa: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  propina: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  tipo_pago: { type: DataTypes.STRING(50), allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'mesas', timestamps: false });

// Asociación: Mesa pertenece a Turno y Bar
Mesa.belongsTo(Turno, { foreignKey: 'turno_id', as: 'turno' });
Turno.hasMany(Mesa, { foreignKey: 'turno_id', as: 'mesas' });

Mesa.belongsTo(Bar, { foreignKey: 'bar_id', as: 'bar' });
Bar.hasMany(Mesa, { foreignKey: 'bar_id', as: 'mesas' });

module.exports = Mesa;