const Ave = require('../models/Ave');
const { v4: uuidv4 } = require('uuid');

// Helper para manejar errores y verlos clarito en la terminal
const manejarError = (res, error, mensaje) => {
    console.error(`❌ ${mensaje}:`, error.message || error);
    res.status(500).json({ 
        success: false, 
        message: mensaje, 
        detalles: error.message || error 
    });
};

exports.obtenerAves = async (req, res) => {
    try { 
        res.json(await Ave.find()); 
    } catch (error) { 
        manejarError(res, error, "Error al obtener aves");
    }
};

exports.crearAve = async (req, res) => {
    try {
        const datos = req.body;
        // Si Multer subió una foto, guardamos la ruta
        if (req.file) {
            datos.fotoUrl = req.file.path; 
        }
        
        const nuevaAve = new Ave(datos);
        await nuevaAve.save();
        res.json(nuevaAve);
    } catch (error) { 
        manejarError(res, error, "Error al crear ave (Revisa si faltan campos obligatorios)");
    }
};

exports.actualizarAve = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        
        const aveActualizada = await Ave.findByIdAndUpdate(req.params.id, datos, { new: true });
        res.json({ success: true, message: 'Ave actualizada', ave: aveActualizada });
    } catch (error) { 
        manejarError(res, error, "Error al actualizar ave");
    }
};

exports.eliminarAve = async (req, res) => {
    try {
        await Ave.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Ave eliminada' });
    } catch (error) { 
        manejarError(res, error, "Error al eliminar ave");
    }
};

exports.generarLinkAdopcion = async (req, res) => {
    try {
        const token = uuidv4(); 
        await Ave.findByIdAndUpdate(req.params.id, { estado: 'reservado', tokenRegistro: token });
        
        // Usamos una variable de entorno o detectamos el origen para el link
        // Si no existe la variable, por ahora usa localhost para tus pruebas
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
        res.json({ success: true, link: `${CLIENT_URL}/registro/${token}` });
    } catch (error) { 
        manejarError(res, error, "Error al generar link");
    }
};

exports.obtenerAdopcion = async (req, res) => {
    try {
        const ave = await Ave.findOne({ tokenRegistro: req.params.token });
        if (!ave) return res.status(404).json({ message: 'Link inválido o expirado' });
        res.json(ave);
    } catch (error) { 
        manejarError(res, error, "Error al obtener datos de adopción");
    }
};

exports.confirmarAdopcion = async (req, res) => {
    try {
        const { nombreAdoptivo, propietario } = req.body;
        const ave = await Ave.findOneAndUpdate(
            { tokenRegistro: req.params.token },
            { nombreAsignado: nombreAdoptivo, propietario: propietario, estado: 'vendido', fechaVenta: new Date() },
            { new: true }
        );
        res.json({ success: true, ave });
    } catch (error) { 
        manejarError(res, error, "Error al confirmar adopción");
    }
};