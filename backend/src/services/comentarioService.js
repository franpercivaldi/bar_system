// src/services/comentarioService.js
const Comentario = require('../models/comentario');

const guardarComentarioService = async ({ bar_id, comentario, monto }) => {
  try {
    const fechaActual = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const nuevoComentario = await Comentario.create({
      bar_id,
      comentario,
      monto,
      fecha: fechaActual
    });

    return nuevoComentario;
  } catch (error) {
    console.error('Error en guardarComentarioService:', error);
    throw new Error('Error al guardar el comentario: ' + error.message);
  }
};

module.exports = {
  guardarComentarioService
};
