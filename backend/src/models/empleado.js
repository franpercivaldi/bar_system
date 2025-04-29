// src/models/empleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('empleados', {
  id: { type: DataTypes.INTEGER,   primaryKey: true, autoIncrement: true },
  bar_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: 'empleados',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Empleado;
