import React from 'react';

const RadarRiesgo = ({ altitudes, fase, progresoVuelo, progresoPan, ultimoResultado }) => {
  // --- LÓGICA DE RENDERIZADO DEL SVG (CÁMARA Y COORDENADAS) ---
  const N = altitudes.length - 1;
  const minAlt = Math.min(...altitudes) - 100;
  const maxAlt = Math.max(...altitudes) + 150;
  const range = Math.max(maxAlt - minAlt, 1);
  
  // Mapea la altitud a la coordenada Y del SVG (0-100)
  const getY = (alt) => 85 - (((alt - minAlt) / range) * 70);

  // Generar el camino (path) de la línea
  let path = `M 10 ${getY(altitudes[0])}`;
  for (let i = 1; i < N; i++) {
    path += ` L ${10 + i * 70} ${getY(altitudes[i])}`;
  }

  let currentX = 10, currentY = getY(altitudes[0]);

  // Si está volando, calculamos la posición exacta en la animación
  if (fase === 'volando') {
    currentX = 10 + (N - 1) * 70 + (progresoVuelo * 70);
    currentY = getY(altitudes[N - 1]) + progresoVuelo * (getY(altitudes[N]) - getY(altitudes[N - 1]));
    path += ` L ${currentX} ${currentY}`;
  } else if (N > 0) {
    currentX = 10 + N * 70;
    currentY = getY(altitudes[N]);
    path += ` L ${currentX} ${currentY}`;
  }

  // Datos para el área sombreada debajo de la línea
  const areaData = `${path} L ${currentX} 100 L 10 100 Z`;

  // Desplazamiento de cámara (Pan)
  let cameraOffset = 0;
  if (N > 0) {
    cameraOffset = fase === 'apuestas' ? -((N - 1) * 70) - (progresoPan * 70) : -((N - 1) * 70);
  }

  // Ángulo del ave según la dirección
  let anguloVuelo = 0;
  if (fase === 'volando' && ultimoResultado) {
    if (ultimoResultado.resultadoReal === 'sube') anguloVuelo = -35;
    if (ultimoResultado.resultadoReal === 'baja') anguloVuelo = 35;
  }

  return (
    <div className="relative w-full h-72 md:h-96 bg-[#06090e] rounded-3xl border-2 border-slate-800 overflow-hidden mb-4 shadow-inner">
      
      {/* Estilos locales para las animaciones del radar */}
      <style>{`
        .bg-radar { 
          background-image: linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px); 
          background-size: 50px 50px; 
        }
        .pixel-image { image-rendering: pixelated; }
        @keyframes vueloSuave { 0%, 100% { transform: scaleX(-1) translateY(0); } 50% { transform: scaleX(-1) translateY(-6px); } }
        .anim-vuelo-suave { animation: vueloSuave 1.2s ease-in-out infinite; }
        @keyframes scrollBackground { from { background-position: 0 0; } to { background-position: -50px 0; } }
        .animate-bg-scroll { animation: scrollBackground 1.5s linear infinite; }
      `}</style>

      {/* Cuadrícula de fondo */}
      <div className={`absolute inset-0 opacity-30 bg-radar ${fase === 'volando' ? 'animate-bg-scroll' : ''}`}></div>
      
      {/* Contenedor con movimiento de cámara */}
      <div className="absolute inset-0 w-full h-full will-change-transform" style={{ transform: `translateX(${cameraOffset}%)` }}>
        
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible z-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="estela" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Sombra debajo de la línea - CORREGIDO: Se cambió polygon por path */}
          <path d={areaData} fill="url(#estela)" stroke="none" />
          
          {/* Línea de trayectoria */}
          <path 
            d={path} 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="1.5" 
            vectorEffect="non-scaling-stroke" 
            className="drop-shadow-[0_0_8px_rgba(34,211,238,1)]" 
          />
        </svg>

        {/* El Agaporni (Ejemplar) */}
        <div 
          className="absolute h-16 w-16 -ml-8 -mt-8 z-20 flex items-center justify-center transition-transform duration-1000 ease-in-out" 
          style={{ left: `${currentX}%`, top: `${currentY}%`, transform: `rotate(${anguloVuelo}deg)` }}
        >
          {fase === 'volando' && <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20"></div>}
          
          <img 
            src={fase === 'volando' ? "/azulv.png" : "/pixel-azul.png"} 
            alt="Ejemplar" 
            className={`relative w-14 h-14 object-contain pixel-image drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] ${fase === 'volando' ? 'anim-vuelo-suave' : ''}`} 
            style={fase !== 'volando' ? { transform: 'scaleX(-1)' } : {}}
          />
        </div>

        {/* Etiqueta de Altitud actual */}
        <div className="absolute z-30 ml-8" style={{ left: `${currentX}%`, top: `calc(${currentY}% + 1.5rem)` }}>
          <span className="bg-slate-900/90 backdrop-blur text-cyan-300 px-3 py-1 rounded-lg border border-cyan-500/30 font-mono text-xs font-bold shadow-xl flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${fase === 'volando' ? 'bg-amber-500 animate-ping' : 'bg-cyan-500'}`}></span>
            {fase === 'volando' 
              ? Math.round(altitudes[N - 1] + progresoVuelo * (altitudes[N] - altitudes[N - 1])) 
              : altitudes[N]} m
          </span>
        </div>

      </div>
    </div>
  );
};

export default RadarRiesgo;