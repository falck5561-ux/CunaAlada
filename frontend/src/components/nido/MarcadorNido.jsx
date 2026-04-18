import React from 'react';
import { Timer, ShoppingCart, Feather, Zap } from 'lucide-react';

const MarcadorNido = ({ plumas, tiempoRestante, fase, abrirRecarga }) => {
  
  // Determinamos el estilo del cronómetro según la fase y el tiempo
  const obtenerEstiloTimer = () => {
    if (fase === 'apuestas') {
      return tiempoRestante <= 3 
        ? 'bg-rose-950/50 border-rose-500 text-rose-400 animate-pulse' 
        : 'bg-[#0d121f] border-cyan-500/50 text-cyan-400';
    }
    if (fase === 'volando') return 'bg-amber-950/30 border-amber-500/50 text-amber-400';
    return 'bg-slate-900 border-slate-700 text-slate-500';
  };

  const obtenerTextoFase = () => {
    if (fase === 'apuestas') return 'CIERRE DE APUESTAS EN';
    if (fase === 'volando') return 'RASTREANDO VUELO';
    return 'CALCULANDO...';
  };

  return (
    <div className="space-y-6 mb-4">
      {/* Título y Badge de Sistema */}
      <div className="text-center space-y-2 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Nido del <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Riesgo</span>
        </h1>
        <p className="text-slate-400 font-medium text-xs md:text-sm tracking-wide flex items-center justify-center gap-2">
          <Zap size={14} className="text-cyan-400" /> SISTEMA DE RADAR GLOBAL • GANA <span className="text-cyan-400 font-bold">PLUMAS</span>
        </p>
      </div>

      {/* Contenedor de Status */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* --- TARJETA DE SALDO --- */}
        <div className="flex-1 bg-[#0d121f] rounded-2xl p-4 flex justify-between items-center border border-slate-800">
          <div>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-1">
              Saldo Disponible
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-cyan-400">{plumas}</span>
              <span className="text-lg text-cyan-500 font-bold">🪶</span>
            </div>
          </div>
          <button 
            onClick={abrirRecarga}
            className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl font-bold text-xs hover:bg-cyan-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={14}/> RECARGAR
          </button>
        </div>

        {/* --- TARJETA DE TIEMPO / FASE --- */}
        <div className={`md:w-64 rounded-2xl p-4 flex flex-col items-center justify-center border transition-colors ${obtenerEstiloTimer()}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">
            {obtenerTextoFase()}
          </span>
          <div className="flex items-center gap-2">
            <Timer size={20} />
            <span className="text-3xl font-black font-mono">
              {fase === 'apuestas' ? `00:${tiempoRestante.toString().padStart(2, '0')}` : '---'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarcadorNido;