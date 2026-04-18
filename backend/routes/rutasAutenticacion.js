const express = require('express');
const router = express.Router();
const controladorAutenticacion = require('../controllers/controladorAutenticacion');

// La ruta base en server.js será /api/auth
router.post('/google', controladorAutenticacion.loginGoogle);

module.exports = router;