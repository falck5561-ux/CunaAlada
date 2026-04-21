import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; 

export const useTienda = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [ordenamiento, setOrdenamiento] = useState(''); 

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('cuna-carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [tickets, setTickets] = useState([]);

  const categorias = ['Todos', 'Alimento', 'Juguetes', 'Accesorios', 'Salud'];

  // --- 🛠️ OBTENER USUARIO DESDE LOCALSTORAGE ---
  const obtenerNombreUsuarioActual = () => {
    const sesion = localStorage.getItem('cuna_usuario');
    if (sesion) {
      try {
        const objetoUsuario = JSON.parse(sesion);
        return objetoUsuario.nombre || 'Invitado';
      } catch (e) { return 'Invitado'; }
    }
    return 'Invitado';
  };

  useEffect(() => { 
    obtenerProductos();
    obtenerMisTickets(); 
  }, []);
  
  useEffect(() => { 
    localStorage.setItem('cuna-carrito', JSON.stringify(carrito)); 
  }, [carrito]);

  // Control de scroll al abrir carrito (Mejora UX)
  useEffect(() => {
    if (carritoAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [carritoAbierto]);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API_URL}/productos`);
      setProductos(res.data);
    } catch (err) { 
      console.error("Error en Tienda:", err);
      setError('Error de conexión con el catálogo'); 
    } finally { 
      setCargando(false); 
    }
  };

  const obtenerMisTickets = async () => {
    const nombreUsuario = obtenerNombreUsuarioActual(); 
    try {
      const res = await axios.get(`${API_URL}/pedidos-tienda/mis-pedidos?usuario=${nombreUsuario}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Error al obtener tickets:", err);
    }
  };

  const mostrarNotificacion = (msj, tipo = 'success') => {
    setNotificacion({ msj, tipo });
    setTimeout(() => setNotificacion(null), 3500); // Tiempo un poco mayor para leer mejor
  };

  const totalCarrito = useMemo(() => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }, [carrito]);

  const modificarCantidad = (id, delta) => {
    setCarrito(prev => {
      const itemActual = prev.find(p => p._id === id);
      if (itemActual && delta > 0 && itemActual.cantidad >= itemActual.stock) {
        mostrarNotificacion(`¡Solo quedan ${itemActual.stock} unidades de este producto!`, 'error');
        return prev; 
      }
      return prev.map(item => {
        if (item._id === id) {
          const nuevaCantidad = Math.max(0, item.cantidad + delta);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const agregarAlCarrito = (producto) => {
    const itemEnCarrito = carrito.find(item => item._id === producto._id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (cantidadActual >= producto.stock) {
       mostrarNotificacion(`Stock límite alcanzado: ${producto.stock}`, 'error');
       return;
    }

    setCarrito(prev => {
      const existe = prev.find(item => item._id === producto._id);
      if (existe) {
        return prev.map(item => item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    
    mostrarNotificacion(`¡${producto.nombre} agregado a la cesta!`);
    if(productoSeleccionado) setProductoSeleccionado(null);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item._id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('cuna-carrito');
  };

  // 🔥 REGISTRO MEJORADO CON DOBLE VALIDACIÓN
  const registrarPedidoEnDB = async (metodo = 'efectivo') => {
    const nombreUsuario = obtenerNombreUsuarioActual();
    
    if (carrito.length === 0) {
      mostrarNotificacion("Tu carrito está vacío.", "error");
      return null;
    }
    
    // 🛡️ DOBLE VALIDACIÓN: Límite de Efectivo
    if (metodo === 'efectivo' && totalCarrito > 600) {
      mostrarNotificacion("El límite para pedidos en efectivo es de $600 MXN.", "error");
      return null;
    }

    // 🛡️ BLOQUEO: No permitir dos tickets en efectivo al mismo tiempo
    if (metodo === 'efectivo' && tickets.some(t => t.estado === 'pendiente')) {
      mostrarNotificacion("Ya tienes una reserva pendiente en caja. Liquídala antes de pedir otra.", "error");
      return null;
    }

    try {
      // Definimos el estado final de forma estricta
      const estadoDeseado = metodo === 'tarjeta' ? 'pagado' : 'pendiente';

      const datosPedido = {
        usuarioNombre: nombreUsuario,
        productos: carrito.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        total: totalCarrito,
        metodoPago: metodo,
        estado: estadoDeseado 
      };

      const res = await axios.post(`${API_URL}/pedidos-tienda/crear`, datosPedido);
      
      // Armamos el objeto para la UI garantizando el estado correcto
      const pedidoParaUI = {
        ...res.data.pedido,
        estado: estadoDeseado
      };

      // Actualizamos historial local instantáneamente
      setTickets(prev => [pedidoParaUI, ...prev]);
      vaciarCarrito(); 
      
      const mensajeExito = metodo === 'tarjeta' 
        ? "¡PAGO CONFIRMADO! GENERANDO FOLIO..." 
        : "¡RESERVA GENERADA! PAGA EN MOSTRADOR.";
      
      mostrarNotificacion(mensajeExito, 'success');
      
      return pedidoParaUI; 
    } catch (err) {
      console.error("Error al registrar pedido:", err);
      mostrarNotificacion("Error al procesar el pedido. Intenta nuevamente.", "error");
      return null;
    }
  };

  const generarLinkWhatsApp = () => {
    let mensaje = "Hola Cuna Alada 🦜, mi pedido:\n\n";
    carrito.forEach(item => { mensaje += `▪️ ${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}\n`; });
    mensaje += `\n💰 *TOTAL: $${totalCarrito}*`;
    return `https://wa.me/5215642050757?text=${encodeURIComponent(mensaje)}`;
  };

  // Lógica de filtrado y ordenamiento optimizada
  const productosProcesados = useMemo(() => {
    let res = [...productos];
    if (categoriaActiva !== 'Todos') res = res.filter(p => p.categoria === categoriaActiva);
    if (busqueda) res = res.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    
    if (ordenamiento === 'menor_precio') {
      res.sort((a, b) => a.precio - b.precio);
    } else if (ordenamiento === 'mayor_precio') {
      res.sort((a, b) => b.precio - a.precio);
    }
    return res;
  }, [productos, categoriaActiva, busqueda, ordenamiento]);

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
    vaciarCarrito,
    tickets, 
    registrarPedidoEnDB, 
    obtenerMisTickets,
    ordenamiento,      
    setOrdenamiento,   
    obtenerProductos   
  };
};