import React, { useState } from "react";
import {
  ShoppingBag,
  X,
  CreditCard,
  MessageCircle,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Info,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Importamos nuestra lógica
import { useTienda } from "../hooks/useTienda";
import { API_URL } from "../config/api";

// --- INICIALIZACIÓN DE STRIPE ---
const stripePromise = loadStripe(
  "pk_test_51SFnF0ROWvZ0m785J38J20subms9zeVw92xxsdct2OVzHbIXF8Kueajcp4jxJblwBhozD1xDljC2UG1qDNOGOxTX00UiDpoLCI",
);

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

const FormularioPago = ({ datos, setDatos, onSuccess, totalCarrito }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorStripe, setErrorStripe] = useState(null);

  const procesarPago = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcesandoPago(true);
    setErrorStripe(null);

    try {
      // USAMOS API_URL PARA EL PAGO
      const resPago = await axios.post(`${API_URL}/crear-pago`, {});

      const { clientSecret } = resPago.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: datos.nombre,
            email: datos.email,
            phone: datos.telefono,
          },
        },
      });

      if (result.error) {
        setErrorStripe(result.error.message);
        setProcesandoPago(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // USAMOS API_URL PARA CONFIRMAR LA COMPRA
          await axios.post(`${API_URL}/tienda/confirmar-compra`, {
            nombre: datos.nombre,
            email: datos.email,
            telefono: datos.telefono,
            idPago: result.paymentIntent.id,
          });
          onSuccess(2);
        }
      }
    } catch (error) {
      console.error("Error en pago:", error);
      setErrorStripe(
        error.response?.data?.message ||
          "Ocurrió un problema al conectar con el servidor.",
      );
      setProcesandoPago(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#334155",
        fontFamily: '"Inter", sans-serif',
        fontSize: "16px",
        "::placeholder": { color: "#94a3b8" },
      },
      invalid: { color: "#ef4444", iconColor: "#ef4444" },
    },
  };

  return (
    <form onSubmit={procesarPago} className="space-y-4">
      <div>
        <input
          type="text"
          required
          value={datos.nombre}
          onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          disabled={procesandoPago}
          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
          placeholder="Nombre completo"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="email"
          required
          value={datos.email}
          onChange={(e) => setDatos({ ...datos, email: e.target.value })}
          disabled={procesandoPago}
          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
          placeholder="Correo electrónico"
        />
        <input
          type="tel"
          required
          value={datos.telefono}
          onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
          disabled={procesandoPago}
          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
          placeholder="Teléfono"
        />
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-400 transition-colors">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
          Datos de la Tarjeta
        </label>
        <div className="p-2">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {errorStripe && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 text-sm font-bold border border-rose-200">
          <AlertCircle size={18} /> {errorStripe}
        </div>
      )}

      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 mt-6 shadow-sm">
        <div className="flex justify-between items-end mt-4">
          <span className="text-emerald-700 text-sm uppercase font-bold tracking-wider">
            Total a Pagar
          </span>
          <span className="text-4xl font-black text-emerald-600">
            ${totalCarrito}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={procesandoPago || 3 === 0 || !stripe}
        className={`w-full mt-6 py-5 rounded-2xl font-black text-white flex justify-center items-center gap-3 transition-all shadow-xl
                ${3 === 0 || procesandoPago ? "bg-slate-300 shadow-none cursor-not-allowed" : "bg-gray-900 hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-emerald-500/30"}`}
      >
        {procesandoPago ? (
          <Loader2 className="animate-spin" />
        ) : (
          <CreditCard size={24} />
        )}
        {procesandoPago ? "Procesando Pago Seguro..." : "Pagar de Forma Segura"}
      </button>
    </form>
  );
};

// const ElegirMétodoPago = () => {
//   const metodosPagoDisponibles = [
//     { id: 0, nombre: "WhatsApp" },
//     { id: 1, nombre: "Tarjeta" },
//     // Métodos de pago en el futuro
//     // {id: #, nombre: "texto"},
//   ];
//   const [metodoPago, setMetodoPago] = useState(metodosPagoDisponibles[0].id);
//   return (
//     <div className="space-y-4">
//       {metodosPagoDisponibles.map((metodo) => (
//         <div className="inline-flex">
//           <button
//             key={metodo.id}
//             onClick={() => setMetodoPago(metodo.id)}
//             className="
//             p-2
//             rounded-md
//             text-md
//             outline-black outline outline-solid
//             items-center justify-center
//             font-black   transition-all duration-300 shadow-xl overflow-hidden relative group/btn bg-emerald-600 text-white
//             hover:bg-emerald-700
//             hover:shadow-emerald-500/30
//             "
//           >
//             {metodo.nombre}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

const Tienda = () => {
  // Extraemos todo lo que necesitamos del Custom Hook
  const {
    cargando,
    error,
    notificacion,
    carritoAbierto,
    setCarritoAbierto,
    productoSeleccionado,
    setProductoSeleccionado,
    busqueda,
    setBusqueda,
    categoriaActiva,
    setCategoriaActiva,
    categorias,
    productosProcesados,
    carrito,
    modificarCantidad,
    agregarAlCarrito,
    eliminarDelCarrito,
    totalCarrito,
    generarLinkWhatsApp,
    modalCompra,
    setModalCompra,
    abrirModal,
    datosCliente,
    setDatosCliente,
    handlePagoExitoso,
  } = useTienda();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 pb-20 relative">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                modificarCantidad(prod._id, -1);
                              }}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-700 hover:text-red-500 font-bold shadow-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-gray-800">
                              {cantidadLlevada}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                modificarCantidad(prod._id, 1);
                              }}
                              className={`w-7 h-7 flex items-center justify-center rounded-md font-bold shadow-sm transition-colors ${sinStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              agregarAlCarrito(prod);
                            }}
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
      {/* DRAWER CARRITO */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm backdrop-entrada"
            onClick={() => setCarritoAbierto(false)}
          ></div>

          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col drawer-entrada">
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
            {/* <ElegirMétodoPago /> */}
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
                {/* --- MODAL DETALLE --- */}
                <button
                  onClick={() => abrirModal(true)}
                  className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl overflow-hidden relative group/btn bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-1"
                >
                  <span className="relative z-10">
                    Elegir Números y Comprar
                  </span>
                </button>
                tttttttttttttt
                <Elements stripe={stripePromise}>
                  <FormularioPago
                    datos={datosCliente}
                    setDatos={setDatosCliente}
                    onSuccess={handlePagoExitoso}
                    totalCarrito={totalCarrito}
                  />
                </Elements>
                <p />
                uuuuuuuuuuuuuuuuuuuuu
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;
