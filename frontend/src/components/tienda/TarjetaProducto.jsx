import React from 'react';
import { Plus } from 'lucide-react';

export const TarjetaProducto = ({ 
  prod, 
  carrito, 
  modificarCantidad, 
  agregarAlCarrito, 
  setProductoSeleccionado 
}) => {
  // Buscamos si el producto ya está en el carrito para mostrar la cantidad
  const item = carrito.find(i => i._id === prod._id);
  const qty = item ? item.cantidad : 0;
  // Calculamos si tiene oferta para ponerle su etiqueta roja
  const esOferta = prod.precioOriginal > prod.precio;

  return (
    <div className={`group bg-white rounded-[2.5rem] p-5 border-2 transition-all duration-300 flex flex-col relative ${
      qty > 0 ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-[0_10px_30px_rgba(5,150,105,0.15)] -translate-y-1' : 
      esOferta ? 'border-rose-400/50 shadow-lg shadow-rose-50 hover:shadow-xl hover:-translate-y-1' : 'border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1'
    }`}>
      
      {/* Etiqueta de Oferta */}
      {esOferta && (
        <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full z-10 shadow-lg shadow-rose-500/30 uppercase tracking-wider animate-pulse">
          Oferta
        </div>
      )}
      
      {/* Imagen del Producto (Click para abrir Modal) */}
      <div 
        className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-5 cursor-pointer relative shadow-inner" 
        onClick={() => setProductoSeleccionado(prod)}
      >
        <img 
          src={prod.fotoUrl} 
          alt={prod.nombre} 
          className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-110 duration-700"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300"></div>
      </div>

      <h3 className="font-black text-slate-800 text-[11px] mb-3 line-clamp-2 leading-tight">{prod.nombre}</h3>
      
      <div className="mt-auto flex items-end justify-between">
        {/* Precios */}
        <div className="flex flex-col">
          {esOferta && <span className="text-[10px] text-slate-400 line-through font-bold mb-0.5">${prod.precioOriginal}</span>}
          <span className={`text-3xl font-black tracking-tighter leading-none ${esOferta ? 'text-rose-500' : 'text-slate-900'}`}>${prod.precio}</span>
        </div>

        {/* Controles de Agregar / Restar */}
        <div className="flex items-center gap-2">
          {qty > 0 ? (
            <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-200 shadow-sm">
              <button onClick={() => modificarCantidad(prod._id, -1)} className="w-8 h-8 bg-white rounded-xl font-black text-slate-400 hover:text-rose-500 shadow-sm transition-colors">-</button>
              <span className="w-8 text-center font-black text-sm text-slate-700">{qty}</span>
              <button onClick={() => modificarCantidad(prod._id, 1)} disabled={qty >= prod.stock} className="w-8 h-8 bg-emerald-600 text-white rounded-xl font-black shadow-sm hover:bg-emerald-500 transition-colors">+</button>
            </div>
          ) : (
            <button 
              onClick={() => agregarAlCarrito(prod)} 
              disabled={prod.stock <= 0} 
              className="p-4 bg-slate-900 text-white rounded-2xl shadow-[0_4px_15px_rgba(15,23,42,0.2)] active:scale-90 transition-all hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(5,150,105,0.3)] group-hover:rotate-12"
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};