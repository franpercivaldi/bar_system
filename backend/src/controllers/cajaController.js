const { guardarCajaInicial, obtenerCajaInicial } = require('../services/cajaService');

const postCaja = async (req, res) => {
  try {
    const barId = req.headers['bar-seleccionado'];
    const { monto } = req.body;

    if (!barId || monto === undefined) {
      return res.status(400).json({ mensaje: 'Faltan datos' });
    }

    const caja = await guardarCajaInicial({ bar_id: barId, monto });
    res.status(201).json(caja);
  } catch (error) {
    console.error('Error al guardar la caja inicial:', error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
};

const getCaja = async (req, res) => {
  try {
    const barId = req.headers['bar-seleccionado'];
    const caja = await obtenerCajaInicial(barId);

    if (!caja) {
      return res.status(404).json({ mensaje: 'Caja no registrada para hoy' });
    }

    res.json(caja);
  } catch (error) {
    console.error('Error al obtener la caja:', error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
};

module.exports = { postCaja, getCaja };
