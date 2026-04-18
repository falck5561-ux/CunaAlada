const express = require('express');
const router = express.Router();
const controladorSorteos = require('../controllers/controladorSorteos');

// La ruta base en server.js será /api/sorteos
router.get('/', controladorSorteos.obtenerSorteos);
router.post('/', controladorSorteos.crearSorteo);
router.delete('/:id', controladorSorteos.eliminarSorteo);

// Pagos y compras de boletos
router.post('/crear-pago', controladorSorteos.crearPago);
router.post('/:id/confirmar-compra', controladorSorteos.confirmarCompra);
router.post('/:id/revelar', controladorSorteos.revelarGanador);

module.exports = router;