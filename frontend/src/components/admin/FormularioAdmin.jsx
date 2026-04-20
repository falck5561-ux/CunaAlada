import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import { Edit2, Plus, X, Upload, Image as ImageIcon, Bird, Dna, Hash, Check, Save, ZoomIn, Scissors } from 'lucide-react';

const FormularioAdmin = ({ 
  seccion, modoEdicion, theme, 
  formAve, formProd, formSorteo, 
  handleChangeAve, handleChangeProd, handleChangeSorteo, 
  handleFileChange, previewUrl,   
  onSubmit, onCancel, listaAvesDisponibles 
}) => {

  // --- ESTADOS PARA EL RECORTE DE IMAGEN ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Bloquear el scroll del fondo cuando el modal esté abierto
  useEffect(() => {
    if (showCropper) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showCropper]);

  // Al seleccionar el archivo, no lo subimos aún, primero lo mostramos para recortar
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((_ , pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Función mágica para procesar el recorte y enviarlo al PanelAdmin
  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      // Creamos un objeto similar al evento original de input file para no romper tu lógica de PanelAdmin
      const fakeEvent = {
        target: {
          files: [croppedImage]
        }
      };
      handleFileChange(fakeEvent); // Se lo pasamos al padre (PanelAdmin)
      setShowCropper(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-6">
      
      {/* ========================================================== */}
      {/* MODAL DEL RECORTE (Renderizado con portal en el Body)      */}
      {/* ========================================================== */}
      {showCropper && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                <Scissors size={20} className="text-emerald-500"/> Ajustar Fotografía
              </h4>
              <button onClick={() => setShowCropper(false)} className="text-slate-400 hover:text-slate-600"><X/></button>
            </div>

            <div className="relative h-80 w-full bg-slate-200">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4} // Proporción ideal para tus cartas de aves
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <ZoomIn size={18} className="text-slate-300" />
                  <input
                    type="range"
                    value={zoom}
                    min={1} max={3} step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCropper(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
                <button type="button" onClick={handleCropSave} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">
                  APLICAR RECORTE
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- CABECERA --- */}
      <div className="flex justify-between items-center mb-8">
        <h3 className={`font-bold text-xl flex items-center gap-3 text-slate-700`}>
          <span className={`p-2 rounded-lg bg-${theme.main}-50 text-${theme.main}-500`}>
            {modoEdicion ? <Edit2 size={20}/> : <Plus size={20}/>}
          </span>
          {modoEdicion ? 'Editar Registro' : seccion === 'sorteos' ? 'Configurar Sorteo' : 'Nuevo Registro'}
        </h3>
        {modoEdicion && (
          <button type="button" onClick={onCancel} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-500 flex items-center gap-1.5 transition-colors">
            <X size={14}/>
            <span>Cancelar</span>
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} encType={seccion !== 'sorteos' ? "multipart/form-data" : ""}>
        <div className="space-y-6">
            
            {/* --- SECCIÓN DE FOTO SÓLO PARA AVES Y PRODUCTOS --- */}
            {seccion !== 'sorteos' && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Fotografía</label>
                    <div className="w-full relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={onSelectFile}
                        className="hidden" 
                        id="file-subidaArchivos"
                    />
                    <label htmlFor="file-subidaArchivos" className={`cursor-pointer w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all overflow-hidden ${previewUrl ? `border-${theme.main}-400 bg-white` : `border-slate-300 hover:border-${theme.main}-400 hover:bg-slate-50`}`}>
                        {previewUrl ? (
                            <div className="relative w-full h-full group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold text-xs flex items-center gap-2">
                                        <Upload size={16}/> Cambiar y ajustar
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-1">
                                    <ImageIcon size={24}/>
                                </div>
                                <span className="text-sm font-bold text-slate-500">Subir Imagen</span>
                                <span className="text-[10px] text-slate-400">AJUSTAR AL SUBIR</span>
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

            {/* --- INPUTS DE SORTEOS --- */}
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
  );
};

// ============================================================================
// FUNCIONES AUXILIARES PARA EL RECORTE (Canvas)
// ============================================================================

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'ave_recortada.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}

export default FormularioAdmin;