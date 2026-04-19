require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// --- IMPORTAR RUTAS ---
const rutasAves = require('./routes/rutasAves');
const rutasProductos = require('./routes/rutasProductos');
const rutasSorteos = require('./routes/rutasSorteos');
const rutasAutenticacion = require('./routes/rutasAutenticacion');
const rutasAdopcion = require('./routes/rutasAdopcion'); 
const rutasBilletera = require('./routes/rutasBilletera');

// --- INICIALIZACIÓN ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// Servir carpetas estáticas para que se vean las fotos de las aves
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado exitosamente'))
    .catch(err => console.error('❌ Error Mongo:', err));

// --- MONTAR RUTAS ---
app.use('/api/aves', rutasAves);
app.use('/api/productos', rutasProductos);
app.use('/api/sorteos', rutasSorteos);
app.use('/api/auth', rutasAutenticacion);
app.use('/api/adopcion', rutasAdopcion); 
app.use('/api/billetera', rutasBilletera);

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Cuna Alada System v6.0 corriendo en puerto ${PORT} (Modo MVC)`);
});