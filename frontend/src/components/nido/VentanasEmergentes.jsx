import React from 'react';
import { X, Info, TrendingUp, TrendingDown, Minus, Feather, Bird, ShieldCheck, Zap, Star, Gift } from 'lucide-react';

const VentanasEmergentes = ({ tipo, alCerrar, onComprarPack }) => {
  if (!tipo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Contenedor con efecto de cristal y bordes de neón sutiles */}
      <div className="bg-[#0f172a]/95 border border-white/10 rounded-[3rem] max-w-lg w-full shadow-[0_0_80px_-20px_rgba(6,182,212,0.3)] overflow-hidden relative">
        
        {/* Glows ambientales para profundidad */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none" />

        <div className="p-8 md:p-10 relative">
          <button 
            onClick={alCerrar} 
            className="absolute top-8 right-8 text-slate-500 hover:text-white p-2 bg-white/5 rounded-full transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>

          {/* --- SECCIÓN: REGLAS (CANJE) --- */}
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

              <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 overflow-hidden">
                <div className="p-5 space-y-4">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Bird size={16}/> Mercado de Mutaciones
                  </h3>
                  <div className="space-y-3">
                    {[
                      { m: 'Ancestral', p: '1,000', c: 'green-400' },
                      { m: 'Turquesa', p: '2,500', c: 'cyan-400' },
                      { m: 'Opalino', p: '5,000', c: 'violet-400' }
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors italic">Rosicollis <span className={`text-${row.c} font-bold`}>{row.m}</span></span>
                        <span className="text-sm font-black text-white bg-white/5 px-3 py-1 rounded-lg italic">{row.p} 🪶</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={alCerrar} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-cyan-400">
                Entendido
              </button>
            </div>
          )}

          {/* --- SECCIÓN: BANCO DE PLUMAS (ELITE STORE) --- */}
          {tipo === 'recarga' && (
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
                  { q: 500, price: 500, bonus: 50, tag: 'Criador Pro', color: 'cyan', pop: true },
                  { q: 1000, price: 1000, bonus: 200, tag: 'Maestro Aviario', color: 'amber' },
                  { q: 5000, price: 4000, bonus: 1500, tag: 'Lonja Whale', color: 'violet', ultra: true }
                ].map((p, i) => (
                  <div 
                    key={i}
                    onClick={() => onComprarPack(p.price)}
                    className={`group relative flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                      p.pop ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]' : 
                      p.ultra ? 'bg-violet-500/10 border-violet-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {/* Badge de Bonus */}
                    {p.bonus > 0 && (
                      <div className="absolute -top-3 left-8 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center gap-1 shadow-lg">
                        <Gift size={12} className="text-white animate-bounce" />
                        <span className="text-[10px] font-black text-white uppercase">+{p.bonus} Bono</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.tag}</span>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 text-${p.color}-400`}>
                          <Feather size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-white leading-none">
                            {p.q + p.bonus}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Plumas Totales</span>
                        </div>
                      </div>
                    </div>

                    <div className={`px-6 py-3 rounded-2xl font-black text-lg transition-all ${
                      p.pop ? 'bg-cyan-500 text-slate-950 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 
                      p.ultra ? 'bg-violet-500 text-white' : 'bg-white/10 text-white group-hover:bg-white/20'
                    }`}>
                      ${p.price}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex flex-col items-center gap-4">
                <div className="flex gap-6 opacity-30 hover:opacity-100 transition-opacity duration-700">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 grayscale" />
                </div>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Cuna Alada Secure Protocol</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentanasEmergentes;