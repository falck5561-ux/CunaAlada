import React, { useState, useEffect } from 'react';
import { Bird, Home, Utensils, ToyBrick, Feather, ShoppingBag, Zap, CreditCard, Loader2 } from 'lucide-react';

const CatalogoPremios = ({ plumasActuales, onComprarPack }) => {
  const [categoria, setCategoria] = useState('todas');
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- PAQUETES FIJOS DE STRIPE (Esto no viene de la DB) ---
  const paquetesStripe = [
    { id: 'p1', nombre: 'Pack Iniciación', precio: 100, tipo: 'recarga', desc: 'Recibe 100 🪶', color: 'border-slate-500/50', esRecarga: true, plumas: 100 },
    { id: 'p2', nombre: 'Pack Criador Pro', precio: 500, tipo: 'recarga', desc: 'Recibe 520 🪶 (Bono +20)', color: 'border-cyan-500/50', esRecarga: true, plumas: 520 },
    { id: 'p3', nombre: 'Pack Maestro Aviario', precio: 1000, tipo: 'recarga', desc: 'Recibe 1070 🪶 (Bono +70)', color: 'border-amber-500/50', esRecarga: true, plumas: 1070 },
    { id: 'p4', nombre: 'Pack Lonja Whale', precio: 4000, tipo: 'recarga', desc: 'Recibe 4500 🪶 (Bono +500)', color: 'border-violet-500/50', esRecarga: true, plumas: 4500 },
  ];

  // --- CARGAR DATOS REALES DE TU MONGODB ---
  useEffect(() => {
    const cargarCatálogoReal = async () => {
      try {
        // 1. Petición para traer las Aves (Ajusta la URL a tu ruta real)
        const resAves = await fetch('http://localhost:5000/api/aves');
        const avesDB = await resAves.json();
        
        // Mapeamos los datos de la DB al formato de nuestra tarjeta
        const avesFormateadas = avesDB.map(ave => ({
          id: ave._id,
          nombre: ave.titulo || ave.nombre || 'Ejemplar', // Depende de cómo lo tengas en tu DB
          precio: ave.precio, // Asumimos que 1 MXN = 1 Pluma
          tipo: 'ave',
          desc: `Anillo: ${ave.anillo || 'N/A'}`,
          imagen: ave.fotoUrl || ave.foto, // Tu foto de Cloudinary
          color: 'border-cyan-500/30',
          esRecarga: false
        }));

        // 2. Petición para traer los Accesorios/Alimento de la Tienda (Ajusta la URL)
        // NOTA: Si aún no tienes esta ruta, puedes comentar este bloque por ahora
        const resTienda = await fetch('http://localhost:5000/api/productos');
        const tiendaDB = await resTienda.json();
        
        const tiendaFormateada = tiendaDB.map(prod => ({
          id: prod._id,
          nombre: prod.nombre,
          precio: prod.precio,
          tipo: prod.categoria?.toLowerCase() || 'accesorios', // 'alimento', 'juguetes', etc.
          desc: prod.descripcion || 'Artículo de tienda',
          imagen: prod.fotoUrl || prod.foto,
          color: 'border-amber-500/30',
          esRecarga: false
        }));

        // Juntamos TODO: Aves reales + Tienda real + Paquetes de Stripe
        setItems([...avesFormateadas, ...tiendaFormateada, ...paquetesStripe]);
        setCargando(false);

      } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        // Si hay error (ej. el backend está apagado), mostramos solo los paquetes de recarga
        setItems(paquetesStripe);
        setCargando(false);
      }
    };

    cargarCatálogoReal();
  }, []);

  const filtrados = categoria === 'todas' ? items : items.filter(i => i.tipo === categoria || (categoria === 'accesorios' && !['ave', 'recarga'].includes(i.tipo)));

  return (
    <div className="space-y-6">
      {/* Selector de Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
          { id: 'todas', label: 'Todo', icon: <ShoppingBag size={14}/> },
          { id: 'ave', label: 'Aves', icon: <Bird size={14}/> },
          { id: 'accesorios', label: 'Accesorios', icon: <Home size={14}/> },
          { id: 'recarga', label: 'Recargar 🪶', icon: <Zap size={14} className="text-amber-400"/> },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
              categoria === cat.id 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
        
        {cargando ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-xs uppercase font-black tracking-widest">Conectando con la base de datos...</p>
          </div>
        ) : (
          filtrados.map((item) => (
            <div 
              key={item.id} 
              className={`group relative overflow-hidden bg-slate-900/40 rounded-[2rem] border transition-all hover:bg-slate-800/60 ${item.color} ${item.esRecarga ? 'bg-gradient-to-br from-slate-900/40 to-cyan-950/20' : ''}`}
            >
              <div className="flex gap-4 items-center p-5">
                
                {/* --- FOTO DEL PRODUCTO REAL O ICONO --- */}
                <div className="w-20 h-20 bg-black/40 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <>
                      {item.tipo === 'ave' && <Bird className="text-cyan-400" size={32} />}
                      {!item.esRecarga && item.tipo !== 'ave' && <Home className="text-amber-600" size={32} />}
                      {item.esRecarga && <Zap className="text-amber-400 animate-pulse" size={32} />}
                    </>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1">
                  <h4 className="text-white font-black text-sm uppercase italic leading-tight">{item.nombre}</h4>
                  <p className="text-slate-500 text-[10px] mt-1 font-medium">{item.desc}</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`font-black text-sm flex items-center gap-1 ${item.esRecarga ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.esRecarga ? <CreditCard size={14}/> : <Feather size={14} />}
                      {item.esRecarga ? `$${item.precio} MXN` : `${item.precio} 🪶`}
                    </span>
                  </div>
                </div>

                {/* Botón Acción (Canjear o Comprar) */}
                <button 
                  onClick={() => item.esRecarga ? onComprarPack(item.precio) : console.log(`Comprando: ${item.id}`)}
                  disabled={!item.esRecarga && plumasActuales < item.precio}
                  className={`p-4 rounded-2xl transition-all shadow-md ${
                    item.esRecarga 
                      ? 'bg-cyan-500 text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]' 
                      : (plumasActuales >= item.precio ? 'bg-white text-slate-950 hover:bg-cyan-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed')
                  }`}
                >
                  {item.esRecarga ? <Zap size={20} fill="currentColor"/> : <ShoppingBag size={20} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CatalogoPremios;