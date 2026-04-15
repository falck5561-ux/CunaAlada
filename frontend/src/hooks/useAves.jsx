import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Importamos la URL mágica que configuramos
import { API_URL } from '../config/api'; 

export const useAves = () => {
  const [aves, setAves] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const obtenerAves = async () => {
    setCargando(true);
    setError(false);
    try {
      // 2. Cambiamos la URL de Render por la variable dinámica
      const res = await axios.get(`${API_URL}/aves`);
      
      const disponibles = res.data.filter(ave => !ave.estado || ave.estado === 'disponible');
      setAves(Array.isArray(disponibles) ? disponibles : []);
    } catch (err) {
      console.error("Error al obtener aves:", err);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  const abrirTodosLosHuevos = () => {
    setAves(prevAves => prevAves.map(ave => ({ ...ave, abierto: true })));
  };

  useEffect(() => {
    obtenerAves();
  }, []); // Se ejecuta al cargar el componente

  return { aves, cargando, error, obtenerAves, abrirTodosLosHuevos };
};