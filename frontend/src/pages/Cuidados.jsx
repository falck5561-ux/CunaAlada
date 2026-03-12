import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Play, Heart, AlertTriangle, CheckCircle2, Utensils, 
  Stethoscope, Sparkles, ChevronRight, ShieldCheck, 
  X, Zap, Thermometer, Brain, Home, Moon, Sun, 
  Activity, ArrowRight, Salad, Scale
} from 'lucide-react';

// --- DATA: BASE DE CONOCIMIENTO EXPANDIDA ---
const INFO_TABS = {
  PELIGROS: {
    id: 'peligros', label: 'Seguridad Vital', icon: ShieldCheck, color: 'bg-rose-500',
    content: [
      { title: "El Asesino Silencioso: Teflón", desc: "Sartenes y planchas antiadherentes sobrecalentadas liberan gases inodoros que matan al ave en minutos.", severity: "CRITICO" },
      { title: "Metales Pesados", desc: "Zinc y Plomo en cascabeles baratos, bisutería o jaulas oxidadas. Causan fallo neurológico.", severity: "ALTO" },
      { title: "Aguacate", desc: "Contiene persina, una toxina cardíaca letal para psitácidas. Jamás ofrecer ni un trozo.", severity: "LETAL" },
      { title: "Vapores Tóxicos", desc: "Aerosoles, perfumes, velas aromáticas, humo de tabaco e inciensos. Sus pulmones son hipersensibles.", severity: "ALTO" },
      { title: "Plantas Comunes", desc: "Adelfa, Lirio, Dieffenbachia y Potos son venenosas si las pican.", severity: "MEDIO" },
      { title: "Nidos de Tela", desc: "Las fibras se deshilachan y se enredan en patas (amputación) o buche (impactación).", severity: "ALTO" },
    ]
  },
  DIETA: {
    id: 'dieta', label: 'Nutrición Pro', icon: Utensils, color: 'bg-emerald-500',
    stats: [
      { label: "Pienso Extrusionado", val: "45%", desc: "Base de la dieta (Nutribird, Psittacus)" },
      { label: "Frescos Diarios", val: "40%", desc: "Verduras de hoja, pimiento, brocoli" },
      { label: "Semillas", val: "10%", desc: "Solo como premio o complemento" },
      { label: "Fruta", val: "5%", desc: "Por su alto contenido en azúcar" }
    ],
    list: ["Pimiento Rojo/Verde", "Espinacas", "Zanahoria", "Calabacín", "Brócoli", "Manzana (sin pepas)", "Huevo duro (con cáscara)"]
  },
  HABITAT: {
    id: 'habitat', label: 'Jaula y Sueño', icon: Home, color: 'bg-indigo-500',
    tips: [
      { t: "La Regla del Vuelo", d: "La jaula debe ser más ancha que alta. Mínimo 60cm de largo para que puedan aletear." },
      { t: "12 Horas de Oscuridad", d: "Necesitan dormir 12h en oscuridad total y silencio para no tener problemas hormonales." },
      { t: "Perchas Naturales", d: "Usa ramas de árboles frutales de diferentes grosores. El plástico causa pododermatitis." },
      { t: "Ubicación", d: "Sala social, pegada a una pared (seguridad), lejos de cocina y corrientes de aire." }
    ]
  },
  LENGUAJE: {
    id: 'lenguaje', label: 'Diccionario Ave', icon: Brain, color: 'bg-amber-500',
    actions: [
      { act: "Rechinar el pico", mean: "Estoy relajado y listo para dormir.", type: "good" },
      { act: "Regurgitar comida", mean: "Te quiero alimentar (Vínculo máximo).", type: "love" },
      { act: "Alas abiertas (Corazón)", mean: "Territorialidad o mucho calor.", type: "warn" },
      { act: "Pupilas contrayéndose", mean: "Excitación extrema o agresividad inminente.", type: "warn" },
      { act: "Esponjarse", mean: "Si es breve: relax. Si es constante: enfermedad.", type: "alert" }
    ]
  }
};

const VIDEOS = [
  { id: 1, title: "Guía Definitiva de Alimentación", yt: "CO7orv0PCjw", dur: "12:45", tag: "Esencial" },
  { id: 2, title: "Errores de Principiante", yt: "AP1xhrlhSbU", dur: "15:20", tag: "Crítico" },
  { id: 3, title: "Adiestramiento Básico", yt: "cJwKwo95qR0", dur: "10:12", tag: "Trucos" },
  { id: 4, title: "Lenguaje Corporal", yt: "qqPfrgDM7qY", dur: "14:05", tag: "Conducta" }
];

const Cuidados = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('peligros');
  const [videoModal, setVideoModal] = useState(null);

  // Variantes de Animación
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans selection:bg-emerald-200 pb-32">
      
      {/* --- HERO SECTION --- */}
      <header className="relative bg-slate-900 pt-32 pb-48 overflow-hidden rounded-b-[60px] md:rounded-b-[100px] shadow-2xl z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-2 px-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
              Academia Cuna Alada
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
              Maestría en <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Agapornis.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              No son adornos, son seres sintientes complejos. <br className="hidden md:block"/>
              Aquí tienes la ciencia y la experiencia para darles una vida plena.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 -mt-32 relative z-20">
        
        {/* --- SECCIÓN DE VIDEOS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/40 mb-20"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Play size={24} fill="currentColor"/></div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Videoteca Esencial</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VIDEOS.map((video) => (
              <motion.div 
                key={video.id} 
                whileHover={{ y: -10 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                onClick={() => setVideoModal(video)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={`https://img.youtube.com/vi/${video.yt}/hqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                      <Play fill="white" className="text-white ml-1" size={20} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md">{video.dur}</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{video.tag}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- PANEL DE INFORMACIÓN INTERACTIVA (BENTO GRID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
          
          {/* SIDEBAR DE NAVEGACIÓN (Responsivo: Horizontal en móvil, Vertical en Desktop) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:sticky lg:top-10 h-min z-20 snap-x">
            <LayoutGroup>
              {Object.values(INFO_TABS).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 lg:gap-4 p-4 lg:p-5 rounded-3xl transition-all duration-300 text-left group outline-none flex-shrink-0 snap-start ${isActive ? 'text-white shadow-lg lg:shadow-xl lg:scale-105' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTabBg" className={`absolute inset-0 rounded-3xl ${tab.color}`} />
                    )}
                    <tab.icon className="relative z-10 shrink-0" size={20} />
                    <span className="relative z-10 font-bold text-sm uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
                    {isActive && <motion.div layoutId="arrow" className="absolute right-4 z-10 hidden lg:block"><ChevronRight size={18}/></motion.div>}
                  </button>
                );
              })}
            </LayoutGroup>
          </div>

          {/* CONTENIDO PRINCIPAL DINÁMICO */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[50px] p-8 md:p-12 shadow-2xl border border-slate-100 min-h-[600px]"
              >
                {/* --- RENDERIZADO CONDICIONAL POR TAB --- */}

                {/* 1. PELIGROS */}
                {activeTab === 'peligros' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center"><ShieldCheck size={32}/></div>
                       <div>
                         <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Amenazas Ocultas</h3>
                         <p className="text-slate-500">Lo que para ti es normal, para ellos es veneno.</p>
                       </div>
                    </div>
                    <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {INFO_TABS.PELIGROS.content.map((item, idx) => (
                        <motion.div key={idx} variants={itemVars} className="p-6 rounded-[30px] bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-slate-100 group">
                           <div className="flex justify-between items-start mb-3">
                             <AlertTriangle className="text-rose-500 group-hover:scale-110 transition-transform" size={24} />
                             <span className={`text-[10px] font-black px-2 py-1 rounded bg-slate-200 ${item.severity === 'LETAL' ? 'text-rose-600 bg-rose-100' : 'text-slate-600'}`}>{item.severity}</span>
                           </div>
                           <h4 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h4>
                           <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* 2. DIETA */}
                {activeTab === 'dieta' && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center"><Salad size={32}/></div>
                       <div>
                         <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Ingeniería Nutricional</h3>
                         <p className="text-slate-500">Olvídate de "solo semillas". Eso es comida chatarra.</p>
                       </div>
                    </div>

                    {/* Gráfico de distribución (Responsivo con scroll horizontal en móviles) */}
                    <div className="flex md:grid md:grid-cols-4 gap-4 mb-12 overflow-x-auto pb-4 snap-x">
                      {INFO_TABS.DIETA.stats.map((stat, i) => (
                         <div key={i} className="min-w-[220px] md:min-w-0 flex-shrink-0 bg-slate-50 p-6 rounded-[30px] text-center border border-slate-100 relative overflow-hidden snap-center">
                            <h4 className="text-4xl font-black text-emerald-500 mb-1">{stat.val}</h4>
                            <p className="font-bold text-slate-700 text-sm uppercase mb-2">{stat.label}</p>
                            <p className="text-xs text-slate-400 leading-tight">{stat.desc}</p>
                            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500" style={{width: stat.val}}></div>
                         </div>
                      ))}
                    </div>

                    <div className="bg-emerald-50/50 rounded-[35px] p-8 border border-emerald-100">
                      <h5 className="font-black text-emerald-800 uppercase tracking-widest mb-6 flex items-center gap-2"><CheckCircle2 size={18}/> Lista de Compras Segura</h5>
                      <div className="flex flex-wrap gap-3">
                        {INFO_TABS.DIETA.list.map((item, i) => (
                          <span key={i} className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-sm font-bold shadow-sm border border-emerald-100">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HABITAT */}
                {activeTab === 'habitat' && (
                  <div>
                     <div className="flex items-center gap-4 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><Home size={32}/></div>
                       <div>
                         <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">El Hogar Perfecto</h3>
                         <p className="text-slate-500">Jaula no es cárcel, es su habitación segura.</p>
                       </div>
                    </div>
                    <div className="grid gap-6">
                      {INFO_TABS.HABITAT.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-6 p-6 bg-slate-50 rounded-[30px] hover:bg-indigo-50/30 transition-colors border border-slate-100">
                           <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shrink-0">{i+1}</div>
                           <div>
                             <h4 className="text-lg font-bold text-slate-800 mb-1">{tip.t}</h4>
                             <p className="text-slate-500 font-medium">{tip.d}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. LENGUAJE */}
                {activeTab === 'lenguaje' && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center"><Brain size={32}/></div>
                       <div>
                         <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Traductor Ave-Humano</h3>
                         <p className="text-slate-500">Aprende a escuchar lo que dicen sin palabras.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       {INFO_TABS.LENGUAJE.actions.map((act, i) => (
                         <div key={i} className="bg-white p-6 rounded-[30px] border-2 border-slate-50 shadow-lg hover:border-amber-200 transition-colors">
                            <div className="flex justify-between mb-4">
                              <span className="font-black text-slate-800 text-lg">{act.act}</span>
                              {act.type === 'love' && <Heart className="text-rose-500 animate-pulse" fill="currentColor"/>}
                              {act.type === 'warn' && <Zap className="text-amber-500"/>}
                              {act.type === 'good' && <Sparkles className="text-emerald-500"/>}
                              {act.type === 'alert' && <Activity className="text-blue-500"/>}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-600 font-medium text-sm">
                              "{act.mean}"
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- MITOS SECTION (FLIP CARDS) --- */}
        <section className="mb-32">
           <div className="text-center mb-16">
              <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs">Cultura General</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">Derribando Mitos</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { mito: "Si le compro pareja, dejará de quererme.", verdad: "Falso. Si tú mantienes la interacción, el ave suma a la manada, no resta. Un ave socialmente satisfecha es más equilibrada." },
                { mito: "Las semillas son la mejor comida.", verdad: "Son como comer hamburguesas a diario. Causan hígado graso y muerte prematura. El pienso debe ser la base." },
                { mito: "Necesitan espejos para no aburrirse.", verdad: "El espejo crea obsesión psicológica. Creen que el reflejo es otro pájaro que nunca les responde. Provoca agresividad." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                   <div className="text-rose-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2"><X size={16}/> Mito Común</div>
                   <h3 className="text-xl font-bold text-slate-800 mb-6 italic">"{item.mito}"</h3>
                   <div className="pt-6 border-t border-slate-100">
                     <div className="text-emerald-600 font-black uppercase text-xs tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> Realidad</div>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.verdad}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <div className="relative rounded-[60px] bg-slate-900 overflow-hidden text-center py-20 px-6 md:py-32">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
           <div className="relative z-10 max-w-4xl mx-auto">
             <Heart size={60} className="text-emerald-500 mx-auto mb-8 animate-bounce" fill="currentColor" />
             <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">¿Listo para el compromiso?</h2>
             <p className="text-slate-400 text-xl md:text-2xl font-medium mb-12">Si has leído todo esto, ya sabes más que el 90% de los dueños. <br/>Tus futuros agapornis estarán en buenas manos.</p>
             <button onClick={() => navigate('/aves')} className="bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg py-5 px-12 rounded-full transition-all shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto">
                Ver Aves Disponibles <ArrowRight />
             </button>
           </div>
        </div>

      </div>

      {/* --- MODAL VIDEO --- */}
      <AnimatePresence>
        {videoModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
            onClick={() => setVideoModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-all" onClick={() => setVideoModal(null)}>
                <X size={24} />
              </button>
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoModal.yt}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen title="video" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cuidados;