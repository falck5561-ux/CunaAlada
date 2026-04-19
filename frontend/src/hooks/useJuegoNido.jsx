import { useState, useEffect, useRef } from 'react';

const useJuegoNido = () => {
  // --- ESTADOS DE LA ECONOMÍA CON MEMORIA ---
  const [plumas, setPlumas] = useState(() => {
    const guardado = localStorage.getItem('nido_plumas');
    return guardado !== null ? Number(guardado) : 0;
  });
  const [apuesta, setApuesta] = useState(10);
  const [prediccion, setPrediccion] = useState(null);

  // --- ESTADOS DEL MOTOR ---
  const [fase, setFase] = useState('apuestas');
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [mensaje, setMensaje] = useState({ texto: 'SISTEMA ABIERTO. HAGAN SUS PREDICCIONES.', tipo: 'normal' });
  const [historial, setHistorial] = useState(() => {
    const guardado = localStorage.getItem('nido_historial');
    return guardado !== null ? JSON.parse(guardado) : [];
  });

  // --- ESTADOS DEL MUNDO ---
  const [altitudes, setAltitudes] = useState([1647]);
  const [progresoVuelo, setProgresoVuelo] = useState(0);
  const [progresoPan, setProgresoPan] = useState(0);
  const [ultimoResultado, setUltimoResultado] = useState(null);

  // GUARDADO AUTOMÁTICO DE SALDO E HISTORIAL (Persistencia en F5)
  useEffect(() => {
    localStorage.setItem('nido_plumas', plumas);
  }, [plumas]);

  useEffect(() => {
    localStorage.setItem('nido_historial', JSON.stringify(historial));
  }, [historial]);

  // REFS (Para evitar cierres de scope en animaciones a 60FPS)
  const prediccionRef = useRef(null);
  const apuestaRef = useRef(10);
  const animVueloRef = useRef(null);
  const animPanRef = useRef(null);

  // ========================================================
  // 1. FASE DE APUESTAS (PANEO Y RELOJ CON MEMORIA)
  // ========================================================
  useEffect(() => {
    if (fase === 'apuestas') {
      // Guardamos la hora exacta en la que empezó la ronda para que F5 no la reinicie
      let start = localStorage.getItem('nido_reloj_inicio');
      if (!start) {
        start = Date.now();
        localStorage.setItem('nido_reloj_inicio', start);
      } else {
        start = Number(start);
      }

      const duration = 10000; // 10 Segundos

      const animatePan = () => {
        const elapsed = Date.now() - start;

        // Si ya se acabó el tiempo, borramos la memoria del reloj y volamos
        if (elapsed >= duration) {
          localStorage.removeItem('nido_reloj_inicio');
          iniciarVuelo();
          return;
        }

        const p = Math.min(elapsed / duration, 1);
        const easeP = 1 - Math.pow(1 - p, 3);

        if (altitudes.length > 1) setProgresoPan(easeP);
        setTiempoRestante(Math.max(0, Math.ceil((duration - elapsed) / 1000)));

        animPanRef.current = requestAnimationFrame(animatePan);
      };

      animPanRef.current = requestAnimationFrame(animatePan);
      return () => cancelAnimationFrame(animPanRef.current);
    }
  }, [fase, altitudes.length]);

  // ========================================================
  // 2. MOTOR DE VUELO (LÓGICA CENTRAL)
  // ========================================================
  const iniciarVuelo = () => {
    setFase('volando');
    setMensaje({ texto: '¡DESPEGUE! RASTREANDO VUELO...', tipo: 'turbulencia' });
    setProgresoPan(0);
    setProgresoVuelo(0);

    // Lógica de probabilidad
    const probabilidad = Math.floor(Math.random() * 100) + 1;
    let resReal = '';
    let mult = 0;
    let delta = 0;

    if (probabilidad <= 45) {
      resReal = 'sube';
      mult = 1.5;
      delta = Math.floor(Math.random() * 200 + 100);
    } else if (probabilidad <= 90) {
      resReal = 'baja';
      mult = 1.5;
      delta = -(Math.floor(Math.random() * 200 + 100));
    } else {
      resReal = 'mantiene';
      mult = 3.0;
      delta = 0;
    }

    const nuevaAltitud = altitudes[altitudes.length - 1] + delta;
    setAltitudes((prev) => [...prev, nuevaAltitud]);

    let gano = false;
    let ganancia = 0;
    const montoApostado = Number(apuestaRef.current) || 0;

    if (prediccionRef.current === resReal) {
      gano = true;
      ganancia = Math.floor(montoApostado * mult);
    }
    setUltimoResultado({ gano, ganancia, resultadoReal: resReal });

    let start = Date.now();
    const duration = 6000;

    const animateFlight = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const easeP = p * (2 - p);
      setProgresoVuelo(easeP);
      
      if (p < 1) {
        animVueloRef.current = requestAnimationFrame(animateFlight);
      } else {
        setFase('resultados');
      }
    };
    animVueloRef.current = requestAnimationFrame(animateFlight);
  };

  // ========================================================
  // 3. PROCESAMIENTO DE RESULTADOS
  // ========================================================
  useEffect(() => {
    if (fase === 'resultados' && ultimoResultado) {
      if (prediccionRef.current) {
        if (ultimoResultado.gano) {
          setPlumas((prev) => prev + ultimoResultado.ganancia);
          setMensaje({ texto: `¡ACERTASTE! GANASTE ${ultimoResultado.ganancia} 🪶`, tipo: 'exito' });
        } else {
          setMensaje({ texto: 'RUMBO EQUIVOCADO. PREDICCIÓN FALLIDA.', tipo: 'error' });
        }
      } else {
        setMensaje({ texto: `VUELO TERMINADO: ${ultimoResultado.resultadoReal.toUpperCase()}`, tipo: 'normal' });
      }

      setHistorial((prev) => [
        { altitud: altitudes[altitudes.length - 1], tendencia: ultimoResultado.resultadoReal },
        ...prev
      ].slice(0, 5));

      // Reset para la siguiente ronda
      setTimeout(() => {
        setPrediccion(null);
        prediccionRef.current = null;
        setTiempoRestante(10);
        setProgresoVuelo(0);
        setUltimoResultado(null);
        setMensaje({ texto: 'SISTEMA ABIERTO. HAGAN SUS PREDICCIONES.', tipo: 'normal' });
        setFase('apuestas');
      }, 4000);
    }
  }, [fase]);

  // ========================================================
  // 4. ACCIÓN: COLOCAR APUESTA (NUEVA LÓGICA DE BLOQUEO)
  // ========================================================
  const colocarApuesta = (seleccion) => {
    // 1. Candado: Si ya hizo una predicción, rechazamos el click.
    if (prediccion !== null) {
      return setMensaje({ texto: 'APUESTA BLOQUEADA: Ya participas en esta ronda.', tipo: 'error' });
    }

    const montoActual = Number(apuesta) || 0;
    if (fase !== 'apuestas') return;
    if (montoActual > plumas || montoActual <= 0) {
      return setMensaje({ texto: 'SALDO INSUFICIENTE O INVÁLIDO', tipo: 'error' });
    }

    // 2. Se descuenta el saldo y se fija la apuesta (Ocurre solo 1 vez por ronda)
    setPlumas((prev) => prev - montoActual);
    setPrediccion(seleccion);
    prediccionRef.current = seleccion;
    apuestaRef.current = montoActual;
    setMensaje({ texto: `PREDICCIÓN FIJADA: ${seleccion.toUpperCase()}`, tipo: 'exito' });
  };

  return {
    plumas,
    apuesta,
    setApuesta,
    prediccion,
    fase,
    tiempoRestante,
    mensaje,
    historial,
    altitudes,
    progresoVuelo,
    progresoPan,
    ultimoResultado,
    colocarApuesta
  };
};

export default useJuegoNido;