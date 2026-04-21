import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// === 1. COMPONENTE INTERNO DEL FORMULARIO STRIPE ===
const FormularioStripe = ({ total, onSuccess, onCancel, secretoStripe }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState(null);

  const ejecutarPago = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcesando(true);
    setErrorPago(null);

    const { error, paymentIntent } = await stripe.confirmCardPayment(secretoStripe, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (error) {
      setErrorPago(error.message);
      setProcesando(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={ejecutarPago} className="space-y-6">
      <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200 shadow-inner transition-all hover:bg-slate-50">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Terminal Cuna Alada</span>
          <div className="flex gap-1.5">
             <div className="w-8 h-5 bg-slate-200 rounded-md" />
             <div className="w-8 h-5 bg-slate-300 rounded-md" />
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#0f172a', fontFamily: 'system-ui, sans-serif', fontSmoothing: 'antialiased', '::placeholder': { color: '#94a3b8' } },
              invalid: { color: '#ef4444' }
            }
          }} />
        </div>
      </div>

      {errorPago && (
        <div className="bg-rose-50 text-rose-600 text-[11px] font-black p-4 rounded-2xl border border-rose-200 text-center animate-shake uppercase italic shadow-sm">
          {errorPago}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={procesando} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 hover:text-slate-700 transition-all active:scale-95">
          Cancelar
        </button>
        <button type="submit" disabled={procesando || !stripe} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:bg-emerald-500 hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
          {procesando ? 'AUTORIZANDO...' : `AUTORIZAR $${total}`}
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4">
        <Lock size={12} className="text-emerald-500" /> SSL Secure Gateway
      </div>
    </form>
  );
};

// === 2. COMPONENTE PRINCIPAL DEL MODAL (EXPORTADO) ===
export const TerminalPago = ({ 
  terminalAbierta, 
  setTerminalAbierta, 
  secretoStripe, 
  totalCarrito, 
  manejarPagoExitoso, 
  stripePromise 
}) => {
  if (!terminalAbierta || !secretoStripe) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl transition-all">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-t-[12px] border-emerald-500 animate-bounce-in relative">
        <button 
          onClick={() => setTerminalAbierta(false)} 
          className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors active:scale-90"
        >
          <X size={20}/>
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic text-slate-900">Pago Autorizado</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Cifrado de Seguridad Activo</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 flex justify-between items-end shadow-inner">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Total a cobrar</span>
           <span className="text-5xl font-black text-emerald-600 tracking-tighter leading-none italic drop-shadow-sm">${totalCarrito}</span>
        </div>

        {/* Aquí envolvemos el formulario con el proveedor de Stripe */}
        <Elements stripe={stripePromise} options={{ clientSecret: secretoStripe }}>
          <FormularioStripe 
            total={totalCarrito} 
            secretoStripe={secretoStripe} 
            onSuccess={manejarPagoExitoso} 
            onCancel={() => setTerminalAbierta(false)} 
          />
        </Elements>
      </div>
    </div>
  );
};