import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Sparkles, ShieldCheck, Bird, LogOut, LayoutDashboard, Globe, ShieldAlert } from 'lucide-react';

const Login = ({ setAutorizado }) => {
    const [cargando, setCargando] = useState(false);
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('cuna_usuario')));
    const API_URL = 'https://cunaalada-kitw.onrender.com';

    const cerrarSesion = () => {
        localStorage.clear();
        setAutorizado(false);
        setUsuario(null);
        window.location.href = '/'; 
    };

    const handleGoogleSuccess = async (resToken) => {
        setCargando(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/google`, {
                token: resToken.credential
            });

            if (res.data.success) {
                const user = res.data.usuario;
                localStorage.setItem('cuna_token', res.data.token);
                localStorage.setItem('cuna_usuario', JSON.stringify(user));
                
                if (user.rol === 'admin') {
                    localStorage.setItem('adminToken', res.data.token);
                    setAutorizado(true);
                    window.location.href = '/admin'; 
                } else {
                    window.location.href = '/tienda';
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    // --- VISTA: USUARIO YA AUTENTICADO ---
    if (usuario) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-sans">
                {/* Decoración de fondo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px] opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-50" />
                </div>

                <div className="bg-white/80 backdrop-blur-2xl p-8 sm:p-12 rounded-[50px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white max-w-md w-full relative z-10 text-center animate-[reveal_0.5s_ease-out]">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full animate-spin-slow opacity-20" />
                            <img src={usuario.foto} className="w-28 h-28 rounded-full border-4 border-white shadow-2xl relative z-10 mx-auto object-cover" alt="Perfil" />
                        </div>
                        <div className="absolute bottom-1 right-1/3 translate-x-8 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-4 border-white z-20">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">¡Hola de nuevo!</h2>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">{usuario.nombre}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Estado: <span className={usuario.rol === 'admin' ? "text-emerald-600" : "text-blue-600"}>{usuario.rol}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => window.location.href = usuario.rol === 'admin' ? '/admin' : '/tienda'}
                            className="group flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-3xl font-bold hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-emerald-200"
                        >
                            <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                            Ir al Panel de Control
                        </button>
                        <button 
                            onClick={cerrarSesion}
                            className="flex items-center justify-center gap-3 bg-rose-50 text-rose-500 py-5 rounded-3xl font-bold hover:bg-rose-100 transition-all duration-300"
                        >
                            <LogOut size={20} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA: LOGIN ---
    return (
        <div className="min-h-screen bg-white flex w-full overflow-hidden font-sans">
            
            {/* Lado Izquierdo: Branding cinemático (Solo PC) */}
            <div className="hidden lg:flex w-7/12 relative bg-[#060910] items-center justify-center p-20 overflow-hidden">
                {/* Capas de fondo */}
                <img src="/portada.png" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-110 animate-pulse-slow" alt="Cuna Alada" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#060910] via-transparent to-emerald-900/20" />
                
                <div className="relative z-10 space-y-10 max-w-2xl">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-emerald-400 animate-[reveal_0.8s_ease-out]">
                        <Bird size={24} className="animate-[float_5s_infinite_ease-in-out]" />
                        <span className="font-black tracking-[0.3em] text-[10px] uppercase">Original Quality</span>
                    </div>

                    <div className="space-y-4 animate-[reveal_1s_ease-out]">
                        <h1 className="text-[100px] font-black text-white leading-[0.85] tracking-[-0.05em]">
                            Cuna <br />
                            <span className="text-emerald-500">Alada.</span>
                        </h1>
                        <div className="h-2 w-24 bg-emerald-500 rounded-full" />
                    </div>

                    <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-lg animate-[reveal_1.2s_ease-out]">
                        Gestiona tu pasión. El sistema de control más avanzado para el criador moderno.
                    </p>

                    <div className="flex gap-10 pt-10 animate-[reveal_1.4s_ease-out]">
                        <div className="space-y-1">
                            <p className="text-white font-black text-2xl">100%</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Seguro</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="space-y-1">
                            <p className="text-white font-black text-2xl">Cloud</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sync</p>
                        </div>
                    </div>
                </div>

                {/* Orbes flotantes */}
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Lado Derecho: Formulario de Acceso */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#F8F9FA] lg:bg-white relative">
                {/* Decoración móvil */}
                <div className="lg:hidden absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60" />

                <div className="w-full max-w-[400px] space-y-12 relative z-10 animate-[reveal_0.6s_ease-out]">
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="lg:hidden inline-flex p-5 bg-slate-900 rounded-[2rem] shadow-2xl mb-6">
                            <Bird size={40} className="text-emerald-400" />
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Acceso.</h2>
                        <p className="text-slate-500 text-lg font-medium leading-snug">
                            Bienvenido a la consola central de Cuna Alada.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[35px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white p-10 rounded-[35px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
                                <div className="flex flex-col items-center gap-8">
                                    <div className="w-full">
                                        {cargando ? (
                                            <div className="flex flex-col items-center gap-4 py-4">
                                                <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validando credenciales...</span>
                                            </div>
                                        ) : (
                                            <div className="transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                                <GoogleLogin 
                                                    onSuccess={handleGoogleSuccess}
                                                    onError={() => alert('Error en la autenticación')}
                                                    useOneTap
                                                    theme="filled_black"
                                                    shape="pill"
                                                    width="100%"
                                                    size="large"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 w-full">
                                        <div className="h-px bg-slate-100 flex-1" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Smart Login</span>
                                        <div className="h-px bg-slate-100 flex-1" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <ShieldAlert size={20} className="text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Encriptado</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <Globe size={20} className="text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Global Auth</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <Sparkles size={14} className="text-emerald-500" />
                            Powered by Cuna Alada Enterprise
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos de Animación */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes reveal {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                .animate-pulse-slow { animation: pulse 10s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Login;