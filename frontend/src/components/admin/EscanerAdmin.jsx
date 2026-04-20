import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { 
  Scan, CheckCircle2, XCircle, RefreshCw, 
  ShieldAlert, Package, Bird, Check, RotateCcw,
  Zap, ShieldCheck, Cpu
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api'; 

const EscanerAdmin = () => {
  const [paso, setPaso] = useState('esperando'); 
  const [datos, setDatos] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (paso === 'esperando') {
      const scanner = new Html5QrcodeScanner(
        "lector-qr",
        { fps: 20, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
        false
      );

      scanner.render((text) => {
        if (text.startsWith("VAL-LONJA:")) {
          const id = text.split(':')[1];
          const user = text.split(':')[3];
          scanner.clear();
          consultarTicket(id, user);
        }
      }, () => {});

      return () => { scanner.clear().catch(() => {}); };
    }
  }, [paso]);

  const consultarTicket = async (id, usuario) => {
    setProcesando(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/canjes/consultar-qr/${id}`);
      setDatos({ ...res.data, usuarioNombre: usuario });
      setPaso('verificado');
    } catch (err) {
      if (err.response?.status === 400) {
        setDatos({ ...err.response.data.canje, usuarioNombre: usuario });
        setErrorMsg(err.response.data.message);
        setPaso('verificado');
      } else {
        setErrorMsg("ERROR: El ticket no existe o expiró.");
        setPaso('esperando');
      }
    } finally { setProcesando(false); }
  };

  const confirmarEntrega = async () => {
    setProcesando(true);
    try {
      await axios.patch(`${API_URL}/canjes/confirmar-entrega/${datos._id}`);
      setPaso('exito');
    } catch (err) {
      alert("Error en el enlace con la base de datos.");
    } finally { setProcesando(false); }
  };

  return (
    <div className="flex justify-center items-start pt-6 pb-20 px-4">
      <div className="w-full max-w-xl bg-[#0a0f18]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Decoración de Neón Superior */}
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-700 ${
          paso === 'exito' ? 'bg-emerald-400 shadow-[0_0_20px_#10b981]' : 
          datos?.estadoEntrega === 'entregado' ? 'bg-rose-500 shadow-[0_0_20px_#f43f5e]' : 'bg-cyan-500 shadow-[0_0_20px_#06b6d4]'
        }`} />

        {/* --- PANTALLA 1: ESCANER ACTIVO --- */}
        {paso === 'esperando' && !procesando && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-2">
                <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
                    <Cpu className="text-cyan-400 animate-pulse" size={32} />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Terminal <span className="text-cyan-400">Scanner</span></h2>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Buscando señal de ticket...</p>
              </div>
            </div>
            
            <div className="relative group">
              {/* Esquinas decorativas del escáner */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-xl z-10" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-xl z-10" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-xl z-10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-xl z-10" />
              
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md p-3 relative">
                {/* Línea láser de escaneo animada */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan z-10 opacity-50" />
                <div id="lector-qr" className="w-full rounded-[2rem] overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400">
                    <ShieldAlert size={20} />
                    <p className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</p>
                </div>
            )}
          </div>
        )}

        {/* --- PANTALLA 2: VERIFICACIÓN --- */}
        {paso === 'verificado' && datos && !procesando && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`relative p-8 rounded-[3rem] border-2 text-center overflow-hidden ${
              datos.estadoEntrega === 'entregado' ? 'bg-rose-500/5 border-rose-500/40' : 'bg-emerald-500/5 border-emerald-500/40'
            }`}>
              {/* Brillo de fondo */}
              <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[80px] opacity-20 ${datos.estadoEntrega === 'entregado' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              
              <div className="relative z-10">
                <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${
                  datos.estadoEntrega === 'entregado' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {datos.estadoEntrega === 'entregado' ? '¡Ya Cobrado!' : 'Ticket Válido'}
                </h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">
                  {datos.estadoEntrega === 'entregado' ? 'Protocolo de Seguridad' : 'Autorización de Entrega'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6 relative">
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aviador Identificado</span>
                    </div>
                    <h4 className="text-3xl font-black text-white italic">{datos.usuarioNombre}</h4>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            {datos.tipo === 'ave' ? <Bird size={60}/> : <Package size={60}/>}
                        </div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Producto de Canje</p>
                        <p className="text-2xl font-black text-white uppercase italic leading-tight">{datos.itemNombre}</p>
                        <div className="mt-4 inline-flex items-center gap-3 bg-emerald-500 text-slate-950 px-4 py-1 rounded-xl font-black text-xs">
                            UNIDADES: {datos.cantidad || 1}
                        </div>
                    </div>
                </div>

                {datos.estadoEntrega === 'entregado' && (
                    <div className="flex items-start gap-3 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                        <ShieldAlert className="text-rose-500 shrink-0" size={18} />
                        <div>
                            <p className="text-[9px] font-black text-rose-500 uppercase">Registro de Cobro</p>
                            <p className="text-xs font-bold text-white/80 italic">{errorMsg}</p>
                        </div>
                    </div>
                )}
            </div>

            {datos.estadoEntrega !== 'entregado' ? (
              <button 
                onClick={confirmarEntrega}
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95"
              >
                <ShieldCheck size={24} strokeWidth={3} /> CONFIRMAR ENTREGA
              </button>
            ) : (
              <button 
                onClick={() => setPaso('esperando')}
                className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                <RotateCcw size={18} className="inline mr-2"/> VOLVER AL INICIO
              </button>
            )}
          </div>
        )}

        {/* --- PANTALLA 3: ÉXITO --- */}
        {paso === 'exito' && (
          <div className="text-center py-12 space-y-8 animate-in zoom-in duration-500">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-30 rounded-full animate-pulse" />
                <CheckCircle2 size={120} className="text-emerald-400 relative z-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">¡Entregado!</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Protocolo de Canje Finalizado</p>
            </div>

            <button 
              onClick={() => setPaso('esperando')}
              className="w-full py-6 bg-white text-slate-950 hover:bg-emerald-400 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl"
            >
              SIGUIENTE CLIENTE
            </button>
          </div>
        )}

        {/* CARGANDO / PROCESANDO */}
        {procesando && (
          <div className="absolute inset-0 bg-[#0a0f18]/90 backdrop-blur-md flex flex-col items-center justify-center rounded-[3rem] z-50">
            <RefreshCw className="text-cyan-400 animate-spin mb-4" size={60} />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 animate-pulse">Sincronizando Datos...</p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EscanerAdmin;