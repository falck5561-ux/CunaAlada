import { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

export const useRegistro = (token) => {
    const [ave, setAve] = useState(null);
    const [form, setForm] = useState({ nombre: '', propietario: '' });
    const [paso, setPaso] = useState(1);
    const [cargandoEnvio, setCargandoEnvio] = useState(false);
    
    const API_URL = 'https://cunaalada-kitw.onrender.com';

    useEffect(() => {
        if (!token) return;
        axios.get(`${API_URL}/api/adopcion/${token}`)
            .then(res => {
                setAve(res.data);
                if (res.data.nombreAsignado && res.data.nombreAsignado.trim() !== "") {
                    setForm({ nombre: res.data.nombreAsignado, propietario: res.data.propietario });
                    setPaso(2); 
                }
            })
            .catch(err => console.error(err));
    }, [token]);

    const lanzarConfetiExclusivo = () => {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 100 };
        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#F5F5F5', '#E5E4E2'] });
        }, 250);
    };

    const confirmarRegistro = async (e) => {
        e.preventDefault();
        if (!form.nombre || !form.propietario) return;
        setCargandoEnvio(true);
        try {
            await axios.post(`${API_URL}/api/adopcion/${token}/confirmar`, {
                nombreAdoptivo: form.nombre,
                propietario: form.propietario
            });
            setPaso(2);
            setTimeout(lanzarConfetiExclusivo, 500);
        } catch (error) {
            console.error("Error", error);
            alert("Error de conexión");
        } finally {
            setCargandoEnvio(false);
        }
    };

    const formatearFecha = (fecha) => {
        try {
            if (!fecha) return "Fecha Pendiente";
            return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) { return "Fecha Pendiente"; }
    };

    const obtenerUrlImagen = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        let rutaLimpia = path.replace(/\\/g, '/');
        if (rutaLimpia.startsWith('/')) rutaLimpia = rutaLimpia.substring(1);
        return `${API_URL}/${rutaLimpia}`;
    };

    return { 
        ave, form, setForm, paso, cargandoEnvio, 
        confirmarRegistro, formatearFecha, obtenerUrlImagen 
    };
};