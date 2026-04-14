const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: String, 
    categoria: String, 
    precio: Number, 
    precioOriginal: Number, 
    stock: Number, 
    descripcion: String, 
    fotoUrl: String, 
    enPromocion: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);