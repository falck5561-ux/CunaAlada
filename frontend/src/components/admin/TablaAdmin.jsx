import React from 'react';
import { API_URL } from '../../config/api'; 
import { 
  CheckCircle, Archive, AlertCircle, Bird, Tag, 
  User, Hash, Users, Trophy, Copy, Edit2, 
  Trash2, Eye, EyeOff 
} from 'lucide-react';

const TablaAdmin = ({ 
  seccion, listaFiltrada, 
  filtroEstado, setFiltroEstado, theme,
  prepararEdicion, abrirModalEliminar, setModalParticipantes, 
  revelarGanador, generarLinkRegistro, cambiarVisibilidadSorteo 
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Filtros superiores solo para la sección de Aves */}
      {seccion === 'aves' && (
        <div className="flex gap-4 mb-6">
            <button 
                onClick={() => setFiltroEstado('disponibles')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${filtroEstado === 'disponibles' ? 'bg-white text-emerald-600 border-2 border-emerald-500 shadow-md transform -translate-y-1' : 'bg-slate-100 text-slate-400 border border-transparent hover:bg-white'}`}
            >
                <CheckCircle size={18} /> Disponibles
            </button>
            <button 
                onClick={() => setFiltroEstado('vendidas')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${filtroEstado === 'vendidas' ? 'bg-white text-yellow-600 border-2 border-yellow-500 shadow-md transform -translate-y-1' : 'bg-slate-100 text-slate-400 border border-transparent hover:bg-white'}`}
            >
                <Archive size={18} /> Historial / Vendidas
            </button>
        </div>
      )}

      {/* Tabla Principal */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-slate-100">
              <tr>
                {seccion !== 'sorteos' && <th className="px-8 py-6">Vista Previa</th>}
                <th className="px-6 py-6">
                  {seccion === 'aves' ? 'Especie y Mutación' : seccion === 'productos' ? 'Detalles del Producto' : 'Información del Sorteo'}
                </th>
                <th className="px-6 py-6">
                    {seccion === 'sorteos' ? 'Progreso y Valor' : 'Precio de Venta'}
                </th>
                <th className="px-6 py-6 text-right">Acciones de Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300 gap-4">
                      <div className="p-6 bg-slate-50 rounded-full">
                        <AlertCircle size={48} strokeWidth={1.5} className="text-slate-200" />
                      </div>
                      <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                          {seccion === 'aves' && filtroEstado === 'vendidas' 
                              ? 'No hay aves en el historial.' 
                              : 'Sin registros para mostrar.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : listaFiltrada.map((item) => (
                <tr key={item._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  
                  {/* COLUMNA FOTO (Aves / Productos) */}
                  {seccion !== 'sorteos' && (
                    <td className="px-8 py-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group-hover:shadow-md transition-all">
                        <img 
                            src={
                                (item.foto || item.fotoUrl)
                                ? ( (item.foto || item.fotoUrl).startsWith('http') 
                                    ? (item.foto || item.fotoUrl) 
                                    : `${API_URL.replace('/api', '')}${item.foto || item.fotoUrl}` )
                                : '/portada.png'
                            }
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                            alt="miniatura"
                            onError={(e) => { e.target.src="/portada.png" }}
                        />
                      </div>
                    </td>
                  )}

                  {/* COLUMNA DETALLES */}
                  <td className="px-6 py-5 align-middle">
                    {seccion === 'sorteos' ? (
                      <div>
                          <div className="font-black text-slate-800 text-lg mb-1 uppercase italic tracking-tighter">{item.titulo}</div>
                          <div className="flex items-center gap-2">
                             {item.aveId && (
                                <span className="flex items-center gap-1.5 font-bold text-[10px] bg-indigo-50 px-2 py-0.5 rounded-lg text-indigo-600 border border-indigo-100 uppercase">
                                  <Bird size={12}/> {item.aveId.especie}
                                </span>
                             )}
                             {!item.visible && (
                                <span className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                                  <EyeOff size={10}/> Oculto
                                </span>
                             )}
                          </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2 uppercase tracking-tight">
                          {seccion === 'aves' ? item.especie : item.nombre}
                          {item.enPromocion && <Tag size={14} className="text-rose-500 fill-rose-100 animate-pulse"/>}
                        </div>

                        {seccion === 'aves' && item.nombreAsignado && (
                          <div className="mb-2">
                              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-black border border-emerald-100 shadow-sm uppercase italic">
                                  {item.nombreAsignado}
                              </span>
                          </div>
                        )}
                        
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          {seccion === 'aves' ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 
                              {item.mutacion}
                              {item.anillo && <span className="text-slate-300">|</span>}
                              <span className="text-slate-500">{item.anillo}</span>
                            </>
                          ) : (
                            <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md">{item.categoria}</span>
                          )}
                        </div>
                      </>
                    )}
                  </td>

                  {/* COLUMNA PRECIO / PROGRESO */}
                  <td className="px-6 py-5 align-middle">
                    {seccion === 'sorteos' ? (
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                             <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-violet-500" 
                                  style={{ width: `${Math.min(((item.boletosVendidos?.length || 0) / item.totalBoletos) * 100, 100)}%` }}
                                />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase">{item.boletosVendidos?.length || 0}/{item.totalBoletos}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-600 italic">Ticket: ${item.precioBoleto}</div>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase inline-block
                            ${item.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-600' : 
                              item.estado === 'LLENO' ? 'bg-amber-100 text-amber-600 animate-pulse' : 
                              'bg-slate-100 text-slate-500'}`}>
                            {item.estado}
                          </span>
                      </div>
                    ) : (
                      <>
                        <div className={`font-black text-2xl text-${theme.main}-600 tracking-tighter italic`}>${item.precio}</div>
                        {item.precioOriginal && (
                           <div className="text-[10px] text-slate-400 line-through font-bold">${item.precioOriginal}</div>
                        )}
                      </>
                    )}
                  </td>

                  {/* COLUMNA ACCIONES */}
                  <td className="px-6 py-5 align-middle text-right">
                    
                    {/* ACCIONES ESPECÍFICAS PARA SORTEOS */}
                    {seccion === 'sorteos' ? (
                        <div className="flex justify-end items-center gap-2">
                            {/* Ver Participantes */}
                            <button 
                                onClick={() => setModalParticipantes({ show: true, boletos: item.boletosVendidos || [], tituloSorteo: item.titulo })}
                                className="p-2.5 bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-600 rounded-2xl transition-all"
                                title="Participantes"
                            >
                                <Users size={18}/>
                            </button>

                            {/* Revelar Ganador (Solo si está lleno) */}
                            {item.estado === 'LLENO' && (
                                <button 
                                  onClick={() => revelarGanador(item._id)} 
                                  className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all scale-110"
                                >
                                    <Trophy size={18}/>
                                </button>
                            )}

                            {/* Ocultar / Mostrar (EL OJO) */}
                            <button 
                              onClick={() => cambiarVisibilidadSorteo(item._id)}
                              className={`p-2.5 rounded-2xl transition-all ${item.visible ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                              title={item.visible ? "Visible en Tienda" : "Oculto en Tienda"}
                            >
                                {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>

                            {/* Borrar Sorteo */}
                            <button 
                              onClick={() => abrirModalEliminar(item._id)} 
                              className="p-2.5 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                            >
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ) : (
                        /* ACCIONES PARA AVES Y PRODUCTOS */
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                          {seccion === 'aves' && (
                              <button 
                                onClick={() => generarLinkRegistro(item._id)} 
                                className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all"
                                title="Copiar Link"
                              >
                                <Copy size={18} />
                              </button>
                          )}

                          <button onClick={() => prepararEdicion(item)} className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all" title="Editar">
                            <Edit2 size={18}/>
                          </button>

                          <button onClick={() => abrirModalEliminar(item._id)} className="p-2.5 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all" title="Eliminar">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaAdmin;