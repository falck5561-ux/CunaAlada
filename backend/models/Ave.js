// backend/models/Ave.js
const mongoose = require('mongoose');

const aveSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    mutacion: {
        type: String, 
        required: true
    },
    fechaNacimiento: {
        type: Date,
        required: true 
    },
    precio: {
        type: Number,
        required: true
    },
    fotoUrl: {
        type: String, // Aquí guardaremos el link de la imagen
        default: "https://via.placeholder.com/300"
    },
    estado: {
        type: String,
        enum: ['DISPONIBLE', 'RESERVADO', 'VENDIDO'],
        default: 'DISPONIBLE'
    },
    descripcion: {
        type: String // Para poner notas como "Portador de azul"
    }
}, {
    timestamps: true // Crea automáticamente campos de "creado el..."
});

module.exports = mongoose.model('Ave', aveSchema);