import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL } from '../config/api'; 
import useJuegoNido from '../hooks/useJuegoNido';
import MarcadorNido from '../components/nido/MarcadorNido';
import RadarRiesgo from '../components/nido/RadarRiesgo';
import PanelApuestas from '../components/nido/PanelApuestas';
import VentanasEmergentes from '../components/nido/VentanasEmergentes';
import ModalPagoPlumas from '../components/nido/ModalPagoPlumas'; 
import ChatEnVivo from '../components/nido/ChatEnVivo'; 
import { Info, ShoppingBag } from 'lucide-react';

// 🔥 PASO 1: Recibimos actualizarPlumas desde App.jsx
const NidoRiesgo = ({ setUsuarioGlobal, actualizarPlumas }) => {
  const [socket, setSocket] = useState(null);
  const [usuarioLocal, setUsuarioLocal] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('cuna_usuario'));
    if (user) setUsuarioLocal(user);

    const backendUrl = API_URL.replace('/api', '');
    const nuevoSocket = io(backendUrl);
    setSocket(nuevoSocket);

    return () => nuevoSocket.close();
  }, []);

  const {
    plumas, apuesta, setApuesta, prediccion, fase,
    tiempoRestante, mensaje, historial, altitudes,
    progresoVuelo, progresoPan, ultimoResultado, colocarApuesta,
    setPlumas // 🔥 Asegúrate de que useJuegoNido exporte setPlumas si necesitas que el número grande baje también
  } = useJuegoNido(setUsuarioGlobal, socket); 

  const [modalActivo, setModalActivo] = useState(null); 
  const [secretoStripe, setSecretoStripe] = useState(null);
  const [plumasPendientes, setPlumasPendientes] = useState(0);

  const manejarCompraStripe = async (precio) => {
    try {
      const respuesta = await axios.post(`${API_URL}/billetera/pago-plumas`, { monto: precio });
      if (respuesta.data.clientSecret) {
        setModalActivo(null); 
        setPlumasPendientes(respuesta.data.plumasTotales); 
        setSecretoStripe(respuesta.data.clientSecret); 
      }
    } catch (error) {
      alert("Error al conectar con la pasarela de pago.");
    }
  };

  const alCompletarPago = async (cantidadPlumas) => {
    try {
      const userLocal = JSON.parse(localStorage.getItem('cuna_usuario'));
      if (!userLocal) return;

      const nuevoTotal = (userLocal.plumas || 0) + cantidadPlumas;

      await axios.patch(`${API_URL}/usuarios/sincronizar-plumas`, {
        email: userLocal.email,
        plumas: nuevoTotal
      });

      const usuarioActualizado = { ...userLocal, plumas: nuevoTotal };
      localStorage.setItem('cuna_usuario', JSON.stringify(usuarioActualizado));
      if (setUsuarioGlobal) setUsuarioGlobal(usuarioActualizado);
      
      setSecretoStripe(null);
      setPlumasPendientes(0);
      window.location.reload(); 
    } catch (error) {
      console.error("Error tras pago:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] pt-32 pb-20 px-4 font-sans text-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative mt-8">
        
        {/* BOTONES FLOTANTES SUPERIORES */}
        <div className="absolute right-0 -top-16 flex gap-2 z-20">
          <button onClick={() => setModalActivo('catalogo')} className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 rounded-full transition-all flex items-center gap-2 text-xs font-bold px-4 shadow-lg shadow-amber-900/20">
            <ShoppingBag size={16}/> CATÁLOGO
          </button>
          <button onClick={() => setModalActivo('reglas')} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4 border border-slate-700">
            <Info size={16}/> REGLAS
          </button>
        </div>

        {/* GRID DIVIDIDO EN FILAS PARA ALINEACIÓN PERFECTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 relative z-10 items-start">
          
          {/* FILA 1: MARCADOR SUPERIOR */}
          <div className="lg:col-span-2">
            <MarcadorNido plumas={plumas} tiempoRestante={tiempoRestante} fase={fase} abrirRecarga={() => setModalActivo('recarga')} />
          </div>
          
          {/* FILA 1: CELDA FANTASMA */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* FILA 2: RADAR Y APUESTAS */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="bg-[#111827] rounded-[40px] shadow-2xl shadow-black border border-slate-800 p-6 relative">
              <RadarRiesgo altitudes={altitudes} fase={fase} progresoVuelo={progresoVuelo} progresoPan={progresoPan} ultimoResultado={ultimoResultado} />

              <div className={`text-center py-3 mb-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm border transition-all ${
                mensaje.tipo === 'exito' ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800' : 
                mensaje.tipo === 'error' ? 'bg-rose-950/40 text-rose-400 border-rose-800' : 
                mensaje.tipo === 'turbulencia' ? 'bg-amber-900/20 text-amber-400 border-amber-700/50 animate-pulse' :
                'bg-[#0d121f] text-slate-400 border-slate-800'
              }`}>
                {mensaje.texto}
              </div>

              <PanelApuestas apuesta={apuesta} setApuesta={setApuesta} prediccion={prediccion} onColocarApuesta={colocarApuesta} fase={fase} plumas={plumas} />
            </div>
            
            {historial.length > 0 && (
              <div className="flex gap-2 justify-end overflow-hidden px-4">
                {historial.map((h, i) => (
                  <div key={i} className={`px-2 py-1 rounded text-[10px] font-bold border ${h.tendencia === 'sube' ? 'text-cyan-400 bg-cyan-900/30 border-cyan-900' : h.tendencia === 'baja' ? 'text-rose-400 bg-rose-900/30 border-rose-900' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                    {h.tendencia === 'sube' ? '↑' : h.tendencia === 'baja' ? '↓' : '='} {h.altitud}m
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FILA 2: CHAT EN VIVO */}
          <div className="lg:col-span-1 w-full">
            <div className="sticky top-28">
              <ChatEnVivo socket={socket} usuario={usuarioLocal} />
            </div>
          </div>

        </div>
      </div>

      {/* MODALES */}
      <VentanasEmergentes 
        tipo={modalActivo} 
        alCerrar={() => setModalActivo(null)} 
        alComprarPaquete={manejarCompraStripe} 
        onComprarPack={manejarCompraStripe} 
        plumas={plumas} 
        // 🔥 PASO 2: Aquí está la conexión maestra. Cuando el catálogo cobra, avisa a estas dos funciones.
        setPlumasActuales={(nuevoSaldo) => {
          if (actualizarPlumas) actualizarPlumas(nuevoSaldo); // Esto baja el número del Header
          if (setPlumas) setPlumas(nuevoSaldo); // Esto baja el número grande del minijuego
        }}
      />
      
      {secretoStripe && (
        <ModalPagoPlumas clientSecret={secretoStripe} plumasCompradas={plumasPendientes} alCerrar={() => { setSecretoStripe(null); setPlumasPendientes(0); }} alCompletarExito={alCompletarPago} />
      )}
    </div>
  );
};

export default NidoRiesgo;