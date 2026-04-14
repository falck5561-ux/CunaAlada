import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAves = () => {
  const [aves, setAves] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const obtenerAves = async () => {
    setCargando(true);
    setError(false);
    try {
      const res = await axios.get('https://cunaalada-kitw.onrender.com/api/aves');
      const disponibles = res.data.filter(ave => !ave.estado || ave.estado === 'disponible');
      setAves(Array.isArray(disponibles) ? disponibles : []);
    } catch (err) {
      console.error(err);
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
  }, []);

  return { aves, cargando, error, obtenerAves, abrirTodosLosHuevos };
};