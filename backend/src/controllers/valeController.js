const valeService = require('../services/valeService');

const getVales = async (req, res, next) => {
  try {
    const barId = req.headers['bar-seleccionado'];
    if (!barId) {
      return res.status(400).json({ mensaje: 'Falta header bar-seleccionado' });
    }
    const list = await valeService.getAll(barId);
    console.log('lsita de vales', list)
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const addVale = async (req, res, next) => {
  try {
    const barId = req.headers['bar-seleccionado'];
    const { empleado_id, monto, comentario } = req.body;
    if (!barId || !empleado_id || monto == null) {
      return res.status(400).json({ mensaje: 'Faltan datos' });
    }
    // opcional: podrías verificar aquí que ese empleado pertenece a este bar
    const creado = await valeService.create({ empleado_id, monto, comentario });
    const full = await valeService.getById(creado.id);
    res.status(201).json(full);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVales,
  addVale
};