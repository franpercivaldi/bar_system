const { Empleado } = require('../models');

module.exports = {
  getAll: barId =>
    Empleado.findAll({
      where: { bar_id: barId },
      order: [['nombre', 'ASC']]
    }),

  create: ({ bar_id, nombre }) =>
    Empleado.create({ bar_id, nombre })
};
