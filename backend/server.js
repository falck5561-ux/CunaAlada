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

// --- IMPORTACIONES DE CLOUDINARY PARA FOTOS INMORTALES ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- STRIPE CONECTADO DE FORMA SEGURA (Lee desde el archivo .env) ---
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
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- MOTOR DE FOTOS (Sube directo a la nube) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cuna_alada_fotos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado exitosamente'))
    .catch(err => console.error('❌ Error Mongo:', err));

/* --- MODELOS (Base de Datos) --- */
const AveSchema = new mongoose.Schema({
    especie: String, mutacion: String, anillo: String, fechaNacimiento: String,
    precio: Number, precioOriginal: Number, fotoUrl: String, enPromocion: { type: Boolean, default: false },
    estado: { type: String, default: 'disponible' }, tokenRegistro: String,   
    nombreAsignado: String, propietario: String, fechaVenta: Date
});
const Ave = mongoose.model('Ave', AveSchema);

const ProductoSchema = new mongoose.Schema({
    nombre: String, categoria: String, precio: Number, precioOriginal: Number, 
    stock: Number, descripcion: String, fotoUrl: String, enPromocion: { type: Boolean, default: false }
});
const Producto = mongoose.model('Producto', ProductoSchema);

const Sorteo = require('./models/Sorteo');
const Usuario = require('./models/Usuario');

/* --- RUTAS PARA AVES --- */
app.get('/api/aves', async (req, res) => {
    try { res.json(await Ave.find()); } catch (error) { res.status(500).json(error); }
});

app.post('/api/aves', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path; 
        const nuevaAve = new Ave(datos);
        await nuevaAve.save();
        res.json(nuevaAve);
    } catch (error) { res.status(500).json(error); }
});

app.put('/api/aves/:id', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
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
        await Ave.findByIdAndUpdate(req.params.id, { estado: 'reservado', tokenRegistro: token });
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
            { nombreAsignado: nombreAdoptivo, propietario: propietario, estado: 'vendido', fechaVenta: new Date() },
            { new: true }
        );
        res.json({ success: true, ave });
    } catch (error) { res.status(500).json(error); }
});

/* --- RUTAS PARA PRODUCTOS --- */
app.get('/api/productos', async (req, res) => {
    try { res.json(await Producto.find()); } catch (error) { res.status(500).json(error); }
});

app.post('/api/productos', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
        const nuevoProducto = new Producto(datos);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) { res.status(500).json(error); }
});

app.put('/api/productos/:id', upload.single('foto'), async (req, res) => {
    try {
        const datos = req.body;
        if (req.file) datos.fotoUrl = req.file.path;
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

/* =======================================================
   --- RUTAS PARA SORTEOS (VERSIÓN PREMIUM FINAL) --- 
   ======================================================= */

// 1. Obtener Sorteos 
app.get('/api/sorteos', async (req, res) => {
    try {
        const sorteos = await Sorteo.find().populate('aveId');
        
        const sorteosFormateados = sorteos.map(sorteo => {
            const sorteoObj = sorteo.toObject();
            if (sorteoObj.aveId) {
                sorteoObj.fotoUrl = sorteoObj.aveId.foto || sorteoObj.aveId.fotoUrl;
                sorteoObj.premio = sorteoObj.titulo; 
            }
            return sorteoObj;
        });

        res.json(sorteosFormateados);
    } catch (error) { res.status(500).json(error); }
});

// 2. Admin: Crear Sorteo Y BLOQUEAR AVE
app.post('/api/sorteos', async (req, res) => {
    try {
        const nuevoSorteo = new Sorteo(req.body);
        await nuevoSorteo.save();

        if (req.body.aveId) {
            await Ave.findByIdAndUpdate(req.body.aveId, { estado: 'reservado' });
        }

        res.json({ success: true, sorteo: nuevoSorteo });
    } catch (error) { res.status(500).json(error); }
});

// 2.5 Admin: Eliminar Sorteo 
app.delete('/api/sorteos/:id', async (req, res) => {
    try {
        await Sorteo.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Sorteo eliminado' });
    } catch (error) { res.status(500).json(error); }
});

// 3. Cliente: Crear intención de pago (Stripe) con total correcto
app.post('/api/sorteos/crear-pago', async (req, res) => {
    try {
        const { sorteoId, cantidad = 1, numeroElegido } = req.body;
        const sorteo = await Sorteo.findById(sorteoId);
        
        if (!sorteo || sorteo.estado !== 'ACTIVO') return res.status(400).json({ error: 'Sorteo no disponible' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (sorteo.precioBoleto * cantidad) * 100, // Multiplicado por 100 para los centavos de Stripe
            currency: 'mxn', 
            metadata: { 
                sorteoId: sorteo._id.toString(),
                numeroBoleto: numeroElegido ? numeroElegido.toString() : ''
            }
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) { res.status(500).json({ error: 'Error en pago' }); }
});

// 4. Cliente: Confirmar Compra y Guardar su Número Elegido
app.post('/api/sorteos/:id/confirmar-compra', async (req, res) => {
    try {
        const { nombre, email, telefono, numeroBoleto, idPago } = req.body;
        const sorteo = await Sorteo.findById(req.params.id);

        if (!sorteo || sorteo.estado !== 'ACTIVO') {
            return res.status(400).json({ success: false, message: 'El sorteo no está disponible.' });
        }

        // Verificamos que alguien más no haya ganado ese número mientras pagaban
        const ocupado = sorteo.boletosVendidos.find(b => b.numeroBoleto === parseInt(numeroBoleto));
        if (ocupado) {
            return res.status(400).json({ success: false, message: 'Ese número se acaba de vender, intenta con otro.' });
        }

        // Guardamos el boleto exactamente como lo manda el frontend
        sorteo.boletosVendidos.push({
            nombreCliente: nombre,
            telefonoCliente: telefono,
            usuarioEmail: email,
            numeroBoleto: parseInt(numeroBoleto),
            idPagoStripe: idPago
        });

        // Si se vendió el último boleto, activar la fase "LLENO" 
        if (sorteo.boletosVendidos.length >= sorteo.totalBoletos) {
            sorteo.estado = 'LLENO';
            let fechaSorteo = new Date();
            fechaSorteo.setHours(fechaSorteo.getHours() + 24);
            sorteo.fechaSorteoPlaneada = fechaSorteo;
        }

        await sorteo.save();
        res.json({ success: true, message: 'Boleto adquirido con éxito', boleto: numeroBoleto, sorteo });
    } catch (error) { res.status(500).json(error); }
});

// 5. Admin: Revelar Ganador
app.post('/api/sorteos/:id/revelar', async (req, res) => {
    try {
        const sorteo = await Sorteo.findById(req.params.id).populate('aveId');
        
        if (sorteo.estado === 'FINALIZADO') return res.status(400).json({ success: false, message: 'El sorteo ya tiene ganador' });

        // Elegir ganador al azar
        const indiceGanador = Math.floor(Math.random() * sorteo.boletosVendidos.length);
        const boletoGanador = sorteo.boletosVendidos[indiceGanador];
        
        sorteo.estado = 'FINALIZADO';
        sorteo.ganador = {
            nombreCliente: boletoGanador.nombreCliente,
            usuarioEmail: boletoGanador.usuarioEmail,
            numeroBoleto: boletoGanador.numeroBoleto
        };

        // Cambiar el estado del ave a "vendido" oficial
        if(sorteo.aveId) {
            sorteo.aveId.estado = 'vendido';
            sorteo.aveId.propietario = boletoGanador.nombreCliente;
            await sorteo.aveId.save();
        }

        await sorteo.save();
        res.json({ success: true, sorteo });
    } catch (error) { res.status(500).json(error); }
});

/* --- LOGIN INTELIGENTE CON GOOGLE --- */
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
        const { sub: googleId, email, name: nombre, picture: foto } = ticket.getPayload();

        const CORREO_ADMIN = 'falck5561@gmail.com'; 
        const esAdministrador = email.toLowerCase() === CORREO_ADMIN.toLowerCase();

        let usuario = await Usuario.findOne({ email: email.toLowerCase() });
        
        if (!usuario) {
            usuario = new Usuario({ googleId, email: email.toLowerCase(), nombre, foto, rol: esAdministrador ? 'admin' : 'cliente' });
            await usuario.save();
        } else if (esAdministrador && usuario.rol !== 'admin') {
            usuario.rol = 'admin';
            await usuario.save();
        }

        const sessionToken = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET || 'CunaAladaMasterKey_2026',
            { expiresIn: '7d' }
        );
        res.json({ success: true, token: sessionToken, usuario });
    } catch (error) { res.status(401).json({ success: false }); }
});

app.listen(PORT, () => console.log(`🚀 Servidor de Cuna Alada System v6.0 (Sorteos Premium) corriendo en puerto ${PORT}`));