const express = require('express');
const router = express.Router();
const PedidoTienda = require('../models/PedidoTienda');

// 1. CREAR EL PEDIDO
router.post('/crear', async (req, res) => {
    try {
        const { usuarioNombre, productos, total, metodoPago, estado } = req.body;
        
        const folio = "CUNA-" + Math.floor(10000 + Math.random() * 90000);

        const nuevoPedido = new PedidoTienda({
            usuarioNombre,
            productos,
            total,
            folio,
            metodoPago, 
            estado: estado || 'pendiente' 
        });

        await nuevoPedido.save();
        res.json({ message: 'Pedido registrado', pedido: nuevoPedido });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: 'Error al procesar pedido.' });
    }
});

// 2. CONSULTAR QR (Admin Scanner)
router.get('/consultar/:id', async (req, res) => {
    try {
        const pedido = await PedidoTienda.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado.' });

        // ✨ CORRECCIÓN FINAL: Solo bloquea si ya fue ENTREGADO al cliente
        // Si dice 'pagado' (tarjeta), lo dejará pasar para que el admin confirme la entrega.
        if (pedido.estado === 'entregado') {
            const fecha = new Date(pedido.fechaEntrega || pedido.fecha).toLocaleString();
            return res.status(400).json({ 
                message: `¡ALERTA! Este pedido YA FUE ENTREGADO al cliente el ${fecha}`,
                yaCobrado: true,
                pedido 
            });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar pedido.' });
    }
});

// 3. CONFIRMAR PAGO Y ENTREGA (Botón Admin)
router.patch('/confirmar/:id', async (req, res) => {
    try {
        const { adminNombre } = req.body; 
        
        // ✨ Cuando el admin da clic, el estado cambia a ENTREGADO
        const pedidoActualizado = await PedidoTienda.findByIdAndUpdate(
            req.params.id,
            { 
                estado: 'entregado', 
                fechaEntrega: new Date(),
                adminCajero: adminNombre || 'Admin General'
            },
            { new: true }
        );

        res.json({ message: '¡Pedido entregado con éxito!', pedido: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar entrega.' });
    }
});

// 4. HISTORIAL DEL USUARIO (Mis Folios)
router.get('/mis-pedidos', async (req, res) => {
    try {
        const { usuario } = req.query;
        const limite48h = new Date(Date.now() - 48 * 60 * 60 * 1000);

        // ✨ LIMPIEZA: Ocultamos los 'entregados'. Así los tickets desaparecen de la app del cliente
        const pedidos = await PedidoTienda.find({ 
            usuarioNombre: usuario, 
            $or: [
                { estado: 'pagado' }, // Pagados con tarjeta que aún no se recogen
                { estado: 'pendiente', fecha: { $gte: limite48h } } // Efectivo menor a 48h
            ]
        }).sort({ fecha: -1 });
        
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos.' });
    }
});

module.exports = router;