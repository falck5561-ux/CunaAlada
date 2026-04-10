const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer'); 
const path = require('path');     
require('dotenv').config();

// --- IMPORTACIONES PARA GOOGLE LOGIN Y SEGURIDAD ---
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// --- NUEVAS IMPORTACIONES PARA CLOUDINARY (Fotos inmortales) ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Inicializar Stripe con la llave secreta del archivo .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configuración del Cliente de Google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '543150877659-0ta3446oi5lm3vbbqa1trga13occu2ht.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE CLOUDINARY ---
// Lee las llaves mágicas que pusiste en el Environment de Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- NUEVO MOTOR DE FOTOS (Sube directo a la nube) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cuna_alada_fotos', // Se creará esta carpeta en tu cuenta de Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado exitosamente'))
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
    fotoUrl: String, 
    enPromocion: { type: Boolean, default: false },
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

// 3. Importación de modelos externos
const Sorteo = require('./models/Sorteo');
const Usuario = require('./models/Usuario');


/* --- RUTAS PARA AVES --- */

app.get('/api/aves', async (req, res) => {
    try {
        const aves = await Ave.find();
        res.json(aves);
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/aves', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        // Ahora req.file.path contiene la URL pública y segura de Cloudinary
        if (req.file) {
            datos.fotoUrl = req.file.path;
        }
        const nuevaAve = new Ave(datos);
        await nuevaAve.save();
        res.json(nuevaAve);
    } catch (error) { res.status(500).json(error); }
});

app.put('/api/aves/:id', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        // Si el usuario subió una foto nueva al editar, actualizamos la URL de Cloudinary
        if (req.file) {
            datos.fotoUrl = req.file.path;
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
        // IMPORTANTE: URL de producción actualizada
        res.json({ success: true, link: `https://cuna-alada-web.onrender.com/registro/${token}` });
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


/* --- RUTAS PARA PRODUCTOS --- */

app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/productos', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        // La tienda también usa Cloudinary ahora
        if (req.file) {
            datos.fotoUrl = req.file.path;
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
            datos.fotoUrl = req.file.path;
        }
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, datos, { new: true });
        res.json({ success: true, producto: productoActualizado });
    } catch (error) { res.status(500).json(error); }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) { res.status(500).json(error); }
});


/* --- RUTAS PARA SORTEOS --- */

app.get('/api/sorteos', async (req, res) => {
    try {
        const sorteos = await Sorteo.find();
        res.json(sorteos);
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/sorteos/crear-pago', async (req, res) => {
    try {
        const { sorteoId } = req.body;
        const sorteo = await Sorteo.findById(sorteoId);
        if (!sorteo) return res.status(400).json({ error: 'No disponible' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: sorteo.precioBoleto * 100,
            currency: 'mxn', 
            metadata: { sorteoId: sorteo._id.toString() }
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) { res.status(500).json(error); }
});


/* --- LOGIN DE ADMINISTRADOR (TRADICIONAL) --- */
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPass) {
        res.json({ success: true, token: 'SESSION_ACTIVE_TOKEN' });
    } else {
        res.status(401).json({ success: false });
    }
});


/* --- LOGIN INTELIGENTE CON GOOGLE (CLIENTES Y ADMIN) --- */
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name: nombre, picture: foto } = payload;

        // AQUÍ SE DEFINE AL JEFE (Administrador)
        const CORREO_ADMIN = 'falck5561@gmail.com'; 
        const esAdministrador = email.toLowerCase() === CORREO_ADMIN.toLowerCase();

        let usuario = await Usuario.findOne({ email: email.toLowerCase() });
        
        if (!usuario) {
            // Si es nuevo, le asignamos el rol dependiendo de su correo
            usuario = new Usuario({ 
                googleId, 
                email: email.toLowerCase(), 
                nombre, 
                foto,
                rol: esAdministrador ? 'admin' : 'cliente'
            });
            await usuario.save();
        } else {
            // Si ya existe pero entra el admin, le aseguramos el rol
            if (esAdministrador && usuario.rol !== 'admin') {
                usuario.rol = 'admin';
                await usuario.save();
            }
        }

        const sessionToken = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET || 'CunaAladaMasterKey_2026',
            { expiresIn: '7d' }
        );

        res.json({ success: true, token: sessionToken, usuario });
    } catch (error) {
        console.error("Error Auth:", error);
        res.status(401).json({ success: false, message: 'Fallo al validar cuenta' });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor de Cuna Alada System v5.0 (Cloudinary) corriendo en puerto ${PORT}`));