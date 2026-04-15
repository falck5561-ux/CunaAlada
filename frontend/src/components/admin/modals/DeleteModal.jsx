import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-all border border-slate-100">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-1">
                    <AlertTriangle size={28} className="text-rose-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">¿Eliminar registro?</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Esta acción no se puede deshacer. ¿Estás seguro de que quieres borrarlo permanentemente?
                    </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all text-sm"
                    >
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DeleteModal;