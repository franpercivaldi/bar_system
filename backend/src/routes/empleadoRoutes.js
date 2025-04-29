const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee } = require('../controllers/empleadoController');

router.post('/empleados', addEmployee);
router.get('/empleados', getEmployees);

module.exports = router;