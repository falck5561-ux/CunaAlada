import React, { useState } from 'react';
import axios from 'axios';
import { Search, Frown, Ticket, ShoppingCart } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

// === IMPORTACIÓN DE COMPONENTES SEPARADOS ===
import { Notificacion } from '../components/tienda/Notificacion';
import { TarjetaProducto } from '../components/tienda/TarjetaProducto';
import { ModalDetalleProducto } from '../components/tienda/ModalDetalleProducto';
import { PanelCarrito } from '../components/tienda/PanelCarrito';
import { PanelFolios } from '../components/tienda/PanelFolios';
import { TerminalPago } from '../components/tienda/TerminalPago';
import { ModalTicketQR } from '../components/tienda/ModalTicketQR';

// === HOOKS Y CONFIGURACIÓN ===
import { useTienda } from '../hooks/useTienda';
import { API_URL } from '../config/api';

const stripePromise = loadStripe('pk_test_51SFnF0ROWvZ0m785J38J20subms9zeVw92xxsdct2OVzHbIXF8Kueajcp4jxJblwBhozD1xDljC2UG1qDNOGOxTX00UiDpoLCI');

// === COMPONENTE AUXILIAR INTERNO (Skeletons) ===
const SkeletonsCarga = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-[2.5rem] p-5 border border-slate-100 animate-pulse flex flex-col h-[400px] shadow-sm">
        <div className="w-full aspect-square bg-slate-50 rounded-3xl mb-5"></div>
        <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-4"></div>
        <div className="mt-auto flex justify-between items-end">
          <div className="h-8 bg-slate-200 rounded-full w-1/3"></div>
          <div className="h-14 bg-slate-200 rounded-2xl w-14"></div>
        </div>
      </div>
    ))}
  </div>
);

// === COMPONENTE PRINCIPAL DE LA PÁGINA ===
const Tienda = () => {
  const {
    cargando, notificacion, carritoAbierto, setCarritoAbierto,
    productoSeleccionado, setProductoSeleccionado, busqueda, setBusqueda,
    categoriaActiva, setCategoriaActiva, categorias, productosProcesados,
    carrito, modificarCantidad, agregarAlCarrito, eliminarDelCarrito,
    totalCarrito, tickets, registrarPedidoEnDB, obtenerProductos
  } = useTienda();

  const [terminalAbierta, setTerminalAbierta] = useState(false);
  const [secretoStripe, setSecretoStripe] = useState(null);
  const [qrAbierto, setQrAbierto] = useState(false);
  const [infoTicket, setInfoTicket] = useState(null);
  const [misTicketsAbiertos, setMisTicketsAbiertos] = useState(false);

  // --- MÉTODOS DE PAGO ---
  const iniciarPagoTarjeta = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/billetera/pago-tienda`, { 
        montoTotal: totalCarrito,
        descripcionPedido: `Venta Cuna Alada: ${carrito.length} productos`
      });
      if (data.clientSecret) {
        setSecretoStripe(data.clientSecret);
        setTerminalAbierta(true);
        setCarritoAbierto(false);
      }
    } catch (e) { alert("Error al conectar con la pasarela."); }
  };

  const manejarPagoExitoso = async () => {
    const pedido = await registrarPedidoEnDB('tarjeta');
    if (pedido) {
      setInfoTicket({ ...pedido, estado: 'pagado', qrString: `PEDIDO-TIENDA:${pedido._id}:PAGADO` });
      setTerminalAbierta(false);
      setQrAbierto(true);
      if (obtenerProductos) obtenerProductos();
    }
  };

  const manejarPedidoEfectivo = async () => {
    if (totalCarrito > 600) return;
    const pedido = await registrarPedidoEnDB('efectivo');
    if (pedido) {
      setInfoTicket({ ...pedido, estado: 'pendiente', qrString: `PEDIDO-TIENDA:${pedido._id}:PENDIENTE` });
      setQrAbierto(true);
      setCarritoAbierto(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative uppercase tracking-tighter selection:bg-emerald-200">
      
      {/* 1. NOTIFICACIÓN GLOBAL */}
      {notificacion && <Notificacion mensaje={notificacion.msj} tipo={notificacion.tipo} />}

      {/* 2. HEADER DE LA TIENDA */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 shadow-sm transition-all">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            
            <h1 className="text-2xl font-black text-slate-900 italic cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setBusqueda('')}>
              CUNA <span className="text-emerald-600">ALADA</span>
            </h1>
            
            <div className="relative flex-1 max-w-xl hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR PRODUCTOS..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setMisTicketsAbiertos(true)} className="p-3.5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 active:scale-95 transition-all text-slate-700">
                <Ticket size={20} />
                {tickets.length > 0 && <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{tickets.length}</span>}
              </button>
              <button onClick={() => setCarritoAbierto(true)} className="p-3.5 bg-slate-900 text-white rounded-2xl relative shadow-[0_4px_15px_rgba(15,23,42,0.3)] hover:shadow-[0_8px_25px_rgba(15,23,42,0.4)] hover:bg-emerald-600 hover:-translate-y-0.5 active:scale-95 transition-all">
                <ShoppingCart size={20} />
                {carrito.length > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm animate-pulse">{carrito.length}</span>}
              </button>
            </div>

          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCategoriaActiva(cat)} className={`px-6 py-2.5 rounded-full text-[10px] font-black border-2 transition-all whitespace-nowrap uppercase tracking-wider ${categoriaActiva === cat ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GRID DE PRODUCTOS */}
      <div className="container mx-auto px-4 mt-8">
        {cargando ? (
          <SkeletonsCarga />
        ) : productosProcesados.length === 0 ? (
          <div className="py-32 text-center space-y-6 flex flex-col items-center animate-fade-in">
            <div className="bg-slate-100 p-8 rounded-full">
              <Frown size={64} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-400 italic">No se encontraron productos</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productosProcesados.map((prod) => (
              <TarjetaProducto 
                key={prod._id}
                prod={prod}
                carrito={carrito}
                modificarCantidad={modificarCantidad}
                agregarAlCarrito={agregarAlCarrito}
                setProductoSeleccionado={setProductoSeleccionado}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. IMPORTACIÓN DE MODALES Y DRAWERS */}
      
      <ModalDetalleProducto 
        productoSeleccionado={productoSeleccionado}
        setProductoSeleccionado={setProductoSeleccionado}
        agregarAlCarrito={agregarAlCarrito}
      />

      <PanelCarrito 
        carritoAbierto={carritoAbierto}
        setCarritoAbierto={setCarritoAbierto}
        carrito={carrito}
        modificarCantidad={modificarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
        totalCarrito={totalCarrito}
        iniciarPagoTarjeta={iniciarPagoTarjeta}
        manejarPedidoEfectivo={manejarPedidoEfectivo}
      />

      <PanelFolios 
        misTicketsAbiertos={misTicketsAbiertos}
        setMisTicketsAbiertos={setMisTicketsAbiertos}
        tickets={tickets}
        setInfoTicket={setInfoTicket}
        setQrAbierto={setQrAbierto}
      />

      <TerminalPago 
        terminalAbierta={terminalAbierta}
        setTerminalAbierta={setTerminalAbierta}
        secretoStripe={secretoStripe}
        totalCarrito={totalCarrito}
        manejarPagoExitoso={manejarPagoExitoso}
        stripePromise={stripePromise}
      />

      <ModalTicketQR 
        qrAbierto={qrAbierto}
        setQrAbierto={setQrAbierto}
        infoTicket={infoTicket}
      />

      {/* === ESTILOS GLOBALES DE LA VISTA === */}
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.3s ease-in-out 3; }
        
        @keyframes notificationIn {
          0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-notification { animation: notificationIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Tienda;