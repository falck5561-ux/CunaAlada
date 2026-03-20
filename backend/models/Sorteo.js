// backend/models/Sorteo.js
const mongoose = require('mongoose');

const SorteoSchema = new mongoose.Schema({
    premio: { type: String, required: true },
    descripcion: { type: String },
    fotoUrl: { type: String, default: "https://via.placeholder.com/300" },
    precioBoleto: { type: Number, required: true },
    totalBoletos: { type: Number, required: true, default: 50 },
    boletosVendidos: [{
        nombreCliente: String,
        telefonoCliente: String,
        emailCliente: String,
        fechaCompra: { type: Date, default: Date.now },
        idPagoStripe: String // Para rastrear el pago
    }],
    estado: { 
        type: String, 
        enum: ['ACTIVO', 'FINALIZADO'], 
        default: 'ACTIVO' 
    },
    ganador: {
        nombreCliente: String,
        telefonoCliente: String,
        numeroBoleto: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Sorteo', SorteoSchema);