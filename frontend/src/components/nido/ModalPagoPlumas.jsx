import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

// Tu llave pública real de Stripe (Segura para el frontend)
const stripePromise = loadStripe('pk_test_51SFnF0ROWvZ0m785J38J20subms9zeVw92xxsdct2OVzHbIXF8Kueajcp4jxJblwBhozD1xDljC2UG1qDNOGOxTX00UiDpoLCI');

// El formulario interno de la tarjeta
const FormularioTarjeta = ({ clientSecret, alCompletar, alCancelar, plumasCompradas }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [pagado, setPagado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcesando(true);
    setError(null);

    // Confirmamos el pago usando el secreto que nos dio el backend
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });

    if (payload.error) {
      setError(payload.error.message);
      setProcesando(false);
    } else if (payload.paymentIntent.status === 'succeeded') {
      setPagado(true);
      setProcesando(false);
      // Esperamos 2 segundos para mostrar la palomita verde y luego cerramos
      setTimeout(() => alCompletar(plumasCompradas), 2000);
    }
  };

  if (pagado) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <CheckCircle2 size={64} className="text-emerald-400 animate-bounce" />
        <h3 className="text-2xl font-black text-white">¡Pago Exitoso!</h3>
        <p className="text-slate-400">Se han añadido {plumasCompradas} 🪶 a tu Nido.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#e2e8f0',
                '::placeholder': { color: '#64748b' },
                iconColor: '#22d3ee',
              },
              invalid: { color: '#f43f5e', iconColor: '#f43f5e' }
            }
          }} 
        />
      </div>
      
      {error && <div className="text-rose-400 text-sm font-bold text-center">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || procesando}
        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {procesando ? <Loader2 className="animate-spin" /> : `Pagar y Recibir ${plumasCompradas} 🪶`}
      </button>
    </form>
  );
};

// El Modal Contenedor
const ModalPagoPlumas = ({ clientSecret, plumasCompradas, alCerrar, alCompletarExito }) => {
  if (!clientSecret) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-[2rem] max-w-md w-full shadow-[0_0_50px_-10px_rgba(6,182,212,0.4)] relative p-8">
        
        <button onClick={alCerrar} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" /> Pago Seguro
          </h2>
          <p className="text-slate-400 text-sm">Ingresa tu tarjeta para completar la recarga.</p>
        </div>

        {/* Envolvemos el formulario con el proveedor de Stripe */}
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
          <FormularioTarjeta 
            clientSecret={clientSecret} 
            plumasCompradas={plumasCompradas}
            alCerrar={alCerrar}
            alCompletar={alCompletarExito}
          />
        </Elements>
      </div>
    </div>
  );
};

export default ModalPagoPlumas;