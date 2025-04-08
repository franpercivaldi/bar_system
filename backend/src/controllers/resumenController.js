const {
    getResumenDiarioService,
    getResumenMensualService
  } = require('../services/resumenService');
  
  const getResumenDiario = async (req, res) => {
    try {
      const barId = req.headers['bar-seleccionado'];
      if (!barId) return res.status(400).json({ mensaje: 'Bar no seleccionado' });
  
      const resumen = await getResumenDiarioService(barId);
      res.json(resumen);
    } catch (error) {
      console.error('Error al obtener resumen diario:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };
  
  const getResumenMensual = async (req, res) => {
    try {
      const barId = req.headers['bar-seleccionado'];
      if (!barId) return res.status(400).json({ mensaje: 'Bar no seleccionado' });
  
      const resumen = await getResumenMensualService(barId);
      res.json(resumen);
    } catch (error) {
      console.error('Error al obtener resumen mensual:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };
  
  module.exports = {
    getResumenDiario,
    getResumenMensual
  };
  