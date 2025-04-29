const { Vale, Empleado } = require('../models');

module.exports = {
  getAll: barId =>
    Vale.findAll({
      include: [{
        model: Empleado,
        as: 'empleado',
        where:  { bar_id: Number(barId) },
        attributes: ['id','nombre']
      }],
      order: [['fecha', 'DESC']]
    }),

  create: ({ empleado_id, monto, comentario }) =>
    Vale.create({ empleado_id, monto, comentario }),

  getById: id =>
    Vale.findByPk(id, {
      include: [{ model: Empleado, attributes: ['id','nombre'] }]
    })
};
