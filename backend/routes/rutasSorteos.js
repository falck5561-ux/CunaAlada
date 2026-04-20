const express = require('express');
const router = express.Router();
const controladorSorteos = require('../controllers/controladorSorteos');

// ==========================================
// RUTA BASE: /api/sorteos
// ==========================================

// Obtener sorteos (Historial completo para Admin / Filtrados para Clientes)
router.get('/', controladorSorteos.obtenerSorteos);

// Crear nuevo sorteo
router.post('/', controladorSorteos.crearSorteo);

// 🔥 NUEVA: Cambiar visibilidad (Ocultar/Mostrar sorteo en la tienda)
router.patch('/:id/visibilidad', controladorSorteos.cambiarVisibilidad);

// Eliminar sorteo (Limpiar historial permanentemente)
router.delete('/:id', controladorSorteos.eliminarSorteo);

// ==========================================
// PAGOS Y MECÁNICA DEL JUEGO
// ==========================================

// Crear intención de pago con Stripe
router.post('/crear-pago', controladorSorteos.crearPago);

// Confirmar compra de boleto tras pago exitoso
router.post('/:id/confirmar-compra', controladorSorteos.confirmarCompra);

// Revelar ganador (Elegir ticket al azar)
router.post('/:id/revelar', controladorSorteos.revelarGanador);

module.exports = router;