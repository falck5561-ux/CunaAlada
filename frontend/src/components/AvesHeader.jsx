import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, HelpCircle, ChevronUp } from 'lucide-react';

const AvesHeader = ({ mostrarQuiz, setMostrarQuiz, onAbrirHuevos }) => {
  return (
    <div className="text-center mb-12 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm"
      >
        <Crown size={14} className="fill-emerald-100" />
        <span>Colección Exclusiva 2024</span>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter leading-tight mb-4"
      >
        Nuestros <br className="md:hidden"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 animate-gradient-x">
          Ejemplares
        </span>
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 font-medium max-w-lg mx-auto text-lg mb-8"
      >
        Criados con amor, paciencia y dedicación. <br/>
        Elige tu compañero ideal hoy mismo.
      </motion.p>

      <div className="flex flex-wrap justify-center items-center gap-4 mx-auto">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setMostrarQuiz(!mostrarQuiz)}
          className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            mostrarQuiz ? 'bg-slate-200 text-slate-600' : 'bg-white text-emerald-600 shadow-lg shadow-emerald-100 hover:scale-105 border border-emerald-100'
          }`}
        >
          <AnimatePresence mode='wait' initial={false}>
            {mostrarQuiz ? (
              <motion.span key="close" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                Cerrar asistente <ChevronUp size={16}/>
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                <HelpCircle size={18}/> ¿No sabes cuál elegir? Haz el Test
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onAbrirHuevos}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-105"
        >
          🐣 Eclosionar todos
        </motion.button>
      </div>
    </div>
  );
};

export default AvesHeader;