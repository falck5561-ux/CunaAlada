import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSorteos = () => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalCompra, setModalCompra] = useState({ show: false, sorteo: null });
    const [numerosSeleccionados, setNumerosSeleccionados] = useState([]); 
    const [datosCliente, setDatosCliente] = useState({ nombre: '', email: '', telefono: '' });
    const [mensajeExito, setMensajeExito] = useState(null);

    // MOCK DEL USUARIO LOGUEADO
    const emailUsuarioActual = "josueponcearch@gmail.com"; 

    const cargarSorteos = async () => {
        try {
            const res = await axios.get('https://cunaalada-kitw.onrender.com/api/sorteos');
            if (res.data && res.data.length > 0) {
                setSorteos(res.data);
            } else {
                setSorteos([{
                    _id: 'demo-1',
                    premio: 'Agapornis Fisher - Mutación Arlequín Azul',
                    descripcion: 'Hermoso ejemplar papillero de 25 días. Criado a mano, dócil y con excelente genética.',
                    fotoUrl: '/portada.png', 
                    precioBoleto: 150,
                    totalBoletos: 50,
                    boletosVendidos: [], 
                    estado: 'ACTIVO'
                }]);
            }
        } catch (error) {
            console.error("Error al cargar sorteos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSorteos();
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
        cargarSorteos(); 
    };

    return {
        sorteos, loading, modalCompra, setModalCompra,
        numerosSeleccionados, datosCliente, setDatosCliente,
        mensajeExito, setMensajeExito,
        abrirModal, toggleNumero, handlePagoExitoso, emailUsuarioActual
    };
};