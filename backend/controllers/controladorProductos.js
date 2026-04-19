const Producto = require('../models/Producto');
const Canje = require('../models/Canje'); 

// 1. Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try { 
        res.json(await Producto.find()); 
    } catch (error) { 
        res.status(500).json({ error: "Error al obtener productos" }); 
    }
};

// 2. Crear un nuevo producto
exports.crearProducto = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const nuevoProducto = new Producto(datos);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) { 
        res.status(500).json({ error: "Error al crear producto" }); 
    }
};

// 3. Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id, 
            datos, 
            { new: true }
        );
        res.json({ success: true, producto: productoActualizado });
    } catch (error) { 
        res.status(500).json({ error: "Error al actualizar" }); 
    }
};

// 4. Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { 
        res.status(500).json({ error: "Error al eliminar" }); 
    }
};


exports.canjearProducto = async (req, res) => {
    try {
        const { usuarioNombre, cantidad } = req.body;
        const cantidadARestar = parseInt(cantidad) || 1;

        // A. Buscamos y actualizamos el stock del producto
        const producto = await Producto.findOneAndUpdate(
            { 
                _id: req.params.id, 
                stock: { $gte: cantidadARestar } 
            }, 
            { 
                $inc: { stock: -cantidadARestar } 
            },
            { new: true }
        );

        if (!producto) {
            return res.status(400).json({ 
                error: "No hay suficiente stock para la cantidad solicitada" 
            });
        }

        // B. CREAMOS EL REGISTRO EN LA COLECCIÓN DE CANJES
        // Esto es lo que aparecerá en "Mis Premios" aunque el stock se acabe
        const nuevoCanje = new Canje({
            usuarioNombre: usuarioNombre,
            itemId: producto._id,
            itemNombre: producto.nombre,
            itemImagen: producto.fotoUrl,
            cantidad: cantidadARestar,
            tipo: 'producto'
        });

        await nuevoCanje.save();

        res.json({ 
            success: true, 
            message: "Canje registrado en tu historial",
            canje: nuevoCanje 
        });

    } catch (error) {
        console.error("Error en canje con persistencia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};