const { guardarMesaService, getMesasByIdBarService, editarMesaService, eliminarMesaService } = require('../services/mesaService');

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
    const barId = req.headers['bar-seleccionado'];
    const mesas = await getMesasByIdBarService(barId);
    res.json(mesas);
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    res.status(400).json({ mensaje: error.message });
  }
}

const editarMesa = async (req, res) => {
  try {
    const id = req.params.id;
    const mesaActualizada = await editarMesaService(id, req.body);
    res.json(mesaActualizada);
  } catch (error) {
    console.error('Error al editar la mesa:', error);
    res.status(400).json({ mensaje: error.message });
  }
};


const eliminarMesa = async (req, res) => {
  try{
    const {id} = req.params;
    const mesaEliminada = await eliminarMesaService(id);
    res.json(mesaEliminada)
  } catch (error){
    res.status(400).json({mensaje: error.message})
  }
}

module.exports = { guardarMesa, getMesasByIdBar, editarMesa, eliminarMesa};