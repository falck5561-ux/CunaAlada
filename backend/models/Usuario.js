const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    foto: { type: String }, 
    googleId: { type: String, required: true, unique: true },
    rol: { type: String, default: 'cliente' },
    plumas: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);