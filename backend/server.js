require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// --- IMPORTAR RUTAS ---
const aveRoutes = require('./routes/aveRoutes');
const productoRoutes = require('./routes/productoRoutes');
const sorteoRoutes = require('./routes/sorteoRoutes');
const authRoutes = require('./routes/authRoutes');
const adopcionRoutes = require('./routes/adopcionRoutes'); 

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
app.use('/api/aves', aveRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/sorteos', sorteoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/adopcion', adopcionRoutes); 

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Cuna Alada System v6.0 corriendo en puerto ${PORT} (Modo MVC)`);
});