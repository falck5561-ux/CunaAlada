const express = require('express');
const router = express.Router();
const sorteoController = require('../controllers/sorteoController');

// La ruta base en server.js será /api/sorteos
router.get('/', sorteoController.obtenerSorteos);
router.post('/', sorteoController.crearSorteo);
router.delete('/:id', sorteoController.eliminarSorteo);

// Pagos y compras de boletos
router.post('/crear-pago', sorteoController.crearPago);
router.post('/:id/confirmar-compra', sorteoController.confirmarCompra);
router.post('/:id/revelar', sorteoController.revelarGanador);

module.exports = router;