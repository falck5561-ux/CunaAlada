import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './config/api';

// Importación de Páginas
import InicioSesion from './pages/InicioSesion';
import Tienda from './pages/Tienda';
import PanelAdmin from './pages/PanelAdmin';
import Aves from './pages/Aves';
import Cuidados from './pages/Cuidados';
import Registro from './pages/Registro';
import Sorteos from './pages/Sorteos';
import Inicio from './pages/Inicio'; 
import NidoRiesgo from './pages/NidoRiesgo'; 

// Importación de Componentes
import BotonWhatsApp from './components/BotonWhatsApp';

// Iconos
import { 
  Bird, ShoppingBag, Home, Menu, X, ShieldCheck, BookOpen,
  Heart, Instagram, Facebook, Ticket, LogOut, User, Activity 
} from 'lucide-react';

// ============================================================================
// COMPONENTES DE ESTRUCTURA GLOBALES
// ============================================================================

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const MenuNavegacion = ({ usuario, cerrarSesion, menuMovilAbierto, setMenuMovilAbierto }) => {
  const location = useLocation();

  const enlaces = [
    { to: "/", label: "Inicio", icon: <Home size={18}/> },
    { to: "/aves", label: "Ejemplares", icon: <Bird size={18}/> },
    { to: "/tienda", label: "Tienda", icon: <ShoppingBag size={18}/> },
    { to: "/sorteos", label: "Sorteos", icon: <Ticket size={18}/> },
    { to: "/nido-riesgo", label: "Nido del Riesgo", icon: <Activity size={18}/> }, 
    { to: "/cuidados", label: "Academia", icon: <BookOpen size={18}/> }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 md:py-6 transition-all">
        <div className="container mx-auto h-20 glass rounded-3xl flex items-center justify-between px-6 md:px-8 shadow-2xl">
          <Link to="/" className="flex items-center gap-4 group no-underline" onClick={() => setMenuMovilAbierto(false)}>
            <img src="/icono.png" alt="Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-110 duration-300" />
            <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
              CUNA<span className="text-emerald-500">ALADA</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {enlaces.map((item) => (
              <Link key={item.to} to={item.to} className={`nav-item text-sm font-bold no-underline transition-colors flex items-center gap-2 ${location.pathname === item.to ? 'text-emerald-600 nav-item-active' : 'text-slate-500 hover:text-emerald-500'}`}>
                {item.icon} {item.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {usuario ? (
              <div className="flex items-center gap-4 group relative">
                <div className="flex items-center gap-3 bg-white/50 border border-slate-200 py-1.5 pl-1.5 pr-4 rounded-full shadow-sm">
                  <img src={usuario.foto} alt="User" className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Hola</span>
                    <span className="text-xs font-bold text-slate-800 leading-none truncate max-w-[80px]">{usuario.nombre.split(' ')[0]}</span>
                  </div>
                  {/* AQUÍ SE MUESTRAN LAS PLUMAS EN TIEMPO REAL */}
                  <div className="bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 ml-1">
                    <span className="text-[10px] font-black text-emerald-700">{usuario.plumas || 0} 🪶</span>
                  </div>
                  <button onClick={cerrarSesion} title="Cerrar Sesión" className="ml-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
                {usuario.rol === 'admin' && (
                   <Link to="/admin" className="p-2 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg">
                      <ShieldCheck size={18} />
                   </Link>
                )}
              </div>
            ) : (
              <Link to="/admin" className="px-6 py-3 rounded-2xl text-xs font-black no-underline transition-all bg-white text-slate-500 border border-slate-200 hover:border-emerald-500 hover:text-emerald-500 flex items-center gap-2">
                <User size={14} /> ENTRAR
              </Link>
            )}
          </div>

          <button className="lg:hidden p-3 bg-slate-100 rounded-2xl text-slate-900 hover:bg-emerald-50 transition-colors" onClick={() => setMenuMovilAbierto(true)}>
            <Menu size={24}/>
          </button>
        </div>
      </nav>

      {/* MENU MÓVIL */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[105] transition-opacity duration-300 lg:hidden ${menuMovilAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuMovilAbierto(false)} />
      
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm glass-dark z-[110] transform transition-transform duration-500 ease-out lg:hidden shadow-2xl flex flex-col p-8 justify-between ${menuMovilAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
           <div className="flex justify-between items-center mb-12">
             <span className="text-2xl font-black text-white tracking-tighter">CUNA<span className="text-emerald-400">ALADA</span></span>
             <button onClick={() => setMenuMovilAbierto(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <X size={20}/>
             </button>
           </div>
           
           <div className="flex flex-col gap-5">
              {usuario && (
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <img src={usuario.foto} alt="Me" className="w-14 h-14 rounded-full border-2 border-emerald-400" />
                  <div>
                    <p className="text-white font-bold m-0">{usuario.nombre}</p>
                    <p className="text-emerald-400 text-xs font-bold uppercase m-0">{usuario.plumas || 0} PLUMAS</p>
                  </div>
                </div>
              )}
              {enlaces.map((item, i) => (
                <Link key={i} to={item.to} onClick={() => setMenuMovilAbierto(false)} className="flex items-center gap-4 text-2xl font-bold text-slate-300 no-underline hover:text-white transition-colors">
                  <span className="text-emerald-500/50">{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
        </div>

        <div className="space-y-4">
           {usuario ? (
             <button onClick={cerrarSesion} className="w-full py-5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform">
               <LogOut size={20} /> CERRAR SESIÓN
             </button>
           ) : (
             <Link to="/admin" onClick={() => setMenuMovilAbierto(false)} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-center font-black text-white text-lg no-underline shadow-lg active:scale-95 transition-transform block">
               ACCESO
             </Link>
           )}
        </div>
      </div>
    </>
  );
};

const FooterPrincipal = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[40px] md:rounded-t-[80px] relative z-20 mt-20 border-t border-emerald-900/50 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
    <div className="container mx-auto px-8 md:px-12 text-center md:text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5 space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
              <img src="/icono.png" alt="Logo" className="h-10 w-auto opacity-90" />
              <h3 className="text-3xl font-black m-0 tracking-tighter text-white">CUNA<span className="text-emerald-500">ALADA</span></h3>
          </div>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto md:mx-0">
            Dedicados a la crianza responsable y amorosa de aves en Campeche.
          </p>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Explorar</h4>
          <div className="flex flex-col gap-3 text-slate-400 font-medium text-sm">
            <Link to="/aves" className="hover:text-white transition-colors no-underline">Nuestros Ejemplares</Link>
            <Link to="/tienda" className="hover:text-white transition-colors no-underline">Tienda</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 text-center text-slate-500 text-[11px] font-bold tracking-widest uppercase">
        © {new Date().getFullYear()} CUNA ALADA • CAMPECHE • Creado por DevJP
      </div>
    </div>
  </footer>
);

// ============================================================================
// COMPONENTE ENRUTADOR PRINCIPAL
// ============================================================================

const AppContent = () => {
  const [autorizado, setAutorizado] = useState(!!localStorage.getItem('adminToken'));
  const [usuario, setUsuario] = useState(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const location = useLocation();

  // 1. CARGAR USUARIO SOLO AL MONTAR (EVITA QUE SE BORREN LAS PLUMAS AL NAVEGAR)
  useEffect(() => {
    const savedUser = localStorage.getItem('cuna_usuario');
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
    setAutorizado(!!localStorage.getItem('adminToken'));
  }, []); 

  const cerrarSesion = () => {
    localStorage.clear();
    setAutorizado(false);
    setUsuario(null);
    setMenuMovilAbierto(false);
    window.location.href = '/';
  };

  const esPaginaPrivada = location.pathname.startsWith('/admin') || location.pathname.startsWith('/registro');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      <MenuNavegacion 
        usuario={usuario} 
        cerrarSesion={cerrarSesion} 
        menuMovilAbierto={menuMovilAbierto} 
        setMenuMovilAbierto={setMenuMovilAbierto} 
      />

      <main className="flex-grow pt-28">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/aves" element={<Aves />} />
          <Route path="/cuidados" element={<Cuidados />} />
          <Route path="/registro/:token" element={<Registro />} />
          <Route path="/sorteos" element={<Sorteos />} />
          <Route path="/nido-riesgo" element={<NidoRiesgo />} />
          <Route path="/admin" element={autorizado ? <PanelAdmin cerrarSesion={cerrarSesion} /> : <InicioSesion setAutorizado={setAutorizado} />} />
        </Routes>
      </main>

      <BotonWhatsApp />
      {!esPaginaPrivada && <FooterPrincipal />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}