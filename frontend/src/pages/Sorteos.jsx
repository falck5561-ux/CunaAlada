import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Trophy, CreditCard, Sparkles, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const Sorteos = () => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(true);

    // MEJORA: Definimos la URL de la API dinámicamente
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const cargarSorteos = async () => {
            try {
                // Usamos nuestra variable dinámica en lugar de quemar el localhost
                const res = await axios.get(`${API_URL}/api/sorteos`);
                
                if (res.data && res.data.length > 0) {
                    setSorteos(res.data);
                } else {
                    setSorteos([{
                        _id: 'demo-1',
                        premio: 'Agapornis Fisher - Mutación Arlequín Azul',
                        descripcion: 'Hermoso ejemplar papillero de 25 días. Criado a mano, dócil y con excelente genética. Incluye transportadora premium, guía de cuidados y asesoría de por vida.',
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

        cargarSorteos();
    }, [API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pb-24">
            {/* Luces de fondo decorativas */}
            <div className="bg-orb top-[10%] left-[-10%] bg-emerald-300 opacity-20" />
            <div className="bg-orb bottom-[20%] right-[-10%] bg-teal-300 opacity-20" />

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Encabezado Premium */}
                <div className="text-center mb-20 reveal">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100 text-emerald-700 font-extrabold text-xs uppercase tracking-widest mb-6 shadow-sm">
                        <Sparkles size={16} className="text-emerald-500 animate-pulse" /> Sorteos Exclusivos
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Gana un <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Compañero Alado.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Adquiere tu boleto digital y participa por ejemplares únicos. El sorteo se realiza automáticamente al vender todos los lugares.
                    </p>
                </div>

                {/* Lista de Sorteos */}
                <div className="grid gap-12 max-w-5xl mx-auto">
                    {sorteos.map((sorteo) => {
                        const vendidos = sorteo.boletosVendidos?.length || 0;
                        const porcentaje = (vendidos / sorteo.totalBoletos) * 100;
                        const estaLleno = vendidos >= sorteo.totalBoletos;

                        return (
                            <div key={sorteo._id} className="glass rounded-[40px] p-6 md:p-10 flex flex-col lg:flex-row gap-10 shadow-2xl reveal border border-white/60 relative overflow-hidden group">
                                
                                {/* Etiqueta de Estado Flotante */}
                                {sorteo.estado === 'ACTIVO' && !estaLleno && (
                                    <div className="absolute top-0 right-10 bg-emerald-500 text-white px-6 py-2 rounded-b-2xl font-black text-xs tracking-widest shadow-lg flex items-center gap-2 z-20">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        EN VIVO
                                    </div>
                                )}

                                {/* Columna Izquierda: Imagen */}
                                <div className="w-full lg:w-5/12 relative rounded-[32px] overflow-hidden aspect-square lg:aspect-auto lg:h-[450px]">
                                    <div className="absolute inset-0 bg-slate-100 animate-pulse"></div> 
                                    <img 
                                        src={sorteo.fotoUrl} 
                                        alt={sorteo.premio} 
                                        className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                                    
                                    {/* Precio sobre la imagen */}
                                    <div className="absolute bottom-6 left-6 z-20 glass-dark text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl border border-white/10">
                                        <Ticket size={24} className="text-emerald-400" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold m-0 leading-none mb-1">Valor del Boleto</p>
                                            <p className="text-2xl font-black m-0 leading-none">${sorteo.precioBoleto} <span className="text-sm font-medium opacity-60">MXN</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Información y Compra */}
                                <div className="w-full lg:w-7/12 flex flex-col justify-center relative z-20">
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight">{sorteo.premio}</h3>
                                    <p className="text-slate-500 mb-8 text-lg leading-relaxed">{sorteo.descripcion}</p>

                                    {/* Sección de Garantías */}
                                    <div className="flex gap-6 mb-10 opacity-70">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <ShieldCheck size={18} className="text-emerald-500" /> Compra Segura
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <Clock size={18} className="text-blue-500" /> Sorteo Inmediato
                                        </div>
                                    </div>

                                    {sorteo.estado === 'ACTIVO' ? (
                                        <div className="bg-white/50 rounded-3xl p-6 border border-slate-200 shadow-sm">
                                            {/* Contador y Barra */}
                                            <div className="mb-8">
                                                <div className="flex justify-between items-end mb-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lugares Ocupados</p>
                                                        <p className="text-2xl font-black text-slate-800 m-0">
                                                            {vendidos} <span className="text-lg text-slate-400 font-medium">/ {sorteo.totalBoletos}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg text-sm">
                                                        {sorteo.totalBoletos - vendidos} disponibles
                                                    </div>
                                                </div>
                                                
                                                {/* Barra de Progreso Mejorada */}
                                                <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out relative"
                                                        style={{ width: `${Math.max(porcentaje, 2)}%` }} 
                                                    >
                                                        {/* Brillo interno de la barra */}
                                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => alert("Siguiente paso: Abrir formulario de pago de Stripe")}
                                                disabled={estaLleno}
                                                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl
                                                    ${estaLleno 
                                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                                        : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:shadow-emerald-500/20 hover:-translate-y-1 hover:to-slate-900 btn-action'
                                                    }`}
                                            >
                                                <CreditCard size={24} /> 
                                                {estaLleno ? 'Boletos Agotados' : 'Adquirir Boleto Ahora'} 
                                                {!estaLleno && <ArrowRight size={20} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 rounded-3xl text-center shadow-inner">
                                            <Trophy size={56} className="mx-auto text-amber-500 mb-4" />
                                            <h4 className="text-2xl font-black text-slate-800 mb-2">¡Sorteo Finalizado!</h4>
                                            <p className="text-slate-600">El ganador fue el boleto <span className="font-black text-amber-600">#{sorteo.ganador?.numeroBoleto || 'N/A'}</span>.</p>
                                            <p className="text-sm text-slate-500 mt-2">Pronto publicaremos un nuevo sorteo.</p>
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