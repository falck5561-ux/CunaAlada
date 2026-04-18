import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Dribbble, ExternalLink, Heart } from 'lucide-react'; 
import TarjetaAve from './TarjetaAve';
import { useJaula, usePajarito, ZONAS } from '../hooks/useJaula';

// --- ELEMENTOS SECUNDARIOS ---
const PelotaHighPerf = ({ pos, rot }) => (
  <motion.div
    exit={{ opacity: 0, scale: 0, transition: { duration: 1.5 } }}
    className="absolute z-40 text-2xl md:text-4xl drop-shadow-xl origin-center pointer-events-none filter brightness-110"
    style={{ 
        left: `${pos.x}%`, 
        top: `${pos.y}%`, 
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    }}
  >
    🧶
  </motion.div>
);

const PajaritoPro = ({ ave, jaulaRef, onSacar, worldState, updateWorld, setGlobalDragging }) => {
  const {
      controls, mood, emoji, pos, facingRight, currentImg,
      handleDragStart, handleDragEnd
  } = usePajarito(ave, worldState, updateWorld, onSacar, setGlobalDragging);

  return (
    <motion.div
      drag
      dragConstraints={jaulaRef}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute flex flex-col items-center justify-end z-30 cursor-grab active:cursor-grabbing
                 w-16 h-16 -ml-8 -mt-16 
                 md:w-[100px] md:h-[100px] md:-ml-[50px] md:-mt-[100px]"
      initial={{ left: `${pos.current.x}%`, top: `${pos.current.y}%` }}
    >
        <div className="hidden md:block absolute -top-14 bg-black/80 backdrop-blur-md p-2 rounded-xl opacity-0 hover:opacity-100 transition-opacity w-28 pointer-events-none border border-white/10 shadow-xl z-50">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-white uppercase">{ave.nombreAsignado || 'Ave'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            </div>
            <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${mood.hunger}%` }}/>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {emoji && (
                <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: -40, opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-0 text-2xl md:text-3xl">
                    {emoji}
                </motion.div>
            )}
        </AnimatePresence>
        
        <div style={{ transform: `scaleX(${facingRight.current ? -1 : 1})`, transition: 'transform 0.15s', width: '100%', height: '100%' }}>
            <img src={currentImg} className="w-full h-full object-contain drop-shadow-xl select-none pixelated" draggable="false" />
        </div>
    </motion.div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const JaulaInteractiva = ({ avesDisponibles = [] }) => {
  const {
      aveSeleccionada, setAveSeleccionada,
      jaulaRef, world, isGlobalDragging, setGlobalDragging,
      spawnBall, updateWorld, fillFood
  } = useJaula();

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 md:my-12 p-4 flex flex-col items-center font-sans">
      
      {/* HEADER AMIGABLE */}
      <div className="text-center mb-6 md:mb-10 px-2 relative z-20">
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter mb-2">
            Santuario <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Inteligente</span>
        </h2>
        
        {/* Call to Action */}
        <motion.div 
            animate={{ scale: isGlobalDragging ? 1.05 : 1 }}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 shadow-sm ${isGlobalDragging ? "bg-rose-100 text-rose-600 font-bold ring-2 ring-rose-200" : "bg-white text-slate-600 border border-slate-200"}`}
        >
            {isGlobalDragging ? (
                <ExternalLink size={18} className="animate-pulse" />
            ) : (
                <Heart size={18} className="text-rose-500" />
            )}
            <span className="text-sm md:text-base font-medium">
                {isGlobalDragging ? "¡Suéltalo fuera para ver detalles!" : "✨ Agarra un ave fuera para conocerla y adquirirla"}
            </span>
        </motion.div>
      </div>

      {/* CONTROLES */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8 p-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl z-20 w-full sm:w-auto">
         <button onClick={fillFood} className="relative group overflow-hidden w-full sm:w-40 h-12 md:h-14 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all shadow-sm active:scale-95">
            <div className="absolute inset-0 bg-amber-400/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"/>
            <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-500" style={{ width: `${world.food}%` }}/>
            <div className="relative z-10 flex items-center justify-center gap-2 h-full text-slate-700 font-bold group-hover:text-amber-600 text-sm md:text-base">
                <Utensils size={18} className={world.food > 0 ? "animate-bounce" : ""}/>
                <span>{world.food > 0 ? 'Comiendo' : 'Alimentar'}</span>
            </div>
         </button>
         
         <div className="hidden sm:block w-px h-8 bg-slate-300"/>
         
         <button onClick={spawnBall} className="relative group overflow-hidden w-full sm:w-40 h-12 md:h-14 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-400 transition-all shadow-sm active:scale-95">
            <div className="absolute inset-0 bg-rose-400/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"/>
            <div className="relative z-10 flex items-center justify-center gap-2 h-full text-slate-700 font-bold group-hover:text-rose-600 text-sm md:text-base">
                <Dribbble size={18} className={world.ball ? "animate-spin" : ""}/>
                <span>{world.ball ? 'Lanzar' : 'Jugar'}</span>
            </div>
         </button>
      </div>

      {/* RENDER DE LA JAULA */}
      <div 
        ref={jaulaRef} 
        className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] bg-gradient-to-b from-[#eef2f6] to-[#e2e8f0] rounded-[30px] md:rounded-[40px] border-[1px] border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden select-none ring-4 md:ring-8 ring-slate-100"
      >
          <AnimatePresence>
            {isGlobalDragging && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-0 border-[6px] border-dashed border-rose-300/50 rounded-[30px] md:rounded-[40px] pointer-events-none animate-pulse"
                />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="absolute left-1/2 -translate-x-1/2 top-0 origin-top anim-swing" style={{ height: '25%' }}>
            <div className="w-[1px] h-full bg-slate-400/80 mx-auto" />
            <div className="w-16 md:w-24 h-2 md:h-3 bg-gradient-to-r from-amber-800 to-amber-700 rounded-full border border-amber-950 absolute bottom-0 left-1/2 -translate-x-1/2 shadow-lg flex items-center justify-center">
                <div className="w-full h-[1px] bg-white/20"/>
            </div>
          </div>

          {ZONAS.PERCHAS_Y.map((y, i) => (
            <div key={i} className="absolute left-[5%] right-[5%] md:left-[8%] md:right-[8%] h-2 md:h-3 bg-amber-900/80 rounded-full shadow-md flex items-center justify-center border-b border-amber-950/50" style={{ top: `${y}%` }}>
                 <div className="w-[95%] h-[1px] bg-white/10 rounded-full"/>
            </div>
          ))}

          <div className="absolute bottom-[6%] left-[5%] w-24 h-12 md:w-32 md:h-16 bg-white rounded-b-2xl md:rounded-b-3xl border-2 md:border-4 border-slate-300 shadow-lg z-10 overflow-hidden">
              <div className="absolute top-0 w-full h-2 bg-black/10 z-20" />
              <motion.div animate={{ height: `${world.food}%` }} className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-500" />
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] pointer-events-none"/>
              <span className="absolute bottom-1 w-full text-center text-[8px] md:text-[9px] font-bold text-slate-400/80 tracking-widest">SEMILLAS</span>
          </div>

          <div className="absolute bottom-[6%] right-[5%] w-28 h-10 md:w-40 md:h-14 bg-stone-300 rounded-full border-b-4 md:border-b-8 border-stone-400 shadow-lg overflow-hidden z-10">
              <div className="absolute top-2 md:top-3 left-2 right-2 bottom-0 bg-cyan-400/80 rounded-b-full animate-pulse" />
              <div className="absolute top-0 right-10 w-2 h-10 bg-white/30 skew-x-12 blur-[1px]"/>
          </div>

          <AnimatePresence>
             {world.ball && <PelotaHighPerf pos={world.ball.pos} rot={world.ball.rot} />}
          </AnimatePresence>

          {avesDisponibles.filter(a => a.estado === 'disponible').map(ave => (
             <PajaritoPro 
                key={ave._id} 
                ave={ave} 
                jaulaRef={jaulaRef} 
                onSacar={setAveSeleccionada} 
                worldState={world} 
                updateWorld={updateWorld}
                setGlobalDragging={setGlobalDragging}
             />
          ))}
      </div>

      {/* RENDER MODAL ADOPCIÓN */}
      <AnimatePresence>
        {aveSeleccionada && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex justify-center items-center py-10 px-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setAveSeleccionada(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               exit={{ scale: 0.9, opacity: 0, y: 30 }} 
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="relative w-full max-w-sm my-auto z-50 isolate" 
               onClick={e => e.stopPropagation()}
             >
                <button onClick={() => setAveSeleccionada(null)} className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform text-slate-800 ring-4 ring-slate-900/20">
                   <X size={20} />
                </button>
                <div className="rounded-3xl shadow-2xl overflow-hidden bg-white py-8">
                    <TarjetaAve ave={aveSeleccionada} />
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JaulaInteractiva;