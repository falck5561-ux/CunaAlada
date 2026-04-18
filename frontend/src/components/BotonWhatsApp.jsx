import React from 'react';
import { MessageCircle } from 'lucide-react'; 

const BotonWhatsApp = () => {
  const telefono = "529810000000"; 
  const mensaje = "Hola Cuna Alada, me interesa conocer más sobre sus ejemplares 🦜";
  const link = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[999] group flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      {/* 1. Tooltip (Texto flotante que aparece SOLO al pasar el mouse) */}
      <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        ¿Tienes dudas?
        {/* Triangulito del tooltip */}
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-900"></span>
      </span>

      {/* 2. El Botón Circular */}
      <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.5)] transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
        
        {/* 3. Animación de "Onda" (Ping) para que se vea vivo */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-ping"></span>
        
        {/* Icono */}
        <MessageCircle size={32} color="white" fill="white" className="relative z-10" />
      </div>
    </a>
  );
};

export default BotonWhatsApp;