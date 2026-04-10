const mongoose = require('mongoose');

const SorteoSchema = new mongoose.Schema({
    // 1. EL PREMIO REAL: Vinculamos el sorteo a un Ave específica de tu inventario
    aveId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ave',
        required: true 
    },
    
    // 2. DATOS DEL EVENTO
    titulo: { type: String, required: true },
    descripcion: { type: String },
    precioBoleto: { type: Number, required: true },
    totalBoletos: { type: Number, required: true, default: 50 },
    
    // 3. MOTOR DE TICKETS
    boletosVendidos: [{
        usuarioEmail: String,      // Clave para que el cliente vea "Sus Boletos" al iniciar sesión
        nombreCliente: String,
        telefonoCliente: String,
        numeroBoleto: Number,      // Su número de la suerte (ej. Ticket #12)
        fechaCompra: { type: Date, default: Date.now },
        idPagoStripe: String       // El recibo de pago seguro
    }],
    
    // 4. LAS FASES DEL SHOW
    estado: { 
        type: String, 
        enum: ['ACTIVO', 'LLENO', 'FINALIZADO'], 
        default: 'ACTIVO' 
    },
    
    // 5. LA CUENTA REGRESIVA
    fechaSorteoPlaneada: { type: Date }, // Se establece cuando se compra el último boleto
    
    // 6. EL GRAN GANADOR
    ganador: {
        nombreCliente: String,
        usuarioEmail: String,
        numeroBoleto: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Sorteo', SorteoSchema);