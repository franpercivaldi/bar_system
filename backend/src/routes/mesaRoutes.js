const express = require('express');
const router = express.Router();
const { guardarMesa, getMesasByIdBar } = require('../controllers/mesaController');

router.post('/mesas', guardarMesa);
router.get('/mesas', getMesasByIdBar)

module.exports = router;
