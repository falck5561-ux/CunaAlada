import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// Importación de Páginas
import Login from './pages/Login';
import Tienda from './pages/Tienda';
import AdminPanel from './pages/AdminPanel';
import Aves from './pages/Aves';
import Cuidados from './pages/Cuidados';
import Registro from './pages/Registro';
import Sorteos from './pages/Sorteos'; // <--- NUEVA PÁGINA DE SORTEOS

// Importación de Componentes
import BotonWhatsApp from './components/BotonWhatsApp';
import JaulaInteractiva from './components/JaulaInteractiva';

// Iconos
import { 
  Bird, ShoppingBag, Home, Menu, X, ShieldCheck, BookOpen,
  Sparkles, ArrowRight, Heart, Instagram, Facebook, Zap, Ticket
} from 'lucide-react';


const EstilosMaestros = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
    
    :root {
      --primary: #10b981;
      --primary-dark: #059669;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #f8fafc;
      margin: 0;
      color: #1e293b;
      overflow-x: hidden;
    }

    /* Animación de entrada */
    @keyframes revealUp {
      from { opacity: 0; transform: translateY(30px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .reveal { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

    /* Orbes de luz */
    .bg-orb {
      position: absolute; width: 600px; height: 600px;
      border-radius: 50%; filter: blur(100px);
      z-index: 0; pointer-events: none; opacity: 0.4;
      animation: float-orb 20s infinite alternate;
    }

    @keyframes float-orb {
      from { transform: translate(0, 0); }
      to { transform: translate(100px, 100px); }
    }

    /* Efectos de Cristal */
    .glass {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .glass-dark {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Botones Interactivos */
    .btn-action {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative; overflow: hidden;
    }
    .btn-action:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3);
    }
    
    /* Navbar Link */
    .nav-item { position: relative; transition: color 0.3s; }
    .nav-item::after {
      content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
      background: var(--primary); transition: width 0.3s;
    }
    .nav-item:hover::after { width: 100%; }
    .nav-item-active::after { width: 100% !important; }
  `}</style>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/* --- COMPONENTE INTERNO --- */
const AppContent = () => {
  const [autorizado, setAutorizado] = useState(!!localStorage.getItem('adminToken'));
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const location = useLocation();

  const cerrarSesion = () => {
    localStorage.removeItem('adminToken');
    setAutorizado(false);
    setMenuMovilAbierto(false);
  };

  const esPaginaPrivada = location.pathname.startsWith('/admin') || location.pathname.startsWith('/registro');

  // --- COMPONENTE DE INICIO ---
  const Inicio = () => {
    const [avesJuego, setAvesJuego] = useState([]);

    useEffect(() => {
        const fetchAves = async () => {
            try {
                const res = await axios.get('https://cunaalada-kitw.onrender.com/api/aves');
                setAvesJuego(res.data);
            } catch (error) {
                console.error("Error cargando aves para el juego", error);
            }
        };
        fetchAves();
    }, []);

    return (
        <div className="flex flex-col">
            {/* HERO SECTION */}
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

            {/* SECCIÓN DEL JUEGO: JAULA INTERACTIVA */}
            <section className="py-20 relative bg-gradient-to-b from-white via-emerald-50/50 to-white z-10">
                <div className="container mx-auto px-6">
                    <JaulaInteractiva avesDisponibles={avesJuego} />
                </div>
            </section>
        </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-6 py-4 md:py-6 transition-all">
        <div className="container mx-auto h-20 glass rounded-3xl flex items-center justify-between px-6 md:px-8 shadow-2xl">
          
          <Link to="/" className="flex items-center gap-4 group no-underline" onClick={() => setMenuMovilAbierto(false)}>
            <img src="/icono.png" alt="Logo" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-110 duration-300" />
            <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
              CUNA<span className="text-emerald-500">ALADA</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { to: "/", label: "Inicio", icon: <Home size={18}/> },
              { to: "/aves", label: "Ejemplares", icon: <Bird size={18}/> },
              { to: "/tienda", label: "Tienda", icon: <ShoppingBag size={18}/> },
              { to: "/sorteos", label: "Sorteos", icon: <Ticket size={18}/> },
              { to: "/cuidados", label: "Academia", icon: <BookOpen size={18}/> }
            ].map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`nav-item text-sm font-bold no-underline transition-colors flex items-center gap-2 ${location.pathname === item.to ? 'text-emerald-600 nav-item-active' : 'text-slate-500 hover:text-emerald-500'}`}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-2" />

            <Link to="/admin" className={`px-6 py-3 rounded-2xl text-xs font-black no-underline transition-all ${autorizado ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800' : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-500 hover:text-emerald-500'}`}>
              {autorizado ? 'PANEL' : 'ADMIN'}
            </Link>
          </div>

          {/* Botón Menú Móvil */}
          <button 
            className="lg:hidden p-3 bg-slate-100 rounded-2xl text-slate-900 hover:bg-emerald-50 transition-colors" 
            onClick={() => setMenuMovilAbierto(true)}
          >
            <Menu size={24}/>
          </button>
        </div>
      </nav>

      {/* MENU MÓVIL (SIDEBAR / DRAWER) */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[105] transition-opacity duration-300 lg:hidden ${menuMovilAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuMovilAbierto(false)}
      />
      
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm glass-dark z-[110] transform transition-transform duration-500 ease-out lg:hidden shadow-2xl flex flex-col p-8 justify-between ${menuMovilAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div>
           <div className="flex justify-between items-center mb-12">
             <span className="text-2xl font-black text-white tracking-tighter">
               CUNA<span className="text-emerald-400">ALADA</span>
             </span>
             <button onClick={() => setMenuMovilAbierto(false)} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <X size={20}/>
             </button>
           </div>
           
           <div className="flex flex-col gap-6">
              {[
                { name: 'Inicio', to: '/', icon: <Home size={24}/> },
                { name: 'Ejemplares', to: '/aves', icon: <Bird size={24}/> },
                { name: 'Tienda', to: '/tienda', icon: <ShoppingBag size={24}/> },
                { name: 'Sorteos', to: '/sorteos', icon: <Ticket size={24}/> },
                { name: 'Academia', to: '/cuidados', icon: <BookOpen size={24}/> }
              ].map((item, i) => (
                <Link 
                  key={i} 
                  to={item.to} 
                  onClick={() => setMenuMovilAbierto(false)} 
                  className="group flex items-center gap-4 text-3xl font-bold text-slate-300 no-underline hover:text-white transition-colors py-2"
                >
                  <span className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
        </div>

        <Link to="/admin" onClick={() => setMenuMovilAbierto(false)} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-center font-black text-white text-lg no-underline shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">
          {autorizado ? 'IR AL PANEL' : 'ACCESO ADMIN'}
        </Link>
      </div>

      {/* RENDERIZADO DE PÁGINAS */}
      <main className="flex-grow pt-28">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/aves" element={<Aves />} />
          <Route path="/cuidados" element={<Cuidados />} />
          <Route path="/registro/:token" element={<Registro />} />
          <Route path="/sorteos" element={<Sorteos />} />
          <Route path="/admin" element={autorizado ? <AdminPanel cerrarSesion={cerrarSesion} /> : <div className="py-24 max-w-md mx-auto px-4"><Login setAutorizado={setAutorizado} /></div>} />
        </Routes>
      </main>

      {/* BOTÓN DE WHATSAPP */}
      <BotonWhatsApp />
      
      {/* FOOTER */}
      {!esPaginaPrivada && (
        <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[40px] md:rounded-t-[80px] relative z-20 mt-20 border-t border-emerald-900/50 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="container mx-auto px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
              
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                    <img src="/icono.png" alt="Logo" className="h-10 w-auto opacity-90" />
                    <h3 className="text-3xl font-black m-0 tracking-tighter text-white">CUNA<span className="text-emerald-500">ALADA</span></h3>
                </div>
                <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                  Dedicados a la crianza responsable y amorosa. Creamos vínculos para toda la vida entre aves y familias.
                </p>
                <div className="flex gap-4 pt-2">
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all hover:-translate-y-1"><Instagram size={20}/></a>
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all hover:-translate-y-1"><Facebook size={20}/></a>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Explorar</h4>
                <div className="flex flex-col gap-3 text-slate-400 font-medium text-sm">
                  <Link to="/aves" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors"></span> Nuestros Ejemplares</Link>
                  <Link to="/tienda" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors"></span> Tienda de Accesorios</Link>
                  <Link to="/sorteos" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors"></span> Sorteos Exclusivos</Link>
                  <Link to="/cuidados" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors"></span> Guía de Cuidados</Link>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Contacto y Ubicación</h4>
                <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-white font-bold text-sm mb-1">Campeche, México</p>
                      <p className="text-slate-400 text-xs">Envíos aéreos disponibles a toda la república.</p>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      Atención Disponible Ahora
                   </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              <p>© {new Date().getFullYear()} CUNA ALADA • CAMPECHE</p>
              <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  Creado con <Heart size={10} className="text-emerald-500 fill-emerald-500"/> por DevJP
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

/* --- COMPONENTE PRINCIPAL (EXPORTACIÓN) --- */
export default function App() {
  return (
    <BrowserRouter>
      <EstilosMaestros />
      <AppContent />
    </BrowserRouter>
  );
}