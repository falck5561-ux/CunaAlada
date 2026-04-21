import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { 
  Scan, CheckCircle2, XCircle, RefreshCw, 
  ShieldAlert, Package, Bird, Check, RotateCcw,
  Zap, ShieldCheck, Cpu, Banknote, ShoppingCart,
  Target, Info, User, Calendar
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
        { 
          fps: 24, 
          qrbox: { width: 280, height: 280 }, 
          rememberLastUsedCamera: true,
          aspectRatio: 1.0
        },
        false
      );

      scanner.render((text) => {
        if (text.startsWith("VAL-LONJA:")) {
          const id = text.split(':')[1];
          const user = text.split(':')[3];
          scanner.clear().catch(err => console.error(err));
          consultarTicketJuego(id, user);
        } 
        else if (text.startsWith("PEDIDO-TIENDA:")) {
          const id = text.split(':')[1];
          scanner.clear().catch(err => console.error(err));
          consultarPedidoTienda(id);
        }
      }, () => {});

      return () => {
        scanner.clear().catch((err) => {});
      };
    }
  }, [paso]);

  const consultarTicketJuego = async (id, usuario) => {
    setProcesando(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/canjes/consultar-qr/${id}`);
      setDatos({ ...res.data, usuarioNombre: usuario, tipoApp: 'juego' });
      setPaso('verificado');
    } catch (err) {
      if (err.response?.status === 400) {
        setDatos({ ...err.response.data.canje, usuarioNombre: usuario, tipoApp: 'juego' });
        setErrorMsg(err.response.data.message);
        setPaso('verificado');
      } else {
        setErrorMsg("IDENTIFICADOR INVÁLIDO: EL TICKET NO EXISTE");
        setPaso('esperando');
      }
    } finally { setProcesando(false); }
  };

  const consultarPedidoTienda = async (id) => {
    setProcesando(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/pedidos-tienda/consultar/${id}`);
      const pedido = res.data;
      setDatos({
        _id: pedido._id,
        folio: pedido.folio,
        usuarioNombre: pedido.usuarioNombre,
        totalCobrar: pedido.total,
        items: pedido.productos,
        estado: pedido.estado,
        tipoApp: 'tienda'
      });
      setPaso('verificado');
    } catch (err) {
      if (err.response?.status === 400) {
        const pedido = err.response.data.pedido;
        setDatos({
            _id: pedido._id,
            folio: pedido.folio,
            usuarioNombre: pedido.usuarioNombre,
            totalCobrar: pedido.total,
            items: pedido.productos,
            estado: pedido.estado, // Ahora nos indicará si es 'entregado'
            tipoApp: 'tienda'
        });
        setErrorMsg(err.response.data.message); // Mostrará "YA FUE ENTREGADO"
        setPaso('verificado');
      } else {
        setErrorMsg("PEDIDO NO ENCONTRADO EN LA BASE DE DATOS");
        setPaso('esperando');
      }
    } finally { setProcesando(false); }
  };

  const confirmarOperacion = async () => {
    setProcesando(true);
    const adminActual = localStorage.getItem('user-nombre') || 'Josué Pérez';
    try {
      if (datos.tipoApp === 'tienda') {
        // Al confirmar, el backend lo pasará a estado 'entregado'
        await axios.patch(`${API_URL}/pedidos-tienda/confirmar/${datos._id}`, { adminNombre: adminActual });
      } else {
        await axios.patch(`${API_URL}/canjes/confirmar-entrega/${datos._id}`);
      }
      setPaso('exito');
    } catch (err) {
      alert("Error crítico de sincronización.");
    } finally { setProcesando(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-10 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Fondo Decorativo Estilo Cyber */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* CARD PRINCIPAL - GLASSMORPHISM */}
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header de la Terminal */}
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                <Target className="text-cyan-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Cuna<span className="text-cyan-400">Scanner</span></h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Terminal de Validación V2.0</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
          </div>

          <div className="p-8">
            {/* --- PASO 1: ESCANEO --- */}
            {paso === 'esperando' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sistema de Visión Activo</span>
                  </div>
                  <h3 className="text-lg text-slate-300 font-medium">Posiciona el código QR frente a la cámara</h3>
                </div>

                <div className="relative mx-auto max-w-sm group">
                   {/* Esquinas de diseño */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-cyan-500 rounded-tl-2xl z-20" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-cyan-500 rounded-tr-2xl z-20" />
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-cyan-500 rounded-bl-2xl z-20" />
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-cyan-500 rounded-br-2xl z-20" />

                  {/* Contenedor del Scanner */}
                  <div className="rounded-[2rem] overflow-hidden bg-black/60 border border-white/5 relative aspect-square shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none z-10 animate-pulse" />
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scanner-line z-20" />
                    
                    <div id="lector-qr" className="w-full h-full object-cover grayscale brightness-125 contrast-125"></div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-bounce-in">
                    <ShieldAlert className="text-rose-500 shrink-0" size={24} />
                    <p className="text-xs font-black text-rose-500 uppercase tracking-wider">{errorMsg}</p>
                  </div>
                )}
              </div>
            )}

            {/* --- PASO 2: RESULTADOS --- */}
            {paso === 'verificado' && datos && (
              <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                
                {/* Status Badge */}
                <div className={`py-4 rounded-[2rem] border-2 text-center relative overflow-hidden ${
                  errorMsg ? 'bg-rose-500/5 border-rose-500/30 text-rose-500' : 'bg-emerald-500/5 border-emerald-500/30 text-emerald-500'
                }`}>
                  <div className={`absolute top-0 left-0 h-full w-2 ${errorMsg ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <h4 className="text-4xl font-black italic tracking-tighter uppercase">
                    {errorMsg ? 'DENEGADO' : 'APROBADO'}
                  </h4>
                  <p className="text-[10px] font-bold tracking-[0.4em] opacity-60">
                    ID: {datos._id.substring(0, 15)}...
                  </p>
                </div>

                {/* Info Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <User size={16} /> <span className="text-[10px] font-black uppercase">Cliente / Usuario</span>
                    </div>
                    <p className="text-xl font-bold text-white truncate">{datos.usuarioNombre}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <Calendar size={16} /> <span className="text-[10px] font-black uppercase">Referencia</span>
                    </div>
                    <p className="text-xl font-bold text-white">{datos.folio || 'CANJE-ALADA'}</p>
                  </div>
                </div>

                {/* 🔴 NUEVO: BANNER DE INSTRUCCIÓN DE COBRO PARA EL ADMIN */}
                {datos.tipoApp === 'tienda' && !errorMsg && (
                  <div className={`p-4 rounded-[1.5rem] border-2 flex items-center justify-center gap-3 shadow-lg ${
                    datos.estado === 'pagado' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {datos.estado === 'pagado' ? <CheckCircle2 size={24} /> : <Banknote size={24} />}
                    <span className="font-black tracking-[0.1em] text-sm md:text-base uppercase">
                      {datos.estado === 'pagado' ? 'PRE-PAGADO (TARJETA) - SOLO ENTREGAR' : 'COBRAR EN MOSTRADOR (EFECTIVO)'}
                    </span>
                  </div>
                )}

                {/* Detalles de lo que se entrega */}
                <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Resumen del Pedido</span>
                    {datos.tipoApp === 'tienda' ? <ShoppingCart size={18} className="text-slate-500" /> : <Bird size={18} className="text-slate-500" />}
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {datos.tipoApp === 'tienda' ? (
                      datos.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-cyan-400 border border-white/10">{it.cantidad}x</div>
                            <span className="text-sm font-bold text-slate-300">{it.nombre}</span>
                          </div>
                          <span className="text-sm font-black text-white">${it.precio * it.cantidad}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          {datos.tipo === 'ave' ? <Bird className="text-emerald-400" /> : <Package className="text-emerald-400" />}
                        </div>
                        <div>
                          <p className="text-lg font-black text-white uppercase italic">{datos.itemNombre}</p>
                          <p className="text-xs text-slate-400">Cantidad Total: {datos.cantidad || 1}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {datos.tipoApp === 'tienda' && (
                    <div className="mt-6 pt-4 border-t-2 border-white/5 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Monto Total</span>
                      {/* El color del total cambia para advertir si falta cobrar */}
                      <span className={`text-4xl font-black italic leading-none ${datos.estado === 'pagado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ${datos.totalCobrar}
                      </span>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 flex items-start gap-4">
                    <ShieldAlert className="text-rose-500 shrink-0" size={24} />
                    <p className="text-[11px] font-bold text-rose-300 leading-relaxed uppercase tracking-tight">{errorMsg}</p>
                  </div>
                )}

                {/* Acciones */}
                {!errorMsg ? (
                  <button 
                    onClick={confirmarOperacion}
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    <ShieldCheck size={24} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                    {/* El botón se adapta a la acción necesaria */}
                    {datos.tipoApp === 'tienda' && datos.estado === 'pendiente' ? 'COBRAR Y ENTREGAR' : 'CONFIRMAR ENTREGA'}
                  </button>
                ) : (
                  <button onClick={() => setPaso('esperando')} className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase border border-white/10 transition-all flex items-center justify-center gap-3">
                    <RotateCcw size={18} /> REINTENTAR ESCANEO
                  </button>
                )}
              </div>
            )}

            {/* --- PASO 3: ÉXITO --- */}
            {paso === 'exito' && (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-emerald-500/40 blur-3xl rounded-full animate-pulse" />
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.6)]">
                    <CheckCircle2 size={64} className="text-slate-950" strokeWidth={3} />
                  </div>
                </div>
                <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">¡LOGRADO!</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.4em] mb-10">La base de datos ha sido actualizada</p>
                
                <button 
                  onClick={() => setPaso('esperando')}
                  className="w-full py-6 bg-white text-slate-950 hover:bg-cyan-400 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                >
                  SIGUIENTE TURNO
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 flex justify-center items-center gap-6 text-slate-500 font-black text-[9px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2"><Zap size={10} className="text-cyan-500" /> Latencia: 14ms</div>
          <div className="flex items-center gap-2"><Cpu size={10} className="text-emerald-500" /> Encryption: AES-256</div>
          <div className="flex items-center gap-2"><Scan size={10} className="text-rose-500" /> Auth: Validated</div>
        </div>
      </div>

      {/* Overlay de Carga General */}
      {procesando && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="text-cyan-500 animate-pulse" size={32} />
            </div>
          </div>
          <p className="text-xs font-black text-cyan-400 uppercase tracking-[0.5em] mt-8 animate-pulse">Sincronizando con MongoDB...</p>
        </div>
      )}

      {/* Estilos CSS Adicionales */}
      <style>{`
        @keyframes scanner-line {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scanner-line {
          animation: scanner-line 3.5s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.4);
        }
        #lector-qr__dashboard_section_csr button {
          background: #22d3ee !important;
          color: #020617 !important;
          border-radius: 1rem !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          padding: 8px 16px !important;
          border: none !important;
          margin-top: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default EscanerAdmin;