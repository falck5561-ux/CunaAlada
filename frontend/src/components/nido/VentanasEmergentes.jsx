import React, { useEffect, useState } from 'react';
import { 
  X, TrendingUp, TrendingDown, Minus, Info, 
  Zap, ShieldAlert, Crosshair, Target, Feather,
  Bird, ShieldCheck, Star, Gift, ShoppingBag 
} from 'lucide-react';
import CatalogoPremios from './CatalogoPremios'; 

const VentanasEmergentes = ({ tipo, alCerrar, alComprarPaquete, onComprarPack, plumas }) => {
  const [animarEntrada, setAnimarEntrada] = useState(false);

  // Efecto suave al abrir cualquier modal
  useEffect(() => {
    if (tipo) {
      setTimeout(() => setAnimarEntrada(true), 10);
    } else {
      setAnimarEntrada(false);
    }
  }, [tipo]);

  if (!tipo) return null;

  // Unificamos la función para que tanto la tienda como el catálogo puedan usar Stripe
  const manejarCompra = alComprarPaquete || onComprarPack;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${animarEntrada ? 'bg-slate-950/80 backdrop-blur-md opacity-100' : 'bg-transparent opacity-0'}`}>
      
      {/* Contenedor del Modal - Se ensancha si es el catálogo para que luzcan los productos reales */}
      <div className={`bg-[#0f172a]/95 border border-white/10 rounded-[3rem] w-full shadow-[0_0_80px_-20px_rgba(6,182,212,0.3)] overflow-hidden relative transform transition-all duration-500 ${animarEntrada ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'} ${tipo === 'catalogo' ? 'max-w-2xl' : 'max-w-lg'}`}>
        
        {/* Glow Effects de fondo */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none" />

        <div className="p-8 md:p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar custom-scrollbar">
          
          <button 
            onClick={alCerrar} 
            className="absolute top-8 right-8 text-slate-500 hover:text-rose-400 p-2 bg-white/5 rounded-full transition-all hover:rotate-90 hover:bg-rose-500/20 z-50"
          >
            <X size={20} />
          </button>

          {/* ==========================================
              📖 MODAL: REGLAS DEL JUEGO (REMASTERIZADO)
              ========================================== */}
          {tipo === 'reglas' && (
            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <Info className="text-cyan-400" size={32} /> 
                  Manual <span className="text-cyan-400">Nido</span>
                </h2>
                <div className="h-1 w-20 bg-cyan-500 rounded-full" />
                <p className="text-slate-400 text-xs font-bold tracking-widest mt-2">SISTEMA DE PREDICCIÓN ALADA</p>
              </div>

              {/* Bloque 1: ¿Cómo funciona? */}
              <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-2xl">
                <h3 className="text-sm font-black text-slate-200 mb-2 flex items-center gap-2">
                  <Crosshair size={16} className="text-amber-400" /> LA MISIÓN
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  El radar rastrea el vuelo de un ave en tiempo real. Tienes <strong>10 segundos</strong> para analizar la tendencia y predecir hacia dónde se moverá en el próximo impulso. Si aciertas, multiplicas tus plumas.
                </p>
              </div>

              {/* Bloque 2: Multiplicadores */}
              <div>
                <h3 className="text-sm font-black text-slate-200 mb-3 flex items-center gap-2">
                  <Target size={16} className="text-emerald-400" /> MULTIPLICADORES DE VUELO
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Tarjeta Sube */}
                  <div className="group flex items-center justify-between bg-gradient-to-r from-cyan-950/40 to-transparent border border-cyan-900/50 p-3 rounded-xl hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-900/50 rounded-lg group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white m-0">SUBE</p>
                        <p className="text-[10px] text-slate-400 m-0">El ave gana altitud.</p>
                      </div>
                    </div>
                    <div className="bg-cyan-500/20 px-3 py-1 rounded-lg border border-cyan-500/30">
                      <span className="text-sm font-black text-cyan-400">x1.5</span>
                    </div>
                  </div>

                  {/* Tarjeta Baja */}
                  <div className="group flex items-center justify-between bg-gradient-to-r from-rose-950/40 to-transparent border border-rose-900/50 p-3 rounded-xl hover:border-rose-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-900/50 rounded-lg group-hover:scale-110 transition-transform">
                        <TrendingDown size={20} className="text-rose-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white m-0">BAJA</p>
                        <p className="text-[10px] text-slate-400 m-0">El ave pierde altitud.</p>
                      </div>
                    </div>
                    <div className="bg-rose-500/20 px-3 py-1 rounded-lg border border-rose-500/30">
                      <span className="text-sm font-black text-rose-400">x1.5</span>
                    </div>
                  </div>

                  {/* Tarjeta Igual */}
                  <div className="group flex items-center justify-between bg-gradient-to-r from-amber-950/40 to-transparent border border-amber-900/50 p-3 rounded-xl hover:border-amber-500/50 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-full bg-amber-500/5 skew-x-12 animate-pulse"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="p-2 bg-amber-900/50 rounded-lg group-hover:scale-110 transition-transform">
                        <Minus size={20} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white m-0">SE MANTIENE</p>
                        <p className="text-[10px] text-slate-400 m-0 flex items-center gap-1">
                          <ShieldAlert size={10} className="text-amber-500" /> Vuelo estabilizado (Raro)
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 relative z-10">
                      <span className="text-sm font-black text-amber-400">x3.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={alCerrar} 
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-[0.98]"
              >
                ENTENDIDO, A VOLAR
              </button>
            </div>
          )}

          {/* ==========================================
              💰 BANCO DE PLUMAS / RECARGA
              ========================================== */}
          {(tipo === 'recarga' || tipo === 'banco') && (
            <div className="space-y-8 relative z-10">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Banco de <span className="text-amber-400">Plumas</span>
                </h2>
                <div className="h-1 w-20 bg-amber-500 rounded-full mb-2" />
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

          {/* ==========================================
              🛒 CATÁLOGO DE PREMIOS
              ========================================== */}
          {tipo === 'catalogo' && (
            <div className="space-y-6 relative z-10">
               <div className="space-y-1">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Catálogo <span className="text-amber-400">Real</span>
                </h2>
                <div className="h-1 w-20 bg-amber-500 rounded-full mb-2" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Canjea tus plumas por ejemplares y productos</p>
              </div>

              <CatalogoPremios 
                plumasActuales={plumas} 
                onComprarPack={manejarCompra}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VentanasEmergentes;