import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 👈 NUEVO: Importamos el Portal de React
import { 
  Bird, Home, ShoppingBag, Zap, CreditCard, Loader2, 
  CheckCircle2, PartyPopper, Star, MapPin, Feather, X, Plus, Minus, Lock, Unlock 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CatalogoPremios = ({ plumasActuales, onComprarPack }) => {
  const [categoria, setCategoria] = useState('todas');
  const [items, setItems] = useState([]); 
  const [misCanjes, setMisCanjes] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [exitoModal, setExitoModal] = useState(null);
  const [qrAmpliado, setQrAmpliado] = useState(null);
  const [cantidades, setCantidades] = useState({});

  const usuarioGuardado = JSON.parse(localStorage.getItem('cuna_usuario'));
  const USUARIO_ACTUAL = usuarioGuardado?.nombre || "Usuario Anónimo";
  const DIRECCION_ENTREGA = "Aviario La Lonja Alada, Calle 12, Campeche.";

  const paquetesStripe = [
    { id: 'p1', nombre: 'PACK INICIACIÓN', precio: 100, tipo: 'recarga', desc: 'Recibe 100 🪶', esRecarga: true },
    { id: 'p2', nombre: 'PACK CRIADOR PRO', precio: 500, tipo: 'recarga', desc: 'Recibe 520 🪶', esRecarga: true },
    { id: 'p3', nombre: 'PACK MAESTRO AVIARIO', precio: 1000, tipo: 'recarga', desc: 'Recibe 1070 🪶', esRecarga: true },
    { id: 'p4', nombre: 'PACK LONJA WHALE', precio: 4000, tipo: 'recarga', desc: 'Recibe 4500 🪶', esRecarga: true },
  ];

  const cargarTodo = async () => {
    try {
      const [resAves, resTienda, resCanjes] = await Promise.all([
        fetch('http://localhost:5000/api/aves'),
        fetch('http://localhost:5000/api/productos'),
        fetch(`http://localhost:5000/api/canjes?usuario=${USUARIO_ACTUAL}`) 
      ]);

      const avesDB = await resAves.json();
      const tiendaDB = await resTienda.json();
      const canjesDB = await resCanjes.json();

      const aves = avesDB.filter(a => a.estado === 'disponible').map(ave => ({
        id: ave._id,
        nombre: `${ave.especie || 'Ave'} ${ave.mutacion || ''}`,
        precio: ave.precio || 1000, 
        tipo: 'ave',
        imagen: ave.fotoUrl,
        esRecarga: false
      }));

      const productos = tiendaDB.filter(p => p.stock > 0).map(prod => ({
        id: prod._id,
        nombre: prod.nombre,
        precio: prod.precio,
        tipo: 'producto',
        stock: prod.stock,
        imagen: prod.fotoUrl || prod.foto,
        esRecarga: false
      }));

      setItems([...aves, ...productos, ...paquetesStripe]);
      setMisCanjes(canjesDB); 
      setCargando(false);
    } catch (error) {
      console.error("Error al sincronizar datos:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const modificarCantidad = (id, delta, stockMax) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max(1, Math.min((prev[id] || 1) + delta, stockMax))
    }));
  };

  const manejarAccion = async (item) => {
    if (item.esRecarga) {
      onComprarPack(item.precio);
      return;
    }

    const cantSeleccionada = cantidades[item.id] || 1;
    const costoTotal = item.precio * cantSeleccionada;

    if (plumasActuales >= costoTotal) {
      try {
        const endPoint = item.tipo === 'ave' ? 'aves/canjear-ave' : 'productos/canjear-producto';
        const respuesta = await fetch(`http://localhost:5000/api/${endPoint}/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioNombre: USUARIO_ACTUAL, cantidad: cantSeleccionada })
        });

        if (respuesta.ok) {
          localStorage.setItem('nido_plumas', plumasActuales - costoTotal);
          await cargarTodo(); 
          setExitoModal({ ...item, cantidad: cantSeleccionada });
        } else {
          alert("Error en el canje. Verifica el stock.");
        }
      } catch (error) { console.error(error); }
    } else { alert(`¡Te faltan plumas! Necesitas ${costoTotal} 🪶`); }
  };

  const filtrados = categoria === 'mis-premios' 
    ? misCanjes 
    : items.filter(i => {
        if (categoria === 'todas') return true;
        if (categoria === 'ave') return i.tipo === 'ave';
        if (categoria === 'accesorios') return i.tipo === 'producto';
        if (categoria === 'recarga') return i.esRecarga;
        return true;
      });

  const getTheme = (tipo, isTicket) => {
    if (isTicket) return { glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30 hover:border-emerald-400', bar: 'bg-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-500' };
    if (tipo === 'ave') return { glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30 hover:border-cyan-400', bar: 'bg-cyan-500', btn: 'bg-cyan-600 hover:bg-cyan-500' };
    if (tipo === 'producto') return { glow: 'bg-amber-500/10 group-hover:bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30 hover:border-amber-400', bar: 'bg-amber-500', btn: 'bg-amber-600 hover:bg-amber-500' };
    if (tipo === 'recarga') return { glow: 'bg-violet-500/10 group-hover:bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30 hover:border-violet-400', bar: 'bg-violet-500', btn: 'bg-violet-600 hover:bg-violet-500' };
    return { glow: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-700', bar: 'bg-slate-500', btn: 'bg-slate-600' };
  };

  return (
    <div className="relative space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar">
        {[
          { id: 'todas', label: 'Todo', icon: <ShoppingBag size={14}/> },
          { id: 'mis-premios', label: 'Mis Premios', icon: <Star size={14} className="text-yellow-400"/> },
          { id: 'ave', label: 'Aves', icon: <Bird size={14}/> },
          { id: 'accesorios', label: 'Tienda', icon: <Home size={14}/> },
          { id: 'recarga', label: 'Plumas', icon: <Zap size={14} className="text-violet-400"/> },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 ${
              categoria === cat.id ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        {cargando ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 className="animate-spin mb-2 text-cyan-500" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Sincronizando Aviario...</p>
            </div>
        ) : filtrados.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30">
                <Bird className="mx-auto mb-4" size={48} />
                <p className="text-[10px] font-black uppercase tracking-widest">Tu colección está vacía todavía</p>
            </div>
        ) : (
          filtrados.map((item) => {
            const isTicket = categoria === 'mis-premios';
            const cantidadActual = cantidades[item.id] || 1;
            const costoTotal = item.precio * cantidadActual;
            const alcanzado = isTicket || item.esRecarga ? true : plumasActuales >= costoTotal;
            const porcentaje = Math.min(((plumasActuales || 0) / costoTotal) * 100, 100);
            const faltan = costoTotal - plumasActuales;
            const theme = getTheme(item.tipo, isTicket);

            return (
              <div 
                key={item._id || item.id} 
                onClick={() => isTicket && setQrAmpliado(item)}
                className={`group relative overflow-hidden bg-[#111827]/80 backdrop-blur-md rounded-[2rem] border transition-all duration-300 flex flex-col justify-between 
                  ${alcanzado ? `${theme.border} hover:-translate-y-1 hover:shadow-xl` : 'border-slate-800 opacity-90'} 
                  ${isTicket ? 'cursor-zoom-in' : ''}`}
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] rounded-full pointer-events-none transition-all duration-500 ${theme.glow}`} />

                <div className="flex flex-col p-5 h-full relative z-10">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-20 h-20 bg-black/60 rounded-2xl flex-shrink-0 border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.esRecarga ? (
                        <Zap className={theme.text} size={36} fill="currentColor" />
                      ) : (
                        <img src={isTicket ? item.itemImagen : item.imagen} className="w-full h-full object-cover" alt="Item" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border flex items-center gap-1 ${alcanzado ? `bg-white/5 ${theme.text} ${theme.border}` : 'bg-slate-900 text-slate-500 border-slate-700'}`}>
                          {isTicket ? <CheckCircle2 size={10}/> : (alcanzado ? <Unlock size={10}/> : <Lock size={10}/>)}
                          {isTicket ? 'ADQUIRIDO' : (alcanzado ? 'DESBLOQUEADO' : 'BLOQUEADO')}
                        </span>
                      </div>
                      <h4 className="text-white font-black text-sm uppercase italic mt-2 leading-tight">
                        {isTicket ? item.itemNombre : (item.nombre || item.desc)}
                      </h4>
                      {!isTicket && !item.esRecarga && (
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Stock Disponible: {item.stock || '1'}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    {isTicket ? (
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 font-black uppercase">Unidades Adquiridas</span>
                            <span className="text-white font-bold">{item.cantidad || 1}</span>
                         </div>
                         <div className="bg-white p-1 rounded-lg border border-emerald-500">
                           <QRCodeSVG value={`TICKET:${item._id}`} size={30} />
                         </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-end justify-between">
                          {item.tipo === 'producto' ? (
                            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                              <button onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id, -1, item.stock); }} className="p-1 bg-slate-800 rounded-md text-white hover:bg-rose-500"><Minus size={14} /></button>
                              <span className="text-white font-black text-xs w-6 text-center">{cantidadActual}</span>
                              <button onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id, 1, item.stock); }} className="p-1 bg-slate-800 rounded-md text-white hover:bg-emerald-500"><Plus size={14} /></button>
                            </div>
                          ) : (
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Costo Total</span>
                          )}
                          <span className={`font-black text-lg flex items-center gap-1 ${alcanzado ? theme.text : 'text-slate-400'}`}>
                            {item.esRecarga ? <CreditCard size={14}/> : <Feather size={14} />}
                            {item.esRecarga ? `$${item.precio} MXN` : `${costoTotal.toLocaleString()} 🪶`}
                          </span>
                        </div>

                        {!item.esRecarga && (
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.bar}`}
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        )}

                        <button 
                          disabled={!alcanzado && !item.esRecarga}
                          onClick={(e) => { e.stopPropagation(); manejarAccion(item); }} 
                          className={`w-full py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
                            item.esRecarga 
                              ? `${theme.btn} text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-[1.02]` 
                              : alcanzado 
                                ? `${theme.btn} text-white shadow-lg hover:scale-[1.02] active:scale-95` 
                                : 'bg-slate-800/50 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {item.esRecarga ? 'Comprar Paquete' : (alcanzado ? 'Canjear Ahora' : `Faltan ${faltan.toLocaleString()} 🪶`)}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🔥 PORTALES DE REACT: Esto saca las ventanas de su "trampa" y las pone por encima de toda la página */}
      
      {/* MODAL ÉXITO (Confeti al comprar) */}
      {exitoModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-[#0f172a] border-2 border-cyan-500/50 rounded-[3.5rem] max-w-sm w-full p-8 text-center shadow-[0_0_80px_rgba(6,182,212,0.4)]">
            <PartyPopper size={48} className="text-cyan-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-black text-white italic uppercase leading-none">¡LOGRADO!</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Revisa tu premio en la pestaña de Mis Premios</p>
            <button onClick={() => setExitoModal(null)} className="w-full mt-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
              ¡Entendido!
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL QR GIGANTE (Escaneo en Aviario) */}
      {qrAmpliado && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-[3rem] max-w-sm w-full p-8 text-center relative shadow-2xl">
            <button onClick={() => setQrAmpliado(null)} className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-rose-500 hover:text-white transition-all z-50">
              <X size={20} />
            </button>
            <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-emerald-500 mb-4 bg-black">
                    <img src={qrAmpliado.itemImagen} className="w-full h-full object-cover" alt="Ticket" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic leading-none">{qrAmpliado.itemNombre}</h3>
                <p className="text-emerald-500 text-[9px] font-black uppercase mt-2 tracking-widest">Código de Entrega Oficial</p>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] inline-block mb-8 shadow-xl">
              <QRCodeSVG value={`VAL-LONJA:${qrAmpliado._id}:USER:${qrAmpliado.usuarioNombre}`} size={220} level="H" includeMargin={true}/>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-left flex gap-3 items-center">
              <MapPin className="text-emerald-500" size={24} />
              <div>
                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Punto de Entrega:</p>
                <p className="text-[11px] text-white font-bold leading-tight">{DIRECCION_ENTREGA}</p>
                <p className="text-[9px] text-emerald-400 font-bold uppercase mt-1">Ticket: {qrAmpliado._id.slice(-6)}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CatalogoPremios;