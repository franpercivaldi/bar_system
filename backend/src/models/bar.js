const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bar = sequelize.define(
  "Bar",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "bares", timestamps: false }
);

module.exports = Bar;
