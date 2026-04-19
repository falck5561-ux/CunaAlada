// routes/rutasBilletera.js
const express = require('express');
const router = express.Router();
const billeteraController = require('../controllers/controladorBilletera');

// Ruta para generar la intención de pago
router.post('/pago-plumas', billeteraController.crearPagoPlumas);

module.exports = router;