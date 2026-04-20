const express = require('express');
const router = express.Router(); // <--- ¡Esto es lo que faltaba!
const Canje = require('../models/Canje'); 

// 1. CONSULTAR QR (Solo para ver la info antes de confirmar)
router.get('/consultar-qr/:id', async (req, res) => {
    try {
        const canje = await Canje.findById(req.params.id);
        if (!canje) return res.status(404).json({ message: 'Ticket no encontrado.' });
        
        // Usamos 'estadoEntrega' que es el nombre real en tu Schema
        if (canje.estadoEntrega === 'entregado') {
            const fecha = canje.fechaEntrega ? new Date(canje.fechaEntrega).toLocaleString() : "Fecha desconocida";
            return res.status(400).json({ 
                message: `Este premio YA FUE ENTREGADO el día ${fecha}`,
                yaEntregado: true,
                canje 
            });
        }

        res.json(canje);
    } catch (error) {
        console.error("Error en consultar-qr:", error);
        res.status(500).json({ message: 'Error al consultar ticket.' });
    }
});

// 2. CONFIRMAR ENTREGA (Cuando el admin aprieta el botón)
router.patch('/confirmar-entrega/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos y actualizamos usando los nombres exactos de tu modelo
        const canjeActualizado = await Canje.findByIdAndUpdate(
            id, 
            { 
                estadoEntrega: 'entregado', 
                fechaEntrega: new Date() 
            }, 
            { new: true } 
        );

        if (!canjeActualizado) {
            return res.status(404).json({ message: 'Ticket no encontrado.' });
        }

        res.json({ message: '¡Entrega confirmada y registrada!', canje: canjeActualizado });
    } catch (error) {
        console.error("Error en confirmar-entrega:", error);
        res.status(500).json({ message: 'Error al procesar la entrega.' });
    }
});

// 3. OBTENER HISTORIAL (Para la vista del usuario)
router.get('/', async (req, res) => {
    try {
        const { usuario } = req.query;
        // Solo mostramos los que NO han sido entregados para que desaparezcan del nido
        const misPremios = await Canje.find({ 
            usuarioNombre: usuario, 
            estadoEntrega: { $ne: 'entregado' } 
        }).sort({ fecha: -1 });
        
        res.json(misPremios);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial de premios" });
    }
});

module.exports = router; // <--- Y esto exporta el router para server.js