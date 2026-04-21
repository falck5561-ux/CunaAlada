import React from 'react';
import { ShoppingBag, X, ShoppingCart, Trash2, CreditCard, QrCode, ShieldAlert } from 'lucide-react';

export const PanelCarrito = ({ 
  carritoAbierto, 
  setCarritoAbierto, 
  carrito, 
  modificarCantidad, 
  eliminarDelCarrito, 
  totalCarrito, 
  iniciarPagoTarjeta, 
  manejarPedidoEfectivo 
}) => {
  // Si el carrito no está abierto, no renderizamos nada en pantalla
  if (!carritoAbierto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro difuminado (al hacer clic cierra el carrito) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setCarritoAbierto(false)}
      ></div>
      
      {/* Contenedor principal del Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-[-20px_0_60px_rgba(0,0,0,0.2)] flex flex-col animate-slide-left border-l border-white/20">
        
        {/* === HEADER === */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
            <ShoppingBag className="text-emerald-500" size={28}/> MI PEDIDO
          </h2>
          <button 
            onClick={() => setCarritoAbierto(false)} 
            className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-500 active:scale-90"
          >
            <X size={20}/>
          </button>
        </div>
        
        {/* === LISTA DE PRODUCTOS === */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/80 custom-scrollbar">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="p-8 bg-slate-100 rounded-full mb-6 shadow-inner">
                <ShoppingCart size={64} strokeWidth={1.5} />
              </div>
              <p className="font-black uppercase tracking-widest text-sm">Cesta Vacía</p>
            </div>
          ) : (
            carrito.map(item => (
              <div key={item._id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                <img src={item.fotoUrl} className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100" alt=""/>
                <div className="flex-1 space-y-2">
                  <h4 className="font-black text-[11px] uppercase text-slate-700 leading-tight line-clamp-2">{item.nombre}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600 font-black text-xl italic leading-none">${item.precio * item.cantidad}</span>
                    
                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-2 py-1 border border-slate-200">
                      <button onClick={() => modificarCantidad(item._id, -1)} className="w-6 h-6 flex items-center justify-center font-black text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors">-</button>
                      <span className="font-black text-xs w-6 text-center">{item.cantidad}</span>
                      <button onClick={() => modificarCantidad(item._id, 1)} className="w-6 h-6 flex items-center justify-center font-black text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors">+</button>
                    </div>
                  </div>
                </div>
                
                {/* Botón Eliminar */}
                <button 
                  onClick={() => eliminarDelCarrito(item._id)} 
                  className="p-3 text-slate-300 hover:text-white hover:bg-rose-500 rounded-xl transition-colors active:scale-90"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>

        {/* === FOOTER (TOTALES Y BOTONES DE PAGO) === */}
        <div className="p-8 bg-white border-t border-slate-100 space-y-5 shadow-[0_-20px_60px_rgba(0,0,0,0.05)] z-10">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 font-black uppercase text-[11px] tracking-widest">Total Estimado</span>
            <span className="text-5xl font-black italic tracking-tighter text-slate-900 leading-none drop-shadow-sm">${totalCarrito}</span>
          </div>
          
          <div className="space-y-3 pt-2">
            {/* Botón Tarjeta */}
            <button 
              onClick={iniciarPagoTarjeta} 
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(15,23,42,0.25)] hover:bg-emerald-600 hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 text-[11px]"
            >
              <CreditCard size={18}/> Pagar con Tarjeta
            </button>
            
            {/* Botón Efectivo o Advertencia Límite */}
            {totalCarrito <= 600 ? (
              <button 
                onClick={manejarPedidoEfectivo} 
                className="w-full bg-emerald-50 text-emerald-700 border-2 border-emerald-200 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-emerald-100 hover:border-emerald-300 transition-all flex items-center justify-center gap-3 active:scale-95 text-[11px]"
              >
                <QrCode size={18}/> Efectivo en Tienda
              </button>
            ) : (
              <div className="bg-rose-50 border-2 border-rose-100 p-5 rounded-[1.5rem] text-center shadow-inner">
                <p className="text-rose-500 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2">
                  <ShieldAlert size={16}/> Límite de Efectivo Superado ($600 max)
                </p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};