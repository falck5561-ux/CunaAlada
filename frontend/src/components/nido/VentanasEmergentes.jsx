import React from 'react';
import { X, Info, TrendingUp, TrendingDown, Minus, Feather, Bird, ShieldCheck, Zap, Star, Gift, ShoppingBag } from 'lucide-react';
import CatalogoPremios from './CatalogoPremios'; 

const VentanasEmergentes = ({ tipo, alCerrar, alComprarPaquete, onComprarPack, plumas }) => {
  if (!tipo) return null;

  // Unificamos la función para que tanto la tienda como el catálogo puedan usar Stripe
  const manejarCompra = alComprarPaquete || onComprarPack;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Contenedor del Modal - Se ensancha si es el catálogo para que luzcan los productos reales */}
      <div className={`bg-[#0f172a]/95 border border-white/10 rounded-[3rem] w-full shadow-[0_0_80px_-20px_rgba(6,182,212,0.3)] overflow-hidden relative ${tipo === 'catalogo' ? 'max-w-2xl' : 'max-w-lg'}`}>
        
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none" />

        <div className="p-8 md:p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
          <button 
            onClick={alCerrar} 
            className="absolute top-8 right-8 text-slate-500 hover:text-white p-2 bg-white/5 rounded-full transition-all hover:rotate-90 z-50"
          >
            <X size={20} />
          </button>

          {/* --- SECCIÓN: REGLAS --- */}
          {tipo === 'reglas' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Manual <span className="text-cyan-400">Nido</span>
                </h2>
                <div className="h-1 w-20 bg-cyan-500 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <TrendingUp className="text-cyan-400"/>, label: 'SUBE', mult: 'x1.5' },
                  { icon: <TrendingDown className="text-rose-500"/>, label: 'BAJA', mult: 'x1.5' },
                  { icon: <Minus className="text-slate-400"/>, label: 'IGUAL', mult: 'x3.0' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center">
                    {item.icon}
                    <span className="text-[10px] font-black text-slate-500 mt-2">{item.label}</span>
                    <span className="text-lg font-black text-white">{item.mult}</span>
                  </div>
                ))}
              </div>
              <button onClick={alCerrar} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-cyan-400">
                Entendido
              </button>
            </div>
          )}

          {/* --- SECCIÓN: BANCO DE PLUMAS (Esta no la tocamos, se queda como te gusta) --- */}
          {(tipo === 'recarga' || tipo === 'banco') && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Banco de <span className="text-amber-400">Plumas</span>
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-cyan-500"/> Transacciones Seguras con Stripe
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { q: 100, price: 100, bonus: 0, tag: 'Iniciación', color: 'slate' },
                  { q: 500, price: 500, bonus: 20, tag: 'Criador Pro', color: 'cyan', pop: true },
                  { q: 1000, price: 1000, bonus: 70, tag: 'Maestro Aviario', color: 'amber' },
                  { q: 4000, price: 4000, bonus: 500, tag: 'Lonja Whale', color: 'violet', ultra: true }
                ].map((p, i) => (
                  <div key={i} onClick={() => manejarCompra && manejarCompra(p.price)} className={`group relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${p.pop ? 'bg-cyan-500/10 border-cyan-500/30' : p.ultra ? 'bg-violet-500/10 border-violet-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    {p.bonus > 0 && (
                      <div className="absolute -top-3 left-8 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center gap-1 shadow-lg">
                        <Gift size={12} className="text-white animate-bounce" />
                        <span className="text-[10px] font-black text-white uppercase">+{p.bonus} Bono</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.tag}</span>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 text-${p.color}-400`}><Feather size={20} /></div>
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-white leading-none">{p.q + p.bonus}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl font-black text-lg ${p.pop ? 'bg-cyan-500 text-slate-950' : p.ultra ? 'bg-violet-500 text-white' : 'bg-white/10 text-white'}`}>${p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECCIÓN: CATÁLOGO DE PREMIOS (Aquí es donde corregimos la función) --- */}
          {tipo === 'catalogo' && (
            <div className="space-y-6">
               <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Catálogo <span className="text-amber-400">Real</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Canjea tus plumas por ejemplares y productos</p>
              </div>

              <CatalogoPremios 
                plumasActuales={plumas} 
                onComprarPack={manejarCompra} // Pasamos la función para que los paquetes en el catálogo también funcionen
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VentanasEmergentes;