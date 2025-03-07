const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    rol: { type: DataTypes.STRING(10), allowNull: false },
    bar_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'usuarios', timestamps: false });

module.exports = Usuario;
