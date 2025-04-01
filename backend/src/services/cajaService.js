const CajaInicial = require('../models/cajaInicial');

const guardarCajaInicial = async ({ bar_id, monto }) => {
  const fecha = new Date().toISOString().split('T')[0];

  // upsert: si ya existe, lo actualiza
  const [caja, created] = await CajaInicial.upsert({
    bar_id,
    fecha,
    monto
  }, { returning: true });

  return caja;
};

const obtenerCajaInicial = async (bar_id) => {
  const fecha = new Date().toISOString().split('T')[0];

  const caja = await CajaInicial.findOne({
    where: { bar_id, fecha }
  });

  return caja;
};

module.exports = { guardarCajaInicial, obtenerCajaInicial };
