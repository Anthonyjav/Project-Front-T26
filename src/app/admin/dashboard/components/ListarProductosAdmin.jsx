'use client';

import { useEffect, useState, useRef, useMemo, memo } from 'react';

const cloudinaryThumb = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_400,h_320,c_fill/');
};

const TarjetaProducto = memo(({ producto, onEditar, onEliminar, eliminando }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col">
    <div className="w-full h-40 mb-4 overflow-hidden rounded-md bg-gray-100">
      <img
        src={
          Array.isArray(producto.imagen) && producto.imagen.length > 0
            ? cloudinaryThumb(producto.imagen[0])
            : '/placeholder.jpg'
        }
        alt="Imagen producto"
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
        {producto.nombre}
      </h3>
      <div className="flex items-center gap-3 mb-2">
        <p className="text-sm font-bold text-gray-800">S/ {Array.isArray(producto.variantes) && producto.variantes.length > 0 ? producto.variantes[0].precio : 'N/A'}</p>
        <span className={`text-xs font-medium ${(producto.activo === true || producto.activo === '1' || producto.activo === 1) ? 'text-green-600' : 'text-red-600'}`}>
          {(producto.activo === true || producto.activo === '1' || producto.activo === 1) ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <ul className="text-sm text-gray-700 space-y-1 mb-4">
        {producto.categoria?.nombre && (
          <li><strong>Categoría:</strong> {producto.categoria.nombre}</li>
        )}
        {Array.isArray(producto.variantes) && producto.variantes.length > 0 && (
          <li>
            <strong>Variantes:</strong>
            <ul className="ml-4 space-y-1">
              {producto.variantes.map((v, i) => (
                <li key={i}>{v.color} - {v.talla} - S/ {v.precio} - Cant: {v.cantidad}</li>
              ))}
            </ul>
          </li>
        )}
        {producto.seleccionado && <li><strong>Seleccionado:</strong> Sí</li>}
      </ul>
    </div>
    <div className="flex justify-center gap-4 mt-auto">
      <button
        onClick={() => onEditar(producto)}
        className="px-2 py-1 border border-black text-black hover:bg-black hover:text-white rounded text-xs w-1/2"
      >
        Editar
      </button>
      <button
        onClick={() => onEliminar(producto.id)}
        disabled={eliminando === producto.id}
        className="px-2 py-1 border border-black text-black hover:bg-black hover:text-white rounded text-xs w-1/2 disabled:opacity-50"
      >
        {eliminando === producto.id ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  </div>
));

const ModalEditar = memo(({ productoEditando, variantes, categorias, nuevaImagenes, nuevaImagenesURLs, onCambio, onVarianteChange, onAgregarVariante, onEliminarVariante, onImagenChange, onGuardar, onCerrar }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2">
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Editar Producto</h2>
        <button type="button" onClick={onCerrar} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onGuardar(); }} className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Información básica</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nombre</span>
              <input name="nombre" value={productoEditando.nombre} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Categoría</span>
              <select name="categoriaId" value={productoEditando.categoriaId || ''} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none">
                <option value="">Selecciona</option>
                {categorias.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
              </select>
            </label>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Descripción y detalles</p>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Descripción</span>
            <textarea name="descripcion" value={productoEditando.descripcion} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" rows={3} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Composición</span>
              <input name="composicion" value={productoEditando.composicion || ''} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Info</span>
              <input name="info" value={productoEditando.info || ''} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Cuidados</span>
              <input name="cuidados" value={productoEditando.cuidados || ''} onChange={onCambio} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none" />
            </label>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Imágenes</p>
          <label className="block">
            <input type="file" accept="image/*" multiple onChange={onImagenChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer" />
          </label>
          {nuevaImagenes.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {nuevaImagenes.map((file, i) => (
                <img key={i} src={nuevaImagenesURLs.current[i]} alt={`preview-${i}`} className="w-full h-24 object-cover rounded-lg border" />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Variantes</p>
            <button type="button" onClick={onAgregarVariante} className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700">+ Agregar</button>
          </div>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-72 overflow-auto">
            {variantes.map((variante, idx) => (
              <div key={idx} className="p-3 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-0.5 block">Color</label>
                    <div className="flex gap-1">
                      <input type="color" value={variante.color.startsWith('#') ? variante.color : '#000000'} onChange={(e) => onVarianteChange(idx, 'color', e.target.value)} className="w-10 h-8 border rounded cursor-pointer" />
                      <input type="text" placeholder="Ej: Negro" value={variante.color} onChange={(e) => onVarianteChange(idx, 'color', e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-0.5 block">Talla</label>
                    <select value={variante.talla} onChange={(e) => onVarianteChange(idx, 'talla', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                      <option value="">-</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="35">35</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-0.5 block">Precio</label>
                    <input type="number" step="0.01" placeholder="0.00" value={variante.precio} onChange={(e) => onVarianteChange(idx, 'precio', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-0.5 block">Stock</label>
                    <div className="flex gap-1 items-center">
                      <input type="number" placeholder="0" value={variante.cantidad} onChange={(e) => onVarianteChange(idx, 'cantidad', e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                      {variantes.length > 1 && (
                        <button type="button" onClick={() => onEliminarVariante(idx)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Estado</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="seleccionado" checked={productoEditando.seleccionado || false} onChange={onCambio} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm text-gray-700">Seleccionado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="activo" checked={!!productoEditando.activo} onChange={onCambio} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          <button type="button" onClick={onCerrar} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
));

export default function ListarProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [nuevaImagenes, setNuevaImagenes] = useState([]);
  const nuevaImagenesURLs = useRef([]);
  const [variantes, setVariantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`);
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
        if (!res.ok) throw new Error('Error al cargar categorías');
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategorias();
  }, []);

  const categoriasFiltro = useMemo(
    () => [...new Set(productos.map((p) => p.categoria?.nombre).filter(Boolean))],
    [productos]
  );

  const productosFiltrados = useMemo(
    () => productos.filter((producto) => {
      const coincideCategoria = categoriaSeleccionada
        ? producto.categoria?.nombre === categoriaSeleccionada
        : true;
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    }),
    [productos, categoriaSeleccionada, busqueda]
  );

  const totalPaginas = useMemo(
    () => Math.ceil(productosFiltrados.length / productosPorPagina),
    [productosFiltrados.length]
  );

  const productosPaginados = useMemo(
    () => productosFiltrados.slice((paginaActual - 1) * productosPorPagina, (paginaActual - 1) * productosPorPagina + productosPorPagina),
    [productosFiltrados, paginaActual]
  );

  const cambiarPagina = (nueva) => setPaginaActual(nueva);

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    setEliminando(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setEliminando(null);
    }
  };

  const abrirModalEditar = (producto) => {
    setProductoEditando({
      ...producto,
      activo: producto.activo === true || producto.activo === '1' || producto.activo === 1,
      categoriaId: producto.categoria?.id || '',
    });
    if (producto.variantes && Array.isArray(producto.variantes) && producto.variantes.length > 0) {
      setVariantes(producto.variantes.map((v) => ({
        id: v.id,
        color: v.color || '',
        talla: v.talla || '',
        precio: v.precio || '',
        cantidad: v.cantidad || '',
      })));
    } else {
      setVariantes([{ color: '', talla: '', precio: '', cantidad: '' }]);
    }
    nuevaImagenesURLs.current.forEach((url) => URL.revokeObjectURL(url));
    nuevaImagenesURLs.current = [];
    setNuevaImagenes([]);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
    setVariantes([]);
    nuevaImagenesURLs.current.forEach((url) => URL.revokeObjectURL(url));
    nuevaImagenesURLs.current = [];
    setNuevaImagenes([]);
  };

  const handleCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoEditando((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    nuevaImagenesURLs.current.forEach((url) => URL.revokeObjectURL(url));
    nuevaImagenesURLs.current = files.map((file) => URL.createObjectURL(file));
    setNuevaImagenes(files);
  };

  const handleVarianteChange = (index, field, value) => {
    setVariantes((prev) => {
      const next = prev.map((v, i) => (i === index ? { ...v, [field]: value } : v));
      return next;
    });
  };

  const agregarVariante = () => {
    setVariantes((prev) => [...prev, { color: '', talla: '', precio: '', cantidad: '' }]);
  };

  const eliminarVariante = (index) => {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    try {
      const variantesNormalizadas = (variantes || []).map((v) => ({
        ...v,
        precio: parseFloat(v.precio) || 0,
        cantidad: parseInt(v.cantidad) || 0,
      }));

      const formData = new FormData();
      formData.append('nombre', productoEditando.nombre);
      formData.append('descripcion', productoEditando.descripcion || '');
      formData.append('categoriaId', productoEditando.categoriaId || '');
      formData.append('composicion', productoEditando.composicion || '');
      formData.append('info', productoEditando.info || '');
      formData.append('cuidados', productoEditando.cuidados || '');
      formData.append('seleccionado', productoEditando.seleccionado === true ? 'true' : 'false');
      formData.append('activo', productoEditando.activo === true ? 'true' : 'false');
      formData.append('variantes', JSON.stringify(variantesNormalizadas));
      nuevaImagenes.forEach((file) => formData.append('imagen', file));
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${productoEditando.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Error al guardar el producto');
      const actualizado = await res.json();
      const productoActualizado = actualizado.producto ? { ...actualizado.producto, variantes: actualizado.variantes ?? actualizado.producto.variantes } : actualizado;
      setProductos((prev) =>
        prev.map((p) => (p.id === productoActualizado.id ? productoActualizado : p))
      );
      cerrarModal();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Gestión de Productos</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 px-2">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm font-medium">Categoría:</label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => {
              setCategoriaSeleccionada(e.target.value);
              setPaginaActual(1);
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="">Todas</option>
            {categoriasFiltro.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm font-medium">Buscar:</label>
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosPaginados.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            onEditar={abrirModalEditar}
            onEliminar={handleEliminar}
            eliminando={eliminando}
          />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => cambiarPagina(n)}
              className={`px-3 py-1 rounded border text-sm ${
                paginaActual === n
                  ? 'bg-black text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {modalAbierto && productoEditando && (
        <ModalEditar
          productoEditando={productoEditando}
          variantes={variantes}
          categorias={categorias}
          nuevaImagenes={nuevaImagenes}
          nuevaImagenesURLs={nuevaImagenesURLs}
          onCambio={handleCambio}
          onVarianteChange={handleVarianteChange}
          onAgregarVariante={agregarVariante}
          onEliminarVariante={eliminarVariante}
          onImagenChange={handleImagenChange}
          onGuardar={handleGuardar}
          onCerrar={cerrarModal}
        />
      )}
    </>
  );
}
