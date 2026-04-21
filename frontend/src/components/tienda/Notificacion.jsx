import React from 'react';

export const Notificacion = ({ mensaje, tipo }) => {
  // Si no hay mensaje, no renderizamos la notificación
  if (!mensaje) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 z-[300] px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 animate-notification backdrop-blur-xl border ${
      tipo === 'success' 
        ? 'bg-emerald-500/95 border-emerald-400/50 text-white' 
        : 'bg-rose-600/95 border-rose-400/50 text-white'
    }`}>
      <span className="text-xl drop-shadow-md">
        {tipo === 'success' ? '✨' : '⚠️'}
      </span>
      <span className="font-black text-[11px] uppercase tracking-[0.15em] drop-shadow-sm">
        {mensaje}
      </span>
    </div>
  );
};