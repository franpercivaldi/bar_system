const express = require('express');
const router = express.Router();
const { guardarMesa, getMesas } = require('../controllers/mesaController');

router.post('/mesas', guardarMesa);
router.get('/mesas', getMesas)

module.exports = router;
