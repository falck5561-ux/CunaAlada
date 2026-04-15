import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import QRCode from "react-qr-code";
import { PenLine, Download, ShieldCheck, Star, Bird, Feather } from 'lucide-react';

// Importamos nuestra lógica
import { useRegistro } from '../hooks/useRegistro';

const Registro = () => {
  const { token } = useParams();
  
  // Extraemos todo lo que necesitamos del Custom Hook
  const { 
    ave, form, setForm, paso, cargandoEnvio, 
    confirmarRegistro, formatearFecha, obtenerUrlImagen 
  } = useRegistro(token);

  const [descargando, setDescargando] = useState(false);
  const certificadoRef = useRef(null);

  const urlValidacion = `https://cunaalada.com/validar/${token}`; 
  const folioUnico = token ? token.substring(0, 8).toUpperCase() : "0000";

  // --- EFECTO PARA AUTODESCARGA ---
  useEffect(() => {
    if (paso === 2) {
        const timer = setTimeout(() => {
            descargarImagen();
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [paso]);

  const descargarImagen = async () => {
    if (certificadoRef.current && !descargando) {
      setDescargando(true);
      await new Promise(resolve => setTimeout(resolve, 500)); 

      try {
        const canvas = await html2canvas(certificadoRef.current, {
          scale: 4, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFCF5',
          logging: false,
          onclone: (clonedDoc) => {
              const element = clonedDoc.querySelector('.certificate-node');
              if(element) element.style.display = 'block';
          }
        });
        
        const link = document.createElement('a');
        link.download = `Titulo_Propiedad_${form.nombre}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error("Error capturando", error);
      } finally {
        setDescargando(false);
      }
    }
  };

  if (!ave) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-modern selection:bg-yellow-500/30 selection:text-yellow-200" translate="no">
      
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,134,11,0.08),rgba(0,0,0,1))]"></div>
      </div>

      <AnimatePresence mode="wait">
        {paso === 1 ? (
             <motion.div 
                key="paso-formulario" 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -30, scale: 0.95 }} 
                className="max-w-md w-full bg-[#0F0F0F]/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/5 shadow-[0_0_80px_-20px_rgba(184,134,11,0.15)] relative z-10"
             >
                 <div className="text-center mb-10">
                   <div className="inline-flex p-4 rounded-full border border-yellow-500/20 bg-gradient-to-b from-yellow-900/10 to-transparent mb-6 shadow-inner ring-1 ring-white/5">
                      <ShieldCheck size={36} className="text-yellow-500" />
                   </div>
                   <h1 className="text-4xl font-imperial text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-3 tracking-wide">
                     Registro Oficial
                   </h1>
                   <p className="text-slate-400 text-sm font-light">
                     Inmortaliza el vínculo con tu <span className="text-yellow-400 font-medium">{ave.especie}</span>.
                   </p>
                 </div>

                 <form onSubmit={confirmarRegistro} className="space-y-8">
                   <div className="group relative">
                      <label className="block text-[10px] font-bold text-yellow-600/80 uppercase tracking-[0.2em] mb-2 group-focus-within:text-yellow-400 transition-colors">Nombre del Ave</label>
                      <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-transparent border-b border-white/10 text-center text-3xl font-imperial text-white py-2 outline-none focus:border-yellow-500 transition-colors" placeholder="Apolo" maxLength={20} autoFocus />
                   </div>

                   <div className="group relative">
                      <label className="block text-[10px] font-bold text-yellow-600/80 uppercase tracking-[0.2em] mb-2 group-focus-within:text-yellow-400 transition-colors">Propietario Legal</label>
                      <input type="text" value={form.propietario} onChange={e => setForm({...form, propietario: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white font-medium outline-none focus:bg-white/10 transition-all" placeholder="Nombre y Apellido" />
                   </div>

                   <button disabled={cargandoEnvio} className="w-full bg-gradient-to-r from-yellow-700 to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-yellow-600/20 transition-all flex items-center justify-center gap-3 font-modern uppercase tracking-widest text-xs">
                      {cargandoEnvio ? "Procesando..." : <> <PenLine size={16} /> Firmar Título </>}
                   </button>
                 </form>
             </motion.div>
        ) : (
          <motion.div key="paso-certificado" className="flex flex-col items-center w-full max-w-[500px]">
              
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 1, type: "spring", bounce: 0.3 }} 
                className="w-full relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] z-20"
              >
                   <div ref={certificadoRef} className="certificate-node bg-paper-texture p-8 md:p-10 pb-6 relative overflow-hidden text-center w-full aspect-[3.5/5] flex flex-col justify-between" style={{ borderRadius: '2px' }}>
                        
                        <div className="absolute inset-4 border border-[#B8860B] opacity-40 pointer-events-none"></div>
                        <div className="absolute inset-6 border-[3px] border-double border-[#8B4513]/80 pointer-events-none"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none mix-blend-multiply">
                            <Feather size={250} className="text-[#8B4513]" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center h-full pt-4">
                            
                            {/* ENCABEZADO */}
                            <div className="mb-4 w-full">
                                <div className="flex justify-center items-center gap-4 mb-3 opacity-80">
                                    <div className="h-[1px] w-10 bg-[#8B4513]"></div>
                                    <Star size={8} className="text-[#B8860B] fill-current"/>
                                    <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#5c4033] font-modern">Certificado Oficial</span>
                                    <Star size={8} className="text-[#B8860B] fill-current"/>
                                    <div className="h-[1px] w-10 bg-[#8B4513]"></div>
                                </div>
                                <h1 className="font-imperial text-[38px] md:text-[46px] font-black tracking-tight leading-[0.85] text-[#B8860B]" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1), 0px 0px 2px rgba(184,134,11,0.5)' }}>
                                    TÍTULO DE<br/>PROPIEDAD
                                </h1>
                            </div>

                            {/* FOTO y ANILLO */}
                            <div className="relative my-2 group">
                                <div className="w-44 h-44 rounded-full p-1 bg-[#d4af37] shadow-lg">
                                  <div className="w-full h-full rounded-full border-[4px] border-[#f0f0f0] overflow-hidden bg-gray-200 relative">
                                      {ave.fotoUrl ? (
                                          <img src={obtenerUrlImagen(ave.fotoUrl)} className="w-full h-full object-cover" alt="Ave" crossOrigin="anonymous" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-slate-100"><Bird size={48} className="text-[#D4AF37] opacity-50"/></div>
                                      )}
                                  </div>
                                </div>
                                {/* --- CORRECCIÓN DEL ANILLO --- */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 shadow-md">
                                    <div className="bg-[#1a1a1a] text-[#F0E68C] px-6 py-1.5 rounded-[2px] text-[10px] font-bold tracking-[0.25em] border border-[#D4AF37] font-modern uppercase flex items-center justify-center gap-2">
                                        <span className="opacity-80 mt-[1px]">•</span> 
                                        <span>{ave.anillo || "S/N"}</span> 
                                        <span className="opacity-80 mt-[1px]">•</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col justify-center gap-1 w-full mt-6">
                                <div>
                                    <p className="font-imperial text-[9px] text-[#8B4513]/80 italic mb-1">Se otorga el presente a</p>
                                    <h2 className="font-imperial text-4xl text-[#3d231a] leading-tight capitalize drop-shadow-sm">{form.nombre}</h2>
                                    <p className="font-modern text-[7px] text-[#8B4513]/60 mt-1 uppercase tracking-widest font-semibold">
                                      Nacido el: <span>{formatearFecha(ave.fechaNacimiento)}</span>
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-center gap-3 opacity-30 my-2">
                                    <div className="h-[1px] w-16 bg-[#8B4513]"></div>
                                    <div className="w-1.5 h-1.5 rotate-45 bg-[#8B4513]"></div>
                                    <div className="h-[1px] w-16 bg-[#8B4513]"></div>
                                </div>
                                
                                <div>
                                    <p className="font-imperial text-[9px] text-[#8B4513]/80 italic mb-0">Bajo la tutela legal de</p>
                                    <h3 className="font-hand text-[42px] text-[#B8860B] px-4 leading-none pt-2">{form.propietario}</h3>
                                </div>
                            </div>

                            <div className="w-full mt-auto flex justify-between items-end pt-4 border-t border-[#8B4513]/20 relative">
                                <div className="absolute -top-[1px] left-0 w-1 h-1 bg-[#8B4513]"></div>
                                <div className="absolute -top-[1px] right-0 w-1 h-1 bg-[#8B4513]"></div>

                                <div className="text-left pl-1 flex flex-col justify-end">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#5c4033] font-modern mb-1.5">Cuna Alada Oficial</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 bg-white border border-[#8B4513]/20 shadow-sm">
                                            <QRCode value={urlValidacion} size={42} fgColor="#3d231a" bgColor="#FFFFFF" />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[5px] uppercase text-[#8B4513]/60 tracking-wider font-bold">Folio Digital</span>
                                            <span className="text-[10px] font-bold text-[#B8860B] font-mono tracking-widest">{folioUnico}</span>
                                            <span className="text-[6px] text-[#8B4513] font-serif italic mt-0.5">{new Date().toLocaleDateString('es-MX')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative pr-1 flex flex-col items-end opacity-90">
                                    <img src="/icono.png" alt="Logo" className="h-16 w-auto object-contain filter sepia contrast-125 drop-shadow-sm" />
                                    <p className="text-[6px] text-[#8B4513] font-modern mt-1 tracking-wider uppercase">Campeche, MX</p>
                                </div>
                            </div>
                        </div>
                   </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 1 }} 
                 className="mt-8 text-center w-full px-4 pb-12"
              >
                 <button 
                    onClick={descargarImagen} 
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#B8860B] via-[#F0E68C] to-[#B8860B] p-[1px] shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_40px_rgba(184,134,11,0.6)] hover:-translate-y-1 active:scale-[0.98] transition-all"
                 >
                    <div className="relative h-full w-full bg-[#1a1500] hover:bg-[#2e2600] rounded-[15px] px-8 py-5 transition-colors duration-500">
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-1/2 group-hover:animate-[shine_1.5s_infinite]"></div>
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            {descargando ? (
                                <span className="text-yellow-100 font-bold text-xs uppercase tracking-[0.25em] animate-pulse">Generando Imagen...</span>
                            ) : (
                                <>
                                    <Download size={20} className="text-[#FFD700]" /> 
                                    <span className="text-yellow-100 font-bold text-xs uppercase tracking-[0.25em] drop-shadow-md">Descargar Título</span>
                                </>
                            )}
                        </div>
                    </div>
                 </button>
                 {descargando && <p className="text-yellow-500/50 text-[9px] mt-2 animate-pulse font-modern">Por favor espera, estamos renderizando en alta calidad...</p>}
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registro;