const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../middlewares/upload');

// La ruta base en server.js será /api/productos
router.get('/', productoController.obtenerProductos);
router.post('/', upload.single('foto'), productoController.crearProducto);
router.put('/:id', upload.single('foto'), productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;