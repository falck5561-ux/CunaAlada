const express = require('express');
const router = express.Router();
const controladorAves = require('../controllers/controladorAves');
const subidaArchivos = require('../middlewares/subidaArchivos'); // Importamos la config de Cloudinary

// --- RUTAS DE INVENTARIO (AVES) ---
router.get('/', controladorAves.obtenerAves);
router.post('/', subidaArchivos.single('foto'), controladorAves.crearAve);
router.put('/:id', subidaArchivos.single('foto'), controladorAves.actualizarAve);
router.delete('/:id', controladorAves.eliminarAve);

// --- RUTAS DE PROPIEDAD Y ADOPCIÓN ---
router.post('/:id/generar-link', controladorAves.generarLinkAdopcion);

router.get('/adopcion/:token', controladorAves.obtenerAdopcion);
router.post('/adopcion/:token/confirmar', controladorAves.confirmarAdopcion);

module.exports = router;