import React from 'react';
import { Ticket, X, QrCode, CheckCircle, Clock } from 'lucide-react';

export const PanelFolios = ({ 
  misTicketsAbiertos, 
  setMisTicketsAbiertos, 
  tickets, 
  setInfoTicket, 
  setQrAbierto 
}) => {
  // Si el panel no está abierto, no renderizamos nada
  if (!misTicketsAbiertos) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro difuminado (cierra el panel al hacer clic) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setMisTicketsAbiertos(false)}
      ></div>
      
      {/* Contenedor principal del Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-[-20px_0_60px_rgba(0,0,0,0.2)] flex flex-col animate-slide-left border-l border-white/20">
        
        {/* === HEADER === */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Ticket className="text-amber-500" size={28}/> MIS FOLIOS
          </h2>
          <button 
            onClick={() => setMisTicketsAbiertos(false)} 
            className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-500 active:scale-90"
          >
            <X size={20}/>
          </button>
        </div>
        
        {/* === LISTA DE TICKETS === */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/80 custom-scrollbar">
          {tickets.length === 0 ? (
            // Estado vacío
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="p-8 bg-slate-100 rounded-full mb-6 shadow-inner">
                <QrCode size={64} strokeWidth={1.5} />
              </div>
              <p className="font-black uppercase tracking-widest text-sm">Sin Folios Activos</p>
            </div>
          ) : (
            // Mapeo de tickets
            tickets.map(t => (
              <div 
                key={t._id} 
                onClick={() => { 
                  // Al dar clic, preparamos la info y abrimos el Modal QR
                  setInfoTicket({
                    ...t, 
                    qrString: `PEDIDO-TIENDA:${t._id}:${t.estado.toUpperCase()}`
                  }); 
                  setQrAbierto(true); 
                  setMisTicketsAbiertos(false); 
                }} 
                className={`bg-white p-6 rounded-[2rem] border-2 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden active:scale-95 ${
                  t.estado === 'pagado' ? 'border-emerald-100 hover:border-emerald-400' : 'border-amber-100 hover:border-amber-400'
                }`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Folio Reservación</span>
                    <span className="font-black text-2xl uppercase italic tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {t.folio}
                    </span>
                  </div>
                  
                  {/* Badge de Estado */}
                  <span className={`font-black px-4 py-2 rounded-full text-[9px] shadow-sm tracking-widest border ${
                    t.estado === 'pagado' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {t.estado === 'pagado' ? 'PAGADO' : 'PENDIENTE'}
                  </span>
                </div>
                
                {/* Resumen Total */}
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                   {t.estado === 'pagado' ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
                   Monto Total: <span className="text-slate-900 text-sm drop-shadow-sm">${t.total}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};