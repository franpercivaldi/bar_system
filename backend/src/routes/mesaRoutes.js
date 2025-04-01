const express = require('express');
const router = express.Router();
const { guardarMesa, getMesasByIdBar, editarMesa, eliminarMesa } = require('../controllers/mesaController');

router.post('/mesas', guardarMesa);
router.get('/mesas', getMesasByIdBar)
router.put('/mesas/:id', editarMesa)
router.delete('/mesas/:id', eliminarMesa)

module.exports = router;
