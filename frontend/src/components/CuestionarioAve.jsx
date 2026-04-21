import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, HeartHandshake, Tag } from 'lucide-react';
import { useCuestionarioAve } from '../hooks/useCuestionarioAve';

const CuestionarioAve = ({ avesDisponibles = [] }) => {
  // Extraemos toda la lógica de nuestro Custom Hook
  const {
    fase,
    pasoActual,
    preguntas,
    aveGanadora,
    esAlternativa,
    iniciarQuiz,
    procesarRespuesta,
    reiniciar,
    obtenerTextos,
    getImagenAve
  } = useCuestionarioAve(avesDisponibles);

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-[32px] shadow-2xl border border-white/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="p-8">
        <AnimatePresence mode='wait'>
          
          {/* FASE 1: INTRO */}
          {fase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-emerald-200/50 shadow-lg">
                <Sparkles className="text-emerald-600" size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Asistente de Adopción</h3>
              <p className="text-slate-500 mb-8 text-lg">Responde 3 preguntas y nuestra IA encontrará al bebé disponible perfecto para ti.</p>
              <button onClick={iniciarQuiz} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Encontrar mi Ave <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* FASE 2: PREGUNTAS */}
          {fase === 'preguntas' && (
            <motion.div key="preguntas" initial="enter" animate="center" exit="exit" variants={slideVariants} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${((pasoActual + 1) / 3) * 100}%` }} />
              </div>
              <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm mb-4">{preguntas[pasoActual].icono}</div>
                <h3 className="text-2xl font-bold text-slate-800 text-center">{preguntas[pasoActual].pregunta}</h3>
              </div>
              <div className="space-y-4">
                {preguntas[pasoActual].opciones.map((opc, i) => (
                  <button key={i} onClick={() => procesarRespuesta(opc.val)} className="w-full p-4 rounded-2xl border-2 border-transparent bg-slate-50 hover:bg-white hover:border-emerald-400 transition-all duration-300 group text-left relative overflow-hidden shadow-sm hover:shadow-md">
                    <span className="flex items-center gap-4 relative z-10">
                      <span className="text-2xl">{opc.icon}</span>
                      <span className="flex flex-col">
                        <span className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{opc.label}</span>
                        <span className="text-slate-400 text-xs font-medium">{opc.desc}</span>
                      </span>
                    </span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100"></span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FASE 3: RESULTADO */}
          {fase === 'resultado' && (
            <motion.div key="resultado" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              {aveGanadora ? (
                 <>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${obtenerTextos().colorBadge}`}>
                        {obtenerTextos().badge}
                    </div>
                    
                    <div className="relative w-64 h-64 mx-auto mb-6 group rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        <img 
                            src={getImagenAve(aveGanadora)}
                            alt="Ave Ganadora" 
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/portada.png"; }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-left">
                           <p className="text-xs font-bold opacity-80">Disponible ahora</p>
                        </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight capitalize">{obtenerTextos().titulo}</h3>
                    <p className="text-emerald-600 font-bold text-sm mb-4 flex items-center justify-center gap-1">
                        <Tag size={14}/> {obtenerTextos().subtitulo}
                        {esAlternativa && <HeartHandshake size={16} className="text-rose-500 ml-2"/>}
                    </p>
                    
                    <div className={`p-5 rounded-2xl mb-6 border text-left ${esAlternativa ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-slate-600 text-sm leading-relaxed">
                           {obtenerTextos().desc}
                        </p>
                    </div>
                    
                    <a 
                        href={`https://wa.me/525642050757?text=Hola! Hice el test y me enamoré del ave anillada #${aveGanadora.anillo} (${aveGanadora.mutacion}). ¿Sigue disponible?`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg active:scale-95 mb-4"
                    >
                        Apartar Ave #{aveGanadora.anillo} <ArrowRight size={20} />
                    </a>
                 </>
              ) : (
                 <div className="py-10">
                    <p className="text-slate-500 mb-4">¡Vaya! Justo ahora todos nuestros bebés han sido adoptados.</p>
                    <a href="https://wa.me/525642050757" className="text-emerald-600 font-bold underline">Contáctanos para lista de espera</a>
                 </div>
              )}

              <button onClick={reiniciar} className="text-slate-400 text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:text-slate-600 transition-colors py-2">
                 <RotateCcw size={12}/> Reiniciar test
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CuestionarioAve;