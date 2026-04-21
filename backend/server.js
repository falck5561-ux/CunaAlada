require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const http = require('http'); // 👈 NUEVO: Necesario para WebSockets
const { Server } = require('socket.io'); // 👈 NUEVO: Motor del chat en vivo

// --- 1. IMPORTAR RUTAS ---
const rutasAves = require('./routes/rutasAves');
const rutasProductos = require('./routes/rutasProductos');
const rutasSorteos = require('./routes/rutasSorteos');
const rutasAutenticacion = require('./routes/rutasAutenticacion');
const rutasAdopcion = require('./routes/rutasAdopcion'); 
const rutasBilletera = require('./routes/rutasBilletera');
const rutasCanjes = require('./routes/rutasCanjes');
const rutasUsuarios = require('./routes/rutasUsuarios'); 
const pedidoTiendaRoutes = require('./routes/pedidoTiendaRoutes');
// --- 2. INICIALIZACIÓN ---
const app = express();
const server = http.createServer(app); // 👈 Envolvemos Express en un servidor HTTP
const PORT = process.env.PORT || 5000;

// --- 3. CONFIGURACIÓN DE SOCKET.IO (EL PALOMAR) ---
const io = new Server(server, {
    cors: {
        origin: "*", // Permite que el frontend de Vite se conecte
        methods: ["GET", "POST", "PATCH"]
    }
});

io.on('connection', (socket) => {
    console.log(`🟢 Nuevo aviador conectado al radar: ${socket.id}`);

    // A. Escuchar y retransmitir mensajes normales del chat
    socket.on('enviar_mensaje', (data) => {
        // broadcast.emit lo envía a todos MENOS al que lo escribió
        socket.broadcast.emit('mensaje_recibido', data);
    });

    // B. Escuchar cuando un jugador gana plumas en el juego
    socket.on('jugador_gano', (data) => {
        const mensajeSistema = {
            usuario: 'SISTEMA',
            texto: `🔥 ${data.nombre} acaba de ganar ${data.ganancia} 🪶 apostando a ${data.jugada.toUpperCase()}`,
            tipo: 'sistema'
        };
        // io.emit lo envía a TODOS, incluyendo al ganador
        io.emit('alerta_ganancia', mensajeSistema);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Aviador desconectado: ${socket.id}`);
    });
});

// --- 4. MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json()); 

// Servir carpetas estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. CONEXIÓN A BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cuna-alada')
    .then(() => console.log('✅ MongoDB Conectado: Sistema de La Lonja Alada listo'))
    .catch(err => console.error('❌ Error Mongo:', err));

// --- 6. MONTAR RUTAS (API ENDPOINTS) ---
app.use('/api/aves', rutasAves);
app.use('/api/productos', rutasProductos);
app.use('/api/sorteos', rutasSorteos);
app.use('/api/auth', rutasAutenticacion);
app.use('/api/adopcion', rutasAdopcion); 
app.use('/api/billetera', rutasBilletera);
app.use('/api/canjes', rutasCanjes); 
app.use('/api/usuarios', rutasUsuarios); 
app.use('/api/pedidos-tienda', pedidoTiendaRoutes);
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el Aviario" });
});

// --- 7. INICIO DEL SERVIDOR ---
// 🔥 CAMBIO CLAVE: Usamos server.listen en lugar de app.listen
server.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(`🚀 LA LONJA ALADA SYSTEM v6.0`);
    console.log(`📡 Servidor HTTP y WebSockets corriendo en: http://localhost:${PORT}`);
    console.log(`📂 Modo MVC: Activado`);
    console.log('---------------------------------------------------------');
});