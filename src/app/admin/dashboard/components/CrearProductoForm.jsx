'use client';

import { useEffect, useState } from 'react';

export default function CrearProductoForm() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const [variantes, setVariantes] = useState([
    {
      color: '',
      precio: '',
      tallas: [{ talla: '', cantidad: '' }]
    }
  ]);

  const [composicion, setComposicion] = useState('');
  const [info, setInfo] = useState('');
  const [cuidados, setCuidados] = useState('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!imagenes || imagenes.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = imagenes.map((img) => URL.createObjectURL(img));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagenes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !categoriaId ||
      variantes.some(
        (v) =>
          !v.color ||
          !v.precio ||
          Number.isNaN(Number(v.precio)) ||
          v.tallas.length === 0 ||
          v.tallas.some(
            (t) => !t.talla || !t.cantidad || Number.isNaN(Number(t.cantidad))
          )
      ) ||
      !composicion ||
      !info ||
      !cuidados
    ) {
      setMensaje('Por favor, completa todos los campos requeridos');
      return;
    }

    const variantesPayload = variantes.flatMap((v) =>
      v.tallas.map((t) => ({
        color: v.color,
        precio: Number(v.precio),
        talla: t.talla,
        cantidad: Number(t.cantidad),
      }))
    );

    const formData = new FormData();

    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoriaId', categoriaId);
    formData.append('composicion', composicion);
    formData.append('info', info);
    formData.append('cuidados', cuidados);
    formData.append('seleccionado', 'false');
    formData.append('activo', 'true');
    formData.append('variantes', JSON.stringify(variantesPayload));

    imagenes.forEach((img) => formData.append('imagen', img));

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore; server may not return JSON on error
      }

      if (!res.ok) {
        const msg = data?.error || `Error ${res.status}: ${res.statusText}`;
        setMensaje(msg);
        return;
      }

      setMensaje(`Producto "${data.nombre}" creado con éxito!`);

      setNombre('');
      setDescripcion('');
      setCategoriaId('');
      setVariantes([
        {
          color: '',
          precio: '',
          tallas: [{ talla: '', cantidad: '' }]
        }
      ]);
      setComposicion('');
      setInfo('');
      setCuidados('');
      setImagenes([]);
      setPreviews([]);

    } catch (error) {
      setMensaje('Error al conectar con el servidor');
      console.error(error);
    }
  };

  const handleColorChange = (index, value) => {
    const newVariantes = [...variantes];
    newVariantes[index].color = value;
    setVariantes(newVariantes);
  };

  const handlePrecioChange = (index, value) => {
    const newVariantes = [...variantes];
    newVariantes[index].precio = value;
    setVariantes(newVariantes);
  };

  const handleTallaChange = (colorIndex, tallaIndex, field, value) => {
    const newVariantes = [...variantes];
    newVariantes[colorIndex].tallas[tallaIndex][field] = value;
    setVariantes(newVariantes);
  };

  const agregarColor = () => {
    setVariantes([
      ...variantes,
      { color: '', tallas: [{ talla: '', precio: '', cantidad: '' }] },
    ]);
  };

  const eliminarColor = (index) => {
    setVariantes(variantes.filter((_, i) => i !== index));
  };

  const agregarTalla = (colorIndex) => {
    const newVariantes = [...variantes];
    newVariantes[colorIndex].tallas.push({ talla: '', precio: '', cantidad: '' });
    setVariantes(newVariantes);
  };

  const eliminarTalla = (colorIndex, tallaIndex) => {
    const newVariantes = [...variantes];
    newVariantes[colorIndex].tallas = newVariantes[colorIndex].tallas.filter(
      (_, i) => i !== tallaIndex
    );
    setVariantes(newVariantes);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-md mt-12 max-w-4xl mx-auto">
      <h3 className="text-3xl font-semibold mb-6 text-center text-gray-900">
        Crear Nuevo Producto
      </h3>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Columna 1 */}
        <div className="space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre *"
            required
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          />

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            rows={3}
            maxLength={255}
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          />

          <p className="text-sm text-gray-500 text-right">
            {descripcion.length}/255 caracteres
          </p>

          <textarea
            value={composicion}
            onChange={(e) => setComposicion(e.target.value)}
            placeholder="Composición"
            rows={2}
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          />

          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Información adicional"
            rows={2}
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          />
        </div>

        {/* Columna 2 - Variantes */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Variantes *
            </label>
            <div className="border rounded p-3 bg-gray-50 max-h-96 overflow-auto">
              <div className="space-y-4">
                {variantes.map((grupo, idx) => (
                  <div key={idx} className="bg-white p-3 rounded shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 block mb-1">Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={grupo.color.startsWith('#') ? grupo.color : '#000000'}
                            onChange={(e) => handleColorChange(idx, e.target.value)}
                            className="w-15 h-8 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="Ej: Negro"
                            value={grupo.color}
                            onChange={(e) => handleColorChange(idx, e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="text-xs text-gray-600 block mb-1">Precio (por color)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={grupo.precio}
                          onChange={(e) => handlePrecioChange(idx, e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm bg-gray-100"
                        />
                      </div>

                      {variantes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarColor(idx)}
                          className="px-3 py-1 text-red-600 text-xs hover:bg-red-50 rounded"
                        >
                          Eliminar color
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      {grupo.tallas.map((talla, tIdx) => (
                        <div key={tIdx} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end bg-gray-50 p-2 rounded">
                          <div>
                            <label className="text-xs text-gray-600">Talla</label>
                            <select
                              value={talla.talla}
                              onChange={(e) => handleTallaChange(idx, tIdx, 'talla', e.target.value)}
                              className="w-full px-2 py-1 border rounded text-sm bg-white"
                            >
                              <option value="">Selecciona</option>
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
                            <label className="text-xs text-gray-600">Cantidad</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={talla.cantidad}
                              onChange={(e) => handleTallaChange(idx, tIdx, 'cantidad', e.target.value)}
                              className="w-full px-2 py-1 border rounded text-sm bg-gray-100"
                            />
                          </div>
                          {grupo.tallas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => eliminarTalla(idx, tIdx)}
                              className="col-span-2 md:col-span-4 px-2 py-1 text-red-600 text-xs hover:bg-red-50 rounded"
                            >
                              Eliminar talla
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => agregarTalla(idx)}
                      className="mt-2 px-3 py-1 bg-gray-800 text-white rounded text-sm"
                    >
                      + Agregar talla
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={agregarColor}
              className="mt-2 px-3 py-1 bg-gray-800 text-white rounded text-sm"
            >
              + Agregar color
            </button>
          </div>

          <textarea
            value={cuidados}
            onChange={(e) => setCuidados(e.target.value)}
            placeholder="Cuidados"
            rows={2}
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          />
        </div>

        {/* Campos globales */}
        <div className="md:col-span-2 space-y-4">
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border bg-gray-100"
          >
            <option value="">
              Selecciona una categoría
            </option>

            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImagenes(Array.from(e.target.files))}
            className="w-full"
          />

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-32 h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            Crear Producto
          </button>

          {mensaje && (
            <p className="text-center text-sm mt-2">
              {mensaje}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
