import React from 'react';
import { Users, X, User, AlertCircle } from 'lucide-react';

const ParticipantsModal = ({ show, boletos, tituloSorteo, onClose, theme }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-slate-100 overflow-hidden">
        <div className={`p-6 bg-gradient-to-r ${theme.grad} text-white flex justify-between items-center`}>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users size={24}/> Participantes: {tituloSorteo}
            </h3>
            <p className="text-xs text-white/80 mt-1">{boletos.length} boletos vendidos en total</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24}/>
          </button>
        </div>
        
        <div className="p-6 overflow-auto flex-1 bg-slate-50">
          <table className="w-full text-left bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <thead className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="py-4 px-6">Boleto</th>
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">ID Pago (Stripe)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {boletos.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-black text-violet-600 text-lg">#{b.numeroBoleto}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-700 flex items-center gap-2">
                      <User size={14} className="text-slate-400" /> {b.nombreCliente}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{b.usuarioEmail}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 font-medium">{b.telefonoCliente}</td>
                  <td className="py-4 px-6 font-mono text-[10px] text-slate-400 break-all w-1/4">
                    {b.idPagoStripe || 'Pago Manual / Sin ID'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {boletos.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <AlertCircle size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-30"/>
              <p className="font-medium">Aún no hay ventas registradas para este sorteo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;