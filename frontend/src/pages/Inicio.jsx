import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, ArrowRight, ShoppingBag, Zap, ShieldCheck, Heart } from 'lucide-react';
import JaulaInteractiva from '../components/JaulaInteractiva';
// 1. Importamos la URL dinámica
import { API_URL } from '../config/api'; 

const Inicio = () => {
    const [avesJuego, setAvesJuego] = useState([]);

    useEffect(() => {
        const fetchAves = async () => {
            try {
                // 2. Cambiamos la URL de Render por la variable API_URL
                const res = await axios.get(`${API_URL}/aves`);
                setAvesJuego(res.data);
            } catch (error) {
                console.error("Error cargando aves para el juego", error);
            }
        };
        fetchAves();
    }, []);

    return (
        <div className="flex flex-col">
            {/* ... todo el resto de tu código de diseño se queda igual ... */}
            <div className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="bg-orb top-[-200px] right-[-100px] bg-emerald-200" />
                <div className="bg-orb bottom-[-200px] left-[-100px] bg-blue-100" style={{ animationDelay: '-5s' }} />

                <section className="container mx-auto px-6 relative z-10 py-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
                    
                    <div className="lg:w-1/2 text-center lg:text-left reveal">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-8">
                        <Sparkles size={14} className="animate-pulse" /> Criadero Profesional • Campeche
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none tracking-tighter mb-8">
                        Amor en <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Cada Vuelo.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 font-medium">
                        Especialistas en la crianza ética de Agapornis papilleros. 
                        Garantizamos salud, dócilidad y el mejor comienzo para tu compañero.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                        <Link to="/aves" className="btn-action bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 no-underline shadow-2xl">
                            Ver Colección <ArrowRight size={20} />
                        </Link>
                        <Link to="/tienda" className="btn-action bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 no-underline glass">
                            <ShoppingBag size={20} /> Ir a Tienda
                        </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase"><Zap size={16}/> Entrega Inmediata</div>
                        <div className="flex items-center gap-2 font-bold text-xs uppercase"><ShieldCheck size={16}/> Salud Certificada</div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="relative z-10 p-4 glass rounded-[60px]">
                        <div className="relative aspect-square rounded-[50px] overflow-hidden group">
                            <img 
                            src="/portada.png" 
                            alt="Agapornis Cuna Alada" 
                            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                            
                            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl border border-white/40 shadow-2xl">
                                <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/40">
                                    <Heart size={28} fill="white" className="text-white" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-xl m-0 text-slate-800">Crianza con Amor</p>
                                    <p className="text-xs font-bold text-emerald-600 m-0 uppercase tracking-widest">Campeche, México</p>
                                </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                    </div>
                    </div>
                </section>
            </div>

            <section className="py-20 relative bg-gradient-to-b from-white via-emerald-50/50 to-white z-10">
                <div className="container mx-auto px-6">
                    <JaulaInteractiva avesDisponibles={avesJuego} />
                </div>
            </section>
        </div>
    );
};

export default Inicio;