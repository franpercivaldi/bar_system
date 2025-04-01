// src/api/comments.js
import axios from './axiosInstance';

// Agregar comentario
export const addComment = async ({ comentario, monto }) => {
  const response = await axios.post('/api/comentarios', {
    comentario,
    monto,
  });
  return response.data;
};

// 🆕 Obtener todos los comentarios del día
export const getComments = async () => {
  const response = await axios.get('/api/comentarios');
  return response.data; // Se espera un array de comentarios
};
