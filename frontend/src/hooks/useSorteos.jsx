import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Importamos la URL dinámica
import { API_URL } from '../config/api'; 

export const useSorteos = () => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalCompra, setModalCompra] = useState({ show: false, sorteo: null });
    const [numerosSeleccionados, setNumerosSeleccionados] = useState([]); 
    const [datosCliente, setDatosCliente] = useState({ nombre: '', email: '', telefono: '' });
    const [mensajeExito, setMensajeExito] = useState(null);

    // Aquí puedes poner el email del usuario logueado si lo tienes en el context
    const emailUsuarioActual = "josueponcearch@gmail.com"; 

    const cargarSorteos = async () => {
        try {
            // 🔥 CAMBIO CLAVE: Agregamos ?publico=true a la URL.
            // Esto le avisa al backend que solo queremos los sorteos que NO están ocultos.
            const res = await axios.get(`${API_URL}/sorteos?publico=true`);
            
            if (res.data && res.data.length > 0) {
                setSorteos(res.data);
            } else {
                // Si la base de datos responde vacío o no hay visibles, 
                // puedes dejar la lista vacía o poner el demo.
                setSorteos([]);
            }
        } catch (error) {
            console.error("Error al cargar sorteos:", error);
            // Si hay un error, dejamos la lista como estaba para no romper la UI
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSorteos();
        // Polling: revisa cada 10 segundos si hay nuevos boletos vendidos o nuevos sorteos
        const interval = setInterval(cargarSorteos, 10000); 
        return () => clearInterval(interval);
    }, []);

    const abrirModal = (sorteo) => {
        setModalCompra({ show: true, sorteo });
        setNumerosSeleccionados([]); 
        setDatosCliente({ nombre: '', email: '', telefono: '' }); 
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
        cargarSorteos(); // Recargamos para que se vean los nuevos boletos ocupados
    };

    return {
        sorteos, loading, modalCompra, setModalCompra,
        numerosSeleccionados, datosCliente, setDatosCliente,
        mensajeExito, setMensajeExito,
        abrirModal, toggleNumero, handlePagoExitoso, emailUsuarioActual
    };
};