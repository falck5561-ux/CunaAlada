const express = require('express');
const router = express.Router();
const Canje = require('../models/Canje'); 

router.get('/', async (req, res) => {
    try {
        const { usuario } = req.query;
        
        const misPremios = await Canje.find({ usuarioNombre: usuario }).sort({ fecha: -1 });
        res.json(misPremios);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial de premios" });
    }
});

module.exports = router;