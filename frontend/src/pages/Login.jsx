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

    // --- VISTA: PERFIL ACTIVO (CERRAR SESIÓN) ---
    if (usuario) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-100 max-w-md w-full text-center space-y-8 animate-[reveal_0.5s_ease-out]">
                    <div className="relative inline-block">
                        <img src={usuario.foto} className="w-28 h-28 rounded-full border-4 border-emerald-500 shadow-xl mx-auto object-cover" alt="Perfil" />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">¡Hola, {usuario.nombre.split(' ')[0]}!</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Nivel: {usuario.rol}</p>
                    </div>
                    <div className="grid gap-4">
                        <button onClick={() => window.location.href = usuario.rol === 'admin' ? '/admin' : '/tienda'}
                            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3">
                            <LayoutDashboard size={20} /> Entrar al Panel
                        </button>
                        <button onClick={cerrarSesion}
                            className="w-full bg-rose-50 text-rose-500 py-5 rounded-3xl font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-3">
                            <LogOut size={20} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA: LOGIN (FULL SCREEN PC / ADAPTATIVO MÓVIL) ---
    return (
        <div className="min-h-screen bg-white flex w-full overflow-hidden font-sans">
            
            {/* Lado Izquierdo: Branding Cinemático (Se expande en PC) */}
            <div className="hidden lg:flex w-1/2 relative bg-[#060910] items-center justify-center p-20 overflow-hidden">
                <img src="/portada.png" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 animate-pulse-slow" alt="Cuna Alada" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#060910] via-transparent to-emerald-900/20" />
                
                <div className="relative z-10 space-y-10 w-full max-w-xl">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-emerald-400">
                        <Bird size={24} className="animate-[float_5s_infinite_ease-in-out]" />
                        <span className="font-black tracking-[0.3em] text-[10px] uppercase">Official Console</span>
                    </div>

                    <h1 className="text-[120px] font-black text-white leading-[0.8] tracking-[-0.05em]">
                        Cuna <br />
                        <span className="text-emerald-500">Alada.</span>
                    </h1>

                    <p className="text-slate-400 text-2xl font-medium leading-relaxed">
                        Gestiona tu pasión. El sistema de control central para el criador moderno.
                    </p>
                </div>
            </div>

            {/* Lado Derecho: Acceso (Responsivo) */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#F8F9FA] relative">
                <div className="lg:hidden absolute top-[-5%] left-[-5%] w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60" />

                <div className="w-full max-w-[420px] space-y-12 relative z-10">
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="lg:hidden inline-flex p-5 bg-slate-900 rounded-[2.5rem] shadow-2xl mb-6">
                            <Bird size={40} className="text-emerald-400" />
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Acceso.</h2>
                        <p className="text-slate-500 text-lg font-medium leading-tight">
                            Bienvenido. El sistema detectará automáticamente tu nivel de permisos.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden group">
                        {/* Brillo de fondo al pasar el mouse */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[40px] blur opacity-0 group-hover:opacity-5 transition duration-500"></div>
                        
                        <div className="space-y-10 relative z-10 text-center">
                            <div className="w-full transition-transform duration-300 hover:scale-[1.03] active:scale-95">
                                {cargando ? (
                                    <div className="flex flex-col items-center gap-4 py-4">
                                        <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <GoogleLogin 
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => alert('Fallo en Google')}
                                        theme="filled_black"
                                        shape="pill"
                                        width="100%"
                                        size="large"
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-8 pt-6 border-t border-slate-50">
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldAlert size={20} className="text-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seguro</span>
                                </div>
                                <div className="w-px h-8 bg-slate-100" />
                                <div className="flex flex-col items-center gap-2">
                                    <Globe size={20} className="text-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="flex items-center justify-center lg:justify-start gap-3 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                        <Sparkles size={14} className="text-emerald-400" />
                        Cuna Alada System v4.5
                    </footer>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Login;