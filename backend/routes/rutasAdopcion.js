const express = require('express');
const router = express.Router();

const controladorAves = require('../controllers/controladorAves');

// Cuando React haga el GET, usamos tu función obtenerAdopcion
router.get('/:token', controladorAves.obtenerAdopcion);

// Cuando React haga el POST para confirmar, usamos confirmarAdopcion
router.post('/:token/confirmar', controladorAves.confirmarAdopcion);

module.exports = router;