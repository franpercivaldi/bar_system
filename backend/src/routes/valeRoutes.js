const express = require('express');
const router = express.Router();
const { getVales, addVale } = require('../controllers/valeController');

router.post('/vales', addVale);
router.get('/vales', getVales);

module.exports = router;