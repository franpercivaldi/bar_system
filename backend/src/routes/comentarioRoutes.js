const express = require('express');
const router = express.Router();
const { guardarComentario, obtenerComentariosDelDia} = require('../controllers/comentarioController');

router.post('/comentarios', guardarComentario);
router.get('/comentarios', obtenerComentariosDelDia);

module.exports = router;
