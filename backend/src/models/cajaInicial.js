const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CajaInicial = sequelize.define('CajaInicial', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bar_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'caja_inicial',
  timestamps: false,
  indexes: [{ unique: true, fields: ['bar_id', 'fecha'] }],
});

module.exports = CajaInicial;
