import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const useJuegoNido = (setUsuarioGlobal) => {
  // --- 1. ESTADOS DE LA ECONOMÍA (Sincronizados con la App) ---
  const [plumas, setPlumas] = useState(() => {
    // Leemos directamente del objeto de usuario global
    const guardado = JSON.parse(localStorage.getItem('cuna_usuario'));
    return guardado ? Number(guardado.plumas) : 0;
  });

  const [apuesta, setApuesta] = useState(10);
  const [prediccion, setPrediccion] = useState(null);

  // --- 2. ESTADOS DEL MOTOR ---
  const [fase, setFase] = useState('apuestas');
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [mensaje, setMensaje] = useState({ texto: 'SISTEMA ABIERTO. HAGAN SUS PREDICCIONES.', tipo: 'normal' });
  const [historial, setHistorial] = useState(() => {
    const guardado = localStorage.getItem('nido_historial');
    return guardado !== null ? JSON.parse(guardado) : [];
  });

  // --- 3. ESTADOS DEL MUNDO ---
  const [altitudes, setAltitudes] = useState([1647]);
  const [progresoVuelo, setProgresoVuelo] = useState(0);
  const [progresoPan, setProgresoPan] = useState(0);
  const [ultimoResultado, setUltimoResultado] = useState(null);

  // REFS para animaciones
  const prediccionRef = useRef(null);
  const apuestaRef = useRef(10);
  const animVueloRef = useRef(null);
  const animPanRef = useRef(null);

  // ========================================================
  // 🔥 FUNCIÓN DE SINCRONIZACIÓN AGRESIVA
  // ========================================================
  const sincronizarTodo = async (nuevoSaldo) => {
    const userLocal = JSON.parse(localStorage.getItem('cuna_usuario'));
    if (!userLocal) return;

    // 1. Actualizar el objeto local para persistencia
    const usuarioActualizado = { ...userLocal, plumas: nuevoSaldo };
    localStorage.setItem('cuna_usuario', JSON.stringify(usuarioActualizado));

    // 2. Actualizar el Header (App.jsx) inmediatamente
    if (setUsuarioGlobal) {
      setUsuarioGlobal(usuarioActualizado);
    }

    // 3. Guardar en MongoDB (Segundo plano)
    try {
      await axios.patch(`${API_URL}/usuarios/sincronizar-plumas`, {
        email: userLocal.email,
        plumas: nuevoSaldo
      });
    } catch (err) {
      console.error("Error al guardar en nube:", err);
    }
  };

  // Guardado de historial
  useEffect(() => {
    localStorage.setItem('nido_historial', JSON.stringify(historial));
  }, [historial]);

  // ========================================================
  // LÓGICA DEL RELOJ Y VUELO
  // ========================================================
  useEffect(() => {
    if (fase === 'apuestas') {
      let start = localStorage.getItem('nido_reloj_inicio') || Date.now();
      localStorage.setItem('nido_reloj_inicio', start);

      const duration = 10000;
      const animatePan = () => {
        const elapsed = Date.now() - Number(start);
        if (elapsed >= duration) {
          localStorage.removeItem('nido_reloj_inicio');
          iniciarVuelo();
          return;
        }
        setProgresoPan(Math.min(elapsed / duration, 1));
        setTiempoRestante(Math.max(0, Math.ceil((duration - elapsed) / 1000)));
        animPanRef.current = requestAnimationFrame(animatePan);
      };
      animPanRef.current = requestAnimationFrame(animatePan);
      return () => cancelAnimationFrame(animPanRef.current);
    }
  }, [fase]);

  const iniciarVuelo = () => {
    setFase('volando');
    setMensaje({ texto: '¡DESPEGUE! RASTREANDO VUELO...', tipo: 'turbulencia' });

    const probabilidad = Math.floor(Math.random() * 100) + 1;
    let resReal = '', mult = 0, delta = 0;

    if (probabilidad <= 45) { resReal = 'sube'; mult = 1.5; delta = 150; }
    else if (probabilidad <= 90) { resReal = 'baja'; mult = 1.5; delta = -150; }
    else { resReal = 'mantiene'; mult = 3.0; delta = 0; }

    const nuevaAltitud = altitudes[altitudes.length - 1] + delta;
    setAltitudes((prev) => [...prev, nuevaAltitud]);

    const gano = prediccionRef.current === resReal;
    const ganancia = gano ? Math.floor(Number(apuestaRef.current) * mult) : 0;
    setUltimoResultado({ gano, ganancia, resultadoReal: resReal });

    let start = Date.now();
    const animateFlight = () => {
      const p = Math.min((Date.now() - start) / 6000, 1);
      setProgresoVuelo(p * (2 - p));
      if (p < 1) animVueloRef.current = requestAnimationFrame(animateFlight);
      else setFase('resultados');
    };
    animVueloRef.current = requestAnimationFrame(animateFlight);
  };

  // ========================================================
  // PROCESAMIENTO Y RESET
  // ========================================================
  useEffect(() => {
    if (fase === 'resultados' && ultimoResultado) {
      if (prediccionRef.current && ultimoResultado.gano) {
        const nuevoSaldo = plumas + ultimoResultado.ganancia;
        setPlumas(nuevoSaldo);
        setMensaje({ texto: `¡ACERTASTE! GANASTE ${ultimoResultado.ganancia} 🪶`, tipo: 'exito' });
        sincronizarTodo(nuevoSaldo); // 🚩 Sincronizamos Ganancia
      } else if (prediccionRef.current) {
        setMensaje({ texto: 'RUMBO EQUIVOCADO. PREDICCIÓN FALLIDA.', tipo: 'error' });
      }

      setHistorial((prev) => [{ altitud: altitudes[altitudes.length - 1], tendencia: ultimoResultado.resultadoReal }, ...prev].slice(0, 5));

      setTimeout(() => {
        setPrediccion(null);
        prediccionRef.current = null;
        setFase('apuestas');
      }, 4000);
    }
  }, [fase]);

  // ========================================================
  // ACCIÓN: COLOCAR APUESTA
  // ========================================================
  const colocarApuesta = (seleccion) => {
    if (prediccion !== null || fase !== 'apuestas') return;
    
    const monto = Number(apuesta);
    if (monto > plumas || monto <= 0) {
      return setMensaje({ texto: 'SALDO INSUFICIENTE', tipo: 'error' });
    }

    const nuevoSaldo = plumas - monto;
    
    // 1. Actualizamos estado local
    setPlumas(nuevoSaldo);
    setPrediccion(seleccion);
    prediccionRef.current = seleccion;
    apuestaRef.current = monto;

    // 2. 🔥 Sincronizamos la resta inmediatamente (Header y DB)
    sincronizarTodo(nuevoSaldo); 

    setMensaje({ texto: `PREDICCIÓN FIJADA: ${seleccion.toUpperCase()}`, tipo: 'exito' });
  };

  return {
    plumas, apuesta, setApuesta, prediccion, fase, tiempoRestante, 
    mensaje, historial, altitudes, progresoVuelo, progresoPan, 
    ultimoResultado, colocarApuesta
  };
};

export default useJuegoNido;