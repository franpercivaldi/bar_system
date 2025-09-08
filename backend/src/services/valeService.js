const { Vale, Empleado } = require('../models');
const dayjs = require('dayjs');
const { Op } = require('sequelize');

module.exports = {
  getAll: barId => {
    // Si querés que la semana comience en lunes:
    const lunes = dayjs().startOf('week').add(1, 'day').toDate();
    const domingo = dayjs().endOf('week').add(1, 'day').toDate();

    return Vale.findAll({
      where: {
        fecha: { [Op.between]: [lunes, domingo] }
      },
      include: [{
        model: Empleado,
        as: 'empleado',
        where: { bar_id: Number(barId) },
        attributes: ['id', 'nombre']
      }],
      order: [['fecha', 'DESC']]
    });
  },

  create: ({ empleado_id, monto, comentario }) =>
    Vale.create({ empleado_id, monto, comentario }),

  getById: id =>
    Vale.findByPk(id, {
      include: [{ model: Empleado, attributes: ['id','nombre'] }]
    })
};
