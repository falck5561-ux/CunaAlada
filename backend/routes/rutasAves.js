const express = require('express');
const router = express.Router();
const controladorAves = require('../controllers/controladorAves');
const subidaArchivos = require('../middlewares/subidaArchivos');

// Rutas normales
router.get('/', controladorAves.obtenerAves);
router.post('/', subidaArchivos.single('foto'), controladorAves.crearAve);
router.put('/:id', subidaArchivos.single('foto'), controladorAves.actualizarAve);
router.delete('/:id', controladorAves.eliminarAve);

router.patch('/canjear-ave/:id', controladorAves.canjearAve);

// Adopción
router.post('/:id/generar-link', controladorAves.generarLinkAdopcion);
router.get('/adopcion/:token', controladorAves.obtenerAdopcion);
router.post('/adopcion/:token/confirmar', controladorAves.confirmarAdopcion);

module.exports = router;