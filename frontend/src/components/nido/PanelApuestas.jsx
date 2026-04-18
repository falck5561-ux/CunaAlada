import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PanelApuestas = ({ 
  apuesta, 
  setApuesta, 
  prediccion, 
  onColocarApuesta, 
  fase, 
  plumas 
}) => {
  
  const deshabilitado = fase !== 'apuestas';

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
      {/* --- SECCIÓN DE INVERSIÓN (IZQUIERDA) --- */}
      <div className="w-full lg:w-1/3 flex flex-col gap-1">
        <label className="text-slate-500 font-bold uppercase tracking-widest text-[10px] text-center">
          Inversión (Plumas)
        </label>
        
        <div className={`flex items-center bg-[#0d121f] p-1.5 rounded-2xl border border-slate-800 w-full justify-between transition-opacity ${deshabilitado ? 'opacity-50 pointer-events-none' : ''}`}>
          <button 
            onClick={() => setApuesta(prev => Math.max(0, (Number(prev) || 0) - 10))} 
            className="w-12 h-12 rounded-xl bg-[#111827] text-slate-300 hover:bg-slate-800 font-black text-xl border border-slate-700"
          >
            -
          </button>
          
          <input 
            type="number" 
            value={apuesta} 
            onChange={(e) => setApuesta(e.target.value === '' ? '' : Number(e.target.value))} 
            className="w-full text-center text-2xl font-black text-white bg-transparent outline-none font-mono" 
            readOnly={deshabilitado} 
          />
          
          <button 
            onClick={() => setApuesta(prev => (Number(prev) || 0) + 10)} 
            className="w-12 h-12 rounded-xl bg-[#111827] text-slate-300 hover:bg-slate-800 font-black text-xl border border-slate-700"
          >
            +
          </button>
        </div>
      </div>

      {/* --- SECCIÓN DE BOTONES DE PREDICCIÓN (DERECHA) --- */}
      <div className={`w-full lg:w-2/3 grid grid-cols-3 gap-2 md:gap-4 ${deshabilitado ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* BOTÓN BAJA */}
        <button 
          onClick={() => onColocarApuesta('baja')} 
          className={`group flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl border-2 transition-all 
            ${prediccion === 'baja' 
              ? 'bg-rose-900/40 border-rose-500 text-rose-300 shadow-lg shadow-rose-900/50' 
              : 'bg-[#1a1518] border-rose-900/50 text-rose-500 hover:bg-rose-900/20'}`}
        >
          <TrendingDown size={20} className="group-hover:translate-y-1 transition-transform" />
          <span className="font-black text-[10px] md:text-sm text-center uppercase">¿Baja?</span>
          <span className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase tracking-wider mt-1">Gana x1.5</span>
        </button>

        {/* BOTÓN MANTIENE */}
        <button 
          onClick={() => onColocarApuesta('mantiene')} 
          className={`group flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl border-2 transition-all 
            ${prediccion === 'mantiene' 
              ? 'bg-slate-800 border-slate-400 text-white shadow-lg shadow-slate-700/50' 
              : 'bg-[#1a1c22] border-slate-700/50 text-slate-400 hover:bg-slate-800/50'}`}
        >
          <Minus size={20} />
          <span className="font-black text-[10px] md:text-sm text-center uppercase">¿Igual?</span>
          <span className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase tracking-wider mt-1">Gana x3.0</span>
        </button>

        {/* BOTÓN SUBE */}
        <button 
          onClick={() => onColocarApuesta('sube')} 
          className={`group flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl border-2 transition-all 
            ${prediccion === 'sube' 
              ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-900/50' 
              : 'bg-[#111f1e] border-cyan-900/50 text-cyan-500 hover:bg-cyan-900/20'}`}
        >
          <TrendingUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          <span className="font-black text-[10px] md:text-sm text-center uppercase">¿Sube?</span>
          <span className="text-[8px] md:text-[9px] font-bold opacity-70 uppercase tracking-wider mt-1">Gana x1.5</span>
        </button>

      </div>
    </div>
  );
};

export default PanelApuestas;