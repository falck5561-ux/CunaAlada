import React from 'react';
import { Search } from 'lucide-react';

const EncabezadoEstadisticas = ({ seccion, totalRegistros, busqueda, setBusqueda, theme }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shadow-sm z-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {seccion === 'aves' ? 'Inventario de Ejemplares' : seccion === 'productos' ? 'Inventario de Productos' : 'Eventos y Sorteos'}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {totalRegistros} registros mostrados
        </p>
      </div>
      
      <div className="flex items-center gap-4">
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-${theme.main}-500 transition-colors pointer-events-none`}>
                <Search size={18}/>
            </span>
            <input 
              type="text" 
              placeholder={seccion === 'aves' ? "Buscar por especie, nombre, anillo..." : seccion === 'productos' ? "Buscar producto..." : "Buscar sorteo..."}
              className="pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-slate-200 outline-none w-72 transition-all shadow-sm group-focus-within:shadow-md group-focus-within:bg-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
      </div>
    </header>
  );
};

export default EncabezadoEstadisticas;