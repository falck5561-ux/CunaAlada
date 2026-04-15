import { useState } from 'react';
import axios from 'axios';
// 1. Importamos nuestra URL inteligente
import { API_URL } from '../config/api'; 

export const useLogin = (setAutorizado) => {
    const [cargando, setCargando] = useState(false);
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('cuna_usuario')));

    // ❌ BORRAMOS esta línea porque ya la tenemos en el config:
    // const API_URL = 'https://cunaalada-kitw.onrender.com';

    const cerrarSesion = () => {
        localStorage.clear();
        setAutorizado(false);
        setUsuario(null);
        window.location.href = '/'; 
    };

    const handleGoogleSuccess = async (resToken) => {
        setCargando(true);
        try {
            // 2. Usamos la variable y QUITAMOS el "/api" del medio 
            // porque ya viene incluido en la constante API_URL
            const res = await axios.post(`${API_URL}/auth/google`, {
                token: resToken.credential
            });

            if (res.data.success) {
                const user = res.data.usuario;
                localStorage.setItem('cuna_token', res.data.token);
                localStorage.setItem('cuna_usuario', JSON.stringify(user));
                
                if (user.rol === 'admin') {
                    localStorage.setItem('adminToken', res.data.token);
                    setAutorizado(true);
                    window.location.href = '/admin'; 
                } else {
                    window.location.href = '/tienda';
                }
            }
        } catch (err) {
            console.error("Error en Google Login:", err);
        } finally {
            setCargando(false);
        }
    };

    return { usuario, cargando, cerrarSesion, handleGoogleSuccess };
};