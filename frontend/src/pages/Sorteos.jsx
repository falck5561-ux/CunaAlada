import React, { useState } from 'react';
import axios from 'axios';
import { Ticket, Trophy, CreditCard, Sparkles, ShieldCheck, Clock, ArrowRight, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Importamos nuestra lógica separada
import { useSorteos } from '../hooks/useSorteos';

// --- INICIALIZACIÓN DE STRIPE ---
const stripePromise = loadStripe('pk_test_51SFnF0ROWvZ0m785J38J20subms9zeVw92xxsdct2OVzHbIXF8Kueajcp4jxJblwBhozD1xDljC2UG1qDNOGOxTX00UiDpoLCI');

// ============================================================================
// COMPONENTE HIJO: FORMULARIO DE PAGO STRIPE
// ============================================================================
const FormularioPago = ({ sorteo, numerosSeleccionados, datos, setDatos, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [errorStripe, setErrorStripe] = useState(null);

    const procesarPago = async (e) => {
        e.preventDefault();

        if (numerosSeleccionados.length === 0) return setErrorStripe("Por favor, selecciona al menos un número en la cuadrícula.");
        if (!stripe || !elements) return; 

        setProcesandoPago(true);
        setErrorStripe(null);

        try {
            const resPago = await axios.post('https://cunaalada-kitw.onrender.com/api/sorteos/crear-pago', {
                sorteoId: sorteo._id,
                cantidad: numerosSeleccionados.length,
                numerosElegidos: numerosSeleccionados 
            });

            const { clientSecret } = resPago.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: datos.nombre, email: datos.email, phone: datos.telefono }
                }
            });

            if (result.error) {
                setErrorStripe(result.error.message);
                setProcesandoPago(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    await axios.post(`https://cunaalada-kitw.onrender.com/api/sorteos/${sorteo._id}/confirmar-compra`, {
                        nombre: datos.nombre, email: datos.email, telefono: datos.telefono,
                        numerosBoletos: numerosSeleccionados, idPago: result.paymentIntent.id
                    });
                    onSuccess(numerosSeleccionados); 
                }
            }
        } catch (error) {
            console.error("Error en pago:", error);
            setErrorStripe(error.response?.data?.message || "Ocurrió un problema al conectar con el servidor.");
            setProcesandoPago(false);
        }
    };

    const cardStyle = {
        style: {
            base: { color: '#334155', fontFamily: '"Inter", sans-serif', fontSize: '16px', '::placeholder': { color: '#94a3b8' } },
            invalid: { color: '#ef4444', iconColor: '#ef4444' }
        }
    };

    return (
        <form onSubmit={procesarPago} className="space-y-4">
            <div>
                <input type="text" required value={datos.nombre} onChange={e => setDatos({...datos, nombre: e.target.value})} disabled={procesandoPago} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700" placeholder="Nombre completo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="email" required value={datos.email} onChange={e => setDatos({...datos, email: e.target.value})} disabled={procesandoPago} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700" placeholder="Correo electrónico" />
                <input type="tel" required value={datos.telefono} onChange={e => setDatos({...datos, telefono: e.target.value})} disabled={procesandoPago} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700" placeholder="Teléfono" />
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-400 transition-colors">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Datos de la Tarjeta</label>
                <div className="p-2">
                    <CardElement options={cardStyle} />
                </div>
            </div>

            {errorStripe && (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 text-sm font-bold border border-rose-200">
                    <AlertCircle size={18} /> {errorStripe}
                </div>
            )}

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 mt-6 shadow-sm">
                <div className="flex justify-between items-center text-emerald-800 font-bold mb-2 pb-2 border-b border-emerald-200/50">
                    <span>Boletos Elegidos:</span>
                    <span className="text-lg bg-emerald-200 px-3 py-1 rounded-lg">
                        {numerosSeleccionados.length > 0 ? numerosSeleccionados.length : '0'}
                    </span>
                </div>
                <div className="flex justify-between items-end mt-4">
                    <span className="text-emerald-700 text-sm uppercase font-bold tracking-wider">Total a Pagar</span>
                    <span className="text-4xl font-black text-emerald-600">
                        ${sorteo.precioBoleto * numerosSeleccionados.length}
                    </span>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={procesandoPago || numerosSeleccionados.length === 0 || !stripe} 
                className={`w-full mt-6 py-5 rounded-2xl font-black text-white flex justify-center items-center gap-3 transition-all shadow-xl
                ${(numerosSeleccionados.length === 0 || procesandoPago) ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-gray-900 hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-emerald-500/30'}`}
            >
                {procesandoPago ? <Loader2 className="animate-spin" /> : <CreditCard size={24} />}
                {procesandoPago ? 'Procesando Pago Seguro...' : 'Pagar de Forma Segura'}
            </button>
        </form>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL: VISTA DE SORTEOS
// ============================================================================
const Sorteos = () => {
    // Usamos nuestro Custom Hook
    const { 
        sorteos, loading, modalCompra, setModalCompra,
        numerosSeleccionados, datosCliente, setDatosCliente,
        mensajeExito, setMensajeExito,
        abrirModal, toggleNumero, handlePagoExitoso, emailUsuarioActual
    } = useSorteos();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin shadow-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pb-24 bg-[#F8F9FA] overflow-hidden notranslate" translate="no">
            
            <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
            <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />

            {/* --- PANTALLA DE ÉXITO --- */}
            {mensajeExito && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-emerald-900/90 backdrop-blur-md p-4">
                    <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl max-w-lg w-full animacion-entrada max-h-[90vh] flex flex-col">
                        <div className="flex-shrink-0">
                            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-black text-slate-800 mb-2">¡Compra Exitosa!</h2>
                            <p className="text-slate-500 text-sm mb-6">Tu pago se procesó correctamente. Mucha suerte.</p>
                        </div>
                        
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 mb-6 relative overflow-hidden flex flex-col flex-1 min-h-[150px] max-h-[40vh]">
                            <div className="absolute -right-4 -top-4 opacity-10 text-emerald-500 pointer-events-none"><Ticket size={100}/></div>
                            <p className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-4 flex-shrink-0">
                                {mensajeExito.length > 1 ? 'Tus números oficiales son:' : 'Tu número oficial es:'}
                            </p>
                            
                            <div className="overflow-y-auto scroll-boletos pr-2 flex-1">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {mensajeExito.map((n, index) => (
                                        <span 
                                            key={n} 
                                            className="bg-white text-xl md:text-2xl font-black text-emerald-600 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm pop-in"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            #{n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <button onClick={() => setMensajeExito(null)} className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE COMPRA --- */}
            {modalCompra.show && modalCompra.sorteo && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative animacion-entrada">
                        
                        <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Adquirir Boletos</h3>
                                <p className="text-slate-500 text-sm mt-1">{modalCompra.sorteo.premio}</p>
                            </div>
                            <button onClick={() => setModalCompra({ show: false, sorteo: null })} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 md:p-10 grid lg:grid-cols-2 gap-12">
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                                        Elige tus Números
                                    </h4>
                                    <span className="text-sm font-bold text-emerald-600">
                                        Seleccionados: {numerosSeleccionados.length}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-6">Haz clic en los lugares de la cuadrícula que deseas comprar. Puedes elegir varios.</p>
                                
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100 max-h-[400px] overflow-y-auto scroll-boletos">
                                    {[...Array(modalCompra.sorteo.totalBoletos)].map((_, i) => {
                                        const n = i + 1;
                                        const ocupado = modalCompra.sorteo.boletosVendidos.some(b => b.numeroBoleto === n);
                                        const estaSeleccionado = numerosSeleccionados.includes(n);

                                        return (
                                            <button 
                                                key={n} type="button" disabled={ocupado} onClick={() => toggleNumero(n)}
                                                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                                                ${ocupado ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-50' 
                                                : estaSeleccionado ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200 border-2 border-emerald-600' 
                                                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200'}`}
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 flex gap-4 text-xs font-bold text-slate-500 justify-center">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-200"></span> Libre</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> Tu Elección</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300"></span> Ocupado</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                                    Tus Datos y Pago
                                </h4>
                                <p className="text-slate-500 text-sm mb-6">Completa tu información y paga de forma segura.</p>
                                
                                <Elements stripe={stripePromise}>
                                    <FormularioPago 
                                        sorteo={modalCompra.sorteo}
                                        numerosSeleccionados={numerosSeleccionados}
                                        datos={datosCliente} setDatos={setDatosCliente}
                                        onSuccess={handlePagoExitoso}
                                    />
                                </Elements>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="text-center mb-20 animacion-entrada" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100 text-emerald-700 font-extrabold text-xs uppercase tracking-widest mb-6 shadow-sm hover:shadow-md transition-all">
                        <Sparkles size={16} className="text-emerald-500 animate-pulse" /> Sorteos Exclusivos
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Gana un <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Compañero Alado.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Adquiere tus boletos digitales y participa por ejemplares únicos. El sorteo se realiza automáticamente al vender todos los lugares.
                    </p>
                </div>

                <div className="grid gap-12 max-w-5xl mx-auto">
                    {sorteos.map((sorteo, index) => {
                        const vendidos = sorteo.boletosVendidos?.length || 0;
                        const porcentaje = (vendidos / sorteo.totalBoletos) * 100;
                        const estaLleno = vendidos >= sorteo.totalBoletos;
                        const misBoletos = sorteo.boletosVendidos?.filter(b => b.usuarioEmail === emailUsuarioActual) || [];

                        return (
                            <div 
                                key={sorteo._id} 
                                className="bg-white/80 backdrop-blur-xl rounded-[40px] p-6 md:p-10 flex flex-col lg:flex-row gap-10 shadow-2xl border border-white/60 relative overflow-hidden group animacion-entrada hover:shadow-emerald-900/10 transition-all duration-500"
                                style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                            >
                                {sorteo.estado === 'ACTIVO' && !estaLleno && (
                                    <div className="absolute top-0 right-10 bg-emerald-500 text-white px-6 py-2 rounded-b-2xl font-black text-xs tracking-widest shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex items-center gap-2 z-20 transition-transform duration-300 group-hover:translate-y-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> EN VIVO
                                    </div>
                                )}

                                <div className="w-full lg:w-5/12 relative rounded-[32px] overflow-hidden aspect-square lg:aspect-auto lg:h-[450px] shadow-inner bg-slate-100 flex items-center justify-center">
                                    <img 
                                        src={sorteo.fotoUrl && !sorteo.fotoUrl.startsWith('http') ? `https://cunaalada-kitw.onrender.com${sorteo.fotoUrl}` : (sorteo.fotoUrl || '/portada.png')} 
                                        alt={sorteo.premio} 
                                        className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-110" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/portada.png'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl border border-white/20 transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <Ticket size={24} className="text-emerald-300" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold m-0 leading-none mb-1">Valor del Boleto</p>
                                            <p className="text-2xl font-black m-0 leading-none">${sorteo.precioBoleto} <span className="text-sm font-medium opacity-70">MXN</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-7/12 flex flex-col justify-center relative z-20">
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight group-hover:text-emerald-700 transition-colors duration-300">{sorteo.premio}</h3>
                                    <p className="text-slate-500 mb-8 text-lg leading-relaxed">{sorteo.descripcion}</p>

                                    <div className="flex flex-wrap gap-4 mb-6 opacity-80">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <ShieldCheck size={18} className="text-emerald-500" /> Compra Segura por Stripe
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <Clock size={18} className="text-blue-500" /> Sistema Automatizado
                                        </div>
                                    </div>

                                    {misBoletos.length > 0 && (
                                        <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl shadow-sm">
                                            <p className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                                <Ticket size={16} /> Tus boletos adquiridos:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {misBoletos.map(b => (
                                                    <span key={b.numeroBoleto} className="bg-white text-emerald-600 font-black px-4 py-2 rounded-xl border border-emerald-200 shadow-sm text-lg">
                                                        #{b.numeroBoleto}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {sorteo.estado === 'FINALIZADO' ? (
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 md:p-10 rounded-3xl text-center shadow-inner relative overflow-hidden">
                                            <div className="absolute -right-6 -top-6 text-amber-500/10"><Trophy size={150} /></div>
                                            <Trophy size={64} className="mx-auto text-amber-500 mb-6 relative z-10 drop-shadow-md" />
                                            <h4 className="text-3xl font-black text-slate-800 mb-2 relative z-10 tracking-tight">¡Tenemos un Ganador!</h4>
                                            
                                            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 my-6 relative z-10 shadow-xl transform hover:scale-105 transition-transform duration-300">
                                                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                                    <Sparkles size={16} /> Felicidades a:
                                                </p>
                                                <p className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                                                    {sorteo.ganador?.nombreCliente || 'Usuario Afortunado'}
                                                </p>
                                                <p className="text-slate-600 font-medium text-lg">
                                                    Se llevó a este compañero alado con el boleto <br/>
                                                    <span className="inline-block mt-2 font-black text-2xl text-amber-600 bg-amber-100 px-4 py-2 rounded-xl border border-amber-200">
                                                        #{sorteo.ganador?.numeroBoleto || 'N/A'}
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 mt-4 relative z-10">Este resultado desaparecerá en 7 días.</p>
                                        </div>

                                    ) : sorteo.estado === 'LLENO' || estaLleno ? (
                                        <div className="bg-indigo-900 text-white p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                                            
                                            <div className="w-20 h-20 mx-auto bg-indigo-500 rounded-full flex items-center justify-center anim-sorteando mb-6 relative z-10 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                                                <Clock size={32} className="text-white" />
                                            </div>
                                            <h4 className="text-2xl md:text-3xl font-black mb-2 relative z-10">¡Boletos Agotados!</h4>
                                            <p className="text-indigo-200 relative z-10 mb-6 font-medium">La meta se cumplió. El sorteo se realizará en vivo el:</p>
                                            
                                            <div className="inline-block bg-indigo-800/80 backdrop-blur-sm border border-indigo-500/50 px-6 py-4 rounded-2xl relative z-10 shadow-lg w-full max-w-sm mx-auto">
                                                <p className="text-lg md:text-xl font-black text-indigo-50 capitalize">
                                                    {sorteo.fechaSorteoPlaneada 
                                                        ? new Date(sorteo.fechaSorteoPlaneada).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) 
                                                        : 'Calculando fecha...'}
                                                </p>
                                            </div>
                                        </div>

                                    ) : (
                                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-shadow duration-500">
                                            <div className="mb-8">
                                                <div className="flex justify-between items-end mb-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lugares Ocupados</p>
                                                        <p className="text-3xl font-black text-slate-800 m-0">
                                                            {vendidos} <span className="text-lg text-slate-400 font-medium">/ {sorteo.totalBoletos}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-emerald-700 font-black bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100 text-sm animate-pulse">
                                                        {sorteo.totalBoletos - vendidos} disponibles
                                                    </div>
                                                </div>
                                                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                                        style={{ width: `${Math.max(porcentaje, 3)}%` }} 
                                                    >
                                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
                                                        <div className="barra-brillo"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button onClick={() => abrirModal(sorteo)} className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl overflow-hidden relative group/btn bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                                <Ticket size={24} className="relative z-10" /> 
                                                <span className="relative z-10">Elegir Números y Comprar</span>
                                                <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sorteos;