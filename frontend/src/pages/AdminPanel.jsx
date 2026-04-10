import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Save, Bird, Trash2, Edit2, 
  LogOut, Package, Hash, Search, LayoutDashboard, X, 
  ChevronRight, AlertCircle, Tag, Dna, Archive, CheckCircle, User,
  Check, XCircle, Copy, AlertTriangle, Upload, Image as ImageIcon, Ticket, Trophy, Users
} from 'lucide-react';

const AdminPanel = ({ cerrarSesion }) => {
  const [seccion, setSeccion] = useState('aves');
  const [lista, setLista] = useState([]);
  const [listaAvesDisponibles, setListaAvesDisponibles] = useState([]); // NUEVO: Para el select de Sorteos
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ show: false, message: '', type: 'success' });

  // Modal de Eliminación
  const [modalEliminar, setModalEliminar] = useState({ show: false, id: null });

  // --- NUEVO: Estado para el Modal de Participantes ---
  const [modalParticipantes, setModalParticipantes] = useState({ show: false, boletos: [], tituloSorteo: '' });

  const [filtroEstado, setFiltroEstado] = useState('disponibles');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // --- ESTADO PARA EL ARCHIVO DE IMAGEN ---
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Estado inicial AVES
  const initialAve = { 
    especie: '', mutacion: '', anillo: '', fechaNacimiento: '', 
    precio: '', precioOriginal: '', 
    enPromocion: false, estado: 'disponible' 
  };
  
  // Estado inicial PRODUCTOS
  const initialProd = { 
    nombre: '', categoria: '', precio: '', precioOriginal: '', 
    stock: '', descripcion: '', enPromocion: false 
  };

  // NUEVO: Estado inicial SORTEOS
  const initialSorteo = {
    aveId: '', titulo: '', descripcion: '', precioBoleto: '', totalBoletos: ''
  };

  const [formAve, setFormAve] = useState(initialAve);
  const [formProd, setFormProd] = useState(initialProd);
  const [formSorteo, setFormSorteo] = useState(initialSorteo);

  const showToast = (message, type = 'success') => {
    setNotificacion({ show: true, message, type });
    setTimeout(() => {
      setNotificacion(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const cargarDatos = async () => {
    try {
      if (seccion === 'aves') {
        const res = await axios.get(`https://cunaalada-kitw.onrender.com/api/aves`);
        setLista(res.data);
      } else if (seccion === 'productos') {
        const res = await axios.get(`https://cunaalada-kitw.onrender.com/api/productos`);
        setLista(res.data);
      } else if (seccion === 'sorteos') {
        const resSorteos = await axios.get(`https://cunaalada-kitw.onrender.com/api/sorteos`);
        setLista(resSorteos.data);
        
        // Cargar aves disponibles para el menú desplegable del sorteo
        const resAves = await axios.get(`https://cunaalada-kitw.onrender.com/api/aves`);
        setListaAvesDisponibles(resAves.data.filter(ave => ave.estado === 'disponible'));
      }
    } catch (error) { 
      console.error("Error cargando datos:", error);
      showToast('Error de conexión con el servidor', 'error');
    }
  };

  useEffect(() => { 
    cargarDatos(); 
    resetForms();
    setFiltroEstado('disponibles'); 
  }, [seccion]);

  const resetForms = () => {
    setModoEdicion(false);
    setIdEditar(null);
    setFormAve(initialAve);
    setFormProd(initialProd);
    setFormSorteo(initialSorteo);
    setArchivoSeleccionado(null);
    setPreviewUrl(null);
  };

  const handleChangeAve = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormAve({ ...formAve, [e.target.name]: value });
  };

  const handleChangeProd = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormProd({ ...formProd, [e.target.name]: value });
  };

  const handleChangeSorteo = (e) => {
    setFormSorteo({ ...formSorteo, [e.target.name]: e.target.value });
  };

  // --- MANEJADOR DE SELECCIÓN DE IMAGEN ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const prepararEdicion = (item) => {
    setModoEdicion(true);
    setIdEditar(item._id);
    
    // LOGICA PREVIEW:
    const fotoExistente = item.foto || item.fotoUrl;
    if (fotoExistente) {
        if (fotoExistente.startsWith('http')) {
             setPreviewUrl(fotoExistente);
        } else {
             setPreviewUrl(`https://cunaalada-kitw.onrender.com${fotoExistente}`);
        }
    } else {
        setPreviewUrl(null);
    }
    setArchivoSeleccionado(null);

    if (seccion === 'aves') {
      setFormAve({
        especie: item.especie || '', 
        mutacion: item.mutacion || '',
        anillo: item.anillo || '', 
        fechaNacimiento: item.fechaNacimiento ? item.fechaNacimiento.split('T')[0] : '', 
        precio: item.precio || '',
        precioOriginal: item.precioOriginal || '',
        enPromocion: item.enPromocion || false,
        estado: item.estado || 'disponible'
      });
    } else {
      setFormProd({
        nombre: item.nombre || '',
        categoria: item.categoria || '',
        precio: item.precio || '',
        precioOriginal: item.precioOriginal || '',
        stock: item.stock || '',
        descripcion: item.descripcion || '',
        enPromocion: item.enPromocion || false
      });
    }
  };

  // --- GUARDAR AVES Y PRODUCTOS (CON FORMDATA) ---
  const guardar = async (e) => {
    e.preventDefault();
    const endpoint = seccion === 'aves' ? 'aves' : 'productos';
    const datosBase = seccion === 'aves' ? formAve : formProd;

    const formData = new FormData();

    Object.keys(datosBase).forEach(key => {
        formData.append(key, datosBase[key]);
    });

    if (archivoSeleccionado) {
        formData.append('foto', archivoSeleccionado);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (modoEdicion) {
        await axios.put(`https://cunaalada-kitw.onrender.com/api/${endpoint}/${idEditar}`, formData, config);
        showToast('¡Registro actualizado correctamente!');
      } else {
        await axios.post(`https://cunaalada-kitw.onrender.com/api/${endpoint}`, formData, config);
        showToast('¡Nuevo registro creado con éxito!');
      }
      resetForms();
      cargarDatos();
    } catch (error) { 
      console.error(error);
      showToast('Error al guardar los datos', 'error');
    }
  };

  // --- NUEVO: GUARDAR SORTEO ---
  const guardarSorteo = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`https://cunaalada-kitw.onrender.com/api/sorteos`, formSorteo);
        showToast('¡Sorteo programado exitosamente!');
        resetForms();
        cargarDatos();
    } catch (error) { 
        console.error(error);
        showToast('Error al crear el sorteo', 'error'); 
    }
  };

  // --- NUEVO: REVELAR GANADOR SORTEO ---
  const revelarGanador = async (id) => {
    if(!window.confirm("¿Estás seguro de elegir al ganador ahora? Esta acción no se puede deshacer y avisará a los clientes.")) return;
    try {
        await axios.post(`https://cunaalada-kitw.onrender.com/api/sorteos/${id}/revelar`);
        showToast('¡Tenemos un ganador! La magia ha ocurrido.', 'success');
        cargarDatos();
    } catch (error) { 
        showToast('Error al procesar el ganador', 'error'); 
    }
  };

  const abrirModalEliminar = (id) => {
     setModalEliminar({ show: true, id });
  };

  const confirmarEliminacionReal = async () => {
      try {
        const endpoint = seccion === 'aves' ? 'aves' : 'productos';
        await axios.delete(`https://cunaalada-kitw.onrender.com/api/${endpoint}/${modalEliminar.id}`);
        showToast('Registro eliminado correctamente');
        cargarDatos();
      } catch (error) { 
        showToast('No se pudo eliminar el registro', 'error');
      } finally {
        setModalEliminar({ show: false, id: null });
      }
  };

  const generarLinkRegistro = async (id) => {
    try {
        const res = await axios.post(`https://cunaalada-kitw.onrender.com/api/aves/${id}/generar-link`);
        const linkFinal = res.data.link.replace('/adopcion/', '/registro/');
        navigator.clipboard.writeText(linkFinal);
        showToast('Link copiado al portapapeles 📋');
        cargarDatos();
    } catch (error) {
        showToast('Error al generar el link', 'error');
    }
  };

  // === LÓGICA DE FILTRADO ===
  const listaFiltrada = lista.filter(item => {
    const termino = busqueda.toLowerCase();
    
    let coincideBusqueda = false;
    if (seccion === 'aves') {
        coincideBusqueda = (item.especie && item.especie.toLowerCase().includes(termino)) ||
                           (item.anillo && item.anillo.toLowerCase().includes(termino)) ||
                           (item.mutacion && item.mutacion.toLowerCase().includes(termino)) ||
                           (item.nombreAsignado && item.nombreAsignado.toLowerCase().includes(termino)) ||
                           (item.propietario && item.propietario.toLowerCase().includes(termino));
    } else if (seccion === 'productos') {
        coincideBusqueda = (item.nombre && item.nombre.toLowerCase().includes(termino));
    } else if (seccion === 'sorteos') {
        coincideBusqueda = (item.titulo && item.titulo.toLowerCase().includes(termino));
    }

    if (seccion === 'aves') {
        const esVendido = item.estado === 'vendido' || item.estado === 'reservado';
        if (filtroEstado === 'disponibles') {
            return coincideBusqueda && !esVendido;
        } else {
            return coincideBusqueda && esVendido;
        }
    }

    return coincideBusqueda;
  });

  // Colores dinámicos dependiendo de la sección
  const colores = {
      aves: { main: 'emerald', grad: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200' },
      productos: { main: 'blue', grad: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200' },
      sorteos: { main: 'violet', grad: 'from-violet-500 to-fuchsia-500', shadow: 'shadow-violet-200' }
  };
  const theme = colores[seccion];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden notranslate" translate="no">
      
      {/* --- MODAL DE ELIMINACIÓN --- */}
      {modalEliminar.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-all border border-slate-100">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-1">
                        <AlertTriangle size={28} className="text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">¿Eliminar registro?</h3>
                        <p className="text-sm text-slate-500 mt-1">
                           Esta acción no se puede deshacer. ¿Estás seguro de que quieres borrarlo permanentemente?
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <button 
                          onClick={() => setModalEliminar({ show: false, id: null })}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={confirmarEliminacionReal}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all text-sm"
                        >
                          Sí, Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL DE PARTICIPANTES (IMPLEMENTACIÓN COMPLETA) --- */}
      {modalParticipantes.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-slate-100 overflow-hidden">
            <div className={`p-6 bg-gradient-to-r ${theme.grad} text-white flex justify-between items-center`}>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users size={24}/> Participantes: {modalParticipantes.tituloSorteo}
                </h3>
                <p className="text-xs text-white/80 mt-1">{modalParticipantes.boletos.length} boletos vendidos en total</p>
              </div>
              <button onClick={() => setModalParticipantes({ show: false, boletos: [], tituloSorteo: '' })} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-6 overflow-auto flex-1 bg-slate-50">
              <table className="w-full text-left bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                <thead className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="py-4 px-6">Boleto</th>
                    <th className="py-4 px-6">Cliente</th>
                    <th className="py-4 px-6">Contacto</th>
                    <th className="py-4 px-6">ID Pago (Stripe)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {modalParticipantes.boletos.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-black text-violet-600 text-lg">#{b.numeroBoleto}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700 flex items-center gap-2">
                          <User size={14} className="text-slate-400" /> {b.nombreCliente}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{b.usuarioEmail}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium">{b.telefonoCliente}</td>
                      <td className="py-4 px-6 font-mono text-[10px] text-slate-400 break-all w-1/4">
                        {b.idPagoStripe || 'Pago Manual / Sin ID'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {modalParticipantes.boletos.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <AlertCircle size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-30"/>
                  <p className="font-medium">Aún no hay ventas registradas para este sorteo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN TOAST */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${notificacion.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
         <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium ${notificacion.type === 'error' ? 'bg-rose-500' : 'bg-slate-800'}`}>
            {notificacion.type === 'error' ? <XCircle size={20}/> : <CheckCircle size={20} className="text-emerald-400"/>}
            <span>{notificacion.message}</span>
         </div>
      </div>

      {/* SIDEBAR */}
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

          {/* NUEVO BOTÓN: SORTEOS */}
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
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button onClick={cerrarSesion} className="w-full flex items-center justify-center gap-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-500/20">
            <LogOut size={18} />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#F8F9FC]">
        
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shadow-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {seccion === 'aves' ? 'Inventario de Ejemplares' : seccion === 'productos' ? 'Inventario de Productos' : 'Eventos y Sorteos'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {listaFiltrada.length} registros mostrados
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

        {/* AREA DE TRABAJO */}
        <div className="flex-1 overflow-auto p-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            
            {/* FORMULARIO */}
            <div className="xl:col-span-4">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className={`font-bold text-xl flex items-center gap-3 text-slate-700`}>
                    <span className={`p-2 rounded-lg bg-${theme.main}-50 text-${theme.main}-500`}>
                      {modoEdicion ? <Edit2 size={20}/> : <Plus size={20}/>}
                    </span>
                    {modoEdicion ? 'Editar Registro' : seccion === 'sorteos' ? 'Configurar Sorteo' : 'Nuevo Registro'}
                  </h3>
                  {modoEdicion && (
                    <button onClick={resetForms} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-500 flex items-center gap-1.5 transition-colors">
                      <X size={14}/>
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>

                <form onSubmit={seccion === 'sorteos' ? guardarSorteo : guardar} encType={seccion !== 'sorteos' ? "multipart/form-data" : ""}>
                  <div className="space-y-6">
                      
                      {/* --- SECCIÓN DE FOTO SÓLO PARA AVES Y PRODUCTOS --- */}
                      {seccion !== 'sorteos' && (
                          <div className="space-y-3">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Fotografía</label>
                             <div className="w-full relative">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden" 
                                  id="file-upload"
                                />
                                <label htmlFor="file-upload" className={`cursor-pointer w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all overflow-hidden ${previewUrl ? `border-${theme.main}-400 bg-white` : `border-slate-300 hover:border-${theme.main}-400 hover:bg-slate-50`}`}>
                                    {previewUrl ? (
                                        <div className="relative w-full h-full group">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-bold text-xs flex items-center gap-2">
                                                    <Upload size={16}/> Cambiar foto
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-1">
                                                <ImageIcon size={24}/>
                                            </div>
                                            <span className="text-sm font-bold text-slate-500">Subir Imagen</span>
                                            <span className="text-[10px] text-slate-400">JPG, PNG o WEBP</span>
                                        </>
                                    )}
                                </label>
                             </div>
                          </div>
                      )}

                      {/* --- INPUTS DE AVES --- */}
                      {seccion === 'aves' && (
                        <>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Clasificación</label>
                            
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10"><Bird size={18}/></span>
                                <input name="especie" value={formAve.especie} onChange={handleChangeAve} required className="input-modern !pl-12" placeholder="Especie (Ej. Agapornis, Ninfa)" />
                            </div>

                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10"><Dna size={18}/></span>
                                <input name="mutacion" value={formAve.mutacion} onChange={handleChangeAve} required className="input-modern !pl-12" placeholder="Mutación (Ej. Lutino, Azul)" />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Identificación</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10"><Hash size={18}/></span>
                                <input name="anillo" value={formAve.anillo} onChange={handleChangeAve} className="input-modern !pl-12 font-medium" placeholder="Código del anillo..." />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Precios</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-red-400 font-bold uppercase">Antes</label>
                                    <input type="number" name="precioOriginal" value={formAve.precioOriginal} onChange={handleChangeAve} className="input-modern !py-2 text-sm text-red-400 border-red-100 bg-red-50/30" placeholder="0" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-emerald-600 font-bold uppercase">Venta</label>
                                    <input type="number" name="precio" value={formAve.precio} onChange={handleChangeAve} required className="input-modern !py-2 font-bold text-slate-700 border-emerald-200" placeholder="0" />
                                </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nacimiento</label>
                            <input type="date" name="fechaNacimiento" value={formAve.fechaNacimiento} onChange={handleChangeAve} required className="input-modern text-sm" />
                          </div>

                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Estado</label>
                            <select name="estado" value={formAve.estado} onChange={handleChangeAve} className="input-modern bg-white cursor-pointer">
                                <option value="disponible">🟢 Disponible</option>
                                <option value="reservado">🟡 Reservado</option>
                                <option value="vendido">🔴 Vendido</option>
                            </select>
                          </div>

                          <label className={`flex items-center gap-4 p-4 border border-dashed rounded-xl cursor-pointer transition-all ${formAve.enPromocion ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:bg-slate-50'}`}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formAve.enPromocion ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                                {formAve.enPromocion && <Check size={14} className="text-white"/>}
                            </div>
                            <input type="checkbox" name="enPromocion" checked={formAve.enPromocion} onChange={handleChangeAve} className="hidden"/>
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${formAve.enPromocion ? 'text-emerald-700' : 'text-slate-500'}`}>¡Activar OFERTA!</span>
                            </div>
                          </label>
                        </>
                      )}

                      {/* --- INPUTS DE PRODUCTOS --- */}
                      {seccion === 'productos' && (
                        <>
                          <input name="nombre" value={formProd.nombre} onChange={handleChangeProd} required className="input-modern" placeholder="Nombre del Producto" />
                          <select name="categoria" value={formProd.categoria} onChange={handleChangeProd} required className="input-modern bg-white cursor-pointer">
                            <option value="">Seleccionar Categoría...</option>
                            <option value="Alimento">Alimento</option>
                            <option value="Juguetes">Juguetes</option>
                            <option value="Accesorios">Accesorios</option>
                          </select>

                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Precios y Stock</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-red-400 font-bold uppercase">Antes</label>
                                    <input type="number" name="precioOriginal" value={formProd.precioOriginal} onChange={handleChangeProd} className="input-modern !py-2 text-sm text-red-400 border-red-100 bg-red-50/30" placeholder="0" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-blue-600 font-bold uppercase">Venta</label>
                                    <input type="number" name="precio" value={formProd.precio} onChange={handleChangeProd} required className="input-modern !py-2 font-bold text-slate-700 border-blue-200" placeholder="0" />
                                </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Stock</label>
                                  <input type="number" name="stock" value={formProd.stock} onChange={handleChangeProd} required className="input-modern mt-1" placeholder="Cantidad" />
                              </div>
                          </div>

                          <textarea name="descripcion" value={formProd.descripcion} onChange={handleChangeProd} className="input-modern" rows="3" placeholder="Descripción..."></textarea>
                        </>
                      )}

                      {/* --- NUEVO: INPUTS DE SORTEOS --- */}
                      {seccion === 'sorteos' && (
                        <>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Seleccionar Ave Premio</label>
                            <select name="aveId" value={formSorteo.aveId} onChange={handleChangeSorteo} required className="input-modern bg-white">
                              <option value="">-- Elige un ejemplar disponible --</option>
                              {listaAvesDisponibles.map(ave => (
                                <option key={ave._id} value={ave._id}>{ave.especie} {ave.mutacion} - Anillo: {ave.anillo}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Detalles del Evento</label>
                            <input name="titulo" value={formSorteo.titulo} onChange={handleChangeSorteo} required className="input-modern" placeholder="Título Épico (Ej. Gran Sorteo Primavera)" />
                          </div>

                          <textarea name="descripcion" value={formSorteo.descripcion} onChange={handleChangeSorteo} className="input-modern" rows="3" placeholder="Descripción de las reglas..."></textarea>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Precio Boleto ($)</label>
                                <input type="number" name="precioBoleto" value={formSorteo.precioBoleto} onChange={handleChangeSorteo} required className="input-modern" placeholder="0" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Total Boletos</label>
                                <input type="number" name="totalBoletos" value={formSorteo.totalBoletos} onChange={handleChangeSorteo} required className="input-modern" placeholder="Ej. 50" />
                            </div>
                          </div>
                        </>
                      )}

                      <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transform active:scale-[0.98] transition-all flex justify-center items-center gap-3 bg-gradient-to-r ${theme.grad} ${theme.shadow}`}>
                        <Save size={20}/>
                        <span className="tracking-wide">{modoEdicion ? 'Actualizar Datos' : seccion === 'sorteos' ? 'Crear Sorteo' : 'Guardar Registro'}</span>
                      </button>
                  </div>
                </form>
              </div>
            </div>

            {/* TABLA Y PESTAÑAS */}
            <div className="xl:col-span-8">
              
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
                                              : `https://cunaalada-kitw.onrender.com${item.foto || item.fotoUrl}` )
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

          </div>
        </div>
      </main>

      <style>{`
        .input-modern {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          font-size: 0.95rem;
          color: #334155;
          transition: all 0.2s ease;
        }
        .input-modern:focus {
          background-color: #ffffff;
          border-color: ${seccion === 'aves' ? '#10b981' : seccion === 'productos' ? '#3b82f6' : '#8b5cf6'};
          box-shadow: 0 4px 12px ${seccion === 'aves' ? 'rgba(16, 185, 129, 0.1)' : seccion === 'productos' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'};
        }
        .input-modern::placeholder { color: #94a3b8; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default AdminPanel;