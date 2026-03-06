import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, Zap, Palette, GraduationCap, HeartHandshake, Tag } from 'lucide-react';

const QuizAve = ({ avesDisponibles = [] }) => {
  
  // --- CEREBRO AUTOMÁTICO V2 (CLASIFICADOR DE AVES) ---
  const inventario = useMemo(() => {
    const tienePalabra = (ave, palabras) => {
      const texto = `${ave.mutacion || ''} ${ave.especie || ''} ${ave.nombre || ''}`.toLowerCase();
      return palabras.some(p => texto.includes(p));
    };

    // Filtramos las listas reales de objetos
    const listaVerdes = avesDisponibles.filter(ave => 
      tienePalabra(ave, ['verde', 'ancestral', 'jade', 'clásico', 'clasico'])
    );

    const listaAzules = avesDisponibles.filter(ave => 
      tienePalabra(ave, ['azul', 'blue', 'turquesa', 'violeta', 'cobalto'])
    );

    return { verdes: listaVerdes, azules: listaAzules };
  }, [avesDisponibles]);

  // --- ESTADOS ---
  const [fase, setFase] = useState('intro');
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [aveGanadora, setAveGanadora] = useState(null); 
  const [esAlternativa, setEsAlternativa] = useState(false);

  const preguntas = [
    {
      id: 'energia',
      pregunta: "¿Qué esperas de tu nuevo amigo?",
      icono: <Zap size={24} className="text-yellow-500" />,
      opciones: [
        { label: "Compañía y tranquilidad", val: "tranquilo", icon: "🍃", desc: "Disfrutar momentos de calma juntos" },
        { label: "Juego y diversión", val: "activo", icon: "⚡", desc: "Reírnos con sus ocurrencias" }
      ]
    },
    {
      id: 'color',
      pregunta: "¿Qué colores te atraen más?",
      icono: <Palette size={24} className="text-purple-500" />,
      opciones: [
        { label: "Verdes / Naturaleza", val: "verde", icon: "🌿", desc: "El color clásico de la selva" },
        { label: "Azules / Cielo", val: "azul", icon: "💎", desc: "Tonos turquesas y brillantes" }
      ]
    },
    {
      id: 'experiencia',
      pregunta: "¿Es tu primera vez criando?",
      icono: <GraduationCap size={24} className="text-blue-500" />,
      opciones: [
        { label: "Sí, soy principiante", val: "novato", icon: "👶", desc: "Busco algo dócil para aprender" },
        { label: "No, ya tengo experiencia", val: "experto", icon: "🎓", desc: "Conozco sus necesidades" }
      ]
    }
  ];

  const obtenerRandom = (array) => array[Math.floor(Math.random() * array.length)];

  // --- LÓGICA FINAL ---
  const procesarRespuesta = (valor) => {
    // 1. Guardamos la respuesta actual
    const respuestasFinales = { ...respuestas, [preguntas[pasoActual].id]: valor };
    setRespuestas(respuestasFinales);

    // 2. Si hay más preguntas, avanzamos
    if (pasoActual < preguntas.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      // 3. Si era la última, calculamos el resultado INMEDIATAMENTE
      setTimeout(() => {
          let ave = null;
          let alt = false;
          const quiereVerde = respuestasFinales.color === 'verde';

          if (quiereVerde) {
            if (inventario.verdes.length > 0) ave = obtenerRandom(inventario.verdes);
            else if (inventario.azules.length > 0) { ave = obtenerRandom(inventario.azules); alt = true; }
          } else {
            if (inventario.azules.length > 0) ave = obtenerRandom(inventario.azules);
            else if (inventario.verdes.length > 0) { ave = obtenerRandom(inventario.verdes); alt = true; }
          }
          
          setAveGanadora(ave);
          setEsAlternativa(alt);
          setFase('resultado');
      }, 50);
    }
  };

  const reiniciar = () => {
    setFase('intro');
    setPasoActual(0);
    setRespuestas({});
    setAveGanadora(null);
  };

  const obtenerTextos = () => {
    if (!aveGanadora) return { titulo: "¡Ups!", desc: "Todos nuestros bebés ya tienen hogar por ahora." };

    const esAveVerde = inventario.verdes.some(v => v._id === aveGanadora._id);
    const nombreColor = esAveVerde ? "Verde Ancestral" : "Azul Turquesa";
    
    let descripcion = "";
    let badge = "";

    if (esAlternativa) {
        descripcion = `Sabemos que buscabas otro color, ¡pero mira a quién tenemos aquí! Este bebé ${nombreColor} (Anillo ${aveGanadora.anillo}) está disponible y buscando familia. A veces el ave nos elige a nosotros. ¿No es hermoso?`;
        badge = "¡Te presentamos una alternativa!";
    } else {
        descripcion = `¡Lo encontramos! Basado en tus respuestas, este hermoso ${nombreColor} es tu compañero ideal. Tiene la energía y personalidad que buscas.`;
        badge = "¡Es un Match Perfecto!";
    }

    return { 
        titulo: aveGanadora.mutacion || "Roseicollis",
        subtitulo: `Anillo Oficial: #${aveGanadora.anillo}`,
        desc: descripcion,
        badge: badge,
        colorBadge: esAlternativa ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
    };
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  // --- HELPER PARA OBTENER LA IMAGEN INTELIGENTE ---
  const getImagenAve = (ave) => {
      if (!ave) return "/portada.png";
      const ruta = ave.foto || ave.fotoUrl;
      if (!ruta) return "/portada.png";
      if (ruta.startsWith('http')) return ruta;
      return `https://cunaalada-kitw.onrender.com${ruta}`;
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
              <button onClick={() => setFase('preguntas')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
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

          {/* FASE 3: RESULTADO (AVE REAL) */}
          {fase === 'resultado' && (
            <motion.div key="resultado" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              
              {aveGanadora ? (
                 <>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${obtenerTextos().colorBadge}`}>
                        {obtenerTextos().badge}
                    </div>
                    
                    <div className="relative w-64 h-64 mx-auto mb-6 group rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        
                        {/* IMAGEN CORREGIDA INTELIGENTE */}
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
                        href={`https://wa.me/529811333772?text=Hola! Hice el test y me enamoré del ave anillada #${aveGanadora.anillo} (${aveGanadora.mutacion}). ¿Sigue disponible?`} 
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
                    <a href="https://wa.me/529811333772" className="text-emerald-600 font-bold underline">Contáctanos para lista de espera</a>
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

export default QuizAve;