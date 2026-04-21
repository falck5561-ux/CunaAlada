import React from 'react';
import { Link } from 'react-router-dom';

const FooterPrincipal = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[3rem] md:rounded-t-[5rem] relative mt-20 border-t-[12px] border-emerald-500 overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
    
    <div className="container mx-auto px-8 md:px-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* COLUMNA 1: IDENTIDAD */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <img src="/icono.png" alt="Logo" className="h-12 w-auto" />
            <h3 className="text-3xl font-black m-0 tracking-tighter uppercase">
              Cuna<span className="text-emerald-400">Alada</span>
            </h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Dedicados a la crianza responsable y amorosa de aves exóticas en el Estado de Campeche.
          </p>
        </div>

        {/* COLUMNA 2: EXPLORAR */}
        <div className="space-y-6 text-center md:text-left">
          <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Explorar</h4>
          <ul className="space-y-4 p-0 list-none">
            <li><Link to="/aves" className="text-slate-400 hover:text-white no-underline text-sm font-bold transition-colors">Ejemplares</Link></li>
            <li><Link to="/tienda" className="text-slate-400 hover:text-white no-underline text-sm font-bold transition-colors">Tienda</Link></li>
            <li><Link to="/cuidados" className="text-slate-400 hover:text-white no-underline text-sm font-bold transition-colors">Academia</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: INFO */}
        <div className="space-y-6 text-center md:text-left">
          <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Servicios</h4>
          <ul className="space-y-4 p-0 list-none">
            <li className="text-slate-400 text-sm font-bold">Envíos Nacionales</li>
            <li className="text-slate-400 text-sm font-bold">Garantía de Salud</li>
            <li className="text-slate-400 text-sm font-bold">Asesoría Post-Venta</li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div className="space-y-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center md:text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Contacto</h4>
          <p className="text-slate-400 text-[10px] font-black uppercase">Campeche, México</p>
          <a href="mailto:info@cunaalada.com" className="block text-emerald-400 text-sm font-black no-underline">info@cunaalada.com</a>
        </div>

      </div>

      <div className="border-t border-white/5 pt-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} CUNA ALADA • CRIADERO PROFESIONAL
      </div>
    </div>
  </footer>
);

export default FooterPrincipal;