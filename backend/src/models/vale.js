// src/models/vale.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vale = sequelize.define('vales', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  empleado_id: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  comentario: { type: DataTypes.TEXT },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'vales',
  timestamps: false
});

module.exports = Vale;
