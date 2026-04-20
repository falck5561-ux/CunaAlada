import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, ZoomIn } from 'lucide-react';

const ModalCrop = ({ imagenOriginal, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const alTerminarRecorte = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const generarImagenRecortada = async () => {
    try {
      const image = await createImage(imagenOriginal);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0,
        croppedAreaPixels.width, croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        onCropComplete(blob); // Enviamos el archivo final al formulario
      }, 'image/jpeg');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="bg-[#0a0f18] w-full max-w-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="relative h-96 w-full bg-black">
          <Cropper
            image={imagenOriginal}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4} // Ajustado a la proporción de tus cartas (image_f70c6d.jpg)
            onCropChange={setCrop}
            onCropComplete={alTerminarRecorte}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <ZoomIn className="text-slate-500" size={20} />
            <input
              type="range"
              value={zoom}
              min={1} max={3} step={0.1}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
              <X size={18} /> Cancelar
            </button>
            <button onClick={generarImagenRecortada} className="flex-1 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black flex items-center justify-center gap-2">
              <Check size={18} strokeWidth={3} /> LISTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para cargar la imagen
const createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', (error) => reject(error));
  image.setAttribute('crossOrigin', 'anonymous');
  image.src = url;
});

export default ModalCrop;