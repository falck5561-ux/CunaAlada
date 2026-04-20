const Sorteo = require('../models/Sorteo');
const Ave = require('../models/Ave');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. OBTENER SORTEOS (Filtrado para clientes / Completo para Admin)
exports.obtenerSorteos = async (req, res) => {
    try {
        const { publico } = req.query;
        let filtro = {};

        // Si se pide para el público, solo mostramos los que tienen visible: true
        if (publico === 'true') {
            filtro = { visible: true };
        }

        const sorteos = await Sorteo.find(filtro).populate('aveId').sort({ updatedAt: -1 });
        
        const sorteosFormateados = sorteos.map(sorteo => {
            const sorteoObj = sorteo.toObject();
            if (sorteoObj.aveId) {
                sorteoObj.fotoUrl = sorteoObj.aveId.foto || sorteoObj.aveId.fotoUrl;
                sorteoObj.premio = sorteoObj.titulo; 
            }
            return sorteoObj;
        });

        res.json(sorteosFormateados);
    } catch (error) { 
        console.error("Error al obtener sorteos:", error);
        res.status(500).json({ error: "Error al obtener la lista" }); 
    }
};

// 2. CAMBIAR VISIBILIDAD (Ocultar o Mostrar sorteo)
exports.cambiarVisibilidad = async (req, res) => {
    try {
        const sorteo = await Sorteo.findById(req.params.id);
        if (!sorteo) {
            return res.status(404).json({ success: false, message: 'Sorteo no encontrado.' });
        }

        // Cambiamos el estado de visibilidad
        sorteo.visible = !sorteo.visible;
        await sorteo.save();

        res.json({ 
            success: true, 
            message: sorteo.visible ? 'Sorteo ahora es visible para clientes' : 'Sorteo ocultado de la tienda',
            visible: sorteo.visible 
        });
    } catch (error) {
        console.error("Error al cambiar visibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 3. REVELAR GANADOR
exports.revelarGanador = async (req, res) => {
    try {
        const sorteo = await Sorteo.findById(req.params.id).populate('aveId');
        
        if (!sorteo || sorteo.estado === 'FINALIZADO') {
            return res.status(400).json({ success: false, message: 'El sorteo ya tiene ganador o no existe.' });
        }

        if (sorteo.boletosVendidos.length === 0) {
            return res.status(400).json({ success: false, message: 'No se puede sortear sin boletos vendidos.' });
        }

        const indiceGanador = Math.floor(Math.random() * sorteo.boletosVendidos.length);
        const boletoGanador = sorteo.boletosVendidos[indiceGanador];
        
        sorteo.estado = 'FINALIZADO';
        sorteo.ganador = {
            nombreCliente: boletoGanador.nombreCliente,
            usuarioEmail: boletoGanador.usuarioEmail,
            numeroBoleto: boletoGanador.numeroBoleto
        };

        if(sorteo.aveId) {
            sorteo.aveId.estado = 'vendido';
            sorteo.aveId.propietario = boletoGanador.nombreCliente;
            await sorteo.aveId.save();
        }

        await sorteo.save();
        res.json({ success: true, sorteo });
    } catch (error) { 
        console.error("Error al revelar ganador:", error);
        res.status(500).json(error); 
    }
};

// 4. CREAR SORTEO
exports.crearSorteo = async (req, res) => {
    try {
        const nuevoSorteo = new Sorteo(req.body);
        await nuevoSorteo.save();
        if (req.body.aveId) {
            await Ave.findByIdAndUpdate(req.body.aveId, { estado: 'reservado' });
        }
        res.json({ success: true, sorteo: nuevoSorteo });
    } catch (error) { res.status(500).json(error); }
};

// 5. ELIMINAR SORTEO
exports.eliminarSorteo = async (req, res) => {
    try {
        await Sorteo.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Sorteo eliminado' });
    } catch (error) { res.status(500).json(error); }
};

// 6. CREAR INTENCIÓN DE PAGO (STRIPE)
exports.crearPago = async (req, res) => {
    try {
        const { sorteoId, cantidad = 1, numerosElegidos } = req.body;
        const sorteo = await Sorteo.findById(sorteoId);
        if (!sorteo || sorteo.estado !== 'ACTIVO') return res.status(400).json({ error: 'Sorteo no disponible' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (sorteo.precioBoleto * cantidad) * 100, 
            currency: 'mxn', 
            metadata: { 
                sorteoId: sorteo._id.toString(),
                numerosBoletos: numerosElegidos && Array.isArray(numerosElegidos) ? numerosElegidos.join(',') : ''
            }
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) { res.status(500).json({ error: 'Error en pago' }); }
};

// 7. CONFIRMAR COMPRA TRAS PAGO
exports.confirmarCompra = async (req, res) => {
    try {
        const { nombre, email, telefono, numerosBoletos, idPago } = req.body;
        const sorteo = await Sorteo.findById(req.params.id);

        if (!sorteo || sorteo.estado !== 'ACTIVO') {
            return res.status(400).json({ success: false, message: 'El sorteo no está disponible.' });
        }

        numerosBoletos.forEach(numero => {
            sorteo.boletosVendidos.push({
                nombreCliente: nombre, telefonoCliente: telefono,
                usuarioEmail: email, numeroBoleto: parseInt(numero),
                idPagoStripe: idPago
            });
        });

        if (sorteo.boletosVendidos.length >= sorteo.totalBoletos) {
            sorteo.estado = 'LLENO';
            sorteo.fechaSorteoPlaneada = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        }

        await sorteo.save();
        res.json({ success: true, message: 'Boletos adquiridos con éxito', boletos: numerosBoletos, sorteo });
    } catch (error) { res.status(500).json(error); }
};