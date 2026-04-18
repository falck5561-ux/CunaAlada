import { useState } from 'react';
import axios from 'axios';
// 1. Importamos nuestra URL inteligente
import { API_URL } from '../config/api'; 

export const useInicioSesion = (setAutorizado) => {
    const [cargando, setCargando] = useState(false);
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('cuna_usuario')));

    

    const cerrarSesion = () => {
        localStorage.clear();
        setAutorizado(false);
        setUsuario(null);
        window.location.href = '/'; 
    };

    const handleGoogleSuccess = async (resToken) => {
        setCargando(true);
        try {
            
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