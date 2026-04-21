import React from 'react';

const BotonWhatsApp = () => {
  const telefono = "5642050757"; 
  const mensaje = "¡Hola! Necesito apoyo técnico o información sobre los ejemplares de Cuna Alada 🦜";
  const link = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 group flex items-center justify-center animate-fade-in-up active:scale-95 transition-all"
      aria-label="Soporte Cuna Alada"
    >
      {/* Tooltip elegante al pasar el mouse */}
      <div className="absolute right-full mr-5 px-4 py-2 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl border border-white/10">
        ¿Alguna duda? Escríbenos
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900/95 rotate-45 border-r border-t border-white/10"></div>
      </div>

      {/* Contenedor del Agapornis (Ya no se mueve solo) */}
      <div className="relative w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-2 border-slate-50 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-[5deg] overflow-hidden">
        
        {/* Brillo interno sutil (Efecto de cristal, muy tranquilo) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 animate-subtle-shine rounded-[2.5rem]"></div>
        
        {/* SVG DEL AGAPORNIS (CARA DETALLADA DE FRENTE) */}
        <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <defs>
            <linearGradient id="cuerpoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#059669", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="caraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#fb923c", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#fb923c", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Cuerpo simétrico */}
          <path d="M30,50 Q30,20 50,20 Q70,20 70,50 L70,80 Q70,95 50,95 Q30,95 30,80 Z" fill="url(#cuerpoGradient)" />
          {/* Cara detallada */}
          <path d="M35,45 Q35,25 50,25 Q65,25 65,45 Q65,60 50,60 Q35,60 35,45 Z" fill="url(#caraGradient)" />
          {/* Ojos nítidos */}
          <circle cx="42" cy="40" r="3" fill="black" />
          <circle cx="58" cy="40" r="3" fill="black" />
          {/* Pico frontal */}
          <path d="M50,55 L56,50 L50,45 L44,50 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="0.5" />
          
          {/* Audífonos de Soporte */}
          <g fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round">
            <path d="M30,50 Q30,10 50,10 Q70,10 70,50" />
            <rect x="24" y="45" width="8" height="15" rx="3" fill="#1e293b" stroke="none" />
            <rect x="68" y="45" width="8" height="15" rx="3" fill="#1e293b" stroke="none" />
            <path d="M32,60 Q35,75 45,75" strokeWidth="2" stroke="#1e293b" />
            <circle cx="47" cy="75" r="2" fill="#1e293b" stroke="none" />
          </g>
        </svg>

        {/* Indicador Online (Sin ondas, solo el punto fijo) */}
        <span className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white z-20 shadow-sm"></span>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Brillo sutil de luz, muy lento (6 segundos) para que no distraiga */
        @keyframes subtle-shine {
          0% { transform: translateX(-150%) rotate(45deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(150%) rotate(45deg); opacity: 0; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-subtle-shine {
          animation: subtle-shine 6s ease-in-out infinite;
        }
      `}</style>
    </a>
  );
};

export default BotonWhatsApp;