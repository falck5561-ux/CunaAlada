import React, { useState, useEffect, useRef } from 'react';
import { Send, Bird, Zap } from 'lucide-react';

const ChatEnVivo = ({ socket, usuario }) => {
  const [mensajes, setMensajes] = useState([
    { id: 1, usuario: 'SISTEMA', texto: '¡Bienvenidos al Palomar! Hagan sus apuestas.', tipo: 'sistema' }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const scrollRef = useRef(null);

  // Escuchar mensajes y alertas del servidor
  useEffect(() => {
    if (!socket) return;

    socket.on('mensaje_recibido', (data) => {
      setMensajes((prev) => [...prev, { ...data, tipo: 'usuario' }]);
    });

    socket.on('alerta_ganancia', (data) => {
      setMensajes((prev) => [...prev, { ...data, tipo: 'sistema' }]);
    });

    return () => {
      socket.off('mensaje_recibido');
      socket.off('alerta_ganancia');
    };
  }, [socket]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Enviar mensaje
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !socket) return;

    const dataMensaje = {
      usuario: usuario?.nombre || 'Aviador Anónimo',
      texto: nuevoMensaje,
      foto: usuario?.foto
      // Eliminamos el envío de plumas aquí
    };

    socket.emit('enviar_mensaje', dataMensaje);
    
    // Lo añadimos a nuestra vista localmente
    setMensajes((prev) => [...prev, { ...dataMensaje, tipo: 'usuario' }]);
    setNuevoMensaje('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#111827] rounded-[30px] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Cabecera del Chat */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <Bird size={18} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest text-slate-200">El Palomar (En Vivo)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Conectado</span>
        </div>
      </div>

      {/* Cuerpo de Mensajes */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {mensajes.map((m, index) => (
          <div key={index} className={`flex flex-col ${m.tipo === 'sistema' ? 'items-center my-4' : 'items-start'}`}>
            {m.tipo === 'sistema' ? (
              // DISEÑO DE ALERTA DE SISTEMA (Ganancias)
              <div className="bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-900/10">
                <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                <p className="text-[11px] font-bold text-emerald-300 m-0 italic">
                   {m.texto}
                </p>
              </div>
            ) : (
              // DISEÑO DE MENSAJE DE USUARIO
              <div className="flex gap-3 max-w-[90%]">
                <img src={m.foto || '/icono.png'} className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0" alt="Avatar" />
                <div className="flex flex-col">
                  {/* Solo mostramos el nombre, sin el contador de plumas */}
                  <span className="text-[10px] font-black text-emerald-400 uppercase mb-1">{m.usuario.split(' ')[0]}</span>
                  <div className="bg-slate-800/50 px-3 py-2 rounded-2xl rounded-tl-none border border-slate-700/50">
                    <p className="text-xs text-slate-300 leading-relaxed m-0">{m.texto}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input de Envío */}
      <form onSubmit={enviarMensaje} className="p-4 bg-slate-900/50 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe al nido..."
          className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors text-white"
        />
        <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg active:scale-95">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatEnVivo;