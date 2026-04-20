import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; 

import BarraLateral from '../components/admin/BarraLateral';
import EncabezadoEstadisticas from '../components/admin/EncabezadoEstadisticas';
import Notificacion from '../components/admin/Notificacion';
import FormularioAdmin from '../components/admin/FormularioAdmin';
import TablaAdmin from '../components/admin/TablaAdmin';
import DeleteModal from '../components/admin/modals/DeleteModal';
import ParticipantsModal from '../components/admin/modals/ParticipantsModal';
import EscanerAdmin from '../components/admin/EscanerAdmin'; 

const PanelAdmin = ({ cerrarSesion, usuario, user }) => {
  const [seccion, setSeccion] = useState('aves');
  const [lista, setLista] = useState([]);
  const [listaAvesDisponibles, setListaAvesDisponibles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [notificacion, setNotificacion] = useState({ show: false, message: '', type: 'success' });
  const [modalEliminar, setModalEliminar] = useState({ show: false, id: null });
  const [modalParticipantes, setModalParticipantes] = useState({ show: false, boletos: [], tituloSorteo: '' });

  const [filtroEstado, setFiltroEstado] = useState('disponibles');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const initialAve = { especie: '', mutacion: '', anillo: '', fechaNacimiento: '', precio: '', precioOriginal: '', enPromocion: false, estado: 'disponible' };
  const initialProd = { nombre: '', categoria: '', precio: '', precioOriginal: '', stock: '', descripcion: '', enPromocion: false };
  const initialSorteo = { aveId: '', titulo: '', descripcion: '', precioBoleto: '', totalBoletos: '' };

  const [formAve, setFormAve] = useState(initialAve);
  const [formProd, setFormProd] = useState(initialProd);
  const [formSorteo, setFormSorteo] = useState(initialSorteo);

  const showNotificacion = (message, type = 'success') => {
    setNotificacion({ show: true, message, type });
    setTimeout(() => setNotificacion(prev => ({ ...prev, show: false })), 3000);
  };

  const cargarDatos = async () => {
    try {
      if (seccion === 'aves') {
        const res = await axios.get(`${API_URL}/aves`);
        setLista(res.data);
      } else if (seccion === 'productos') {
        const res = await axios.get(`${API_URL}/productos`);
        setLista(res.data);
      } else if (seccion === 'sorteos') {
        const resSorteos = await axios.get(`${API_URL}/sorteos`);
        setLista(resSorteos.data);
        const resAves = await axios.get(`${API_URL}/aves`);
        setListaAvesDisponibles(resAves.data.filter(ave => ave.estado === 'disponible'));
      }
    } catch (error) { 
      console.error("Error cargando datos:", error);
      showNotificacion('Error de conexión con el servidor', 'error');
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

  const handleChangeAve = (e) => setFormAve({ ...formAve, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const handleChangeProd = (e) => setFormProd({ ...formProd, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const handleChangeSorteo = (e) => setFormSorteo({ ...formSorteo, [e.target.name]: e.target.value });

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
    
    const fotoExistente = item.foto || item.fotoUrl;
    if (fotoExistente) {
        if (fotoExistente.startsWith('http')) setPreviewUrl(fotoExistente);
        else setPreviewUrl(`${API_URL.replace('/api', '')}${fotoExistente}`);
    } else {
        setPreviewUrl(null);
    }
    setArchivoSeleccionado(null);

    if (seccion === 'aves') {
      setFormAve({
        especie: item.especie || '', mutacion: item.mutacion || '', anillo: item.anillo || '', 
        fechaNacimiento: item.fechaNacimiento ? item.fechaNacimiento.split('T')[0] : '', 
        precio: item.precio || '', precioOriginal: item.precioOriginal || '',
        enPromocion: item.enPromocion || false, estado: item.estado || 'disponible'
      });
    } else {
      setFormProd({
        nombre: item.nombre || '', categoria: item.categoria || '', precio: item.precio || '',
        precioOriginal: item.precioOriginal || '', stock: item.stock || '',
        descripcion: item.descripcion || '', enPromocion: item.enPromocion || false
      });
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    const endpoint = seccion === 'aves' ? 'aves' : 'productos';
    const datosBase = seccion === 'aves' ? formAve : formProd;
    const formData = new FormData();

    Object.keys(datosBase).forEach(key => formData.append(key, datosBase[key]));
    if (archivoSeleccionado) formData.append('foto', archivoSeleccionado);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (modoEdicion) {
        await axios.put(`${API_URL}/${endpoint}/${idEditar}`, formData, config);
        showNotificacion('¡Registro actualizado correctamente!');
      } else {
        await axios.post(`${API_URL}/${endpoint}`, formData, config);
        showNotificacion('¡Nuevo registro creado con éxito!');
      }
      resetForms();
      cargarDatos();
    } catch (error) { 
      console.error(error);
      showNotificacion('Error al guardar los datos', 'error');
    }
  };

  const guardarSorteo = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${API_URL}/sorteos`, formSorteo);
        showNotificacion('¡Sorteo programado exitosamente!');
        resetForms();
        cargarDatos();
    } catch (error) { 
        console.error(error);
        showNotificacion('Error al crear el sorteo', 'error'); 
    }
  };

  const cambiarVisibilidadSorteo = async (id) => {
    try {
        await axios.patch(`${API_URL}/sorteos/${id}/visibilidad`);
        cargarDatos();
        showNotificacion('Privacidad del sorteo actualizada');
    } catch (error) {
        showNotificacion('Error al cambiar visibilidad', 'error');
    }
  };

  const revelarGanador = async (id) => {
    if(!window.confirm("¿Estás seguro de elegir al ganador ahora? Esta acción no se puede deshacer.")) return;
    try {
        await axios.post(`${API_URL}/sorteos/${id}/revelar`);
        showNotificacion('¡Tenemos un ganador! La magia ha ocurrido.', 'success');
        cargarDatos();
    } catch (error) { showNotificacion('Error al procesar el ganador', 'error'); }
  };

  const abrirModalEliminar = (id) => setModalEliminar({ show: true, id });

  const confirmarEliminacionReal = async () => {
      try {
        // Detectamos el endpoint según la sección activa
        const endpoint = seccion === 'aves' ? 'aves' : seccion === 'productos' ? 'productos' : 'sorteos';
        await axios.delete(`${API_URL}/${endpoint}/${modalEliminar.id}`);
        showNotificacion('Registro eliminado correctamente');
        cargarDatos();
      } catch (error) { 
        showNotificacion('No se pudo eliminar el registro', 'error');
      } finally {
        setModalEliminar({ show: false, id: null });
      }
  };

  const generarLinkRegistro = async (id) => {
    try {
        const res = await axios.post(`${API_URL}/aves/${id}/generar-link`);
        const linkFinal = res.data.link.replace('/adopcion/', '/registro/');
        navigator.clipboard.writeText(linkFinal);
        showNotificacion('Link copiado al portapapeles 📋');
        cargarDatos();
    } catch (error) {
        showNotificacion('Error al generar el link', 'error');
    }
  };

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
        return filtroEstado === 'disponibles' ? (coincideBusqueda && !esVendido) : (coincideBusqueda && esVendido);
    }
    return coincideBusqueda;
  });

  const colores = {
      aves: { main: 'emerald', grad: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200' },
      productos: { main: 'blue', grad: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200' },
      sorteos: { main: 'violet', grad: 'from-violet-500 to-fuchsia-500', shadow: 'shadow-violet-200' },
      escaner: { main: 'emerald', grad: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200' }
  };
  const theme = colores[seccion];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden notranslate" translate="no">
      
      <DeleteModal 
        show={modalEliminar.show} 
        onClose={() => setModalEliminar({ show: false, id: null })} 
        onConfirm={confirmarEliminacionReal} 
      />

      <ParticipantsModal 
        show={modalParticipantes.show}
        boletos={modalParticipantes.boletos}
        tituloSorteo={modalParticipantes.tituloSorteo}
        onClose={() => setModalParticipantes({ show: false, boletos: [], tituloSorteo: '' })}
        theme={theme}
      />

      <Notificacion notificacion={notificacion} />

      <BarraLateral 
        seccion={seccion} 
        setSeccion={setSeccion} 
        cerrarSesion={cerrarSesion} 
        theme={theme} 
        usuario={usuario || user} 
      />

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#F8F9FC]">
        <EncabezadoEstadisticas 
          seccion={seccion} 
          totalRegistros={listaFiltrada.length} 
          busqueda={busqueda} 
          setBusqueda={setBusqueda} 
          theme={theme} 
          usuario={usuario || user} 
        />

        <div className="flex-1 overflow-auto p-10">
          
          {seccion === 'escaner' ? (
            <EscanerAdmin />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
              
              <div className="xl:col-span-4">
                <FormularioAdmin 
                  seccion={seccion}
                  modoEdicion={modoEdicion}
                  theme={theme}
                  formAve={formAve}
                  formProd={formProd}
                  formSorteo={formSorteo}
                  handleChangeAve={handleChangeAve}
                  handleChangeProd={handleChangeProd}
                  handleChangeSorteo={handleChangeSorteo}
                  handleFileChange={handleFileChange}
                  previewUrl={previewUrl}
                  onSubmit={seccion === 'sorteos' ? guardarSorteo : guardar}
                  onCancel={resetForms}
                  listaAvesDisponibles={listaAvesDisponibles}
                />
              </div>

              <div className="xl:col-span-8">
                <TablaAdmin 
                  seccion={seccion}
                  listaFiltrada={listaFiltrada}
                  filtroEstado={filtroEstado}
                  setFiltroEstado={setFiltroEstado}
                  theme={theme}
                  prepararEdicion={prepararEdicion}
                  abrirModalEliminar={abrirModalEliminar}
                  setModalParticipantes={setModalParticipantes}
                  revelarGanador={revelarGanador}
                  generarLinkRegistro={generarLinkRegistro}
                  cambiarVisibilidadSorteo={cambiarVisibilidadSorteo} // 🔥 PASAMOS LA NUEVA FUNCIÓN
                />
              </div>

            </div>
          )}

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
          border-color: ${seccion === 'aves' ? '#10b981' : seccion === 'productos' ? '#3b82f6' : seccion === 'sorteos' ? '#8b5cf6' : '#10b981'};
          box-shadow: 0 4px 12px ${seccion === 'aves' ? 'rgba(16, 185, 129, 0.1)' : seccion === 'productos' ? 'rgba(59, 130, 246, 0.1)' : seccion === 'sorteos' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
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

export default PanelAdmin;