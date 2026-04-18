import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Notificacion = ({ notificacion }) => {
  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${notificacion.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium ${notificacion.type === 'error' ? 'bg-rose-500' : 'bg-slate-800'}`}>
          {notificacion.type === 'error' ? <XCircle size={20}/> : <CheckCircle size={20} className="text-emerald-400"/>}
          <span>{notificacion.message}</span>
        </div>
    </div>
  );
};

export default Notificacion;