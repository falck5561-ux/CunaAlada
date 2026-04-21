const express = require('express');
const router = express.Router();
const PedidoTienda = require('../models/PedidoTienda');
// 🔥 PASO 1: Importar el modelo de Producto para poder restarle stock
const Producto = require('../models/Producto'); 

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

        // Guardamos el pedido en la BD
        await nuevoPedido.save();

        // 🔥 PASO 2: EL CICLO MÁGICO PARA BAJAR EL STOCK 🔥
        // Recorremos el arreglo de productos que viene del frontend
        for (const item of productos) {
            await Producto.findOneAndUpdate(
                { nombre: item.nombre }, // Buscamos el producto por su nombre
                { $inc: { stock: -item.cantidad } } // Restamos la cantidad comprada ($inc negativo)
            );
        }

        res.json({ message: 'Pedido registrado y stock actualizado', pedido: nuevoPedido });
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

        const pedidos = await PedidoTienda.find({ 
            usuarioNombre: usuario, 
            $or: [
                { estado: 'pagado' }, 
                { estado: 'pendiente', fecha: { $gte: limite48h } } 
            ]
        }).sort({ fecha: -1 });
        
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos.' });
    }
});

module.exports = router;