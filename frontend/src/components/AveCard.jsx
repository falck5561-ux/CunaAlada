import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Calendar, Hash, RotateCw, Award, CheckCircle2, MapPin, Smartphone, Tag, PenLine } from 'lucide-react';

/* --- ESTILOS CSS --- */
const EstilosAve = () => (
  <style>{`
    .scene-wrapper {
      position: relative;
      width: 100%;
      max-width: 320px; 
      height: 500px;
      margin: 0 auto;
      perspective: 1200px;
      z-index: 1;
    }
    .egg-layer {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 20;
    }
    .click-zone {
      position: absolute; width: 100%; height: 100%; z-index: 50;
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      cursor: pointer; 
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    .layer-common {
      position: absolute; object-fit: contain; pointer-events: none;
      transition: transform 0.5s ease, opacity 0.3s ease;
    }
    .liquid-mask {
      top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
      background: radial-gradient(circle at center, #8a1c1c 0%, #4a0404 60%, #000000 100%);
      -webkit-mask-image: url('/huevo.png'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;
      mask-image: url('/huevo.png'); mask-size: contain; mask-repeat: no-repeat; mask-position: center;
      opacity: 0;
    }
    .feto-layer {
      z-index: 2; width: 55%; height: 55%; top: 22.5%; left: 22.5%;
      filter: sepia(0.2) contrast(1.2) drop-shadow(0 0 10px rgba(0,0,0,0.8));
      opacity: 0; mix-blend-mode: hard-light;
    }
    .shell-layer {
      top: 0; left: 0; width: 100%; height: 100%; z-index: 3;
      -webkit-mask-image: radial-gradient(circle 110px at var(--x, 50%) var(--y, 50%), transparent 5%, black 40%);
      mask-image: radial-gradient(circle 110px at var(--x, 50%) var(--y, 50%), transparent 5%, black 40%);
    }
    
    .click-zone:hover ~ .anim-target .liquid-mask,
    .click-zone:hover ~ .anim-target .feto-layer,
    .click-zone:active ~ .anim-target .liquid-mask,
    .click-zone:active ~ .anim-target .feto-layer { opacity: 1; }
    
    @keyframes life-breath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    .click-zone:hover ~ .anim-target, .click-zone:active ~ .anim-target { animation: life-breath 3s infinite ease-in-out; }

    .scene-wrapper.hatched .egg-layer { 
      opacity: 0; 
      transform: scale(1.5);
      pointer-events: none;
      transition: transform 0.3s ease-out, opacity 0.2s ease-out; 
    }
    .scene-wrapper.hatched .click-zone { display: none; }

    .card-container {
      position: absolute; width: 100%; height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s;
      opacity: 0;
      transform: translateY(80px) rotateY(0deg);
      z-index: 10;
      cursor: pointer;
    }
    .scene-wrapper.hatched .card-container {
      opacity: 1; transform: translateY(0) rotateY(0deg);
    }
    .scene-wrapper.hatched .card-container.flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px -5px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
    }
    .face-front {
      background: white;
      z-index: 2;
    }
    .face-back {
      transform: rotateY(180deg);
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 150px; height: 150px;
      opacity: 0.5;
      pointer-events: none;
    }
  `}</style>
);

const AveCard = ({ ave }) => {
  const [eclosionado, setEclosionado] = useState(false);
  const [girado, setGirado] = useState(false);
  const [imgSrc, setImgSrc] = useState('/portada.png');
  const wrapperRef = useRef(null);

  // --- LÓGICA DE PRECIO Y OFERTA ---
  const esOferta = ave.precioOriginal && ave.precioOriginal > ave.precio;
  const porcentajeDescuento = esOferta 
    ? Math.round(((ave.precioOriginal - ave.precio) / ave.precioOriginal) * 100) 
    : 0;

  const colorAcento = esOferta ? "text-red-600" : "text-emerald-600";
  const bgAcento = esOferta ? "bg-red-50" : "bg-emerald-50";
  const iconoColor = esOferta ? "text-red-500" : "text-emerald-500";
  const bordeOferta = esOferta ? "border-2 border-red-500 shadow-xl shadow-red-100" : "";

  // --- LÓGICA DE IMAGEN SEGURA ---
  useEffect(() => {
    if (ave.fotoUrl) {
      if (ave.fotoUrl.startsWith('/uploads')) {
        setImgSrc(`http://localhost:5000${ave.fotoUrl}`);
      } else {
        setImgSrc(ave.fotoUrl);
      }
    } else if (ave.foto) { // Soporte para campo 'foto' si existe
         setImgSrc(`http://localhost:5000${ave.foto}`);
    } else {
      setImgSrc("/portada.png"); // Fallback
    }
  }, [ave]);

  const updateMask = (clientX, clientY) => {
    if (!wrapperRef.current || eclosionado) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    wrapperRef.current.style.setProperty('--x', `${x}px`);
    wrapperRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleMouseMove = (e) => updateMask(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    updateMask(touch.clientX, touch.clientY);
  };

  // --- FUNCIÓN PARA ROMPER EL HUEVO (SIN CRASH) ---
  const romperHuevo = () => {
    // Intentar reproducir sonido, pero no romper la app si falla
    try {
        const audio = new Audio('/click.mp3');
        audio.volume = 0.5; 
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Silenciosamente ignorar error de audio
                console.log("Audio no disponible, continuando...");
            });
        }
    } catch (e) {
        console.log("Audio no soportado");
    }
    setEclosionado(true);
  };

  const formatoMXN = new Intl.NumberFormat('es-MX', {
    style: 'decimal', minimumFractionDigits: 0
  });

  return (
    <>
      <EstilosAve />
      
      <div 
        className={`scene-wrapper group ${eclosionado ? 'hatched' : ''}`}
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        
        {/* === NIDO DE FONDO === */}
        {!eclosionado && (
          <div 
            className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280%] h-[280%] z-[-10] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
             <img 
               src="/nido.png" 
               alt="Nido" 
               className="w-full h-full object-contain drop-shadow-2xl opacity-90 translate-y-12"
               onError={(e) => e.target.style.display = 'none'} // Ocultar si falla
             />
          </div>
        )}

        {/* --- CAPA HUEVO --- */}
        <div className="egg-layer">
            <div className="absolute -top-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse md:hidden">
              <span className="flex items-center gap-1"><Smartphone size={12}/> Toca para romper</span>
            </div>

            <div className="click-zone" onClick={romperHuevo}></div>
            
            <div className="anim-target w-full h-full relative flex items-center justify-center">
                <div className="layer-common liquid-mask"></div>
                {/* Fallbacks para imágenes internas del huevo */}
                <img src="/feto.png" alt="Interior" className="layer-common feto-layer" onError={(e) => e.target.style.display='none'}/>
                <img src="/huevo.png" alt="Huevo" className="layer-common shell-layer" onError={(e) => e.target.src='https://via.placeholder.com/300?text=Huevo'}/>
            </div>
        </div>

        {/* --- CAPA CARTA (ADOPCIÓN) --- */}
        <div 
          className={`card-container ${girado ? 'flipped' : ''}`}
          onClick={() => setGirado(!girado)}
        >
            {/* >>> FRENTE <<< */}
            <div className={`card-face face-front flex flex-col font-sans ${bordeOferta}`}>
                
                <div className="relative h-[65%] bg-slate-50 overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
                   
                   {esOferta && (
                     <div className="absolute top-4 right-4 z-30 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
                        <Tag size={12} className="fill-current" />
                        ¡-{porcentajeDescuento}%!
                     </div>
                   )}

                   {/* IMAGEN PRINCIPAL SEGURA */}
                   <img 
                     src={imgSrc} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                     alt={ave.especie}
                     onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "/portada.png"; // Fallback final
                     }}
                   />
                   
                   <div className="absolute bottom-5 left-5 z-20 text-white w-full pr-10">
                     <div className="flex items-center gap-2 mb-1">
                         <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-white/30">
                           {ave.mutacion || 'Estándar'}
                         </span>
                     </div>
                     <h2 className="text-3xl font-black tracking-tight shadow-black drop-shadow-lg leading-none">
                       {ave.especie || 'Ave Exótica'}
                     </h2>
                     <div className="mt-3 flex items-end gap-2 opacity-90">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Nombre:</span>
                         <div className="flex items-center gap-2">
                           <div className="h-6 w-32 border-b-2 border-dashed border-white/60 animate-pulse"></div>
                           <PenLine size={14} className="text-white/70 mb-1" />
                         </div>
                     </div>
                   </div>
                </div>

                <div className="flex-1 bg-white relative p-6 flex flex-col justify-between">
                   <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                     <div>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Nacimiento</p>
                         <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                           <Calendar size={14} className={iconoColor}/>
                           {ave.fechaNacimiento ? new Date(ave.fechaNacimiento).toLocaleDateString() : 'Pendiente'}
                         </p>
                     </div>
                     <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Anillo (ID)</p>
                         <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1.5 mt-0.5">
                           {ave.anillo || 'S/N'}
                           <Hash size={14} className={iconoColor}/>
                         </p>
                     </div>
                   </div>

                   <div className="flex justify-between items-end pt-2">
                     <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Adopción MXN</p>
                         {esOferta ? (
                           <div className="flex flex-col">
                             <span className="text-red-300 line-through text-xs font-bold decoration-red-300 decoration-2 mb-[-2px]">
                               Antes: ${formatoMXN.format(ave.precioOriginal)}
                             </span>
                             <div className={`text-3xl font-black ${colorAcento} tracking-tight`}>
                               ${formatoMXN.format(ave.precio)}
                             </div>
                           </div>
                         ) : (
                           <div className={`text-3xl font-black ${colorAcento} tracking-tight`}>
                             ${formatoMXN.format(ave.precio)}
                           </div>
                         )}
                     </div>
                     <div className="bg-slate-50 p-2 rounded-full text-slate-400 animate-pulse border border-slate-100">
                         <RotateCw size={18}/>
                     </div>
                   </div>
                </div>
            </div>

            {/* >>> REVERSO <<< */}
            <div className="card-face face-back p-0 flex flex-col relative">
                <div className="watermark"></div>
                <div className="bg-slate-50 p-6 border-b border-slate-200 text-center relative z-10">
                   <div className="mx-auto w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-3">
                      <Award size={24} className="text-yellow-500" />
                   </div>
                   <h3 className="text-lg font-serif font-bold text-slate-800 tracking-wide">Certificado de Origen</h3>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Cuna Alada • Campeche</p>
                </div>
                <div className="flex-1 p-6 relative z-10 flex flex-col justify-center space-y-5">
                   <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 ${bgAcento} rounded-lg ${colorAcento}`}>
                            <CheckCircle2 size={16}/>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Salud</p>
                            <p className="text-xs font-bold text-slate-700">Verificada</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MapPin size={16}/>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Ubicación</p>
                            <p className="text-xs font-bold text-slate-700">Campeche, MX</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                      <p className="text-[9px] text-slate-500 text-center italic leading-relaxed">
                          "Garantizamos que este ejemplar de <strong>{ave.especie}</strong> con anillo <strong>{ave.anillo}</strong> ha nacido en cautiverio bajo estándares éticos."
                      </p>
                   </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-100 relative z-20">
                   <a 
                      href={`https://wa.me/5219811333772?text=Hola, quiero adoptar al *${ave.especie}* (Ref: ${ave.anillo || 'S/N'}) ${esOferta ? '(¡Vi la OFERTA!)' : ''}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} 
                      className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-colors text-white
                        ${esOferta 
                           ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                           : 'bg-slate-900 hover:bg-emerald-600 shadow-slate-300' 
                        }
                      `}
                   >
                      <ShoppingBag size={16} />
                      {esOferta ? '¡Obtener en Oferta!' : 'Iniciar Trámite'}
                   </a>
                   <div className="text-center mt-3">
                      <span className="text-[9px] text-slate-400 font-bold cursor-pointer hover:text-slate-600">VOLVER A LA FOTO</span>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default AveCard;