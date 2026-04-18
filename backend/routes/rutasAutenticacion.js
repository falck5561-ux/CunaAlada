const express = require('express');
const router = express.Router();
const controladorAutenticacion = require('../controllers/controladorAutenticacion');

router.post('/google', controladorAutenticacion.loginGoogle);

module.exports = router;