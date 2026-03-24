import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ShoppingBag,
  X,
  MessageCircle,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Info,
} from "lucide-react";

/* --- COMPONENTES UI (Toast) --- */
const Toast = ({ mensaje, tipo }) => (
  <div
    className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-in transition-all ${
      tipo === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
    }`}
  >
    <span>{tipo === "success" ? "✨" : "⚠️"}</span>
    <span className="font-bold text-sm">{mensaje}</span>
  </div>
);

const Tienda = () => {
  // --- ESTADOS ---
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [metodoPago, setMetodoPago] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [orden, setOrden] = useState("relevancia");

  // Carrito persistente
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("cuna-carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  const categorias = ["Todos", "Alimento", "Juguetes", "Accesorios", "Salud"];

  useEffect(() => {
    obtenerProductos();
  }, []);
  useEffect(() => {
    localStorage.setItem("cuna-carrito", JSON.stringify(carrito));
  }, [carrito]);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        "https://cunaalada-kitw.onrender.com/api/productos",
      );
      setProductos(res.data);
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  /* --- OCULTAR FLOTANTES EXTERNOS --- */
  useEffect(() => {
    if (carritoAbierto) {
      document.body.classList.add("modo-carrito-abierto");
    } else {
      document.body.classList.remove("modo-carrito-abierto");
    }
    return () => document.body.classList.remove("modo-carrito-abierto");
  }, [carritoAbierto]);

  const mostrarNotificacion = (msj, tipo = "success") => {
    setNotificacion({ msj, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  // --- LÓGICA CARRITO CON VALIDACIÓN DE STOCK ---
  const modificarCantidad = (id, delta, e) => {
    if (e) e.stopPropagation();

    setCarrito((prev) => {
      // Encontrar el item para validar antes de cambiar
      const itemActual = prev.find((p) => p._id === id);

      // Validación: Si queremos sumar (+) y ya tenemos todo el stock
      if (itemActual && delta > 0 && itemActual.cantidad >= itemActual.stock) {
        mostrarNotificacion(
          `¡Solo quedan ${itemActual.stock} unidades!`,
          "error",
        );
        return prev; // Retornamos el estado anterior sin cambios
      }

      return prev
        .map((item) => {
          if (item._id === id) {
            const nuevaCantidad = Math.max(0, item.cantidad + delta);
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0);
    });
  };

  const agregarAlCarrito = (producto, e) => {
    if (e) e.stopPropagation();

    // Verificamos si ya está en el carrito para checar el stock acumulado
    const itemEnCarrito = carrito.find((item) => item._id === producto._id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (cantidadActual >= producto.stock) {
      mostrarNotificacion(
        `¡Stock límite alcanzado (${producto.stock})!`,
        "error",
      );
      return;
    }

    setCarrito((prev) => {
      const existe = prev.find((item) => item._id === producto._id);
      if (existe) {
        return prev.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });

    mostrarNotificacion(`¡${producto.nombre} agregado!`);
    if (productoSeleccionado) setProductoSeleccionado(null);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  };

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const procesarPagoTarjeta = () => {};

  const generarLinkWhatsApp = () => {
    let mensaje = "Hola Cuna Alada 🦜, mi pedido:\n\n";
    carrito.forEach((item) => {
      mensaje += `▪️ ${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}\n`;
    });
    mensaje += `\n💰 *TOTAL: $${totalCarrito}*`;
    return `https://wa.me/5219811333772?text=${encodeURIComponent(mensaje)}`;
  };

  const eligirMetodoPago = (metodo) => {};
  // Filtros Memoized
  const productosProcesados = useMemo(() => {
    let res = [...productos];
    if (categoriaActiva !== "Todos")
      res = res.filter((p) => p.categoria === categoriaActiva);
    if (busqueda)
      res = res.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      );
    if (orden === "menor_precio") res.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor_precio") res.sort((a, b) => b.precio - a.precio);
    return res;
  }, [productos, categoriaActiva, busqueda, orden]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 pb-20 relative">
      <style>{`
        /* ANIMACIÓN MODAL */
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-animada { animation: scaleIn 0.2s ease-out forwards; }

        /* ANIMACIÓN CARRITO (NUEVO) */
        @keyframes slideInRight { 
          from { transform: translateX(100%); opacity: 0.5; } 
          to { transform: translateX(0); opacity: 1; } 
        }
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        .drawer-entrada { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .backdrop-entrada { animation: fadeIn 0.3s ease-out forwards; }

        /* CORRECCIÓN WHATSAPP */
        body.modo-carrito-abierto .whatsapp-float,
        body.modo-carrito-abierto .whatsapp-btn,
        body.modo-carrito-abierto a[href*="wa.me"]:not(.btn-checkout-interno) { 
           display: none !important; 
           opacity: 0 !important;
           pointer-events: none !important;
        }
      `}</style>

      {notificacion && (
        <Toast mensaje={notificacion.msj} tipo={notificacion.tipo} />
      )}

      {/* HEADER */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-2xl font-black text-gray-900 cursor-pointer"
              onClick={() => setBusqueda("")}
            >
              Tienda <span className="text-emerald-600">Alada</span>
            </h1>
            <button
              onClick={() => setCarritoAbierto(true)}
              className="relative p-3 bg-gray-900 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg"
            >
              <ShoppingCart size={20} />
              {carrito.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                </span>
              )}
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${categoriaActiva === cat ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID PRODUCTOS */}
      <div className="container mx-auto px-4 mt-8">
        {cargando && <div className="text-center py-20">Cargando...</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosProcesados.map((prod) => {
            const itemEnCarrito = carrito.find((i) => i._id === prod._id);
            const cantidadLlevada = itemEnCarrito ? itemEnCarrito.cantidad : 0;
            const esOferta = prod.precioOriginal > prod.precio;
            const porcentaje = esOferta
              ? Math.round(
                  ((prod.precioOriginal - prod.precio) / prod.precioOriginal) *
                    100,
                )
              : 0;
            // Verificamos si podemos agregar más
            const sinStock = cantidadLlevada >= prod.stock;

            return (
              <div
                key={prod._id}
                onClick={() => setProductoSeleccionado(prod)}
                className={`group bg-white rounded-2xl p-3 border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative ${cantidadLlevada > 0 ? "border-emerald-500 ring-1 ring-emerald-500" : esOferta ? "border-red-100" : "border-gray-100"}`}
              >
                {esOferta && prod.stock > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-br-lg rounded-tl-lg z-10 shadow-md flex items-center gap-1">
                    <Tag size={10} /> -{porcentaje}%
                  </div>
                )}

                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative mb-4">
                  <img
                    src={prod.fotoUrl}
                    alt={prod.nombre}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  {cantidadLlevada > 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white font-black text-xs px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <ShoppingBag size={10} /> {cantidadLlevada}
                    </div>
                  )}
                  {prod.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-slate-800 backdrop-blur-[2px]">
                      AGOTADO
                    </div>
                  )}
                  {!prod.stock <= 0 && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-gray-700 block hover:bg-emerald-500 hover:text-white transition-colors">
                        <Info size={16} />
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {prod.nombre}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      {esOferta && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">
                          ${prod.precioOriginal}
                        </span>
                      )}
                      <span
                        className={`text-xl font-black ${esOferta ? "text-red-600" : "text-gray-900"}`}
                      >
                        ${prod.precio}
                      </span>
                    </div>
                    {prod.stock > 0 && (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cantidadLlevada > 0 ? (
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => modificarCantidad(prod._id, -1)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-700 hover:text-red-500 font-bold shadow-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-gray-800">
                              {cantidadLlevada}
                            </span>
                            <button
                              onClick={() => modificarCantidad(prod._id, 1)}
                              className={`w-7 h-7 flex items-center justify-center rounded-md font-bold shadow-sm transition-colors ${sinStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => agregarAlCarrito(prod, e)}
                            className={`p-2 rounded-lg transition-colors shadow-md ${esOferta ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" : "bg-gray-900 text-white hover:bg-emerald-600"}`}
                          >
                            <ShoppingCart size={18} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAWER CARRITO (CON ANIMACIÓN) */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop con FadeIn */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm backdrop-entrada"
            onClick={() => setCarritoAbierto(false)}
          ></div>

          {/* Panel con SlideIn */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col drawer-entrada">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
              <h2 className="text-xl font-black flex items-center gap-2 text-gray-800">
                <ShoppingBag className="text-emerald-600" /> Tu Pedido
              </h2>
              <button
                onClick={() => setCarritoAbierto(false)}
                className="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {carrito.length === 0 ? (
                <p className="text-center py-20 opacity-50">
                  Tu carrito está vacío
                </p>
              ) : (
                carrito.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center"
                  >
                    <img
                      src={item.fotoUrl}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      alt=""
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-1">
                        {item.nombre}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-emerald-700 font-bold">
                          ${item.precio * item.cantidad}
                        </p>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => modificarCantidad(item._id, -1)}
                            className="text-gray-500 hover:text-red-500 font-bold px-1"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-gray-800 w-4 text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => modificarCantidad(item._id, 1)}
                            className={`font-bold px-1 ${item.cantidad >= item.stock ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-emerald-600"}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item._id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-500 font-medium">
                    Total Estimado
                  </span>
                  <span className="text-3xl font-black text-gray-900">
                    ${totalCarrito}
                  </span>
                </div>
                <a
                  href={generarLinkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-checkout-interno w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition active:scale-95 shadow-emerald-200 shadow-lg"
                >
                  <MessageCircle size={20} /> Finalizar Pedido
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DETALLE --- */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setProductoSeleccionado(null)}
          ></div>
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative z-10 modal-animada flex flex-col md:flex-row max-h-[85vh]">
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur p-2 rounded-full text-gray-800 hover:bg-red-50 hover:text-red-500 shadow-sm transition-all hover:scale-110 border border-gray-100"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-2/5 bg-gray-50 h-64 md:h-auto relative flex items-center justify-center p-6">
              <img
                src={productoSeleccionado.fotoUrl}
                className="w-full h-full object-contain mix-blend-multiply"
                alt=""
              />
              {productoSeleccionado.precioOriginal >
                productoSeleccionado.precio && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                  <Tag size={12} /> ¡OFERTA!
                </div>
              )}
            </div>

            <div className="w-full md:w-3/5 p-8 flex flex-col overflow-y-auto">
              <div className="mb-auto mt-2">
                <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold uppercase tracking-wider mb-3">
                  {productoSeleccionado.categoria}
                </span>
                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight pr-8">
                  {productoSeleccionado.nombre}
                </h2>

                <div className="mb-6 border-b border-gray-100 pb-4">
                  {productoSeleccionado.precioOriginal >
                  productoSeleccionado.precio ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300 line-through">
                        ${productoSeleccionado.precioOriginal}
                      </span>
                      <span className="text-4xl font-black text-red-600">
                        ${productoSeleccionado.precio}
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-emerald-600">
                      ${productoSeleccionado.precio}
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-gray-800 mb-2 text-sm">
                  Descripción:
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-6">
                  {productoSeleccionado.descripcion ||
                    "Descripción detallada no disponible."}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div
                    className={`w-2 h-2 rounded-full ${productoSeleccionado.stock > 0 ? "bg-emerald-500" : "bg-red-400"}`}
                  ></div>
                  Status:{" "}
                  <span className="font-semibold text-gray-700">
                    {productoSeleccionado.stock > 0
                      ? `En Stock (${productoSeleccionado.stock})`
                      : "Agotado"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {productoSeleccionado.stock > 0 ? (
                  <button
                    onClick={() => agregarAlCarrito(productoSeleccionado)}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag size={20} /> Agregar al Pedido
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed"
                  >
                    Producto Agotado
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;
