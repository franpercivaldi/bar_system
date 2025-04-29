const empleadoService = require('../services/empleadoService');

const getEmployees = async (req, res, next) => {
  try {
    console.log('Entrando a listar empleados:')
    const barId = req.headers['bar-seleccionado'];
    if (!barId) {
      return res.status(400).json({ mensaje: 'Falta header bar-seleccionado' });
    }
    const list = await empleadoService.getAll(barId);
    console.log(list);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const addEmployee = async (req, res, next) => {
  try {
    const barId = req.headers['bar-seleccionado'];
    const { nombre } = req.body;
    if (!barId || !nombre) {
      return res.status(400).json({ mensaje: 'Faltan datos' });
    }
    const nuevo = await empleadoService.create({ bar_id: barId, nombre });
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getEmployees,
  addEmployee
};