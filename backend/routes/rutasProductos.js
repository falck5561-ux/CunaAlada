const express = require('express');
const router = express.Router();
const controladorProductos = require('../controllers/controladorProductos');
const subidaArchivos = require('../middlewares/subidaArchivos');

router.get('/', controladorProductos.obtenerProductos);
router.post('/', subidaArchivos.single('foto'), controladorProductos.crearProducto);
router.put('/:id', subidaArchivos.single('foto'), controladorProductos.actualizarProducto);
router.delete('/:id', controladorProductos.eliminarProducto);

router.patch('/canjear-producto/:id', controladorProductos.canjearProducto);

module.exports = router;