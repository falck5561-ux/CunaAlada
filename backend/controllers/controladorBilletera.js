const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Usuario = require('../models/Usuario'); // Necesitarás tu modelo de usuario después

// =======================================================
// 1. PAGO DE PLUMAS (SISTEMA VIRTUAL)
// =======================================================
exports.crearPagoPlumas = async (req, res) => {
    try {
        const { monto } = req.body;

        let cantidadPlumas = 0;
        if (monto === 100) cantidadPlumas = 100;
        else if (monto === 500) cantidadPlumas = 520;   // Bono bajó a 20
        else if (monto === 1000) cantidadPlumas = 1070; // Bono bajó a 70
        else if (monto === 4000) cantidadPlumas = 4500; // Bono bajó a 500
        else return res.status(400).json({ error: 'Monto de recarga inválido' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: monto * 100, 
            currency: 'mxn',
            metadata: { 
                tipoOperacion: 'recarga_plumas',
                plumasAcreditadas: cantidadPlumas 
            }
        });

        res.json({ 
            clientSecret: paymentIntent.client_secret,
            plumasTotales: cantidadPlumas 
        });
    } catch (error) { 
        console.error("Error al crear pago de plumas:", error);
        res.status(500).json({ error: 'Error al procesar recarga' }); 
    }
};

// =======================================================
// 🔥 2. NUEVO: PAGO DIRECTO EN TIENDA (PRODUCTOS FÍSICOS)
// =======================================================
exports.crearPagoTienda = async (req, res) => {
    try {
        // Recibimos el total a cobrar desde tu carrito (ej. 1440)
        const { montoTotal, descripcionPedido } = req.body;

        // Validamos que el monto sea mayor a 0
        if (!montoTotal || montoTotal <= 0) {
            return res.status(400).json({ error: 'El monto del pedido es inválido.' });
        }

        // Stripe siempre cobra en centavos, así que multiplicamos el total por 100
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(montoTotal * 100), 
            currency: 'mxn',
            description: descripcionPedido || 'Compra de productos en Tienda Cuna Alada',
            metadata: { 
                tipoOperacion: 'compra_tienda_directa'
            }
        });

        // Devolvemos el secreto al Frontend para que abra el modal de la tarjeta
        res.json({ 
            success: true,
            clientSecret: paymentIntent.client_secret 
        });

    } catch (error) { 
        console.error("Error al crear pago de tienda con Stripe:", error);
        res.status(500).json({ error: 'Error interno al procesar el pago con tarjeta.' }); 
    }
};