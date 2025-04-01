const { guardarMesaService, getMesasByIdBarService } = require('../services/mesaService');

const guardarMesa = async (req, res) => {
  try {
    const barId = req.headers['bar-seleccionado'];

    if(!barId) {
      return res.status(400).json({ mensaje: 'Bar no seleccionado' });
    }

    const nuevaMesa = await guardarMesaService({...req.body, bar_id: barId});
    res.status(201).json(nuevaMesa);
  } catch (error) {
    console.error('Error al guardar la mesa:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

const getMesasByIdBar = async (req, res) => {
  try {
    const mesas = await getMesasByIdBarService(req.body);
    res.json(mesas);
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    res.status(400).json({ mensaje: error.message });
  }
}


module.exports = { guardarMesa, getMesasByIdBar};