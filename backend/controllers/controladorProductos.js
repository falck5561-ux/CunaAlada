const Producto = require('../models/Producto');

exports.obtenerProductos = async (req, res) => {
    try { res.json(await Producto.find()); } catch (error) { res.status(500).json(error); }
};

exports.crearProducto = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const nuevoProducto = new Producto(datos);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) { res.status(500).json(error); }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, datos, { new: true });
        res.json({ success: true, producto: productoActualizado });
    } catch (error) { res.status(500).json(error); }
};

exports.eliminarProducto = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { res.status(500).json(error); }
};