const express = require('express');
const router = express.Router();
const { postCaja, getCaja } = require('../controllers/cajaController');

router.post('/caja', postCaja);
router.get('/caja', getCaja);

module.exports = router;
