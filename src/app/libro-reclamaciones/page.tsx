'use client'

import { useState } from 'react'

export default function LibroReclamacionesPage() {
  const [form, setForm] = useState({
    fecha: '',
    tipoDoc: '',
    nroDoc: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    menoNombres: '',
    menoApellidos: '',
    menoEmail: '',
    menoTelefono: '',
    menoDireccion: '',
    productoServicio: '',
    monto: '',
    descripcion: '',
    tipo: '',
    detalle: '',
    pedido: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/reclamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al enviar reclamo')
      alert('Reclamo enviado correctamente.')
      setForm({
        fecha: '', tipoDoc: '', nroDoc: '', nombres: '', apellidos: '',
        email: '', telefono: '', direccion: '', menoNombres: '', menoApellidos: '',
        menoEmail: '', menoTelefono: '', menoDireccion: '', productoServicio: '',
        monto: '', descripcion: '', tipo: '', detalle: '', pedido: '',
      })
    } catch (err) {
      console.error(err)
      alert('Error al enviar el reclamo. Intente nuevamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8 md:mt-16">
        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-black text-center pt-10 pb-2">LIBRO DE RECLAMACIONES</h1>

        {/* Banner informativo */}
        <div className="bg-gray-100 text-gray-700 text-center mx-6 md:mx-10 px-6 py-4 text-sm leading-relaxed rounded-lg border border-gray-200 mb-2">
          De acuerdo a lo establecido en el Código de Protección y Defensa del Consumidor{' '}
          <strong className="text-black">SG STUDIO EIRL</strong> con RUC <strong className="text-black">10708018771</strong> y dirección{' '}
          <strong className="text-black">Jr. Pizarro 818</strong> cuenta con un Libro de Reclamaciones a su
          disposición. Al ingresar sus datos en el Libro de Reclamaciones usted está aceptando el
          tratamiento de sus datos personales para la solución de su reclamo.
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Fecha de reclamo</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
              required
            />
          </div>

          {/* Identificación */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Información de la persona que presenta el reclamo:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                <select
                  name="tipoDoc"
                  value={form.tipoDoc}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nro. documento</label>
                <input type="text" name="nroDoc" value={form.nroDoc} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input type="text" name="nombres" value={form.nombres} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
            </div>
          </div>

          {/* Menor de edad */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              En caso de ser menor de edad, por favor ingresar los datos del padre, madre o representante.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input type="text" name="menoNombres" value={form.menoNombres} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input type="text" name="menoApellidos" value={form.menoApellidos} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input type="email" name="menoEmail" value={form.menoEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" name="menoTelefono" value={form.menoTelefono} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input type="text" name="menoDireccion" value={form.menoDireccion} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
            </div>
          </div>

          {/* Información general */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Información general:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto o servicio contratado</label>
                <input type="text" name="productoServicio" value={form.productoServicio} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto reclamado (s/)</label>
                <input type="text" name="monto" value={form.monto} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
              </div>
            </div>
          </div>

          {/* Detalle del reclamo */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Detalle del reclamo:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="queja">Queja</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detalle del reclamo</label>
              <textarea name="detalle" value={form.detalle} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pedido</label>
              <textarea name="pedido" value={form.pedido} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" required />
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-3 bg-black text-white text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors"
            >
              Enviar Reclamo
            </button>
          </div>
        </form>

        {/* Contacto */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 md:px-10 py-5 text-sm text-gray-600 text-center leading-relaxed">
          ¿Alguna duda? Escríbenos vía{' '}
          <a href="https://wa.me/51944105915" target="_blank" rel="noopener noreferrer" className="text-black font-semibold underline hover:no-underline">
            WhatsApp (+51 944 105 915)
          </a>{' '}
          o al{' '}
          <a href="https://www.instagram.com/sgstudio.pe" target="_blank" rel="noopener noreferrer" className="text-black font-semibold underline hover:no-underline">
            Instagram (@sgstudio.pe)
          </a>{' '}
          para recibir atención personalizada sobre tu compra.
        </div>
      </div>
    </div>
  )
}
