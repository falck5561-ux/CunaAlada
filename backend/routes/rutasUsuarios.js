const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); 

// RUTA: PATCH /api/usuarios/sincronizar-plumas
router.patch('/sincronizar-plumas', async (req, res) => {
    try {
        const { email, plumas } = req.body;

        // Validación básica
        if (!email) {
            return res.status(400).json({ error: "El email es obligatorio" });
        }

        // Buscamos al usuario y actualizamos el saldo
        // { new: true } devuelve el documento ya actualizado
        const usuarioActualizado = await Usuario.findOneAndUpdate(
            { email: email.toLowerCase() }, 
            { plumas: plumas },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ 
            success: true, 
            message: "Saldo sincronizado en la nube",
            plumas: usuarioActualizado.plumas 
        });

    } catch (error) {
        console.error("Error en sincronización:", error);
        res.status(500).json({ error: "No se pudo guardar en la DB" });
    }
});

module.exports = router;