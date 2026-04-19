import React, { useState } from 'react';
import useJuegoNido from '../hooks/useJuegoNido';
import MarcadorNido from '../components/nido/MarcadorNido';
import RadarRiesgo from '../components/nido/RadarRiesgo';
import PanelApuestas from '../components/nido/PanelApuestas';
import VentanasEmergentes from '../components/nido/VentanasEmergentes';
import ModalPagoPlumas from '../components/nido/ModalPagoPlumas'; // Importamos el Modal Seguro
import { Info, ShoppingBag } from 'lucide-react'; // <-- AGREGAMOS ShoppingBag

const NidoRiesgo = () => {
  // 1. Cargamos toda la lógica del juego
  const {
    plumas, apuesta, setApuesta, prediccion, fase,
    tiempoRestante, mensaje, historial, altitudes,
    progresoVuelo, progresoPan, ultimoResultado, colocarApuesta
  } = useJuegoNido();

  // 2. Estado para las ventanas emergentes del menú
  const [modalActivo, setModalActivo] = useState(null);
  
  // 3. Estados exclusivos para Stripe
  const [secretoStripe, setSecretoStripe] = useState(null);
  const [plumasPendientes, setPlumasPendientes] = useState(0);

  // 4. Lógica para conectar con tu Backend
  const manejarCompraStripe = async (precio) => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/billetera/pago-plumas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ monto: precio })
      });

      const data = await respuesta.json();

      if (data.clientSecret) {
        setModalActivo(null); // Ocultamos el menú de paquetes
        setPlumasPendientes(data.plumasTotales); // Guardamos cuántas plumas va a recibir
        setSecretoStripe(data.clientSecret); // Esto hace que aparezca el ModalPagoPlumas
      } else {
        alert("Hubo un problema al generar la orden de pago en el servidor.");
      }

    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor backend.");
    }
  };

  // 5. Acción que se dispara cuando la tarjeta pasa con éxito
  const alCompletarPago = (cantidadPlumas) => {
    setSecretoStripe(null);
    setPlumasPendientes(0);
    
    // Sumamos las plumas a la memoria temporal del navegador
    const saldoActual = Number(localStorage.getItem('nido_plumas')) || 0;
    localStorage.setItem('nido_plumas', saldoActual + cantidadPlumas);
    
    // Recargamos para que el hook actualice el marcador visualmente
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] pt-32 pb-20 px-4 font-sans text-slate-200 overflow-hidden relative">
      
      {/* Botones Flotantes (Catálogo y Reglas) */}
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute right-0 -top-12 flex gap-2 z-20">
          
          {/* --- NUEVO BOTÓN DE CATÁLOGO --- */}
          <button 
            onClick={() => setModalActivo('catalogo')} 
            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4"
          >
            <ShoppingBag size={16}/> CATÁLOGO
          </button>

          <button 
            onClick={() => setModalActivo('reglas')} 
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4"
          >
            <Info size={16}/> REGLAS
          </button>
        </div>

        {/* --- ENCABEZADO Y MARCADOR --- */}
        <MarcadorNido 
          plumas={plumas} 
          tiempoRestante={tiempoRestante} 
          fase={fase} 
          abrirRecarga={() => setModalActivo('recarga')} 
        />

        {/* --- CONTENEDOR PRINCIPAL --- */}
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
        
        {/* --- HISTORIAL DE VUELOS --- */}
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

      {/* --- MENÚS EMERGENTES (REGLAS, TIENDA Y CATÁLOGO) --- */}
      <VentanasEmergentes 
        tipo={modalActivo} 
        alCerrar={() => setModalActivo(null)} 
        alComprarPaquete={manejarCompraStripe} 
        plumas={plumas} // <-- LE PASAMOS LAS PLUMAS AL CATÁLOGO
      />

      {/* --- MODAL DE PAGO REAL CON TARJETA STRIPE --- */}
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