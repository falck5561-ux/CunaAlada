import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AveCard from '../components/AveCard';
import QuizAve from '../components/QuizAve'; 
import { WifiOff, RefreshCw, Feather, Sparkles, Crown, HelpCircle, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Aves = () => {
  // --- ESTADO ---
  const [aves, setAves] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [aveSeleccionadaId, setAveSeleccionadaId] = useState(null);
  
  // Estado para el Quiz
  const [mostrarQuiz, setMostrarQuiz] = useState(false);

  // --- NUEVA FUNCIÓN PARA ABRIR TODOS LOS HUEVOS ---
  const abrirTodosLosHuevos = () => {
    const avesActualizadas = aves.map(ave => ({ 
      ...ave, 
      abierto: true // Le agregamos esta propiedad a cada ave
    }));
    setAves(avesActualizadas);
  };

  // --- CARGAR DATOS ---
  const obtenerAves = async () => {
    setCargando(true);
    setError(false);
    try {
      const res = await axios.get('https://cunaalada-kitw.onrender.com/api/aves');
      // Filtramos: Solo mostramos si no tiene estado o si está 'disponible'
      const disponibles = res.data.filter(ave => !ave.estado || ave.estado === 'disponible');
      setAves(Array.isArray(disponibles) ? disponibles : []);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAves();
  }, []);

  const handleCardClick = (id) => {
    setAveSeleccionadaId(prevId => prevId === id ? null : id);
  };

  // --- ANIMACIONES ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 50 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-200 relative overflow-hidden">

      {/* --- FONDO DECORATIVO --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-300/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">

        {/* --- HEADER --- */}
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

          {/* --- BOTONES DE ACCIÓN --- */}
          <div className="flex flex-wrap justify-center items-center gap-4 mx-auto">
            {/* BOTÓN TOGGLE QUIZ (El que ya tenías) */}
            <motion.button
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               onClick={() => setMostrarQuiz(!mostrarQuiz)}
               className={`
                 group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all
                 ${mostrarQuiz 
                   ? 'bg-slate-200 text-slate-600' 
                   : 'bg-white text-emerald-600 shadow-lg shadow-emerald-100 hover:scale-105 border border-emerald-100'}
               `}
            >
              <AnimatePresence mode='wait' initial={false}>
                {mostrarQuiz ? (
                  <motion.span 
                    key="close" 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    Cerrar asistente <ChevronUp size={16}/>
                  </motion.span>
                ) : (
                  <motion.span 
                    key="open"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle size={18}/> ¿No sabes cuál elegir? Haz el Test
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* NUEVO BOTÓN: ECLOSIONAR TODOS */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={abrirTodosLosHuevos}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-105"
            >
              🐣 Eclosionar todos
            </motion.button>
          </div>
        </div>

        {/* --- SECCIÓN DEL QUIZ INTELIGENTE --- */}
        <AnimatePresence>
          {mostrarQuiz && (
            <motion.div
              key="quiz-wrapper"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden mb-16"
            >
              <div className="py-2">
                 {/* AQUI ESTÁ EL CAMBIO IMPORTANTE: */}
                 <QuizAve avesDisponibles={aves} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- GRID PRINCIPAL --- */}
        <AnimatePresence mode='wait'>
          
          {cargando && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white h-[450px] rounded-[32px] shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
              ))}
            </motion.div>
          )}

          {!cargando && error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-rose-50 p-6 rounded-full text-rose-400 mb-6 shadow-sm border border-rose-100">
                <WifiOff size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Conexión interrumpida</h3>
              <p className="text-slate-400 mt-2 mb-8">No pudimos cargar la colección.</p>
              <button onClick={obtenerAves} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition-all active:scale-95">
                <RefreshCw size={14}/> Reintentar
              </button>
            </motion.div>
          )}

          {!cargando && !error && aves.length === 0 && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 opacity-50"
            >
              <Feather size={64} className="mx-auto mb-4 text-slate-300" />
              <p className="text-xl font-bold text-slate-400">Todos nuestros ejemplares tienen hogar</p>
              <p className="text-sm font-medium text-slate-300 mt-2">Vuelve pronto para nuevas nidadas.</p>
            </motion.div>
          )}

          {!cargando && !error && aves.length > 0 && (
            <motion.div
              key="grid-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-24 justify-items-center"
            >
              {aves.map((ave) => {
                const id = ave._id || ave.id;
                const isSelected = aveSeleccionadaId === id;

                return (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    layout 
                    className="w-full max-w-[340px] relative perspective-1000"
                    style={{ zIndex: isSelected ? 50 : 10 }}
                  >
                    <div 
                      className={`
                        relative w-full h-full transition-all duration-500 cursor-pointer group
                        ${isSelected ? 'z-50' : 'hover:-translate-y-3'}
                      `}
                      onClick={() => handleCardClick(id)}
                    >
                      <AveCard ave={ave} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </AnimatePresence>

        {/* --- FOOTER --- */}
        {!cargando && aves.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-32 border-t border-slate-100 pt-10"
          >
             <p className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
               <Sparkles size={12} /> Cuna Alada Oficial
             </p>
          </motion.div>
        )}

      </div>
      
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Aves;