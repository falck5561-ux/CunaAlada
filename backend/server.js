const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer'); 
const path = require('path');     
const fs = require('fs');         
require('dotenv').config();

// NUEVO: Importar e inicializar Stripe con la llave secreta del archivo .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Asegúrate de que tienes: const path = require('path'); arriba
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONFIGURACIÓN DE MULTER (EL MOTOR DE FOTOS) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        // Si la carpeta no existe, la crea automáticamente
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Le pone la fecha al nombre para que no se repitan
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado'))
    .catch(err => console.error('❌ Error Mongo:', err));

/* --- MODELOS (Base de Datos) --- */

// 1. Modelo de AVE
const AveSchema = new mongoose.Schema({
    especie: String,
    mutacion: String,
    anillo: String,            
    fechaNacimiento: String,
    precio: Number,            
    precioOriginal: Number,    
    fotoUrl: String, // <--- Aquí guardaremos la ruta de la imagen ("/uploads/...")
    enPromocion: { type: Boolean, default: false },

    // Sistema de Propiedad
    estado: { type: String, default: 'disponible' }, 
    tokenRegistro: String,   
    nombreAsignado: String,  
    propietario: String,     
    fechaVenta: Date
});
const Ave = mongoose.model('Ave', AveSchema);

// 2. Modelo de PRODUCTO
const ProductoSchema = new mongoose.Schema({
    nombre: String,
    categoria: String, 
    precio: Number,
    precioOriginal: Number, 
    stock: Number,
    descripcion: String,
    fotoUrl: String,
    enPromocion: { type: Boolean, default: false }
});
const Producto = mongoose.model('Producto', ProductoSchema);

// 3. Modelo de SORTEO (Importado desde su archivo)
const Sorteo = require('./models/Sorteo');


/* --- RUTAS PARA AVES --- */

app.get('/api/aves', async (req, res) => {
    try {
        const aves = await Ave.find();
        res.json(aves);
    } catch (error) { res.status(500).json(error); }
});

// CREAR AVE (CON FOTO)
app.post('/api/aves', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;

        // Si subieron una imagen, guardamos la ruta en 'fotoUrl'
        if (req.file) {
            datos.fotoUrl = `/uploads/${req.file.filename}`;
        }

        const nuevaAve = new Ave(datos);
        await nuevaAve.save();
        res.json(nuevaAve);
    } catch (error) { res.status(500).json(error); }
});

// EDITAR AVE (CON FOTO)
app.put('/api/aves/:id', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;

        // Si subieron una imagen NUEVA, actualizamos la ruta
        if (req.file) {
            datos.fotoUrl = `/uploads/${req.file.filename}`;
        }

        const aveActualizada = await Ave.findByIdAndUpdate(req.params.id, datos, { new: true });
        res.json({ success: true, message: 'Ave actualizada', ave: aveActualizada });
    } catch (error) { res.status(500).json(error); }
});

app.delete('/api/aves/:id', async (req, res) => {
    try {
        await Ave.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Ave eliminada' });
    } catch (error) { res.status(500).json(error); }
});


/* --- RUTAS SISTEMA DE PROPIEDAD / REGISTRO --- */

app.post('/api/aves/:id/generar-link', async (req, res) => {
    try {
        const token = uuidv4(); 
        await Ave.findByIdAndUpdate(req.params.id, {
            estado: 'reservado',
            tokenRegistro: token
        });
        res.json({ success: true, link: `http://localhost:5173/registro/${token}` });
    } catch (error) { res.status(500).json(error); }
});

app.get('/api/adopcion/:token', async (req, res) => {
    try {
        const ave = await Ave.findOne({ tokenRegistro: req.params.token });
        if (!ave) return res.status(404).json({ message: 'Link inválido o expirado' });
        res.json(ave);
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/adopcion/:token/confirmar', async (req, res) => {
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
        res.json({ success: true, ave });
    } catch (error) { res.status(500).json(error); }
});


/* --- RUTAS PARA PRODUCTOS (CON FOTO TAMBIÉN) --- */

app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/productos', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) {
            datos.fotoUrl = `/uploads/${req.file.filename}`;
        }
        const nuevoProducto = new Producto(datos);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) { res.status(500).json(error); }
});

app.put('/api/productos/:id', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) {
            datos.fotoUrl = `/uploads/${req.file.filename}`;
        }
        await Producto.findByIdAndUpdate(req.params.id, datos);
        res.json({ success: true });
    } catch (error) { res.status(500).json(error); }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { res.status(500).json(error); }
});


/* --- RUTAS PARA SORTEOS --- */

// 1. Obtener todos los sorteos activos
app.get('/api/sorteos', async (req, res) => {
    try {
        const sorteos = await Sorteo.find();
        res.json(sorteos);
    } catch (error) { res.status(500).json(error); }
});

// 2. NUEVO: Crear el intento de pago con Stripe
app.post('/api/sorteos/crear-pago', async (req, res) => {
    try {
        const { sorteoId } = req.body;
        const sorteo = await Sorteo.findById(sorteoId);

        if (!sorteo || sorteo.estado === 'FINALIZADO') {
            return res.status(400).json({ error: 'El sorteo no está disponible' });
        }

        // Stripe maneja el dinero en centavos. Si el boleto cuesta $150 MXN, le enviamos 15000
        const cantidadCentavos = sorteo.precioBoleto * 100;

        // Creamos el intento de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: cantidadCentavos,
            currency: 'mxn', // Pesos mexicanos
            metadata: { 
                sorteoId: sorteo._id.toString()
            }
        });

        // Le devolvemos al frontend un "secreto de cliente" para que pueda mostrar el formulario de tarjeta
        res.json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: 'Hubo un error al procesar el pago' });
    }
});

// 3. Comprar un boleto (Registra en base de datos al confirmar el pago)
app.post('/api/sorteos/:id/comprar', async (req, res) => {
    try {
        const { nombreCliente, telefonoCliente, emailCliente, idPagoStripe } = req.body;
        const sorteo = await Sorteo.findById(req.params.id);

        if (!sorteo || sorteo.estado === 'FINALIZADO') {
            return res.status(400).json({ success: false, message: 'El sorteo no está disponible.' });
        }

        if (sorteo.boletosVendidos.length >= sorteo.totalBoletos) {
            return res.status(400).json({ success: false, message: 'Boletos agotados.' });
        }

        // Registrar el boleto
        sorteo.boletosVendidos.push({
            nombreCliente,
            telefonoCliente,
            emailCliente,
            idPagoStripe
        });

        // Verificar si se vendió el último boleto para cerrar el sorteo
        if (sorteo.boletosVendidos.length === sorteo.totalBoletos) {
            sorteo.estado = 'FINALIZADO';
            
            // Elegir ganador aleatorio
            const indiceGanador = Math.floor(Math.random() * sorteo.totalBoletos);
            const boletoGanador = sorteo.boletosVendidos[indiceGanador];
            
            sorteo.ganador = {
                nombreCliente: boletoGanador.nombreCliente,
                telefonoCliente: boletoGanador.telefonoCliente,
                numeroBoleto: indiceGanador + 1 // +1 para que el boleto no sea 0
            };
        }

        await sorteo.save();
        res.json({ success: true, message: 'Boleto adquirido con éxito', sorteo });
    } catch (error) { res.status(500).json(error); }
});


/* --- LOGIN --- */
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPass) {
        res.json({ success: true, token: 'SESSION_ACTIVE_TOKEN' });
    } else {
        res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor de Cuna Alada corriendo en puerto ${PORT}`));