require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); 
const multer = require('multer'); 
const path = require('path');     

// --- SEGURIDAD Y PAGOS ---
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// --- CLOUDINARY ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- MODELOS ---
// Aquí llamamos a los archivos que están en tu carpeta "models"
const Ave = require('./models/Ave');
const Producto = require('./models/Producto');
const Sorteo = require('./models/Sorteo');
const Usuario = require('./models/Usuario');

// --- INICIALIZACIÓN ---
const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '543150877659-0ta3446oi5lm3vbbqa1trga13occu2ht.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE STORAGE (FOTOS) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cuna_alada_fotos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// --- BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado exitosamente'))
    .catch(err => console.error('❌ Error Mongo:', err));


/* =======================================================
   1. RUTAS DE INVENTARIO (AVES)
   ======================================================= */
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


/* =======================================================
   2. RUTAS DE PROPIEDAD Y ADOPCIÓN
   ======================================================= */
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


/* =======================================================
   3. RUTAS DE PRODUCTOS
   ======================================================= */
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
   4. RUTAS DE SORTEOS PREMIUM
   ======================================================= */
app.get('/api/sorteos', async (req, res) => {
    try {
        const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const sorteos = await Sorteo.find({
            $or: [
                { estado: { $ne: 'FINALIZADO' } }, 
                { estado: 'FINALIZADO', updatedAt: { $gte: haceUnaSemana } } 
            ]
        }).populate('aveId');
        
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

app.delete('/api/sorteos/:id', async (req, res) => {
    try {
        await Sorteo.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Sorteo eliminado' });
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/sorteos/crear-pago', async (req, res) => {
    try {
        const { sorteoId, cantidad = 1, numerosElegidos } = req.body;
        const sorteo = await Sorteo.findById(sorteoId);
        
        if (!sorteo || sorteo.estado !== 'ACTIVO') return res.status(400).json({ error: 'Sorteo no disponible' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (sorteo.precioBoleto * cantidad) * 100, 
            currency: 'mxn', 
            metadata: { 
                sorteoId: sorteo._id.toString(),
                numerosBoletos: numerosElegidos && Array.isArray(numerosElegidos) ? numerosElegidos.join(',') : ''
            }
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) { res.status(500).json({ error: 'Error en pago' }); }
});

app.post('/api/sorteos/:id/confirmar-compra', async (req, res) => {
    try {
        const { nombre, email, telefono, numerosBoletos, idPago } = req.body;
        const sorteo = await Sorteo.findById(req.params.id);

        if (!sorteo || sorteo.estado !== 'ACTIVO') {
            return res.status(400).json({ success: false, message: 'El sorteo no está disponible.' });
        }

        const boletosOcupados = sorteo.boletosVendidos.filter(b => numerosBoletos.includes(b.numeroBoleto));
        
        if (boletosOcupados.length > 0) {
            const numerosPerdidos = boletosOcupados.map(b => b.numeroBoleto).join(', ');
            return res.status(400).json({ 
                success: false, 
                message: `Alguien más acaba de comprar los números: ${numerosPerdidos}. Por favor, selecciona otros.` 
            });
        }

        numerosBoletos.forEach(numero => {
            sorteo.boletosVendidos.push({
                nombreCliente: nombre, telefonoCliente: telefono,
                usuarioEmail: email, numeroBoleto: parseInt(numero),
                idPagoStripe: idPago
            });
        });

        if (sorteo.boletosVendidos.length >= sorteo.totalBoletos) {
            sorteo.estado = 'LLENO';
            sorteo.fechaSorteoPlaneada = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        }

        await sorteo.save();
        res.json({ success: true, message: 'Boletos adquiridos con éxito', boletos: numerosBoletos, sorteo });
    } catch (error) { res.status(500).json(error); }
});

app.post('/api/sorteos/:id/revelar', async (req, res) => {
    try {
        const sorteo = await Sorteo.findById(req.params.id).populate('aveId');
        if (sorteo.estado === 'FINALIZADO') return res.status(400).json({ success: false, message: 'El sorteo ya tiene ganador' });

        const indiceGanador = Math.floor(Math.random() * sorteo.boletosVendidos.length);
        const boletoGanador = sorteo.boletosVendidos[indiceGanador];
        
        sorteo.estado = 'FINALIZADO';
        sorteo.ganador = {
            nombreCliente: boletoGanador.nombreCliente, usuarioEmail: boletoGanador.usuarioEmail,
            numeroBoleto: boletoGanador.numeroBoleto
        };

        if(sorteo.aveId) {
            sorteo.aveId.estado = 'vendido';
            sorteo.aveId.propietario = boletoGanador.nombreCliente;
            await sorteo.aveId.save();
        }

        await sorteo.save();
        res.json({ success: true, sorteo });
    } catch (error) { res.status(500).json(error); }
});


/* =======================================================
   5. RUTAS DE AUTENTICACIÓN
   ======================================================= */
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

app.listen(PORT, () => console.log(`🚀 Servidor de Cuna Alada System v6.0 corriendo en puerto ${PORT}`));