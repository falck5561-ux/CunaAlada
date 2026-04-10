import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Trophy, CreditCard, Sparkles, ShieldCheck, Clock, ArrowRight, X, Loader2, CheckCircle2 } from 'lucide-react';

const Sorteos = () => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- NUEVO: ESTADOS PARA EL MODAL DE PAGO ---
    const [modalPago, setModalPago] = useState({ show: false, sorteo: null });
    const [datosCompra, setDatosCompra] = useState({ nombre: '', email: '', telefono: '', cantidad: 1 });
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [compraExitosa, setCompraExitosa] = useState(false);

    const cargarSorteos = async () => {
        try {
            const res = await axios.get('https://cunaalada-kitw.onrender.com/api/sorteos');
            if (res.data && res.data.length > 0) {
                setSorteos(res.data);
            } else {
                setSorteos([{
                    _id: 'demo-1',
                    premio: 'Agapornis Fisher - Mutación Arlequín Azul',
                    descripcion: 'Hermoso ejemplar papillero de 25 días. Criado a mano, dócil y con excelente genética. Incluye transportadora premium, guía de cuidados y asesoría.',
                    fotoUrl: '/portada.png', 
                    precioBoleto: 150,
                    totalBoletos: 50,
                    boletosVendidos: [], 
                    estado: 'ACTIVO'
                }]);
            }
        } catch (error) {
            console.error("Error al cargar sorteos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSorteos();
        // Polling: Actualizar los datos cada 10 segundos para mostrar boletos vendidos en tiempo real
        const interval = setInterval(cargarSorteos, 10000);
        return () => clearInterval(interval);
    }, []);

    // --- NUEVO: LÓGICA DE COMPRA ---
    const abrirModalPago = (sorteo) => {
        setModalPago({ show: true, sorteo });
        setCompraExitosa(false);
        setDatosCompra({ nombre: '', email: '', telefono: '', cantidad: 1 });
    };

    const handlePago = async (e) => {
        e.preventDefault();
        setProcesandoPago(true);

        try {
            /* AQUÍ VA TU INTEGRACIÓN CON STRIPE:
             1. Llamas a tu backend para crear la sesión de Stripe.
             2. Rediriges al usuario a la URL de checkout de Stripe.
             Ejemplo:
             const res = await axios.post('https://tu-api/api/pagos/crear-sesion', { sorteoId: modalPago.sorteo._id, ...datosCompra });
             window.location.href = res.data.url;
            */

            // Simulación visual por ahora:
            await new Promise(resolve => setTimeout(resolve, 2000));
            setCompraExitosa(true);
            setTimeout(() => {
                setModalPago({ show: false, sorteo: null });
                cargarSorteos(); // Recargar para ver el progreso
            }, 3000);

        } catch (error) {
            console.error("Error procesando pago:", error);
            alert("Hubo un error al procesar el pago.");
        } finally {
            setProcesandoPago(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin shadow-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pb-24 bg-[#F8F9FA] overflow-hidden">
            
            {/* ESTILOS Y ANIMACIONES */}
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animacion-entrada { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .barra-brillo {
                    position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                    animation: brillo 2.5s infinite;
                }
                @keyframes brillo { 100% { left: 200%; } }
                @keyframes pulse-ring { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
                .anim-sorteando { animation: pulse-ring 2s infinite; }
            `}</style>

            {/* LUCES DE FONDO */}
            <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
            <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />

            {/* --- MODAL DE PAGO (CHECKOUT FLOTANTE) --- */}
            {modalPago.show && modalPago.sorteo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative animacion-entrada">
                        <button onClick={() => !procesandoPago && setModalPago({ show: false, sorteo: null })} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors z-10">
                            <X size={24} />
                        </button>

                        {compraExitosa ? (
                            <div className="p-10 text-center flex flex-col items-center">
                                <CheckCircle2 size={80} className="text-emerald-500 mb-4 animate-bounce" />
                                <h3 className="text-2xl font-black text-slate-800 mb-2">¡Boleto Adquirido!</h3>
                                <p className="text-slate-500">Mucha suerte en el sorteo. Recibirás tu confirmación por correo.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 p-8 border-b border-slate-100">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">Completa tu Registro</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">{modalPago.sorteo.premio}</p>
                                </div>
                                <form onSubmit={handlePago} className="p-8 space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nombre Completo</label>
                                        <input type="text" required value={datosCompra.nombre} onChange={e => setDatosCompra({...datosCompra, nombre: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Correo Electrónico</label>
                                        <input type="email" required value={datosCompra.email} onChange={e => setDatosCompra({...datosCompra, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" placeholder="juan@correo.com" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Boletos</label>
                                            <input type="number" min="1" max="10" required value={datosCompra.cantidad} onChange={e => setDatosCompra({...datosCompra, cantidad: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-center font-bold" />
                                        </div>
                                        <div className="w-2/3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Total a Pagar</label>
                                            <div className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 font-black text-emerald-600 flex items-center">
                                                ${(modalPago.sorteo.precioBoleto * datosCompra.cantidad).toFixed(2)} MXN
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={procesandoPago} className="w-full mt-4 py-4 rounded-xl font-black text-white bg-gray-900 hover:bg-emerald-600 transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70">
                                        {procesandoPago ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                                        {procesandoPago ? 'Procesando...' : 'Pagar Ahora'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-12 relative z-10">
                
                {/* ENCABEZADO */}
                <div className="text-center mb-20 animacion-entrada" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100 text-emerald-700 font-extrabold text-xs uppercase tracking-widest mb-6 shadow-sm hover:shadow-md transition-all">
                        <Sparkles size={16} className="text-emerald-500 animate-pulse" /> Sorteos Exclusivos
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Gana un <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Compañero Alado.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Adquiere tu boleto digital y participa por ejemplares únicos. El sorteo se realiza automáticamente al vender todos los lugares.
                    </p>
                </div>

                {/* LISTA DE SORTEOS */}
                <div className="grid gap-12 max-w-5xl mx-auto">
                    {sorteos.map((sorteo, index) => {
                        const vendidos = sorteo.boletosVendidos?.length || 0;
                        const porcentaje = (vendidos / sorteo.totalBoletos) * 100;
                        const estaLleno = vendidos >= sorteo.totalBoletos;

                        return (
                            <div 
                                key={sorteo._id} 
                                className="bg-white/80 backdrop-blur-xl rounded-[40px] p-6 md:p-10 flex flex-col lg:flex-row gap-10 shadow-2xl border border-white/60 relative overflow-hidden group animacion-entrada hover:shadow-emerald-900/10 transition-all duration-500"
                                style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                            >
                                
                                {/* Etiqueta de Estado Flotante */}
                                {sorteo.estado === 'ACTIVO' && !estaLleno && (
                                    <div className="absolute top-0 right-10 bg-emerald-500 text-white px-6 py-2 rounded-b-2xl font-black text-xs tracking-widest shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex items-center gap-2 z-20 transition-transform duration-300 group-hover:translate-y-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> EN VIVO
                                    </div>
                                )}

                                {/* IMAGEN */}
                                <div className="w-full lg:w-5/12 relative rounded-[32px] overflow-hidden aspect-square lg:aspect-auto lg:h-[450px] shadow-inner">
                                    <div className="absolute inset-0 bg-slate-100 animate-pulse"></div> 
                                    <img 
                                        src={sorteo.fotoUrl && !sorteo.fotoUrl.startsWith('http') ? `https://cunaalada-kitw.onrender.com${sorteo.fotoUrl}` : (sorteo.fotoUrl || '/portada.png')} 
                                        alt={sorteo.premio} 
                                        className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-110" 
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

                                {/* INFORMACIÓN */}
                                <div className="w-full lg:w-7/12 flex flex-col justify-center relative z-20">
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight group-hover:text-emerald-700 transition-colors duration-300">{sorteo.premio}</h3>
                                    <p className="text-slate-500 mb-8 text-lg leading-relaxed">{sorteo.descripcion}</p>

                                    <div className="flex flex-wrap gap-4 mb-10 opacity-80">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <ShieldCheck size={18} className="text-emerald-500" /> Compra Segura
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <Clock size={18} className="text-blue-500" /> Sistema Automatizado
                                        </div>
                                    </div>

                                    {/* ESTADOS DEL SORTEO */}
                                    {sorteo.estado === 'ACTIVO' && !estaLleno ? (
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

                                            <button onClick={() => abrirModalPago(sorteo)} className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl overflow-hidden relative group/btn bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                                <CreditCard size={24} className="relative z-10" /> 
                                                <span className="relative z-10">Adquirir Boleto Ahora</span>
                                                <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    ) : sorteo.estado === 'LLENO' || estaLleno ? (
                                        // ANIMACIÓN DE "SORTEANDO" (Cuando se llena pero el admin no ha revelado)
                                        <div className="bg-indigo-900 text-white p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                                            <div className="w-20 h-20 mx-auto bg-indigo-500 rounded-full flex items-center justify-center anim-sorteando mb-6 relative z-10">
                                                <Sparkles size={32} className="text-white" />
                                            </div>
                                            <h4 className="text-2xl font-black mb-2 relative z-10">¡Boletos Agotados!</h4>
                                            <p className="text-indigo-200 relative z-10">El sorteo está preparando la selección aleatoria. Mantente atento, el ganador se revelará aquí pronto.</p>
                                        </div>
                                    ) : (
                                        // ESTADO FINALIZADO
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 rounded-3xl text-center shadow-inner relative overflow-hidden">
                                            <div className="absolute -right-6 -top-6 text-amber-500/10"><Trophy size={120} /></div>
                                            <Trophy size={56} className="mx-auto text-amber-500 mb-4 relative z-10 drop-shadow-md" />
                                            <h4 className="text-2xl font-black text-slate-800 mb-2 relative z-10">¡Sorteo Finalizado!</h4>
                                            <p className="text-slate-700 relative z-10 text-lg">El ganador fue el boleto <span className="font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-lg">#{sorteo.ganador?.numeroBoleto || 'N/A'}</span>.</p>
                                            <p className="text-sm font-bold text-slate-500 mt-4 relative z-10">¡Gracias por participar! Pronto habrá un nuevo compañero alado.</p>
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