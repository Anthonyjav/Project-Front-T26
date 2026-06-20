'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string[];
};

type ItemCarrito = {
  id: number;
  cantidad: number;
  talla: string;
  color: string;
  producto: Producto;
};
type OrdenItemData = {
  id: number;
  cantidad: number;
  talla?: string;
  color?: string;
  precio?: number;
  producto?: {
    id: number;
    nombre: string;
    imagen?: string[];
  };
  variante?: {
    id: number;
    talla?: string;
    color?: string;
    precio?: number;
  };
};

type Orden = {
  id: number;
  estado: string;
  total: number;
  createdAt: string;
  orderId?: string;
  orderIdIzipay?: string;
  shippingMethod?: string;
  paymentResponse?: any;
  items?: OrdenItemData[];
};

const ajustarURL = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://api.sgstudio.shop';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const extraerOrderId = (orden: Orden): string | null => {
  if (orden.orderId) return orden.orderId;
  if (orden.orderIdIzipay) return orden.orderIdIzipay;
  try {
    const resp = typeof orden.paymentResponse === 'string'
      ? JSON.parse(orden.paymentResponse)
      : orden.paymentResponse || {};
    const meta = resp?.transactions?.[0]?.metadata || resp?.metadata || {};
    return meta?.orderId || meta?.order_id || resp?.orderId || null;
  } catch {
    return null;
  }
};

const extraerItemsDeOrden = (orden: Orden): { imagen?: string; nombre?: string }[] => {
  if (orden.items && orden.items.length > 0) {
    const fromBackend = orden.items.map((it) => ({
      imagen: it.producto?.imagen?.[0] || (it as any).imagen || undefined,
      nombre: it.producto?.nombre || '',
    }));
    if (fromBackend.some((i) => i.imagen)) return fromBackend;
  }

  try {
    const resp = typeof orden.paymentResponse === 'string'
      ? JSON.parse(orden.paymentResponse)
      : orden.paymentResponse || {};
    const meta = resp?.transactions?.[0]?.metadata || resp?.metadata || {};
    const items = meta?.items || [];
    const parsed = Array.isArray(items) ? items : typeof items === 'string' ? JSON.parse(items.replace(/\\"/g, '"')) : [];
    return parsed.map((it: any) => ({
      imagen: it.imagen || it.image || it.imagenUrl || undefined,
      nombre: it.nombreProducto || it.nombre || it.title || '',
    }));
  } catch {
    return [];
  }
};

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [loadingCarrito, setLoadingCarrito] = useState(true);
  const [mensajeCompra, setMensajeCompra] = useState('');
  const [comprando, setComprando] = useState(false);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [mensajeReclamo, setMensajeReclamo] = useState('');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);
  const [mostrarFormularioReclamo, setMostrarFormularioReclamo] = useState(false);
  const [reclamos, setReclamos] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [showRawOrder, setShowRawOrder] = useState(false);
  const searchParams = useSearchParams();
  const [showAlertaAsesoria, setShowAlertaAsesoria] = useState(() => searchParams.get('success') === 'true');
  const [tabActivo, setTabActivo] = useState('Mis órdenes');
  const [editando, setEditando] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editApellido, setEditApellido] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [guardando, setGuardando] = useState(false);


  const router = useRouter();
 
  useEffect(() => {
    async function fetchOrdenes() {
      if (!usuario?.id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`);
        const data = await res.json();

        const ordenesUsuario = data
          .filter((orden: any) => orden.usuarioId === usuario.id)
          .map((orden: any) => ({
            ...orden,
            total: typeof orden.total === 'string' ? parseFloat(orden.total) : Number(orden.total || 0),
            createdAt: orden.createdAt || orden.created_at || orden.date || null,
          }));
        setOrdenes(ordenesUsuario);
      } catch (err) {
        console.error(err);
      }
    }

    fetchOrdenes();
  }, [usuario]);

  useEffect(() => {
    async function fetchReclamos() {
      if (!usuario?.id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reclamos`);
        const data = await res.json();
        const reclamosUsuario = data.filter((r: any) => r.usuarioId === usuario.id);
        setReclamos(reclamosUsuario);
      } catch (err) {
        console.error('Error al obtener reclamos:', err);
      }
    }

    fetchReclamos();
  }, [usuario]);



  // Alerta temporal de asesoría
  useEffect(() => {
    if (showAlertaAsesoria) {
      const timer = setTimeout(() => {
        setShowAlertaAsesoria(false);
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [showAlertaAsesoria]);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser && isLoggedIn === 'true') {
      setUsuario(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchCarrito() {
      if (!usuario?.id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito/${usuario.id}`);
        const data = await res.json();
        setCarrito(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCarrito(false);
      }
    }

    fetchCarrito();
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100); 
  };

  const mostrarToast = (mensaje: string) => {
    setToastMessage(mensaje);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleEliminarItem = async (itemId: number) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito/item/${itemId}`, {
      method: 'DELETE',
    });

    // Eliminar del estado local
    setCarrito((prev) => prev.filter((item) => item.id !== itemId));

    // Recargar la página
    window.location.reload();
  } catch (err) {
    console.error('Error al eliminar el producto del carrito:', err);
  }
  };


  const handleEliminarOrden = async (ordenId: number) => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta orden?');
    if (!confirmacion) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${ordenId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar la orden');
      }

      // Eliminar del estado local
            // Eliminar del estado local

      setOrdenes((prev) => prev.filter((orden) => orden.id !== ordenId));
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al eliminar la orden.');
    }
  };

  const openOrderDetails = async (ordenId: number) => {
    try {
      setLoadingOrderDetails(true);
      setShowRawOrder(false);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenes/${ordenId}`);
      if (!res.ok) throw new Error('Error al obtener detalle de la orden');
      let data = await res.json();
      // Normalizar paymentResponse si viene como string
      try {
        if (data.paymentResponse && typeof data.paymentResponse === 'string') {
          try {
            data.paymentResponse = JSON.parse(data.paymentResponse);
          } catch (e) {
            // limpiar comillas escapadas y reintentar
            const cleaned = data.paymentResponse.replace(/\\"/g, '"');
            data.paymentResponse = JSON.parse(cleaned);
          }
        }
      } catch (e) {
        // ignore
      }

      // Normalizar orderId y shippingMethod si vienen en paymentResponse metadata
      try {
        const resp = data.paymentResponse && typeof data.paymentResponse === 'string' ? (() => { try { return JSON.parse(data.paymentResponse); } catch { return data.paymentResponse; } })() : (data.paymentResponse || {});
        const meta = resp?.transactions?.[0]?.metadata || resp?.metadata || {};
        data.orderId = data.orderId || data.orderIdIzipay || meta?.orderId || meta?.order_id || resp.orderId || resp.order_id || data.orderId;
        data.shippingMethod = data.shippingMethod || meta?.shippingMethod || meta?.metodoEnvio || resp.shippingMethod || data.shippingMethod || null;
      } catch (e) {
        // ignore
      }
      // Debug log removed: 'DETALLE ORDEN RAW'
      // Normalize a few commonly used fields
      data.total = typeof data.total === 'string' ? parseFloat(data.total) : Number(data.total || 0);
      data.createdAt = data.createdAt || data.created_at || data.date || null;
      setOrderDetails(data);
      setShowOrderModal(true);
    } catch (err) {
      console.error('Error fetching order details', err);
      mostrarToast('No se pudo cargar los detalles de la orden');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const extractPaymentMethod = (d: any) => {
    if (!d) return 'N/D';
    const resp = d.paymentResponse && typeof d.paymentResponse === 'string'
      ? (() => { try { return JSON.parse(d.paymentResponse); } catch { return d.paymentResponse; } })()
      : (d.paymentResponse || d);
    return (
      d.paymentMethod ||
      resp?.paymentMethod ||
      resp?.transactions?.[0]?.paymentMethod ||
      resp?.method ||
      (d.metadata && (d.metadata.paymentMethod || d.metadata.method)) ||
      'N/D'
    );
  };

  const getPaymentInfo = (d: any) => {
    if (!d) return { label: 'N/D' };
    const resp = d.paymentResponse && typeof d.paymentResponse === 'string'
      ? (() => { try { return JSON.parse(d.paymentResponse); } catch { return d.paymentResponse; } })()
      : (d.paymentResponse || d);
    const tx = resp?.transactions?.[0] || d.transactions?.[0] || null;
    const brand = tx?.transactionDetails?.cardDetails?.effectiveBrand || tx?.transactionDetails?.paymentMethodDetails?.effectiveBrand || d.paymentResponse?.card?.brand || d.paymentResponse?.paymentMethod || null;
    // try to find last4
    const pan = tx?.transactionDetails?.cardDetails?.cardHolderPan || resp?.card?.last4 || resp?.card?.last_digits || null;
    const last = pan ? String(pan).slice(-4) : null;
    const type = tx?.paymentMethodType || tx?.paymentMethod || resp?.paymentMethodType || d.paymentMethodType || null;
    const label = brand ? `${brand}${last ? ' • ****' + last : ''}` : (type || extractPaymentMethod(d) || 'N/D');
    return { brand, last, type, label };
  };

  const extractShippingMethod = (d: any) => {
    if (!d) return 'N/D';
    const resp = d.paymentResponse && typeof d.paymentResponse === 'string'
      ? (() => { try { return JSON.parse(d.paymentResponse); } catch { return d.paymentResponse; } })()
      : (d.paymentResponse || d);
    return (
      d.metodoEnvio ||
      d.shippingMethod ||
      d.shipping?.method ||
      resp?.transactions?.[0]?.metadata?.metodoEnvio ||
      resp?.transactions?.[0]?.metadata?.shippingMethod ||
      resp?.customer?.shippingDetails?.shippingMethod ||
      (d.metadata && (d.metadata.metodoEnvio || d.metadata.shippingMethod)) ||
      'N/D'
    );
  };

  // Devuelve un objeto con campos de envío normalizados: metodoEnvio, referencia, distrito, direccion, telefono
  const getShippingInfo = (d: any) => {
    if (!d) return {};
    const resp = d.paymentResponse && typeof d.paymentResponse === 'string'
      ? (() => { try { return JSON.parse(d.paymentResponse); } catch { return d.paymentResponse; } })()
      : (d.paymentResponse || d);
    const metaTx = resp?.transactions?.[0]?.metadata || (d.transactions && d.transactions[0] && d.transactions[0].metadata) || {};
    const customerShip = resp?.customer?.shippingDetails || d.customer?.shippingDetails || {};

    const metodoEnvio = d.metodoEnvio || d.shippingMethod || metaTx.metodoEnvio || metaTx.shippingMethod || customerShip.shippingMethod || (d.metadata && (d.metadata.metodoEnvio || d.metadata.shippingMethod)) || null;
    const referencia = d.referencia || metaTx.referencia || customerShip.reference || d.reference || (d.metadata && d.metadata.referencia) || null;
    const distrito = d.distrito || metaTx.distrito || customerShip.district || d.shippingAddress?.district || null;
    const direccion = d.direccion || d.address || customerShip.address || d.shippingAddress?.address || d.customer?.billingDetails?.address || null;
    const telefono = d.telefono || customerShip.phoneNumber || d.customer?.billingDetails?.phoneNumber || null;

    return { metodoEnvio, referencia, distrito, direccion, telefono };
  };

  const getItemColor = (it: any) => {
    // Prioridad: item directo -> producto -> metadata.items (transacción) -> atributos varios
    const direct = it.color || it.colour || it.colorName || it.attributes?.color;
    if (direct) return direct;

    const prodColor = (it.producto as any)?.color;
    if (prodColor) {
      if (typeof prodColor === 'string') return prodColor.split(',')[0];
      return prodColor;
    }

    // Buscar en metadata.items parseada
    const metaItems = parseMetadataItems(orderDetails || {});
    if (metaItems && metaItems.length) {
      const found = metaItems.find((mi: any) => String(mi.productoId || mi.producto_id || mi.id) === String(it.productoId || it.producto?.id || it.productoId));
      if (found) {
        return found.color || found.colour || found.colorName || null;
      }
    }

    // Otros campos posibles
    if (it.metadata && it.metadata.color) return it.metadata.color;
    return 'N/D';
  };

  const colorNameToHex = (name: string | null) => {
    if (!name) return null;
    const map: Record<string, string> = {
      negro: '#000000',
      blanco: '#FFFFFF',
      rojo: '#FF0000',
      azul: '#0000FF',
      verde: '#008000',
      amarillo: '#FFFF00',
      gris: '#808080',
      naranja: '#FFA500',
      marron: '#8B4513',
      beige: '#F5F5DC',
      rosa: '#FFC0CB',
      morado: '#800080',
      fucsia: '#FF00FF',
      camel: '#C19A6B'
    };
    const key = String(name).trim().toLowerCase();
    if (map[key]) return map[key];
    // If name is already a color (hex or rgb), return as-is
    return key.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i) ? name : null;
  };

  const normalizeColorForStyle = (raw: string | null) => {
    if (!raw) return null;
    // try map
    const mapped = colorNameToHex(raw);
    if (mapped) return mapped;
    // try using browser to validate
    try {
      const el = document.createElement('div');
      el.style.backgroundColor = '';
      el.style.backgroundColor = raw as string;
      // some browsers normalize values; check if set
      if (el.style.backgroundColor) return raw;
    } catch (e) {
      // ignore
    }
    return null;
  };

  const getItemSize = (it: any) => {
    return (
      it.talla ||
      it.size ||
      it.attributes?.size ||
      (it.producto as any)?.talla?.split?.(',')?.[0] ||
      (it.metadata && it.metadata.size) ||
      'N/D'
    );
  };

  const parseMetadataItems = (order: any) => {
    try {
      // Normalize paymentResponse structure and try several places for metadata
      let transSource: any = null;
      if (order?.paymentResponse) {
        try {
          const resp = typeof order.paymentResponse === 'string' ? JSON.parse(order.paymentResponse) : order.paymentResponse;
          transSource = resp?.transactions?.[0]?.metadata || resp?.metadata || null;
        } catch (e) {
          transSource = order.paymentResponse?.transactions?.[0]?.metadata || order.paymentResponse?.metadata || null;
        }
      }
      const txMeta = transSource || order?.transactions?.[0]?.metadata || order?.metadata;
      if (!txMeta) return [];
      const rawItems = txMeta.items;
      if (!rawItems) return [];
      if (Array.isArray(rawItems)) return rawItems;
      // puede venir como stringified JSON
      if (typeof rawItems === 'string') {
        try {
          return JSON.parse(rawItems);
        } catch (e) {
          // a veces metadata.items es una cadena con comillas escapadas
          try {
            const cleaned = rawItems.replace(/\\"/g, '"');
            return JSON.parse(cleaned);
          } catch (ee) {
            return [];
          }
        }
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  const getItemImage = (it: any) => {
    // 1) si el item trae imagen directa
    if (it.imagen) return Array.isArray(it.imagen) ? it.imagen[0] : it.imagen;
    if (it.producto && it.producto.imagen && it.producto.imagen[0]) return it.producto.imagen[0];

    // 2) intentar extraer desde orderDetails.paymentResponse.transactions[0].metadata.items
    const metaItems = parseMetadataItems(orderDetails || {});
    if (metaItems && metaItems.length) {
      const found = metaItems.find((mi: any) => String(mi.productoId || mi.producto_id || mi.id) === String(it.productoId || it.producto?.id || it.productoId));
      if (found) {
        // varios nombres posibles: imagen, image, imagenUrl
        const f = found.imagen || found.image || found.imagenUrl || found.imageUrl || null;
        return Array.isArray(f) ? f[0] : f;
      }
    }

    // 3) intentar otras rutas en el item
    if (it.image) return it.image;
    if (it.imageUrl) return it.imageUrl;

    return null;
  };


  const iniciarEdicion = () => {
    setEditNombre(usuario.nombre);
    setEditApellido(usuario.apellido || '');
    setEditEmail(usuario.email);
    setEditPassword('');
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setEditPassword('');
  };

  const guardarCambios = async () => {
    if (!editNombre.trim() || !editApellido.trim() || !editEmail.trim()) {
      mostrarToast('Nombre, apellido y email son obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const token = localStorage.getItem('token');
      const body: any = {
        nombre: editNombre.trim(),
        apellido: editApellido.trim(),
        email: editEmail.trim(),
      };
      if (editPassword) {
        if (editPassword.length < 6) {
          mostrarToast('La contraseña debe tener al menos 6 caracteres');
          setGuardando(false);
          return;
        }
        body.password = editPassword;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al actualizar');
      }

      const data = await res.json();

      const updatedUser = { ...usuario, ...data.usuario };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUsuario(updatedUser);

      setEditando(false);
      setEditPassword('');
      mostrarToast('Datos actualizados correctamente');
    } catch (err: any) {
      mostrarToast(err.message || 'Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  const handleIrACheckout = () => {
  if (carrito.length === 0) {
    mostrarToast('Tu carrito está vacío.');
    return;
  }
  router.push('/checkout');
  };


  if (!usuario) {
    return <p className="text-center mt-10 text-gray-600">Cargando datos del usuario...</p>;
  }

  return (
    <section className="min-h-screen pt-24 px-4 md:px-8 bg-white text-black">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center border-b border-gray-300 pb-6">
          <h1 className="text-3xl font-bold tracking-tight uppercase">Mi cuenta</h1>
          <button
            onClick={handleLogout}
            className="btn-animated"
          >
            Cerrar sesión
          </button>
        </div>

        <div>
          <p className="text-gray-700 text-lg">
            ¡Hola <span className="font-semibold">{usuario.nombre}</span>! Aquí puedes gestionar tu
            cuenta y ver tus productos en el carrito.
          </p>
        </div>

        {/* Alerta temporal de confirmación de pago */}
        {showAlertaAsesoria && (
          <div style={{
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '28px', color: '#28a745', fontWeight: 'bold' }}>✓</div>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#155724', fontSize: '20px' }}>
                ¡Pago Exitoso!
              </h2>
              <p style={{ margin: '0 0 4px 0', color: '#155724', fontSize: '16px' }}>
                Un asesor se pondrá en contacto con usted en los próximos minutos para confirmar su pedido.
              </p>
              <p style={{ margin: 0, color: '#155724', fontSize: '14px' }}>
                Revise su correo electrónico para más detalles.
              </p>
            </div>
          </div>
        )}

        {mensajeCompra && (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
            {mensajeCompra}
          </div>
        )}

        {/* Tabs horizontales: Órdenes / Reclamos / Información */}
        {(() => {
          const tabs = ['Mis órdenes', 'Mis reclamos', 'Carrito de compras', 'Información'];
          return (
            <div>
              <div className="flex border-b border-gray-300 gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTabActivo(tab)}
                    className={`px-6 py-3 text-sm font-semibold uppercase transition-colors border-b-2 ${
                      tabActivo === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {tabActivo === 'Mis órdenes' && (
                  <div className="space-y-4">
                    {ordenes.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">Aún no has realizado ninguna orden</p>
                        <a href="/" className="inline-block mt-3 text-sm text-black underline hover:no-underline">Seguir comprando</a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ordenes.map((orden, index) => {
                          const estadoColor: Record<string, string> = {
                            pagado: 'bg-blue-100 text-blue-700',
                            'recojo en tienda listo': 'bg-purple-100 text-purple-700',
                            entregado: 'bg-green-100 text-green-700',
                            'procesando pago': 'bg-yellow-100 text-yellow-700',
                            'pago aceptado': 'bg-blue-100 text-blue-700',
                            'pedido enviado': 'bg-indigo-100 text-indigo-700',
                            'pedido entregado': 'bg-green-100 text-green-700',
                            cancelado: 'bg-red-100 text-red-700',
                          };
                          const badgeColor = estadoColor[orden.estado] || 'bg-gray-100 text-gray-600';

                          return (
                            <div
                              key={orden.id}
                              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                              <div className="px-5 pt-5 pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <h3 className="text-base font-semibold text-gray-900">
                                        Detalle Orden {extraerOrderId(orden) || `#${String(orden.id).slice(-6)}`}
                                      </h3>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                                        {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {new Date(orden.createdAt).toLocaleDateString('es-PE', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                  <p className="text-lg font-bold text-gray-900 whitespace-nowrap ml-4">
                                    PEN {Number(orden.total ?? 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {(() => {
                                const itemsPreview = extraerItemsDeOrden(orden);
                                if (itemsPreview.length === 0) return null;
                                return (
                                  <div className="px-5 pb-3 space-y-2">
                                    {itemsPreview.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-3 py-2 border-t border-gray-100 first:border-t-0">
                                        <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                                          {item.imagen ? (
                                            <img
                                              src={ajustarURL(item.imagen)}
                                              alt={item.nombre || ''}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-800 truncate">{item.nombre || 'Producto'}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}

                              <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => {
                                      setOrdenSeleccionada(orden);
                                      setMostrarFormularioReclamo(true);
                                    }}
                                    className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                      <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                    </svg>
                                    Reclamo
                                  </button>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => openOrderDetails(orden.id)}
                                    className="text-sm font-medium text-black hover:underline inline-flex items-center gap-1.5"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Ver detalle completo
                                  </button>

                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {tabActivo === 'Mis reclamos' && (
                  <div className="space-y-4">
                    {reclamos.length === 0 ? (
                      <p className="text-gray-600">Aún no has registrado ningún reclamo.</p>
                    ) : (
                      <div className="space-y-4">
                        {reclamos.map((r) => (
                          <div
                            key={r.id}
                            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                            <p className="text-sm text-gray-600">Reclamo #{r.id} - Orden #{r.ordenId}</p>
                            <p className="text-sm text-gray-800 mt-2">{r.mensaje}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              Enviado: {new Date(r.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tabActivo === 'Carrito de compras' && (
                  <div className="space-y-4">
                    {loadingCarrito ? (
                      <p className="text-gray-500">Cargando productos...</p>
                    ) : carrito.length === 0 ? (
                      <>
                        <p className="text-gray-600">Tu carrito está vacío.</p>
                        <a
                          href="/"
                          className="inline-block mt-2 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition text-sm"
                        >
                          Seguir comprando
                        </a>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                          {carrito.map((item) => (
                            <div
                              key={item.id}
                              className="flex-shrink-0 w-64 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                            >
                              <img
                                src={item.producto.imagen[0]}
                                alt={item.producto.nombre}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <div className="mt-3 space-y-1">
                                <h3 className="text-base font-semibold truncate">{item.producto.nombre}</h3>
                                <p className="text-sm text-gray-700">PEN {item.producto.precio}</p>
                                <p className="text-xs text-gray-500">
                                  Talla: {item.talla} | Color: {item.color}
                                </p>
                                <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>

                                <div className="flex items-center gap-3 mt-2">
                                  <button
                                    onClick={() => handleEliminarItem(item.id)}
                                    className="text-gray-600 text-xs hover:underline"
                                  >
                                    Eliminar
                                  </button>

                                  <button
                                    onClick={() => handleEliminarItem(item.id)}
                                    className="text-red-500 hover:text-gray-700 text-sm"
                                    title="Eliminar producto"
                                  >
                                    <FaTrash className='text-black' />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleIrACheckout}
                          className="mt-4 px-4 py-2 rounded text-sm bg-black text-white hover:bg-gray-800 transition"
                        >
                          Ir al Checkout
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {tabActivo === 'Información' && (
                  <div className="max-w-md space-y-4">
                    {editando ? (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Nombre</label>
                          <input
                            type="text"
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Apellido</label>
                          <input
                            type="text"
                            value={editApellido}
                            onChange={(e) => setEditApellido(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">Correo electrónico</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
                            Nueva contraseña <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                          </label>
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Dejar en blanco para no cambiar"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-400"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={guardarCambios}
                            disabled={guardando}
                            className="px-5 py-2.5 bg-black text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-black hover:border-gray-500 transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3 text-sm">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Nombre completo</p>
                            <p className="text-gray-800 font-medium mt-1">{usuario.nombre} {usuario.apellido}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Correo electrónico</p>
                            <p className="text-gray-800 font-medium mt-1">{usuario.email}</p>
                          </div>
                   
                        </div>
                        <button
                          onClick={iniciarEdicion}
                          className="px-5 py-2.5 bg-black text-white rounded-lg text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                        >
                          Editar datos
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
      
      {showToast && (
        <div className="fixed top-15 right-6 z-50 bg-black text-white px-6 py-3 rounded shadow-lg animate-fade-in-out transition-all">
          <p className="text-sm">{toastMessage}</p>
          <div className="mt-2 h-1 bg-white/30 relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-white animate-toast-progress" />
          </div>
        </div>
      )}

      {mostrarFormularioReclamo && ordenSeleccionada && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Detalle Orden {extraerOrderId(ordenSeleccionada) || `#${String(ordenSeleccionada.id).slice(-6)}`}</h2>
            <textarea
              value={mensajeReclamo}
              onChange={(e) => setMensajeReclamo(e.target.value)}
              className="w-full h-32 border border-gray-300 p-2 rounded"
              placeholder="Escribe aquí tu reclamo o solicitud..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setMostrarFormularioReclamo(false);
                  setMensajeReclamo('');
                  setOrdenSeleccionada(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!mensajeReclamo.trim()) {
                    mostrarToast('El mensaje no puede estar vacío.');
                    return;
                  }

                  try {
                    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/reclamos', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        usuarioId: usuario?.id,
                        ordenId: ordenSeleccionada.id,
                        mensaje: mensajeReclamo,
                      }),
                    });

                    if (!res.ok) {
                      const err = await res.json();
                      throw new Error(err.error || 'Error al enviar reclamo');
                    }

                    mostrarToast('Reclamo enviado correctamente');
                    setMostrarFormularioReclamo(false);
                    setMensajeReclamo('');
                    setOrdenSeleccionada(null);
                  } catch (error) {
                    console.error(error);
                    alert('Error al registrar el reclamo.');
                  }
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Enviar reclamo
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && orderDetails && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 mx-4 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {orderDetails.orderId || orderDetails.orderIdIzipay
                    ? `Detalle Orden ${orderDetails.orderId || orderDetails.orderIdIzipay}`
                    : `Detalle Orden #${orderDetails.id || '—'}`}
                </h3>
                <p className="text-sm text-gray-600">Estado: <span className="font-medium">{(orderDetails.estado || orderDetails.status || 'N/D').charAt(0).toUpperCase() + (orderDetails.estado || orderDetails.status || '').slice(1)}</span></p>
                <p className="text-sm text-gray-600">Total: PEN {Number(orderDetails.total || orderDetails.amount || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Fecha: {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : (orderDetails.date ? new Date(orderDetails.date).toLocaleString() : 'N/D')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setShowOrderModal(false); setOrderDetails(null); }} className="px-3 py-1 bg-red-50 text-red-600 border rounded">Cerrar</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Método de pago</h4>
                {(() => {
                  const p = getPaymentInfo(orderDetails);
                  return (
                    <div>
                      <p className="text-sm text-gray-700">{p.label}</p>
                      {p.brand && (
                        <div className="mt-2 text-sm text-gray-600 flex items-center gap-3">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{p.brand}</span>
                          {p.last && <span className="text-xs text-gray-500">••••{p.last}</span>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <h4 className="font-semibold">Método de envío</h4>
                {(() => {
                  const s = getShippingInfo(orderDetails);
                  return (
                    <div>
                      <p className="text-sm text-gray-700">{s.metodoEnvio || orderDetails.shippingMethod || orderDetails.metodoEnvio || 'N/D'}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        {s.direccion && <p>{s.direccion}</p>}
                        {(s.direccion || s.distrito) && <p>{s.distrito ? `Distrito: ${s.distrito}` : null}</p>}
                        {s.referencia && <p>Referencia: {s.referencia}</p>}
                        {s.telefono && <p>Tel: {s.telefono}</p>}
                        {!s.direccion && !s.distrito && !s.referencia && !s.telefono && (
                          <p className="text-sm text-gray-500">No hay detalles de envío disponibles</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Productos</h4>
              <div className="mt-2 space-y-3">
                {((orderDetails.items && orderDetails.items.length) ? orderDetails.items : (orderDetails.ordenItems || orderDetails.itemsDetalle || orderDetails.orderItems || [])).map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 border p-3 rounded">
                    {(() => {
                      const img = getItemImage(it);
                      return img ? (
                        <img src={img} alt={it.nombre || it.producto?.nombre || 'Producto'} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-500">Sin imagen</div>
                      );
                    })()}
                    <div className="flex-1">
                      <p className="font-medium">{it.nombre || it.producto?.nombre || it.title || 'Producto'}</p>
                      <p className="text-sm text-gray-600">Cantidad: {it.cantidad || it.quantity || 1}</p>
                      <p className="text-sm text-gray-600">Talla: {getItemSize(it)}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Color: {getItemColor(it)}</p>
                        {(() => {
                          const rawColor = getItemColor(it);
                          const cssColor = normalizeColorForStyle(rawColor === 'N/D' ? null : rawColor);
                          if (cssColor) {
                            return <span className="w-5 h-5 rounded-full" style={{ backgroundColor: cssColor, border: '1px solid #ddd' }} />;
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">PEN {Number(it.precio || it.price || it.unitPrice || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {showRawOrder && (
              <div className="mt-6 bg-gray-50 p-3 rounded text-xs overflow-auto">
                <pre className="whitespace-pre-wrap">{JSON.stringify(orderDetails, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
    
  );
}
