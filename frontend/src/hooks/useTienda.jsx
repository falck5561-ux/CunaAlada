import { useState, useEffect, useMemo } from "react";
import axios from "axios";
// 1. Importamos la URL dinámica
import { API_URL } from "../config/api";

export const useTienda = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCompra, setModalCompra] = useState(false);
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [orden, setOrden] = useState("relevancia");

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

  useEffect(() => {
    if (carritoAbierto) {
      document.body.classList.add("modo-carrito-abierto");
    } else {
      document.body.classList.remove("modo-carrito-abierto");
    }
    return () => document.body.classList.remove("modo-carrito-abierto");
  }, [carritoAbierto]);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      // 2. Cambiamos la URL fija por la variable API_URL
      // Nota: Quitamos el "/api" porque ya viene en la variable
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error("Error en Tienda:", err);
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const mostrarNotificacion = (msj, tipo = "success") => {
    setNotificacion({ msj, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  // ... (El resto de la lógica de carrito y WhatsApp se queda igual)
  const modificarCantidad = (id, delta) => {
    setCarrito((prev) => {
      const itemActual = prev.find((p) => p._id === id);
      if (itemActual && delta > 0 && itemActual.cantidad >= itemActual.stock) {
        mostrarNotificacion(
          `¡Solo quedan ${itemActual.stock} unidades!`,
          "error",
        );
        return prev;
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

  const agregarAlCarrito = (producto) => {
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

  const abrirModal = () => {
    setModalCompra(true);
    setDatosCliente({ nombre: "", email: "", telefono: "" });
  };

  const handlePagoExitoso = (boletosComprados) => {
    setMensajeExito(boletosComprados);
    setModalCompra({ show: false, sorteo: null });
    cargarSorteos();
  };

  const generarLinkWhatsApp = () => {
    let mensaje = "Hola Cuna Alada 🦜, mi pedido:\n\n";
    carrito.forEach((item) => {
      mensaje += `▪️ ${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}\n`;
    });
    mensaje += `\n💰 *TOTAL: $${totalCarrito}*`;
    return `https://wa.me/5219811333772?text=${encodeURIComponent(mensaje)}`;
  };

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

  return {
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
    datosCliente,
    setDatosCliente,
    abrirModal,
    handlePagoExitoso,
  };
};
