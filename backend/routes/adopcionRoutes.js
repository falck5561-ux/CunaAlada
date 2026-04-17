const express = require('express');
const router = express.Router();
// Importamos las funciones que ya tienes en tu aveController
const aveController = require('../controllers/aveController');

// Cuando React haga el GET, usamos tu función obtenerAdopcion
router.get('/:token', aveController.obtenerAdopcion);

// Cuando React haga el POST para confirmar, usamos confirmarAdopcion
router.post('/:token/confirmar', aveController.confirmarAdopcion);

module.exports = router;