const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: String, 
    categoria: String, 
    precio: Number, 
    precioOriginal: Number, 
    stock: { type: Number, default: 0 }, 
    descripcion: String, 
    fotoUrl: String, 
    enPromocion: { type: Boolean, default: false },
    propietario: { type: String, default: null },
    fechaVenta: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);