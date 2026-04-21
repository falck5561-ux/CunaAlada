import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

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
  LogOut, User, Gift, Flame, Mail, MapPin, CheckCircle
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
    { to: "/sorteos", label: "Sorteos", icon: <Gift size={18}/> },
    { to: "/nido-riesgo", label: "Nido de Riesgo", icon: <Flame size={18}/> }, 
    { to: "/cuidados", label: "Academia", icon: <BookOpen size={18}/> }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 md:py-6 transition-all">
        <div className="container mx-auto h-20 bg-white/70 backdrop-blur-xl rounded-[2rem] flex items-center px-4 md:px-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group no-underline mr-8" onClick={() => setMenuMovilAbierto(false)}>
            <img src="/icono.png" alt="Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-110 duration-500 drop-shadow-sm" />
            <span className="hidden sm:block text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Cuna<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-400">Alada</span>
            </span>
          </Link>
          
          {/* ENLACES CENTRALES */}
          <div className="hidden xl:flex items-center justify-center flex-grow gap-1">
            {enlaces.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`text-[11px] font-black uppercase tracking-widest no-underline transition-all duration-300 flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap ${
                  location.pathname === item.to 
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-100/50 shadow-sm' 
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>

          {/* SECCIÓN DERECHA */}
          <div className="flex items-center gap-4 ml-auto xl:ml-4">
            <div className="hidden xl:block w-px h-8 bg-slate-200 mx-2" />

            {usuario ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-3 bg-white/90 border border-slate-100 py-1.5 pl-1.5 pr-4 rounded-full shadow-sm">
                  <img src={usuario.foto} alt="User" className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Aviador</span>
                    <span className="text-xs font-black text-slate-800 leading-none truncate max-w-[80px]">{usuario.nombre.split(' ')[0]}</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200/60 shadow-inner ml-2">
                    <span className="text-[11px] font-black tracking-tighter">{usuario.plumas || 0}</span>
                    <span className="text-sm">🪶</span>
                  </div>

                  <button onClick={cerrarSesion} className="ml-1 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                    <LogOut size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {usuario.rol === 'admin' && (
                   <Link to="/admin" className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95">
                      <ShieldCheck size={20} />
                   </Link>
                )}
              </div>
            ) : (
              <Link to="/admin" className="hidden lg:flex px-6 py-3.5 rounded-[1.5rem] text-[11px] font-black tracking-widest no-underline transition-all bg-slate-900 text-white hover:bg-emerald-500 shadow-lg active:scale-95 items-center gap-2 uppercase">
                <User size={16} /> ENTRAR
              </Link>
            )}

            <button className="xl:hidden p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 active:scale-90 shadow-sm" onClick={() => setMenuMovilAbierto(true)}>
              <Menu size={24}/>
            </button>
          </div>
        </div>
      </nav>

      {/* MENU MÓVIL */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[105] transition-opacity duration-300 xl:hidden ${menuMovilAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuMovilAbierto(false)} />
      
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-slate-900 z-[110] transform transition-transform duration-500 xl:hidden flex flex-col p-8 justify-between overflow-y-auto ${menuMovilAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
           <div className="flex justify-between items-center mb-10">
             <span className="text-2xl font-black text-white tracking-tighter uppercase">Cuna<span className="text-emerald-400">Alada</span></span>
             <button onClick={() => setMenuMovilAbierto(false)} className="p-3 bg-white/5 rounded-full text-slate-300">
                <X size={20}/>
             </button>
           </div>
           
           <div className="flex flex-col gap-2">
              {usuario && (
                <div className="flex items-center gap-4 mb-8 p-5 bg-white/5 rounded-[2rem] border border-white/10">
                  <img src={usuario.foto} alt="Me" className="w-14 h-14 rounded-full border-2 border-emerald-400 object-cover shadow-lg" />
                  <div>
                    <p className="text-white font-black text-lg m-0 truncate mb-1">{usuario.nombre.split(' ')[0]}</p>
                    <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {usuario.plumas || 0} PLUMAS 🪶
                    </div>
                  </div>
                </div>
              )}
              
              {enlaces.map((item, i) => (
                <Link key={i} to={item.to} onClick={() => setMenuMovilAbierto(false)} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-400 no-underline hover:text-white p-4 rounded-2xl transition-all">
                  <span className="text-emerald-500/70">{item.icon}</span>{item.label}
                </Link>
              ))}
           </div>
        </div>

        <div className="mt-8">
           {usuario ? (
             <button onClick={cerrarSesion} className="w-full py-5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-[1.5rem] text-[11px] tracking-widest font-black uppercase flex items-center justify-center gap-3">
               <LogOut size={18} /> CERRAR SESIÓN
             </button>
           ) : (
             <Link to="/admin" onClick={() => setMenuMovilAbierto(false)} className="w-full py-5 bg-emerald-500 rounded-[1.5rem] text-center font-black tracking-widest text-slate-900 text-[11px] uppercase no-underline shadow-lg flex items-center justify-center gap-2">
               <User size={16} /> ACCESO
             </Link>
           )}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// CORRECCIÓN: FOOTER MEJORADO (4 COLUMNAS)
// ============================================================================
const FooterPrincipal = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[3rem] md:rounded-t-[5rem] relative mt-20 border-t-[12px] border-emerald-500 overflow-hidden">
    {/* Decoración de fondo */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
    
    <div className="container mx-auto px-8 md:px-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* COLUMNA 1: IDENTIDAD */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img src="/icono.png" alt="Logo" className="h-12 w-auto drop-shadow-md" />
            <h3 className="text-2xl font-black m-0 tracking-tighter text-white uppercase">
              Cuna<span className="text-emerald-400">Alada</span>
            </h3>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            Criadero profesional dedicado a la preservación y crianza responsable de aves exóticas en Campeche, México.
          </p>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN RÁPIDA */}
        <div className="space-y-6">
          <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Explorar</h4>
          <ul className="space-y-4 p-0 list-none">
            <li><Link to="/aves" className="text-slate-300 hover:text-white no-underline text-sm font-bold transition-colors">Nuestros Ejemplares</Link></li>
            <li><Link to="/tienda" className="text-slate-300 hover:text-white no-underline text-sm font-bold transition-colors">Tienda Oficial</Link></li>
            <li><Link to="/cuidados" className="text-slate-300 hover:text-white no-underline text-sm font-bold transition-colors">Academia</Link></li>
            <li><Link to="/sorteos" className="text-slate-300 hover:text-white no-underline text-sm font-bold transition-colors">Sorteos</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: COMPROMISO */}
        <div className="space-y-6">
          <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Garantía</h4>
          <ul className="space-y-4 p-0 list-none">
            <li className="flex items-center gap-3 text-slate-300 text-sm font-bold">
              <CheckCircle size={16} className="text-emerald-500" /> Salud Certificada
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm font-bold">
              <CheckCircle size={16} className="text-emerald-500" /> Envíos Seguros
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm font-bold">
              <CheckCircle size={16} className="text-emerald-500" /> Asesoría Vitalicia
            </li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO & UBICACIÓN */}
        <div className="space-y-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Contacto Directo</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail size={18} className="text-emerald-400" />
              <span className="text-xs font-bold">contacto@cunaalada.com</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin size={18} className="text-emerald-400" />
              <span className="text-xs font-bold">Campeche, México</span>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} CUNA ALADA • CRIADERO PROFESIONAL
        </div>
        <div className="flex gap-8">
           <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest hover:text-emerald-400 cursor-pointer transition-colors">Privacidad</span>
           <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest hover:text-emerald-400 cursor-pointer transition-colors">Términos</span>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================================
// COMPONENTE PRINCIPAL APP CONTENT
// ============================================================================
const AppContent = () => {
  const [autorizado, setAutorizado] = useState(!!localStorage.getItem('adminToken'));
  const [usuario, setUsuario] = useState(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('cuna_usuario');
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
    setAutorizado(!!localStorage.getItem('adminToken'));
  }, []); 

  const actualizarPlumasGlobal = (nuevasPlumas) => {
    setUsuario(prev => {
      if (!prev) return null;
      const usuarioActualizado = { ...prev, plumas: nuevasPlumas };
      localStorage.setItem('cuna_usuario', JSON.stringify(usuarioActualizado));
      return usuarioActualizado;
    });
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setAutorizado(false);
    setUsuario(null);
    window.location.href = '/';
  };

  const esPaginaPrivada = location.pathname.startsWith('/admin') || location.pathname.startsWith('/registro');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden selection:bg-emerald-200">
      <ScrollToTop />
      
      <MenuNavegacion 
        usuario={usuario} 
        cerrarSesion={cerrarSesion} 
        menuMovilAbierto={menuMovilAbierto} 
        setMenuMovilAbierto={setMenuMovilAbierto} 
      />

      <main className="flex-grow pt-32">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda usuario={usuario} actualizarPlumas={actualizarPlumasGlobal} />} />
          <Route path="/aves" element={<Aves usuario={usuario} actualizarPlumas={actualizarPlumasGlobal} />} />
          <Route path="/nido-riesgo" element={<NidoRiesgo setUsuarioGlobal={setUsuario} actualizarPlumas={actualizarPlumasGlobal} />} />
          <Route path="/cuidados" element={<Cuidados />} />
          <Route path="/registro/:token" element={<Registro />} />
          <Route path="/sorteos" element={<Sorteos />} />
          <Route 
            path="/admin" 
            element={autorizado ? <PanelAdmin cerrarSesion={cerrarSesion} /> : <InicioSesion setAutorizado={setAutorizado} />} 
          />
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