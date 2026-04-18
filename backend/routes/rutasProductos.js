const express = require('express');
const router = express.Router();
const controladorProductos = require('../controllers/controladorProductos');
const subidaArchivos = require('../middlewares/subidaArchivos');

// La ruta base en server.js será /api/productos
router.get('/', controladorProductos.obtenerProductos);
router.post('/', subidaArchivos.single('foto'), controladorProductos.crearProducto);
router.put('/:id', subidaArchivos.single('foto'), controladorProductos.actualizarProducto);
router.delete('/:id', controladorProductos.eliminarProducto);

module.exports = router;