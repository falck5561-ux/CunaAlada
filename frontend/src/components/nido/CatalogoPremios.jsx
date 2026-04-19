import React, { useState, useEffect } from 'react';
import { 
  Bird, Home, ShoppingBag, Zap, CreditCard, Loader2, 
  CheckCircle2, PartyPopper, Star, MapPin, Feather, Maximize2, X, Plus, Minus 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CatalogoPremios = ({ plumasActuales, onComprarPack }) => {
  const [categoria, setCategoria] = useState('todas');
  const [items, setItems] = useState([]); // Productos y Aves disponibles
  const [misCanjes, setMisCanjes] = useState([]); // Historial de tickets ganados
  const [cargando, setCargando] = useState(true);
  const [exitoModal, setExitoModal] = useState(null);
  const [qrAmpliado, setQrAmpliado] = useState(null);
  const [cantidades, setCantidades] = useState({});

  const USUARIO_ACTUAL = "Josué Pérez Ponce"; 
  const DIRECCION_ENTREGA = "Aviario La Lonja Alada, Calle 12, Campeche.";

  // Paquetes de recarga (Stripe)
  const paquetesStripe = [
    { id: 'p1', nombre: 'PACK INICIACIÓN', precio: 100, tipo: 'recarga', desc: 'Recibe 100 🪶', color: 'border-slate-500/50', esRecarga: true },
    { id: 'p2', nombre: 'PACK CRIADOR PRO', precio: 500, tipo: 'recarga', desc: 'Recibe 520 🪶', color: 'border-cyan-500/50', esRecarga: true },
    { id: 'p3', nombre: 'PACK MAESTRO AVIARIO', precio: 1000, tipo: 'recarga', desc: 'Recibe 1070 🪶', color: 'border-amber-500/50', esRecarga: true },
    { id: 'p4', nombre: 'PACK LONJA WHALE', precio: 4000, tipo: 'recarga', desc: 'Recibe 4500 🪶', color: 'border-violet-500/50', esRecarga: true },
  ];

  // FUNCIÓN MAESTRA: Carga Tienda + Historial de Canjes
  const cargarTodo = async () => {
    try {
      const [resAves, resTienda, resCanjes] = await Promise.all([
        fetch('http://localhost:5000/api/aves'),
        fetch('http://localhost:5000/api/productos'),
        fetch(`http://localhost:5000/api/canjes?usuario=${USUARIO_ACTUAL}`) // Historial persistente
      ]);

      const avesDB = await resAves.json();
      const tiendaDB = await resTienda.json();
      const canjesDB = await resCanjes.json();

      // Formateamos aves disponibles
      const aves = avesDB.filter(a => a.estado === 'disponible').map(ave => ({
        id: ave._id,
        nombre: `${ave.especie || 'Ave'} ${ave.mutacion || ''}`,
        precio: ave.precio || 1000, 
        tipo: 'ave',
        imagen: ave.fotoUrl,
        color: 'border-cyan-500/30',
        esRecarga: false
      }));

      // Formateamos productos de tienda
      const productos = tiendaDB.filter(p => p.stock > 0).map(prod => ({
        id: prod._id,
        nombre: prod.nombre,
        precio: prod.precio,
        tipo: 'producto',
        stock: prod.stock,
        imagen: prod.fotoUrl || prod.foto,
        color: 'border-amber-500/30',
        esRecarga: false
      }));

      setItems([...aves, ...productos, ...paquetesStripe]);
      setMisCanjes(canjesDB); // Cargamos aves y productos ya canjeados
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
          body: JSON.stringify({ 
            usuarioNombre: USUARIO_ACTUAL,
            cantidad: cantSeleccionada 
          })
        });

        if (respuesta.ok) {
          localStorage.setItem('nido_plumas', plumasActuales - costoTotal);
          // Recargamos todo para que el ticket aparezca en Mis Premios de inmediato
          await cargarTodo(); 
          setExitoModal({ ...item, cantidad: cantSeleccionada });
        } else {
            alert("Error en el canje. Verifica el stock.");
        }
      } catch (error) { console.error(error); }
    } else { alert(`¡Te faltan plumas! Necesitas ${costoTotal} 🪶`); }
  };

  // --- LÓGICA DE FILTRADO ---
  const filtrados = categoria === 'mis-premios' 
    ? misCanjes // Filtro para el historial
    : items.filter(i => {
        if (categoria === 'todas') return true;
        if (categoria === 'ave') return i.tipo === 'ave';
        if (categoria === 'accesorios') return i.tipo === 'producto';
        if (categoria === 'recarga') return i.esRecarga;
        return true;
      });

  return (
    <div className="relative space-y-6">
      {/* Selector de Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
          { id: 'todas', label: 'Todo', icon: <ShoppingBag size={14}/> },
          { id: 'mis-premios', label: 'Mis Premios', icon: <Star size={14} className="text-yellow-400"/> },
          { id: 'ave', label: 'Aves', icon: <Bird size={14}/> },
          { id: 'accesorios', label: 'Tienda', icon: <Home size={14}/> },
          { id: 'recarga', label: 'Plumas', icon: <Zap size={14} className="text-amber-400"/> },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 ${
              categoria === cat.id ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Productos / Canjes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
        {cargando ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando Aviario...</p>
            </div>
        ) : filtrados.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30">
                <Bird className="mx-auto mb-4" size={48} />
                <p className="text-[10px] font-black uppercase">Tu colección está vacía todavía</p>
            </div>
        ) : (
          filtrados.map((item) => {
            const isTicket = categoria === 'mis-premios';
            const cantidadActual = cantidades[item.id] || 1;

            return (
              <div 
                key={item._id || item.id} 
                onClick={() => isTicket && setQrAmpliado(item)}
                className={`group relative overflow-hidden bg-slate-900/40 rounded-[2rem] border transition-all ${item.color || 'border-cyan-500/20'} ${isTicket ? 'cursor-zoom-in hover:bg-slate-800/80 border-cyan-500/50' : ''}`}
              >
                <div className="flex flex-col p-5 space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-black/40 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden flex items-center justify-center">
                      {item.esRecarga ? (
                        <Zap className="text-cyan-400" size={32} fill="currentColor" />
                      ) : (
                        <img src={isTicket ? item.itemImagen : item.imagen} className="w-full h-full object-cover" alt="Item" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-black text-[11px] uppercase italic leading-tight">
                        {isTicket ? item.itemNombre : item.nombre}
                      </h4>
                      <div className="mt-1">
                        {isTicket ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-emerald-400 text-[9px] font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                                  {item.tipo === 'ave' ? 'Ave Canjeada' : `Unidades: ${item.cantidad}`}
                                </span>
                                <span className="text-slate-500 text-[8px] font-bold uppercase">Haz clic para ver QR</span>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {!item.esRecarga && <span className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter">Stock: {item.stock || '1'}</span>}
                                <span className={`font-black text-xs flex items-center gap-1 ${item.esRecarga ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {item.esRecarga ? <CreditCard size={12}/> : <Feather size={12} />}
                                    {item.esRecarga ? `$${item.precio} MXN` : `${item.precio * cantidadActual} 🪶`}
                                </span>
                            </div>
                        )}
                      </div>
                    </div>

                    {isTicket && (
                      <div className="bg-white p-1 rounded-lg border-2 border-cyan-500 shadow-lg">
                        <QRCodeSVG value={`TICKET:${item._id}`} size={35} />
                      </div>
                    )}
                  </div>

                  {/* SELECTOR Y BOTÓN (Solo si no es un premio ganado) */}
                  {!isTicket && (
                    <>
                      {item.tipo === 'producto' && (
                        <div className="flex items-center justify-between bg-black/30 p-2 rounded-2xl border border-white/5">
                          <span className="text-[9px] font-black text-slate-500 uppercase ml-2">Cantidad</span>
                          <div className="flex items-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id, -1, item.stock); }} className="p-1.5 bg-slate-800 rounded-lg text-white hover:bg-rose-500"><Minus size={12} /></button>
                            <span className="text-white font-black text-sm w-4 text-center">{cantidadActual}</span>
                            <button onClick={(e) => { e.stopPropagation(); modificarCantidad(item.id, 1, item.stock); }} className="p-1.5 bg-slate-800 rounded-lg text-white hover:bg-emerald-500"><Plus size={12} /></button>
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); manejarAccion(item); }} 
                        className={`w-full py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
                            item.esRecarga ? 'bg-cyan-500 text-slate-950' : 'bg-white text-slate-950 hover:bg-cyan-400'
                        }`}
                      >
                        {item.esRecarga ? 'Comprar Pack' : `Canjear ${item.tipo === 'producto' ? `(${cantidadActual})` : ''}`}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL ÉXITO (Confeti al comprar) --- */}
      {exitoModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-[#0f172a] border-2 border-cyan-500/50 rounded-[3.5rem] max-w-sm w-full p-8 text-center shadow-[0_0_80px_rgba(6,182,212,0.4)]">
            <PartyPopper size={48} className="text-cyan-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-black text-white italic uppercase leading-none">¡LOGRADO!</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Revisa tu premio en la pestaña de Mis Premios</p>
            <button onClick={() => setExitoModal(null)} className="w-full mt-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL QR GIGANTE (Escaneo en Aviario) --- */}
      {qrAmpliado && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-700 rounded-[3rem] max-w-sm w-full p-8 text-center relative shadow-2xl">
            <button onClick={() => setQrAmpliado(null)} className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-rose-500 transition-all">
              <X size={20} />
            </button>
            <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-cyan-500 mb-4 bg-black">
                    <img src={qrAmpliado.itemImagen} className="w-full h-full object-cover" alt="Ticket" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic leading-none">{qrAmpliado.itemNombre}</h3>
                <p className="text-cyan-500 text-[9px] font-black uppercase mt-2 tracking-widest">Código de Entrega Oficial</p>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] inline-block mb-8 shadow-xl">
              <QRCodeSVG value={`VAL-LONJA:${qrAmpliado._id}:USER:${qrAmpliado.usuarioNombre}`} size={220} level="H" includeMargin={true}/>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-left flex gap-3 items-center">
              <MapPin className="text-amber-500" size={24} />
              <div>
                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Punto de Entrega:</p>
                <p className="text-[11px] text-white font-bold leading-tight">{DIRECCION_ENTREGA}</p>
                <p className="text-[9px] text-cyan-400 font-bold uppercase mt-1">Ticket: {qrAmpliado._id.slice(-6)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoPremios;