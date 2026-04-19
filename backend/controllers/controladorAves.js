const Ave = require('../models/Ave');
const Canje = require('../models/Canje'); 
const { v4: uuidv4 } = require('uuid');

const manejarError = (res, error, mensaje) => {
    console.error(`❌ ${mensaje}:`, error.message || error);
    res.status(500).json({ 
        success: false, 
        message: mensaje, 
        detalles: error.message || error 
    });
};

// 1. Obtener todas las aves
exports.obtenerAves = async (req, res) => {
    try { 
        res.json(await Ave.find()); 
    } catch (error) { 
        manejarError(res, error, "Error al obtener aves");
    }
};

// 2. Crear nueva ave
exports.crearAve = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) {
            datos.fotoUrl = req.file.path; 
        }
        const nuevaAve = new Ave(datos);
        await nuevaAve.save();
        res.json(nuevaAve);
    } catch (error) { 
        manejarError(res, error, "Error al crear ave");
    }
};

// 3. Actualizar ave
exports.actualizarAve = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const aveActualizada = await Ave.findByIdAndUpdate(req.params.id, datos, { new: true });
        res.json({ success: true, ave: aveActualizada });
    } catch (error) { 
        manejarError(res, error, "Error al actualizar ave");
    }
};

// 4. Eliminar ave
exports.eliminarAve = async (req, res) => {
    try {
        await Ave.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { 
        manejarError(res, error, "Error al eliminar ave");
    }
};

/**
 * 5. CANJEAR AVE (Pestaña Tienda)
 * Aquí aseguramos que el nombre del usuario sea exactamente el mismo que en el Frontend
 */
exports.canjearAve = async (req, res) => {
    try {
        const { usuarioNombre } = req.body; // Debe ser "Josué Pérez Ponce"

        const ave = await Ave.findOneAndUpdate(
            { _id: req.params.id, estado: 'disponible' },
            { 
                estado: 'vendido', 
                propietario: usuarioNombre, 
                fechaVenta: new Date() 
            },
            { new: true }
        );

        if (!ave) return res.status(404).json({ error: "Ave no disponible" });

        // 🔥 TICKET PARA "MIS PREMIOS"
        const nuevoCanje = new Canje({
            usuarioNombre: usuarioNombre, // Se guarda como "Josué Pérez Ponce"
            itemNombre: `${ave.especie} ${ave.mutacion || ''}`.trim(),
            itemImagen: ave.fotoUrl, // <--- REVISA: Que el frontend use 'itemImagen'
            cantidad: 1,
            tipo: 'ave',
            itemId: ave._id
        });

        await nuevoCanje.save();
        console.log(`✅ Canje de Ave guardado para: ${usuarioNombre}`);

        res.json({ success: true, ave, canje: nuevoCanje });
    } catch (error) {
        manejarError(res, error, "Error en el canje de ave");
    }
};

// --- LÓGICA DE ADOPCIÓN POR LINK ---

exports.generarLinkAdopcion = async (req, res) => {
    try {
        const token = uuidv4(); 
        await Ave.findByIdAndUpdate(req.params.id, { estado: 'reservado', tokenRegistro: token });
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
        res.json({ success: true, link: `${CLIENT_URL}/registro/${token}` });
    } catch (error) { manejarError(res, error, "Error al generar link"); }
};

exports.obtenerAdopcion = async (req, res) => {
    try {
        const ave = await Ave.findOne({ tokenRegistro: req.params.token });
        if (!ave) return res.status(404).json({ message: 'Link inválido' });
        res.json(ave);
    } catch (error) { manejarError(res, error, "Error al obtener adopción"); }
};

exports.confirmarAdopcion = async (req, res) => {
    try {
        const { nombreAdoptivo, propietario } = req.body;
        const ave = await Ave.findOneAndUpdate(
            { tokenRegistro: req.params.token },
            { 
                nombreAsignado: nombreAdoptivo, 
                propietario: propietario, 
                estado: 'vendido', 
                fechaVenta: new Date() 
            },
            { new: true }
        );

        // 🔥 REGISTRO EN HISTORIAL
        const nuevoCanje = new Canje({
            usuarioNombre: propietario, 
            itemNombre: `${ave.especie} ${ave.mutacion || ''}`.trim(),
            itemImagen: ave.fotoUrl,
            cantidad: 1,
            tipo: 'ave',
            itemId: ave._id
        });
        await nuevoCanje.save();

        res.json({ success: true, ave });
    } catch (error) { manejarError(res, error, "Error al confirmar adopción"); }
};