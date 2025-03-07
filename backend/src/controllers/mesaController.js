const { guardarMesaService, getMesasService } = require('../services/mesaService');

const guardarMesa = async (req, res) => {
  try {
    const nuevaMesa = await guardarMesaService(req.body);
    res.status(201).json(nuevaMesa);
  } catch (error) {
    console.error('Error al guardar la mesa:', error);
    res.status(400).json({ mensaje: error.message });
  }
};

const getMesas = async (req, res) => {
  try {
    const mesas = await getMesasService();
    res.json(mesas);
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    res.status(400).json({ mensaje: error.message });
  }
}


module.exports = { guardarMesa, getMesas};