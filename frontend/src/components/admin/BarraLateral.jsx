import React from 'react';
import { LayoutDashboard, Bird, Package, Ticket, ScanLine, ChevronRight, LogOut } from 'lucide-react'; // 🔥 Importé ScanLine aquí

const BarraLateral = ({ seccion, setSeccion, cerrarSesion, theme }) => {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
      <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
        <div className={`bg-gradient-to-br ${theme.grad} p-2.5 rounded-xl shadow-lg`}>
          <LayoutDashboard size={24} className="text-white"/>
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">Cuna Alada</h1>
          <p className="text-xs text-slate-400 font-medium opacity-70">Panel Administrativo</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        <button 
          onClick={() => setSeccion('aves')}
          className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${seccion === 'aves' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <div className="flex items-center gap-4">
            <Bird size={22} className={seccion === 'aves' ? 'animate-pulse' : ''}/>
            <span className="font-semibold text-sm">Gestión de Aves</span>
          </div>
          {seccion === 'aves' && <ChevronRight size={16} />}
        </button>
        
        <button 
          onClick={() => setSeccion('productos')}
          className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${seccion === 'productos' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <div className="flex items-center gap-4">
            <Package size={22} className={seccion === 'productos' ? 'animate-pulse' : ''}/>
            <span className="font-semibold text-sm">Tienda / Stock</span>
          </div>
          {seccion === 'productos' && <ChevronRight size={16} />}
        </button>

        <button 
          onClick={() => setSeccion('sorteos')}
          className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${seccion === 'sorteos' ? 'bg-violet-600 text-white shadow-xl shadow-violet-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <div className="flex items-center gap-4">
            <Ticket size={22} className={seccion === 'sorteos' ? 'animate-pulse' : ''}/>
            <span className="font-semibold text-sm">Gestión de Sorteos</span>
          </div>
          {seccion === 'sorteos' && <ChevronRight size={16} />}
        </button>

        {/* 🔥 NUEVO BOTÓN: ESCÁNER QR */}
        <button 
          onClick={() => setSeccion('escaner')}
          className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${seccion === 'escaner' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <div className="flex items-center gap-4">
            <ScanLine size={22} className={seccion === 'escaner' ? 'animate-pulse' : ''}/>
            <span className="font-semibold text-sm">Validar Entregas (QR)</span>
          </div>
          {seccion === 'escaner' && <ChevronRight size={16} />}
        </button>

      </nav>

      <div className="p-6 border-t border-slate-800/50">
        <button onClick={cerrarSesion} className="w-full flex items-center justify-center gap-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-500/20">
          <LogOut size={18} />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default BarraLateral;