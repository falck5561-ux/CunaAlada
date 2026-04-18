import React, { useState } from 'react';
import useJuegoNido from '../hooks/useJuegoNido';
import MarcadorNido from '../components/nido/MarcadorNido';
import RadarRiesgo from '../components/nido/RadarRiesgo';
import PanelApuestas from '../components/nido/PanelApuestas';
import VentanasEmergentes from '../components/nido/VentanasEmergentes';
import { Info } from 'lucide-react';

const NidoRiesgo = () => {
  // 1. Cargamos toda la lógica desde nuestro Hook personalizado
  const {
    plumas, apuesta, setApuesta, prediccion, fase,
    tiempoRestante, mensaje, historial, altitudes,
    progresoVuelo, progresoPan, ultimoResultado, colocarApuesta
  } = useJuegoNido();

  // 2. Estado local para las ventanas (esto es solo visual, por eso queda aquí)
  const [modalActivo, setModalActivo] = useState(null); // 'reglas', 'recarga' o null

  return (
    <div className="min-h-screen bg-[#0a0f18] pt-32 pb-20 px-4 font-sans text-slate-200 overflow-hidden relative">
      
      {/* Botón flotante de Reglas (Esquina Superior) */}
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute right-0 -top-12 flex gap-2 z-20">
          <button 
            onClick={() => setModalActivo('reglas')} 
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4"
          >
            <Info size={16}/> REGLAS
          </button>
        </div>

        {/* --- COMPONENTE: ENCABEZADO Y MARCADOR --- */}
        <MarcadorNido 
          plumas={plumas} 
          tiempoRestante={tiempoRestante} 
          fase={fase} 
          abrirRecarga={() => setModalActivo('recarga')}
        />

        {/* Contenedor Principal del Juego */}
        <div className="bg-[#111827] rounded-[40px] shadow-2xl shadow-black border border-slate-800 p-6 relative z-10">
          
          {/* --- COMPONENTE: RADAR DE VUELO --- */}
          <RadarRiesgo 
            altitudes={altitudes}
            fase={fase}
            progresoVuelo={progresoVuelo}
            progresoPan={progresoPan}
            ultimoResultado={ultimoResultado}
          />

          {/* Banner de Mensajes del Sistema */}
          <div className={`text-center py-3 mb-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border transition-all ${
            mensaje.tipo === 'exito' ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800' : 
            mensaje.tipo === 'error' ? 'bg-rose-950/40 text-rose-400 border-rose-800' : 
            mensaje.tipo === 'turbulencia' ? 'bg-amber-900/20 text-amber-400 border-amber-700/50 animate-pulse' :
            'bg-[#0d121f] text-slate-400 border-slate-800'
          }`}>
            {mensaje.texto}
          </div>

          {/* --- COMPONENTE: PANEL DE CONTROL DE APUESTAS --- */}
          <PanelApuestas 
            apuesta={apuesta}
            setApuesta={setApuesta}
            prediccion={prediccion}
            onColocarApuesta={colocarApuesta}
            fase={fase}
            plumas={plumas}
          />
        </div>
        
        {/* Historial de Vuelos (Mini Badges) */}
        {historial.length > 0 && (
          <div className="flex gap-2 justify-end overflow-hidden px-4 mt-6">
            {historial.map((h, i) => (
              <div key={i} className={`px-2 py-1 rounded text-[10px] font-bold border ${
                h.tendencia === 'sube' ? 'text-cyan-400 bg-cyan-900/30 border-cyan-900' : 
                h.tendencia === 'baja' ? 'text-rose-400 bg-rose-900/30 border-rose-900' : 
                'text-slate-400 bg-slate-800 border-slate-700'
              }`}>
                {h.tendencia === 'sube' ? '↑' : h.tendencia === 'baja' ? '↓' : '='} {h.altitud}m
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- COMPONENTE: MODALES --- */}
      <VentanasEmergentes 
        tipo={modalActivo} 
        alCerrar={() => setModalActivo(null)} 
      />

    </div>
  );
};

export default NidoRiesgo;