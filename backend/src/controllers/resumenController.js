const {
    getResumenDiarioService,
    getResumenMensualService
  } = require('../services/resumenService');
  
  const getResumenDiario = async (req, res) => {
    try {
      const barId = req.headers['bar-seleccionado'];
      if (!barId) {
        return res.status(400).json({ mensaje: 'Bar no seleccionado' });
      }

      // ⬇️ fecha viene como query (?fecha=2025-04-29)
      const { fecha } = req.query;               // 'YYYY-MM-DD'
      const fechaConsulta =
        fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)
          ? fecha
          : new Date().toISOString().split('T')[0];

      const resumen = await getResumenDiarioService(barId, fechaConsulta);
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
  
      const fecha = req.query.fecha;
      const resumen = await getResumenMensualService(barId, fecha);
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
  