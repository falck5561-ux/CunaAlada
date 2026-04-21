import React from 'react';
import { ShoppingBag, Calendar, Hash, RotateCw, Award, CheckCircle2, MapPin, Smartphone, Tag, PenLine } from 'lucide-react';
import { useTarjetaAve } from '../hooks/useTarjetaAve';

const TarjetaAve = ({ ave }) => {
  const {
    eclosionado, girado, toggleGiro, imgSrc, wrapperRef,
    esOferta, porcentajeDescuento, estilos, formatoMXN,
    handleMouseMove, handleTouchMove, romperHuevo
  } = useTarjetaAve(ave);

  return (
    <div 
      className={`scene-wrapper group ${eclosionado ? 'hatched' : ''}`}
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      
      {/* === NIDO DE FONDO === */}
      {!eclosionado && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280%] h-[280%] z-[-10] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center">
           <img 
             src="/nido.png" alt="Nido" 
             className="w-full h-full object-contain drop-shadow-2xl opacity-90 translate-y-12"
             onError={(e) => e.target.style.display = 'none'} 
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
              <img src="/feto.png" alt="Interior" className="layer-common feto-layer" onError={(e) => e.target.style.display='none'}/>
              <img src="/huevo.png" alt="Huevo" className="layer-common shell-layer" onError={(e) => e.target.src='https://via.placeholder.com/300?text=Huevo'}/>
          </div>
      </div>

      {/* --- CAPA CARTA (ADOPCIÓN) --- */}
      <div className={`card-container ${girado ? 'flipped' : ''}`} onClick={toggleGiro}>
          
          {/* >>> FRENTE <<< */}
          <div className={`card-face face-front flex flex-col font-sans ${estilos.bordeOferta}`}>
              <div className="relative h-[65%] bg-slate-50 overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
                 
                 {esOferta && (
                   <div className="absolute top-4 right-4 z-30 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
                      <Tag size={12} className="fill-current" /> ¡-{porcentajeDescuento}%!
                   </div>
                 )}

                 <img 
                   src={imgSrc} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   alt={ave.especie}
                   onError={(e) => { e.target.onerror = null; e.target.src = "/portada.png"; }}
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
                         <Calendar size={14} className={estilos.iconoColor}/>
                         {ave.fechaNacimiento ? new Date(ave.fechaNacimiento).toLocaleDateString() : 'Pendiente'}
                       </p>
                   </div>
                   <div className="text-right">
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Anillo (ID)</p>
                       <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1.5 mt-0.5">
                         {ave.anillo || 'S/N'}
                         <Hash size={14} className={estilos.iconoColor}/>
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
                           <div className={`text-3xl font-black ${estilos.colorAcento} tracking-tight`}>
                             ${formatoMXN.format(ave.precio)}
                           </div>
                         </div>
                       ) : (
                         <div className={`text-3xl font-black ${estilos.colorAcento} tracking-tight`}>
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
                       <div className={`p-2 ${estilos.bgAcento} rounded-lg ${estilos.colorAcento}`}>
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
                    href={`https://wa.me/5215642050757?text=Hola, quiero adquirir al *${ave.especie}* (Ref: ${ave.anillo || 'S/N'}) ${esOferta ? '(¡Vi la OFERTA!)' : ''}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-colors text-white
                      ${esOferta ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-emerald-600 shadow-slate-300'}
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
  );
};

export default TarjetaAve;