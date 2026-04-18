const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    foto: { type: String }, 
    googleId: { type: String, required: true, unique: true }, // Su llave de identidad
    rol: { type: String, default: 'cliente' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);