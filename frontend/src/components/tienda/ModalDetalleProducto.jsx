import React from 'react';
import { X, ShoppingCart } from 'lucide-react';

export const ModalDetalleProducto = ({ 
  productoSeleccionado, 
  setProductoSeleccionado, 
  agregarAlCarrito 
}) => {
  // Si no hay ningún producto seleccionado, el modal no se renderiza (no aparece)
  if (!productoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl transition-all">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative flex flex-col md:flex-row animate-bounce-in border border-white/20">
        
        {/* Botón de Cerrar */}
        <button 
          onClick={() => setProductoSeleccionado(null)} 
          className="absolute top-6 right-6 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 shadow-lg hover:bg-rose-500 hover:text-white transition-all active:scale-90"
        >
          <X size={20}/>
        </button>
        
        {/* Sección de la Imagen */}
        <div className="w-full md:w-1/2 aspect-square bg-slate-50 p-12 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent"></div>
          <img 
            src={productoSeleccionado.fotoUrl} 
            alt={productoSeleccionado.nombre} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500 relative z-10" 
          />
        </div>
        
        {/* Sección de la Información */}
        <div className="p-12 md:w-1/2 flex flex-col justify-center gap-6 bg-white relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div>
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] rounded-full mb-4 border border-emerald-100 shadow-sm">
              {productoSeleccionado.categoria}
            </span>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none uppercase italic tracking-tighter">
              {productoSeleccionado.nombre}
            </h3>
          </div>
          
          <p className="text-slate-500 text-xs italic font-medium leading-relaxed uppercase border-l-4 border-emerald-500 pl-5 py-2 bg-slate-50/50 rounded-r-xl">
            {productoSeleccionado.descripcion || "Excelencia garantizada bajo los estándares de Cuna Alada. Productos seleccionados de la más alta calidad para tus aves."}
          </p>
          
          <div className="flex items-end justify-between pt-6 border-t border-slate-100 mt-4">
            <span className="text-6xl font-black text-emerald-600 tracking-tighter leading-none italic drop-shadow-sm">
              ${productoSeleccionado.precio}
            </span>
            
            <button 
              onClick={() => { 
                agregarAlCarrito(productoSeleccionado); 
                setProductoSeleccionado(null); // Cierra el modal al agregar
              }} 
              className="bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-xs shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:bg-emerald-600 hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center gap-3"
            >
              <ShoppingCart size={20}/> AGREGAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};