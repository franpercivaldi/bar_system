const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bar = require('./bar');


const Comentario = sequelize.define('Comentario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bar_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'comentarios', timestamps: false });

Comentario.belongsTo(Bar, { foreignKey: 'bar_id', as: 'bar' });


module.exports = Comentario;
