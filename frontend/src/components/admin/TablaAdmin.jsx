import React from 'react';
import { API_URL } from '../../config/api'; 
import { CheckCircle, Archive, AlertCircle, Bird, Tag, User, Hash, Users, Trophy, Copy, Edit2, Trash2 } from 'lucide-react';

const TablaAdmin = ({ 
  seccion, listaFiltrada, 
  filtroEstado, setFiltroEstado, theme,
  prepararEdicion, abrirModalEliminar, setModalParticipantes, 
  revelarGanador, generarLinkRegistro 
}) => {
  return (
    <div>
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

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                {seccion !== 'sorteos' && <th className="px-8 py-5">Foto</th>}
                <th className="px-6 py-5">
                  {seccion === 'aves' ? 'Especie y Mutación' : seccion === 'productos' ? 'Producto' : 'Premio / Evento'}
                </th>
                <th className="px-6 py-5">
                    {seccion === 'sorteos' ? 'Progreso y Estado' : 'Precio'}
                </th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300 gap-3">
                      <AlertCircle size={48} strokeWidth={1.5} />
                      <span className="font-medium text-slate-400">
                          {seccion === 'aves' && filtroEstado === 'vendidas' 
                              ? 'No hay aves vendidas aún.' 
                              : 'No se encontraron resultados.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : listaFiltrada.map((item) => (
                <tr key={item._id} className="group hover:bg-slate-50/80 transition-colors duration-200">
                  
                  {/* COLUMNA FOTO (Solo Aves y Productos) */}
                  {seccion !== 'sorteos' && (
                    <td className="px-8 py-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white group-hover:shadow-md transition-all">
                        <img 
                            src={
                                (item.foto || item.fotoUrl)
                                ? ( (item.foto || item.fotoUrl).startsWith('http') 
                                    ? (item.foto || item.fotoUrl) 
                                    : `${API_URL.replace('/api', '')}${item.foto || item.fotoUrl}` )
                                : '/portada.png'
                            }
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                            alt="img"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src="/portada.png"
                            }}
                        />
                      </div>
                    </td>
                  )}

                  {/* COLUMNA DETALLES */}
                  <td className="px-6 py-5 align-middle">
                    {seccion === 'sorteos' ? (
                      <div>
                          <div className="font-bold text-slate-800 text-lg mb-1">{item.titulo}</div>
                          {item.aveId && (
                              <span className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 w-fit px-2 py-0.5 rounded-md text-slate-600 border border-slate-200">
                                <Bird size={12} className="text-slate-400"/> {item.aveId.especie} {item.aveId.mutacion}
                              </span>
                          )}
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                          {seccion === 'aves' ? item.especie : item.nombre}
                          {item.enPromocion && <Tag size={14} className="text-red-500 fill-red-100"/>}
                          {seccion === 'aves' && item.estado !== 'disponible' && item.estado && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-md border uppercase font-bold ${item.estado === 'vendido' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                                  {item.estado}
                              </span>
                          )}
                        </div>

                        {seccion === 'aves' && item.nombreAsignado && (
                          <div className="mb-2">
                              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100 shadow-sm">
                                  <span className="uppercase text-[9px] tracking-wider text-indigo-400 font-medium">Nombre:</span>
                                  {item.nombreAsignado}
                                  {item.propietario && (
                                      <span className="font-normal text-indigo-400 ml-1 text-[10px] flex items-center">
                                          <User size={10} className="mr-0.5"/> {item.propietario}
                                      </span>
                                  )}
                              </span>
                          </div>
                        )}
                        
                        <div className="text-sm text-slate-500 flex flex-col gap-1.5">
                          {seccion === 'aves' ? (
                            <>
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span> 
                                {item.mutacion}
                              </span>
                              {item.anillo && (
                              <span className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 w-fit px-2 py-0.5 rounded-md text-slate-600 border border-slate-200">
                                  <Hash size={12} className="text-slate-400"/> {item.anillo}
                              </span>
                              )}
                            </>
                          ) : (
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold w-fit border border-blue-100">{item.categoria}</span>
                          )}
                        </div>
                      </>
                    )}
                  </td>

                  {/* COLUMNA PRECIO / ESTADO DE SORTEO */}
                  <td className="px-6 py-5 align-middle">
                    {seccion === 'sorteos' ? (
                      <div className="space-y-1">
                          <div className="text-sm text-slate-500">
                              Vendidos: <span className="font-bold text-violet-600">{item.boletosVendidos?.length || 0}</span> / {item.totalBoletos}
                          </div>
                          <div className="text-sm text-slate-500">
                              Boleto: <span className="font-bold">${item.precioBoleto}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase inline-block mt-1
                            ${item.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 
                              item.estado === 'LLENO' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 
                              'bg-slate-100 text-slate-500'}`}>
                            {item.estado}
                          </span>
                      </div>
                    ) : (
                      <>
                        <div className={`font-bold text-xl text-${theme.main}-600`}>${item.precio}</div>
                        {item.enPromocion && (
                          <span className="bg-rose-50 text-rose-500 text-[10px] px-2.5 py-1 rounded-full font-bold border border-rose-100 inline-block mt-2 tracking-wide uppercase shadow-sm">
                            ¡Oferta!
                          </span>
                        )}
                      </>
                    )}
                  </td>

                  {/* COLUMNA ACCIONES */}
                  <td className="px-6 py-5 align-middle text-right">
                    
                    {/* Acciones Sorteos */}
                    {seccion === 'sorteos' ? (
                        <div className="flex flex-col items-end gap-2">
                            <button 
                                onClick={() => setModalParticipantes({ show: true, boletos: item.boletosVendidos || [], tituloSorteo: item.titulo })}
                                className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-violet-100 hover:text-violet-700 transition flex items-center gap-1.5"
                                title="Ver Participantes"
                            >
                                <Users size={14}/> Ver Participantes
                            </button>
                            
                            {item.estado === 'LLENO' && (
                                <button onClick={() => revelarGanador(item._id)} className="bg-violet-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition flex items-center gap-1.5">
                                    <Trophy size={14}/> Revelar Ganador
                                </button>
                            )}
                            
                            {item.estado === 'FINALIZADO' && (
                                <div className="text-sm font-bold text-slate-800 bg-violet-50 px-3 py-2 rounded-lg border border-violet-100 inline-block text-left">
                                    🏆 <span className="text-violet-600">{item.ganador?.nombreCliente || 'Desconocido'}</span>
                                    <br/><span className="text-[10px] text-slate-500 font-normal">Ticket #{item.ganador?.numeroBoleto}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Acciones Aves y Productos */
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                          {seccion === 'aves' && (
                              <button 
                                onClick={() => generarLinkRegistro(item._id)} 
                                className="p-2.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white rounded-xl transition-all font-bold"
                                title="Copiar Link de Venta"
                              >
                                <Copy size={18} />
                              </button>
                          )}

                          <button onClick={() => prepararEdicion(item)} className="p-2.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-blue-100" title="Editar">
                            <Edit2 size={18}/>
                          </button>
                          <button onClick={() => abrirModalEliminar(item._id)} className="p-2.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-rose-100" title="Eliminar">
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