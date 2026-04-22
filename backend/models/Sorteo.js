const mongoose = require('mongoose');

const SorteoSchema = new mongoose.Schema({
    // 1. EL PREMIO REAL: Vinculamos el sorteo a un Ave específica
    aveId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ave',
        required: true 
    },
    
    // 2. DATOS DEL EVENTO
    titulo: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String 
    },
    precioBoleto: { 
        type: Number, 
        required: true 
    },
    totalBoletos: { 
        type: Number, 
        required: true, 
        default: 50 
    },
    
    // 3. MOTOR DE TICKETS
    boletosVendidos: [{
        usuarioEmail: String,      // Para que el cliente vea "Sus Boletos"
        nombreCliente: String,
        telefonoCliente: String,
        numeroBoleto: Number,      // Su número de la suerte
        fechaCompra: { type: Date, default: Date.now },
        idPagoStripe: String       // El recibo de pago seguro
    }],
    
    // 4. LAS FASES DEL SHOW
    estado: { 
        type: String, 
        // 🔥 CORRECCIÓN 1: Agregamos 'ENTREGADO' para que el escáner no falle al guardar
        enum: ['ACTIVO', 'LLENO', 'FINALIZADO', 'ENTREGADO'], 
        default: 'ACTIVO' 
    },
    
    // 5. CONTROL DE VISIBILIDAD (Nueva implementación)
    // Sirve para ocultar sorteos finalizados de la vista de los clientes
    visible: { 
        type: Boolean, 
        default: true 
    },
    
    // 6. LA CUENTA REGRESIVA
    fechaSorteoPlaneada: { 
        type: Date 
    }, // Se establece cuando se llena el sorteo
    
    // 7. EL GRAN GANADOR
    ganador: {
        nombreCliente: String,
        usuarioEmail: String,
        numeroBoleto: Number,
        // 🔥 CORRECCIÓN 2: Agregamos este campo para que MongoDB no borre el QR
        codigoReclamo: String 
    }
}, { 
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Sorteo', SorteoSchema);