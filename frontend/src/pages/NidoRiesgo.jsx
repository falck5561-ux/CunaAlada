import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; 
import useJuegoNido from '../hooks/useJuegoNido';
import MarcadorNido from '../components/nido/MarcadorNido';
import RadarRiesgo from '../components/nido/RadarRiesgo';
import PanelApuestas from '../components/nido/PanelApuestas';
import VentanasEmergentes from '../components/nido/VentanasEmergentes';
import ModalPagoPlumas from '../components/nido/ModalPagoPlumas'; 
import { Info, ShoppingBag } from 'lucide-react'; 

const NidoRiesgo = () => {
  const {
    plumas, apuesta, setApuesta, prediccion, fase,
    tiempoRestante, mensaje, historial, altitudes,
    progresoVuelo, progresoPan, ultimoResultado, colocarApuesta
  } = useJuegoNido();

  const [modalActivo, setModalActivo] = useState(null); 
  const [secretoStripe, setSecretoStripe] = useState(null);
  const [plumasPendientes, setPlumasPendientes] = useState(0);

  // 1. Solicitar intención de pago al Backend
  const manejarCompraStripe = async (precio) => {
    try {
      // Usamos la API_URL global
      const respuesta = await axios.post(`${API_URL}/billetera/pago-plumas`, { 
        monto: precio 
      });

      if (respuesta.data.clientSecret) {
        setModalActivo(null); 
        setPlumasPendientes(respuesta.data.plumasTotales); 
        setSecretoStripe(respuesta.data.clientSecret); 
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error al conectar con la pasarela de pago.");
    }
  };

  // 2. FUNCIÓN CRÍTICA: Guardar plumas tras pago exitoso
  const alCompletarPago = async (cantidadPlumas) => {
    try {
      const userLocal = JSON.parse(localStorage.getItem('cuna_usuario'));
      if (!userLocal) return;

      const nuevoTotal = (userLocal.plumas || 0) + cantidadPlumas;

      // A. AVISAR AL SERVIDOR (Para que no se borren al cerrar sesión)
      await axios.patch(`${API_URL}/usuarios/sincronizar-plumas`, {
        email: userLocal.email,
        plumas: nuevoTotal
      });

      // B. ACTUALIZAR LOCALSTORAGE (Para que el menú y App.jsx lo vean)
      userLocal.plumas = nuevoTotal;
      localStorage.setItem('cuna_usuario', JSON.stringify(userLocal));
      
      // Limpiar estados de Stripe
      setSecretoStripe(null);
      setPlumasPendientes(0);
      
      // C. RECARGAR para sincronizar el Hook del juego
      window.location.reload(); 

    } catch (error) {
      console.error("Error al sincronizar plumas tras pago:", error);
      alert("Pago exitoso, pero hubo un error al sincronizar. Recarga la página.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] pt-32 pb-20 px-4 font-sans text-slate-200 overflow-hidden relative">
      
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute right-0 -top-12 flex gap-2 z-20">
          <button 
            onClick={() => setModalActivo('catalogo')} 
            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 rounded-full transition-all flex items-center gap-2 text-xs font-bold px-4 shadow-lg shadow-amber-900/20"
          >
            <ShoppingBag size={16}/> CATÁLOGO
          </button>

          <button 
            onClick={() => setModalActivo('reglas')} 
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4 border border-slate-700"
          >
            <Info size={16}/> REGLAS
          </button>
        </div>

        <MarcadorNido 
          plumas={plumas} 
          tiempoRestante={tiempoRestante} 
          fase={fase} 
          abrirRecarga={() => setModalActivo('recarga')} 
        />

        <div className="bg-[#111827] rounded-[40px] shadow-2xl shadow-black border border-slate-800 p-6 relative z-10">
          <RadarRiesgo 
            altitudes={altitudes}
            fase={fase}
            progresoVuelo={progresoVuelo}
            progresoPan={progresoPan}
            ultimoResultado={ultimoResultado}
          />

          <div className={`text-center py-3 mb-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border transition-all ${
            mensaje.tipo === 'exito' ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800' : 
            mensaje.tipo === 'error' ? 'bg-rose-950/40 text-rose-400 border-rose-800' : 
            mensaje.tipo === 'turbulencia' ? 'bg-amber-900/20 text-amber-400 border-amber-700/50 animate-pulse' :
            'bg-[#0d121f] text-slate-400 border-slate-800'
          }`}>
            {mensaje.texto}
          </div>

          <PanelApuestas 
            apuesta={apuesta}
            setApuesta={setApuesta}
            prediccion={prediccion}
            onColocarApuesta={colocarApuesta}
            fase={fase}
            plumas={plumas}
          />
        </div>
        
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

      <VentanasEmergentes 
        tipo={modalActivo} 
        alCerrar={() => setModalActivo(null)} 
        alComprarPaquete={manejarCompraStripe} 
        onComprarPack={manejarCompraStripe}    
        plumas={plumas}                        
      />

      {secretoStripe && (
        <ModalPagoPlumas 
          clientSecret={secretoStripe}
          plumasCompradas={plumasPendientes}
          alCerrar={() => {
            setSecretoStripe(null);
            setPlumasPendientes(0);
          }}
          alCompletarExito={alCompletarPago}
        />
      )}

    </div>
  );
};

export default NidoRiesgo;