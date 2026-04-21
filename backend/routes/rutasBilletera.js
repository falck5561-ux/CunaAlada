const express = require('express');
const router = express.Router();
const billeteraController = require('../controllers/controladorBilletera');

// Ruta para generar la intención de pago (Recarga de Plumas)
router.post('/pago-plumas', billeteraController.crearPagoPlumas);

// 🔥 NUEVA RUTA: Para procesar pagos directos del carrito (Tienda)
router.post('/pago-tienda', billeteraController.crearPagoTienda);

module.exports = router;