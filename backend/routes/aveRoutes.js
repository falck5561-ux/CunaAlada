const express = require('express');
const router = express.Router();
const aveController = require('../controllers/aveController');
const upload = require('../middlewares/upload'); // Importamos la config de Cloudinary

// --- RUTAS DE INVENTARIO (AVES) ---
// La ruta base en server.js será /api/aves
router.get('/', aveController.obtenerAves);
router.post('/', upload.single('foto'), aveController.crearAve);
router.put('/:id', upload.single('foto'), aveController.actualizarAve);
router.delete('/:id', aveController.eliminarAve);

// --- RUTAS DE PROPIEDAD Y ADOPCIÓN ---
router.post('/:id/generar-link', aveController.generarLinkAdopcion);

// Nota: Agrupé las rutas de adopción aquí.
// Tu front-end ahora deberá apuntar a /api/aves/adopcion/...
router.get('/adopcion/:token', aveController.obtenerAdopcion);
router.post('/adopcion/:token/confirmar', aveController.confirmarAdopcion);

module.exports = router;