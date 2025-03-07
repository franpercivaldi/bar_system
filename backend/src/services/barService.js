const { bar } = require('../models');

const getAllBares = async () => await Bar.findAll();
const getBarById = async (id) => await Bar.findByPk(id);
const createBar = async (data) => await Bar.create(data);
const updateBar = async (id, data) => await Bar.update(data, { where: { id } });
const deleteBar = async (id) => await Bar.destroy({ where: { id } });

module.exports = { getAllBares, getBarById, createBar, updateBar, deleteBar };
