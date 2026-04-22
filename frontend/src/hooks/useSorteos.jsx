import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; 

export const useSorteos = () => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalCompra, setModalCompra] = useState({ show: false, sorteo: null });
    const [numerosSeleccionados, setNumerosSeleccionados] = useState([]); 
    const [datosCliente, setDatosCliente] = useState({ nombre: '', email: '', telefono: '' });
    const [mensajeExito, setMensajeExito] = useState(null);

    // 🔥 CORRECCIÓN CLAVE PARA LA PLENARIA: Leer el email dinámicamente
    const obtenerEmailUsuario = () => {
        const sesion = localStorage.getItem('cuna_usuario');
        if (sesion) {
            try {
                const usuario = JSON.parse(sesion);
                // Si guardas el correo como 'email' o 'correo', ajusta esto si es necesario
                return usuario.email || usuario.correo || ''; 
            } catch (e) {
                return '';
            }
        }
        return '';
    };

    const emailUsuarioActual = obtenerEmailUsuario(); 

    const cargarSorteos = async () => {
        try {
            const res = await axios.get(`${API_URL}/sorteos?publico=true`);
            
            if (res.data && res.data.length > 0) {
                setSorteos(res.data);
            } else {
                setSorteos([]);
            }
        } catch (error) {
            console.error("Error al cargar sorteos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSorteos();
        // Polling: revisa cada 10 segundos
        const interval = setInterval(cargarSorteos, 10000); 
        return () => clearInterval(interval);
    }, []);

    const abrirModal = (sorteo) => {
        setModalCompra({ show: true, sorteo });
        setNumerosSeleccionados([]); 
        
        // Autocompletar el email si el usuario ya está logueado
        setDatosCliente({ 
            nombre: '', 
            email: emailUsuarioActual, 
            telefono: '' 
        }); 
    };

    const toggleNumero = (n) => {
        setNumerosSeleccionados(prev => {
            if (prev.includes(n)) return prev.filter(num => num !== n);
            return [...prev, n];
        });
    };

    const handlePagoExitoso = (boletosComprados) => {
        setMensajeExito(boletosComprados);
        setModalCompra({ show: false, sorteo: null });
        cargarSorteos(); 
    };

    return {
        sorteos, loading, modalCompra, setModalCompra,
        numerosSeleccionados, datosCliente, setDatosCliente,
        mensajeExito, setMensajeExito,
        abrirModal, toggleNumero, handlePagoExitoso, emailUsuarioActual
    };
};