const express = require('express');
const { getUsuarios, createUsuario } = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);

module.exports = router;
