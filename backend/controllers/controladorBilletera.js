// controllers/controladorBilletera.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Usuario = require('../models/Usuario'); // Necesitarás tu modelo de usuario después

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

