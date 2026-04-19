require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// --- 1. IMPORTAR RUTAS ---
const rutasAves = require('./routes/rutasAves');
const rutasProductos = require('./routes/rutasProductos');
const rutasSorteos = require('./routes/rutasSorteos');
const rutasAutenticacion = require('./routes/rutasAutenticacion');
const rutasAdopcion = require('./routes/rutasAdopcion'); 
const rutasBilletera = require('./routes/rutasBilletera');
const rutasCanjes = require('./routes/rutasCanjes');
const rutasUsuarios = require('./routes/rutasUsuarios'); 

// --- 2. INICIALIZACIÓN ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json()); 

// Servir carpetas estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. CONEXIÓN A BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado: Sistema de La Lonja Alada listo'))
    .catch(err => console.error('❌ Error Mongo:', err));

// --- 5. MONTAR RUTAS (API ENDPOINTS) ---
app.use('/api/aves', rutasAves);
app.use('/api/productos', rutasProductos);
app.use('/api/sorteos', rutasSorteos);
app.use('/api/auth', rutasAutenticacion);
app.use('/api/adopcion', rutasAdopcion); 
app.use('/api/billetera', rutasBilletera);
app.use('/api/canjes', rutasCanjes); 
app.use('/api/usuarios', rutasUsuarios); 


app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el Aviario" });
});

// --- 7. INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(`🚀 LA LONJA ALADA SYSTEM v6.0`);
    console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📂 Modo MVC: Activado`);
    console.log('---------------------------------------------------------');
});