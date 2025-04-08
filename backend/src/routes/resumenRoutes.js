const express = require('express');
const router = express.Router();
const { getResumenDiario, getResumenMensual } = require('../controllers/resumenController');

router.get('/resumen-diario', getResumenDiario);
router.get('/resumen-mensual', getResumenMensual);

module.exports = router;
