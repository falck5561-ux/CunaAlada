import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Sparkles, ShieldCheck, Bird, LogOut, LayoutDashboard, Lock, Globe } from 'lucide-react';

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
            alert("Error al validar con el servidor");
        } finally {
            setCargando(false);
        }
    };

    // --- VISTA: USUARIO YA AUTENTICADO ---
    if (usuario) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden bg-[#F8F9FA]">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
                
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[50px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white max-w-md w-full relative z-10 text-center animate-[reveal_0.6s_ease-out]">
                    <div className="relative mb-8">
                        <img src={usuario.foto} className="w-28 h-28 rounded-full border-4 border-emerald-500 shadow-2xl mx-auto object-cover" alt="Perfil" />
                        <div className="absolute bottom-0 right-1/2 translate-x-12 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">¡Hola, {usuario.nombre.split(' ')[0]}!</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-10">Sesión de {usuario.rol} activa</p>

                    <div className="space-y-4">
                        <button 
                            onClick={() => window.location.href = usuario.rol === 'admin' ? '/admin' : '/tienda'}
                            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <LayoutDashboard size={20} /> Entrar al Panel
                        </button>
                        <button 
                            onClick={cerrarSesion}
                            className="w-full bg-rose-50 text-rose-500 py-5 rounded-3xl font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                            <LogOut size={20} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA: LOGIN (REDISEÑO PC/MÓVIL) ---
    return (
        <div className="min-h-[95vh] flex items-center justify-center p-4 relative overflow-hidden bg-[#0F172A]">
            
            {/* Fondo Cinemático con Movimiento */}
            <div className="absolute inset-0">
                <img src="/portada.png" className="w-full h-full object-cover opacity-20 scale-110 animate-pulse-slow" alt="Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900" />
            </div>

            {/* Tarjeta de Login Centrada */}
            <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white/5 backdrop-blur-3xl rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 animate-[revealUp_0.8s_ease-out]">
                
                {/* Lado Izquierdo: Branding (Se ajusta en PC, se oculta en móvil pequeño si es necesario) */}
                <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-center border-r border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-8 border border-emerald-500/30">
                        <Bird size={40} className="text-emerald-400 animate-[float_4s_infinite_ease-in-out]" />
                    </div>
                    <h1 className="text-7xl font-black text-white leading-none tracking-tighter mb-6">
                        Cuna <br />
                        <span className="text-emerald-500 text-6xl">Alada.</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-sm">
                        La consola central para la gestión inteligente de tu criadero y comunidad.
                    </p>
                    <div className="mt-12 flex gap-4">
                         <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/10">v4.2 Stable</div>
                         <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                             <Lock size={12}/> SSL Encrypted
                         </div>
                    </div>
                </div>

                {/* Lado Derecho: Acceso */}
                <div className="flex-1 bg-white p-10 sm:p-20 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    <div className="lg:hidden mb-10 p-5 bg-slate-900 rounded-[2.5rem] shadow-2xl">
                        <Bird size={40} className="text-emerald-400" />
                    </div>
                    
                    <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-4">Acceso.</h2>
                    <p className="text-slate-500 text-lg font-medium mb-12 max-w-xs">
                        Bienvenido. El sistema detectará automáticamente tu nivel de permisos.
                    </p>

                    <div className="w-full space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[30px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative w-full transition-transform duration-300 hover:scale-[1.02]">
                                {cargando ? (
                                    <div className="flex items-center justify-center py-4 bg-slate-50 rounded-[30px] border border-slate-100">
                                        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <GoogleLogin 
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => alert('Error en autenticación')}
                                        theme="filled_black"
                                        shape="pill"
                                        width="100%"
                                        size="large"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 opacity-40">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={16} /> Verificado
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Globe size={16} /> Global Auth
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes reveal {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

export default Login;