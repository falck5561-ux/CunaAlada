import React from 'react';
import QRCode from 'react-qr-code';
import { X, PackageCheck, AlertCircle, Clock } from 'lucide-react';

export const ModalTicketQR = ({ qrAbierto, setQrAbierto, infoTicket }) => {
  // Si el modal no está abierto o no hay información del ticket, no renderizamos nada
  if (!qrAbierto || !infoTicket) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl transition-all">
      <div className={`bg-white p-10 rounded-[3.5rem] max-w-sm w-full flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative border-t-[14px] animate-bounce-in ${infoTicket.estado === 'pagado' ? 'border-emerald-500' : 'border-amber-500'}`}>
        
        {/* Botón Cerrar Superior */}
        <button 
          onClick={() => setQrAbierto(false)} 
          className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors active:scale-90"
        >
          <X size={20}/>
        </button>
        
        {/* Encabezado Dinámico: Pagado vs Pendiente */}
        {infoTicket.estado === 'pagado' ? (
          <div className="flex flex-col items-center w-full">
             <div className="bg-emerald-500 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 shadow-[0_8px_20px_rgba(16,185,129,0.4)]">
                <PackageCheck size={18} strokeWidth={3} /> PAGO CONFIRMADO
             </div>
             <p className="text-[10px] font-black text-emerald-700 mb-8 uppercase tracking-widest px-4 italic leading-relaxed">
                Tus productos están listos. Muestra este código en el mostrador para recoger.
             </p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
             <div className="bg-amber-500 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2 shadow-[0_8px_20px_rgba(245,158,11,0.4)]">
                <AlertCircle size={18} strokeWidth={3} /> PENDIENTE DE PAGO
             </div>
             <p className="text-[10px] font-black text-amber-700 mb-4 uppercase tracking-widest px-4 italic leading-relaxed">
                Acude a caja con este código para liquidar tu pedido y recibir tus productos.
             </p>
             
             {/* Advertencia de 48 horas */}
             <div className="bg-rose-50/80 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-2xl mb-8 flex items-center gap-2 shadow-sm">
               <Clock size={16} className="animate-pulse shrink-0" />
               <span className="text-[9px] font-black uppercase tracking-widest leading-tight text-left">
                 Este folio expira en 48 horas. Si no se liquida, será cancelado.
               </span>
             </div>
          </div>
        )}
        
        {/* Contenedor del Código QR con Glow Efecto */}
        <div className={`p-8 bg-white rounded-[3rem] border-4 shadow-inner mb-8 flex justify-center relative overflow-hidden ${infoTicket.estado === 'pagado' ? 'border-emerald-50' : 'border-amber-50'}`}>
          <div className={`absolute inset-0 opacity-20 blur-2xl ${infoTicket.estado === 'pagado' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
          <div className="relative z-10 mix-blend-multiply">
            <QRCode value={infoTicket.qrString} size={210} level="H" />
          </div>
        </div>

        {/* Resumen de Datos del Folio */}
        <div className="w-full bg-slate-50 p-6 rounded-[2rem] text-left space-y-4 border border-slate-100 mb-8 shadow-inner">
          <div className="flex justify-between border-b border-slate-200 pb-3 italic font-black">
            <span className="text-[10px] text-slate-400 uppercase">Folio Venta</span>
            <span className="text-slate-900 tracking-tighter uppercase text-lg">{infoTicket.folio}</span>
          </div>
          <div className="flex justify-between items-end italic font-black pt-1">
            <span className="text-[10px] text-slate-400 uppercase mb-1">Monto Total</span>
            <span className={`text-5xl tracking-tighter leading-none italic drop-shadow-sm ${infoTicket.estado === 'pagado' ? 'text-emerald-600' : 'text-slate-900'}`}>
              ${infoTicket.total}
            </span>
          </div>
        </div>

        {/* Botón Principal Cerrar */}
        <button 
          onClick={() => setQrAbierto(false)} 
          className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.4)] hover:-translate-y-1 uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all"
        >
          CERRAR TICKET
        </button>
      </div>
    </div>
  );
};