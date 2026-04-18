const Usuario = require('../models/Usuario');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '543150877659-0ta3446oi5lm3vbbqa1trga13occu2ht.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.loginGoogle = async (req, res) => {
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
};