import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; 

export const useInicioSesion = (setAutorizado) => {
    const [cargando, setCargando] = useState(false);
    // Inicializamos el usuario desde localStorage si existe
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('cuna_usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    const cerrarSesion = () => {
        // Limpiamos todo rastro local
        localStorage.clear();
        if (setAutorizado) setAutorizado(false);
        setUsuario(null);
        // Redirigimos al inicio
        window.location.href = '/'; 
    };

    const handleGoogleSuccess = async (resToken) => {
        setCargando(true);
        try {
            const res = await axios.post(`${API_URL}/auth/google`, {
                token: resToken.credential
            });

            if (res.data.success) {
                const user = res.data.usuario; // Este ya trae las plumas de la DB
                
                // 1. Guardamos el token y el usuario completo
                localStorage.setItem('cuna_token', res.data.token);
                localStorage.setItem('cuna_usuario', JSON.stringify(user));
                
                // 2. 🔥 LA CLAVE: Guardamos las plumas en el campo que usa tu Catálogo
                // Esto asegura que al entrar a la tienda, el saldo sea el real de MongoDB
                localStorage.setItem('nido_plumas', user.plumas || 0);
                
                setUsuario(user);

                // 3. Manejo de roles y redirección
                if (user.rol === 'admin') {
                    localStorage.setItem('adminToken', res.data.token);
                    if (setAutorizado) setAutorizado(true);
                    window.location.href = '/admin'; 
                } else {
                    if (setAutorizado) setAutorizado(true);
                    window.location.href = '/tienda';
                }
            }
        } catch (err) {
            console.error("❌ Error en Google Login:", err);
            alert("Error al conectar con el servidor. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    return { usuario, cargando, cerrarSesion, handleGoogleSuccess };
};