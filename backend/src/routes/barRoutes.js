const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/barController');

router.get('/bars', getAll);

module.exports = router;
