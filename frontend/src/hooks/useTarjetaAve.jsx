import { useState, useRef, useEffect } from 'react';
import { API_URL, BASE_URL } from '../config/api';

export const useTarjetaAve = (ave) => {
  const [eclosionado, setEclosionado] = useState(false);
  const [girado, setGirado] = useState(false);
  const [imgSrc, setImgSrc] = useState('/portada.png');
  const wrapperRef = useRef(null);

  // Inicializar estado de eclosión
  useEffect(() => {
    if (ave?.abierto) {
      setEclosionado(true);
    }
  }, [ave?.abierto]);

  // Lógica de Precios y Ofertas
  const esOferta = ave?.precioOriginal && ave.precioOriginal > ave.precio;
  const porcentajeDescuento = esOferta 
    ? Math.round(((ave.precioOriginal - ave.precio) / ave.precioOriginal) * 100) 
    : 0;

  const estilos = {
    colorAcento: esOferta ? "text-red-600" : "text-emerald-600",
    bgAcento: esOferta ? "bg-red-50" : "bg-emerald-50",
    iconoColor: esOferta ? "text-red-500" : "text-emerald-500",
    bordeOferta: esOferta ? "border-2 border-red-500 shadow-xl shadow-red-100" : ""
  };

  useEffect(() => {
  if (ave?.fotoUrl) {
    if (ave.fotoUrl.startsWith('/subidaArchivoss')) {
      // ✅ Cambiamos la URL de Render por la variable BASE_URL
      setImgSrc(`${BASE_URL}${ave.fotoUrl}`);
    } else {
      setImgSrc(ave.fotoUrl);
    }
  } else if (ave?.foto) { 
      // ✅ Aquí también
      setImgSrc(`${BASE_URL}${ave.foto}`);
  } else {
    setImgSrc("/portada.png"); 
  }
}, [ave, BASE_URL]);

  // Lógica de Interacción (Linterna en el huevo)
  const updateMask = (clientX, clientY) => {
    if (!wrapperRef.current || eclosionado) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    wrapperRef.current.style.setProperty('--x', `${x}px`);
    wrapperRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleMouseMove = (e) => updateMask(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    updateMask(touch.clientX, touch.clientY);
  };

  const romperHuevo = (e) => {
    if (e) e.stopPropagation();
    try {
        const audio = new Audio('/click.mp3');
        audio.volume = 0.5; 
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("Audio no disponible, continuando...");
            });
        }
    } catch (e) {
        console.log("Audio no soportado");
    }
    setEclosionado(true);
  };

  const toggleGiro = () => setGirado(prev => !prev);

  const formatoMXN = new Intl.NumberFormat('es-MX', {
    style: 'decimal', minimumFractionDigits: 0
  });

  return {
    eclosionado, girado, toggleGiro, imgSrc, wrapperRef,
    esOferta, porcentajeDescuento, estilos, formatoMXN,
    handleMouseMove, handleTouchMove, romperHuevo
  };
};