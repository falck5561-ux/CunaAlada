const mongoose = require('mongoose');

const PedidoTiendaSchema = new mongoose.Schema({
    usuarioNombre: { type: String, required: true },
    productos: [
        {
            nombre: String,
            cantidad: Number,
            precio: Number
        }
    ],
    total: { type: Number, required: true },
    folio: { type: String, unique: true }, 
    fecha: { type: Date, default: Date.now },
    
    // --- NUEVO: Necesitamos saber cómo pagó y su estado exacto ---
    metodoPago: { type: String, required: true }, // 'tarjeta' o 'efectivo'
    estado: { type: String, default: 'pendiente' }, // pendiente, pagado, cobrado, cancelado
    
    fechaEntrega: { type: Date },
    adminCajero: { type: String } 
});

module.exports = mongoose.model('PedidoTienda', PedidoTiendaSchema);