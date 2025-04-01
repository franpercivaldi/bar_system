const { guardarComentarioService} = require('../services/comentarioService');
const Comentario = require('../models/comentario');

const guardarComentario = async (req, res) => {
    try {
        const barId = req.headers['bar-seleccionado'];
    
        if(!barId) {
        return res.status(400).json({ mensaje: 'Bar no seleccionado' });
        }
    
        const nuevoComentario = await guardarComentarioService({...req.body, bar_id: barId});
        res.status(201).json(nuevoComentario);
    } catch (error) {
        console.error('Error al guardar el comentario:', error);
        res.status(400).json({ mensaje: error.message });
    }
}

const obtenerComentariosDelDia = async (req, res) => {
    try {
      const barId = req.headers['bar-seleccionado'];
      const fecha = new Date().toISOString().split('T')[0];
  
      const comentarios = await Comentario.findAll({
        where: {
          bar_id: barId,
          fecha: fecha,
        },
        order: [['id', 'ASC']],
      });
  
      res.json(comentarios);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      res.status(500).json({ mensaje: 'Error interno' });
    }
  };

module.exports = { guardarComentario, obtenerComentariosDelDia };