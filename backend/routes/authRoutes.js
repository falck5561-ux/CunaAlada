const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// La ruta base en server.js será /api/auth
router.post('/google', authController.loginGoogle);

module.exports = router;