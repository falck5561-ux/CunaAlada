const mongoose = require('mongoose');

const AveSchema = new mongoose.Schema({
    especie: String, 
    mutacion: String, 
    anillo: String, 
    fechaNacimiento: String,
    precio: Number, 
    precioOriginal: Number, 
    fotoUrl: String, 
    enPromocion: { type: Boolean, default: false },
    estado: { type: String, default: 'disponible' }, 
    tokenRegistro: String,   
    nombreAsignado: String, 
    propietario: String, 
    fechaVenta: Date
}, { timestamps: true });

module.exports = mongoose.model('Ave', AveSchema);