const mongoose = require('mongoose');

const CanjeSchema = new mongoose.Schema({
    usuarioNombre: String,
    itemNombre: String,
    itemImagen: String,
    cantidad: Number,
    tipo: String, // 'ave' o 'producto'
    itemId: String, // ID original del ave o producto
    fecha: { type: Date, default: Date.now },
    estadoEntrega: { type: String, default: 'pendiente' } 
});

module.exports = mongoose.model('Canje', CanjeSchema);