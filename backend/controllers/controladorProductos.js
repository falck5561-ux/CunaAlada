const Producto = require('../models/Producto');
const Canje = require('../models/Canje'); 
const Usuario = require('../models/Usuario'); 

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

/**
 * 5. CANJEAR PRODUCTO (Pestaña Tienda)
 * VERSIÓN BLINDADA v2: Bloquea saldos negativos y asegura stock.
 */
exports.canjearProducto = async (req, res) => {
    try {
        const { usuarioNombre, cantidad, costoTotal } = req.body;
        const cantidadARestar = parseInt(cantidad) || 1;

        // --- PASO 1: INTENTAR COBRAR AL USUARIO (CON FILTRO DE SALDO) ---
        // Buscamos al usuario pero SOLO si tiene más o igual plumas que el costoTotal
        const usuarioActualizado = await Usuario.findOneAndUpdate(
            { 
                nombre: usuarioNombre.trim(),
                plumas: { $gte: costoTotal } // 🔥 CANDADO: Evita el saldo negativo
            },
            { $inc: { plumas: -costoTotal } }, 
            { new: true }
        );

        // Si no se encuentra al usuario O no tiene saldo suficiente
        if (!usuarioActualizado) {
            console.error(`❌ INTENTO DE COBRO FALLIDO: "${usuarioNombre}" no existe o no tiene saldo suficiente.`);
            return res.status(400).json({ 
                success: false, 
                error: "Saldo insuficiente o usuario no encontrado. ¡Necesitas más plumas! 🪶" 
            });
        }

        // --- PASO 2: ACTUALIZAR STOCK DEL PRODUCTO ---
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

        // Si no hay stock, devolvemos las plumas al usuario (Rollback manual)
        if (!producto) {
            await Usuario.findOneAndUpdate(
                { nombre: usuarioNombre.trim() },
                { $inc: { plumas: costoTotal } }
            );
            return res.status(400).json({ 
                success: false,
                error: "No hay suficiente stock para la cantidad solicitada. Tus plumas han sido devueltas." 
            });
        }

        // --- PASO 3: REGISTRAR EL CANJE ---
        const nuevoCanje = new Canje({
            usuarioNombre: usuarioNombre.trim(),
            itemId: producto._id,
            itemNombre: producto.nombre,
            itemImagen: producto.fotoUrl,
            cantidad: cantidadARestar,
            tipo: 'producto'
        });

        await nuevoCanje.save();

        // Log en terminal para confirmación real
        console.log(`✅ COMPRA EXITOSA: ${usuarioNombre} canjeó ${producto.nombre} por ${costoTotal} 🪶. Saldo restante: ${usuarioActualizado.plumas}`);

        res.json({ 
            success: true, 
            message: "¡Canje exitoso! Plumas descontadas.",
            canje: nuevoCanje,
            nuevoSaldo: usuarioActualizado.plumas
        });

    } catch (error) {
        console.error("Error crítico en el proceso de canje:", error);
        res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
};