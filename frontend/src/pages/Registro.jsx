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
          backgroundColor: '#FDFBF7', 
          logging: false,
          onclone: (clonedDoc) => {
              const element = clonedDoc.querySelector('.certificate-node');
              if(element) {
                element.style.display = 'block';
                element.style.transform = 'none'; 
              }
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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-modern selection:bg-yellow-500/30 selection:text-yellow-200" translate="no">
      
      {/* FONDO DECORATIVO LUXURY */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8B4513] opacity-[0.03] blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <AnimatePresence mode="wait">
        {paso === 1 ? (
          /* =========================================
             PASO 1: FORMULARIO
          ========================================= */
             <motion.div 
                key="paso-formulario" 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -30, scale: 0.95 }} 
                className="max-w-md w-full bg-[#111111]/90 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative z-10"
             >
                 <div className="text-center mb-10 relative">
                   <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -z-10"></div>
                   <div className="inline-flex p-4 rounded-full border border-[#D4AF37]/30 bg-[#0A0A0A] mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                      <ShieldCheck size={36} className="text-[#D4AF37]" />
                      <div className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-20"></div>
                   </div>
                   <h1 className="text-4xl font-imperial text-transparent bg-clip-text bg-gradient-to-r from-[#F0E68C] via-[#D4AF37] to-[#B8860B] mb-3 tracking-wide">
                      Registro Oficial
                   </h1>
                   <p className="text-slate-400 text-sm font-light">
                     Inmortaliza el vínculo con tu <span className="text-[#D4AF37] font-semibold">{ave.especie}</span>.
                   </p>
                 </div>

                 <form onSubmit={confirmarRegistro} className="space-y-8">
                   <div className="group relative">
                      <label className="block text-[10px] font-bold text-[#D4AF37]/70 uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-[#F0E68C]">Nombre del Ave</label>
                      <input 
                        type="text" 
                        value={form.nombre} 
                        onChange={e => setForm({...form, nombre: e.target.value})} 
                        className="w-full bg-transparent border-b-2 border-white/10 text-center text-3xl font-imperial text-white py-2 outline-none focus:border-[#D4AF37] transition-all" 
                        placeholder="Ejem: Apolo" 
                        maxLength={20} 
                        autoFocus 
                        required
                      />
                   </div>

                   <div className="group relative">
                      <label className="block text-[10px] font-bold text-[#D4AF37]/70 uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-[#F0E68C]">Propietario Legal</label>
                      <input 
                        type="text" 
                        value={form.propietario} 
                        onChange={e => setForm({...form, propietario: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-medium outline-none focus:bg-white/10 focus:border-[#D4AF37]/50 transition-all placeholder:text-white/20" 
                        placeholder="Nombre Completo" 
                        required
                      />
                   </div>

                   <button 
                     disabled={cargandoEnvio} 
                     className="w-full relative overflow-hidden bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:hover:translate-y-0"
                   >
                      {cargandoEnvio ? "Procesando..." : <> <PenLine size={18} /> Firmar Título </>}
                   </button>
                 </form>
             </motion.div>
        ) : (
          /* =========================================
             PASO 2: CERTIFICADO ULTRA ESTRICTO
          ========================================= */
          <motion.div key="paso-certificado" className="flex flex-col items-center w-full max-w-[450px]">
              
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} 
                className="w-full relative shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-20"
              >
                   <div 
                      ref={certificadoRef} 
                      className="certificate-node relative bg-[#FDFBF7] overflow-hidden w-full aspect-[7/10]" 
                      style={{ 
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')", 
                        boxSizing: "border-box"
                      }}
                   >
                        {/* BORDES ABSOLUTOS */}
                        <div className="absolute inset-4 border border-[#B8860B] opacity-30 pointer-events-none z-10"></div>
                        <div className="absolute inset-6 border-[3px] border-double border-[#8B4513]/70 pointer-events-none z-10"></div>
                        
                        {/* MARCA DE AGUA */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none mix-blend-multiply z-0">
                            <Feather size={350} className="text-[#8B4513]" />
                        </div>

                        <div className="absolute inset-6 flex flex-col justify-between z-20 pt-6 pb-4 px-4">
                            
                            {/* --- 1. HEADER --- */}
                            <div className="shrink-0 text-center">
                                <div className="flex justify-center items-center gap-3 mb-2 opacity-90">
                                    <div className="h-[1px] w-8 bg-[#8B4513]"></div>
                                    <Star size={7} className="text-[#B8860B] fill-current"/>
                                    <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-[#5c4033] font-modern">Certificado Oficial</span>
                                    <Star size={7} className="text-[#B8860B] fill-current"/>
                                    <div className="h-[1px] w-8 bg-[#8B4513]"></div>
                                </div>
                                <h1 className="font-imperial text-[36px] font-black tracking-tight leading-tight text-[#B8860B] pb-1" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                                    TÍTULO DE<br/>PROPIEDAD
                                </h1>
                            </div>

                            {/* --- 2. MIDDLE (Foto + Nombres) --- */}
                            <div className="flex-1 flex flex-col items-center justify-center w-full my-2">
                                
                                <div className="relative mb-5">
                                    {/* FOTO UN POCO MÁS CHICA PARA ASEGURAR ESPACIO */}
                                    <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-br from-[#F0E68C] via-[#D4AF37] to-[#8B4513] shadow-lg mx-auto">
                                      <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-[#F5F5DC] relative">
                                          {ave.fotoUrl ? (
                                              <img src={obtenerUrlImagen(ave.fotoUrl)} className="w-full h-full object-cover" alt="Ave" crossOrigin="anonymous" />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center"><Bird size={40} className="text-[#D4AF37] opacity-40"/></div>
                                          )}
                                      </div>
                                    </div>
                                    
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 w-max">
                                        <div className="bg-[#111] text-[#F0E68C] px-5 py-1 rounded-sm text-[9px] font-bold tracking-[0.2em] border border-[#D4AF37] font-modern uppercase flex items-center shadow-md">
                                            <span className="opacity-80 mr-2">•</span> 
                                            {ave.anillo || "S/N"} 
                                            <span className="opacity-80 ml-2">•</span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- TEXTOS CON HACK ANTI-CORTES Y ANTI-DESBORDES --- */}
                                <div className="text-center w-full px-2">
                                    <p className="font-imperial text-[10px] text-[#8B4513] italic opacity-80">Se otorga el presente a</p>
                                    
                                    {/* HACK: pt-2 pb-4 le da aire para no cortar las letras, -mb-4 evita que empuje el resto */}
                                    <h2 className="font-imperial text-[32px] text-[#3d231a] leading-none capitalize truncate w-full px-2 pt-2 pb-4 -mb-4">
                                      {form.nombre}
                                    </h2>
                                    
                                    <p className="font-modern text-[7px] text-[#8B4513] mt-3 mb-2 uppercase tracking-widest font-semibold opacity-70 relative z-10">
                                      Nacido el: {formatearFecha(ave.fechaNacimiento)}
                                    </p>
                                    
                                    <div className="flex items-center justify-center gap-3 opacity-20 mb-2 relative z-10">
                                        <div className="h-[1px] w-12 bg-[#8B4513]"></div>
                                        <div className="w-1.5 h-1.5 rotate-45 bg-[#8B4513]"></div>
                                        <div className="h-[1px] w-12 bg-[#8B4513]"></div>
                                    </div>
                                    
                                    <p className="font-imperial text-[10px] text-[#8B4513] italic opacity-80 relative z-10">Bajo la tutela legal de</p>
                                    
                                    {/* HACK: line-clamp por si el nombre es largo, con padding extra y margen negativo */}
                                    <h3 className="font-hand text-[32px] leading-[0.9] text-[#B8860B] line-clamp-2 px-2 pt-2 pb-4 -mb-4">
                                      {form.propietario}
                                    </h3>
                                </div>

                            </div>

                            {/* --- 3. FOOTER --- */}
                            <div className="shrink-0 w-full flex justify-between items-end pt-3 border-t border-[#8B4513]/20 relative z-10">
                                <div className="absolute -top-[1px] left-0 w-1 h-1 bg-[#8B4513]"></div>
                                <div className="absolute -top-[1px] right-0 w-1 h-1 bg-[#8B4513]"></div>

                                <div className="flex flex-col justify-end text-left">
                                    <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#5c4033] font-modern mb-1.5">Cuna Alada Oficial</p>
                                    <div className="flex items-center gap-2">
                                        <div className="p-[2px] bg-white border border-[#8B4513]/20 shadow-sm">
                                            <QRCode value={urlValidacion} size={36} fgColor="#3d231a" bgColor="#FFFFFF" />
                                        </div>
                                        <div className="flex flex-col gap-[1px]">
                                            <span className="text-[5px] uppercase text-[#8B4513]/60 tracking-wider font-bold">Folio Digital</span>
                                            <span className="text-[9px] font-bold text-[#B8860B] font-mono tracking-widest">{folioUnico}</span>
                                            <span className="text-[6px] text-[#8B4513] font-serif italic mt-0.5">{new Date().toLocaleDateString('es-MX')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end opacity-90 pb-1">
                                    <img src="/icono.png" alt="Logo" className="h-12 w-auto object-contain filter sepia contrast-125 opacity-80" />
                                    <p className="text-[5px] text-[#8B4513] font-modern mt-1 tracking-wider uppercase">Campeche, MX</p>
                                </div>
                            </div>

                        </div>
                   </div>
              </motion.div>

              {/* BOTÓN DE DESCARGA */}
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 1 }} 
                 className="mt-8 text-center w-full"
              >
                 <button 
                    onClick={descargarImagen} 
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#B8860B] via-[#F0E68C] to-[#B8860B] p-[1px] shadow-[0_0_20px_rgba(184,134,11,0.2)] hover:shadow-[0_0_40px_rgba(184,134,11,0.5)] hover:-translate-y-1 active:scale-95 transition-all"
                 >
                    <div className="relative h-full w-full bg-[#111] hover:bg-[#1a1a1a] rounded-[15px] px-8 py-4 transition-colors duration-500">
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-1/2 group-hover:animate-[shine_1.5s_infinite]"></div>
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            {descargando ? (
                                <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] animate-pulse">Renderizando...</span>
                            ) : (
                                <>
                                    <Download size={18} className="text-[#D4AF37]" /> 
                                    <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">Descargar Título</span>
                                </>
                            )}
                        </div>
                    </div>
                 </button>
                 {descargando && <p className="text-[#D4AF37]/50 text-[9px] mt-3 animate-pulse font-modern uppercase tracking-widest">Generando archivo en alta calidad...</p>}
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(100%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default Registro;