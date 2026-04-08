const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    foto: { type: String }, // Aquí guardaremos la foto de perfil que trae de Google
    googleId: { type: String, required: true, unique: true }, // Su llave de identidad
    rol: { type: String, default: 'cliente' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);