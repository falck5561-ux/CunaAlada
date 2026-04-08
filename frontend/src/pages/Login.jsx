import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Sparkles, Lock, AlertCircle, ArrowLeft, ShieldCheck, Bird } from 'lucide-react';

const Login = ({ setAutorizado }) => {
    // Estados para la vista
    const [modoAdmin, setModoAdmin] = useState(false);
    
    // Estados para Clientes (Google)
    const [cargando, setCargando] = useState(false);
    
    // Estados para el Administrador
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    // URL de tu servidor
    const API_URL = 'https://cunaalada-kitw.onrender.com';

    // --- LÓGICA PARA CLIENTES (GOOGLE) ---
    const handleGoogleSuccess = async (credencialRespuesta) => {
        setCargando(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/google`, {
                token: credencialRespuesta.credential
            });

            if (res.data.success) {
                localStorage.setItem('cuna_token', res.data.token);
                localStorage.setItem('cuna_usuario', JSON.stringify(res.data.usuario));
                
                // Redirigimos a la tienda
                window.location.href = '/tienda'; 
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert('Ups, hubo un detallito al iniciar sesión. Intentémoslo de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // --- LÓGICA PARA TI (ADMINISTRADOR) ---
    const manejarLoginAdmin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/login`, { password });
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                setAutorizado(true); // Esto desbloquea tu AdminPanel
            }
        } catch (err) {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 relative overflow-hidden transition-all duration-700">
            
            {/* --- ANIMACIONES DE AVES EN EL FONDO --- */}
            <div className="absolute top-[20%] left-[-10%] opacity-20 animate-[flyCross_25s_linear_infinite] pointer-events-none">
                <Bird size={80} className="text-emerald-400 drop-shadow-2xl" />
            </div>
            <div className="absolute top-[65%] right-[-10%] opacity-15 animate-[flyCrossReverse_30s_linear_infinite] pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
                <Bird size={60} className="text-teal-500 drop-shadow-2xl" />
            </div>

            {/* Luces de fondo decorativas */}
            <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-[pulse_8s_ease-in-out_infinite]" />
            
            <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[40px] shadow-[0_20px_50px_rgba(16,185,129,0.15)] w-full max-w-md relative z-10 border border-white/60 transition-all duration-500">
                
                {/* --- VISTA DE CLIENTES --- */}
                {!modoAdmin ? (
                    <div className="text-center animate-[fadeIn_0.6s_ease-out]">
                        
                        {/* Ave flotante central */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Brillo detrás del ave */}
                                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 animate-pulse rounded-full"></div>
                                <Bird size={56} className="text-emerald-600 relative z-10 animate-[float_4s_ease-in-out_infinite]" strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100 text-emerald-700 font-extrabold text-xs uppercase tracking-widest mb-6 shadow-sm">
                            <Sparkles size={16} className="text-emerald-500" /> Familia Alada
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Bienvenido</h2>
                        <p className="text-slate-500 mb-10 font-medium text-lg px-2 leading-relaxed">
                            Inicia sesión de forma segura para guardar tus compras y ser parte de nuestra comunidad.
                        </p>
                        
                        <div className="flex justify-center transition-transform hover:scale-105 duration-300 mb-12">
                            {cargando ? (
                                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin shadow-lg"></div>
                            ) : (
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => alert('No pudimos conectar con Google. Por favor, intenta de nuevo.')}
                                    theme="filled_blue"
                                    size="large"
                                    shape="pill"
                                    text="continue_with"
                                />
                            )}
                        </div>

                        {/* Botón discreto para ir al Admin */}
                        <div className="pt-6 border-t border-slate-100/80">
                            <button 
                                onClick={() => setModoAdmin(true)}
                                className="group flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors mx-auto w-full"
                            >
                                <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                                Acceso Administrativo
                            </button>
                        </div>
                    </div>
                ) : (
                    /* --- VISTA DE ADMINISTRADOR --- */
                    <div className="animate-[fadeIn_0.6s_ease-out]">
                        <button 
                            onClick={() => setModoAdmin(false)}
                            className="absolute top-8 left-8 text-slate-400 hover:text-emerald-600 transition-colors hover:-translate-x-1"
                            title="Volver al inicio de clientes"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        <div className="flex justify-center mb-8 mt-4">
                            <div className="bg-emerald-50 p-5 rounded-3xl text-emerald-600 shadow-inner border border-emerald-100 animate-[float_4s_ease-in-out_infinite]">
                                <Lock size={36} strokeWidth={2} />
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-black text-center text-slate-800 mb-3 tracking-tight">Panel de Control</h2>
                        <p className="text-center text-slate-500 mb-8 text-sm font-medium px-4">
                            Ingresa tu llave maestra para gestionar el inventario de Cuna Alada.
                        </p>
                        
                        <form onSubmit={manejarLoginAdmin} className="space-y-6">
                            <input 
                                type="password" 
                                placeholder="Introduce la contraseña secreta"
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center font-bold text-slate-700 bg-slate-50/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            
                            {error && (
                                <div className="flex items-center gap-2 text-rose-500 text-sm justify-center bg-rose-50 p-3 rounded-xl border border-rose-100 animate-pulse font-bold">
                                    <AlertCircle size={18} /> Contraseña incorrecta
                                </div>
                            )}
                            
                            <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-2xl font-black text-lg hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                                <Sparkles size={20} /> Desbloquear Panel
                            </button>
                        </form>
                    </div>
                )}
                
            </div>

            {/* ESTILOS DE ANIMACIÓN PERSONALIZADOS */}
            <style>{`
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(15px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes flyCross {
                    0% { transform: translate(-100vw, 10vh) rotate(15deg); opacity: 0; }
                    10% { opacity: 0.4; }
                    90% { opacity: 0.4; }
                    100% { transform: translate(100vw, -15vh) rotate(-10deg); opacity: 0; }
                }
                @keyframes flyCrossReverse {
                    0% { transform: translate(100vw, -10vh) scaleX(-1) rotate(-15deg); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { transform: translate(-100vw, 15vh) scaleX(-1) rotate(10deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Login;