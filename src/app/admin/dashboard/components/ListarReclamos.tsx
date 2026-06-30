'use client';

import { useEffect, useState } from 'react';
import { useToast } from './ToastContext';

type Reclamo = {
  id: number;
  mensaje: string;
  estado: string;
  usuarioId: number | null;
  ordenId: number | null;
  fecha: string;
  tipoDoc: string;
  nroDoc: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  menoNombres: string;
  menoApellidos: string;
  menoEmail: string;
  menoTelefono: string;
  menoDireccion: string;
  productoServicio: string;
  monto: string;
  descripcion: string;
  tipo: string;
  detalle: string;
  pedido: string;
  createdAt: string;
};

const ESTADOS = ['pendiente', 'en proceso', 'resuelto', 'rechazado'];

const BADGE_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'en proceso': 'bg-blue-100 text-blue-800 border-blue-300',
  resuelto: 'bg-green-100 text-green-800 border-green-300',
  rechazado: 'bg-red-100 text-red-800 border-red-300',
};

function Badge({ estado: e }: { estado: string }) {
  const color = BADGE_COLORS[e] || 'bg-gray-100 text-gray-800 border-gray-300';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border capitalize ${color}`}>
      {e}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p>
      <span className="text-gray-500 font-medium">{label}:</span>{' '}
      <span className="text-gray-900">{children || '-'}</span>
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-100 pb-1 mb-2">
      {children}
    </p>
  );
}

export default function ListarReclamos() {
  const { showToast } = useToast();
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const cargarReclamos = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reclamos`)
      .then((res) => res.json())
      .then((data) => {
        const ordenados = (data as Reclamo[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReclamos(ordenados);
      })
      .catch((err) => {
        console.error('Error al cargar reclamos:', err);
        showToast('No se pudieron cargar los reclamos', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarReclamos();
  }, []);

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    setUpdating(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reclamos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado');

      setReclamos((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      );
      showToast(`Estado actualizado a "${nuevoEstado}"`);
    } catch (error) {
      console.error(error);
      showToast('No se pudo actualizar el estado', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('Eliminar este reclamo? Esta acción no se puede deshacer.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reclamos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al eliminar el reclamo');

      setReclamos((prev) => prev.filter((r) => r.id !== id));
      showToast('Reclamo eliminado correctamente');
    } catch (error) {
      console.error(error);
      showToast('No se pudo eliminar el reclamo', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Cargando reclamos...</span>
      </div>
    );
  }

  const pendientes = reclamos.filter((r) => r.estado === 'pendiente');
  const otros = reclamos.filter((r) => r.estado !== 'pendiente');

  return (
    <section className="space-y-6 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Libro de Reclamaciones</h2>
        <button
          onClick={cargarReclamos}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Actualizar
        </button>
      </div>

      {reclamos.length === 0 && (
        <p className="text-center text-gray-500 py-10">No hay reclamos registrados.</p>
      )}

      {pendientes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block animate-pulse" />
            Pendientes ({pendientes.length})
          </h3>
          <div className="grid gap-4">{pendientes.map((r) => renderCard(r))}</div>
        </div>
      )}

      {otros.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">
            Historial ({otros.length})
          </h3>
          <div className="grid gap-4">{otros.map((r) => renderCard(r))}</div>
        </div>
      )}
    </section>
  );

  function renderCard(reclamo: Reclamo) {
    return (
      <div
        key={reclamo.id}
        className="bg-white border border-gray-200 rounded-xl shadow-sm transition hover:shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              #{reclamo.id}
            </span>
            <Badge estado={reclamo.estado} />
            {reclamo.tipo === 'queja' ? (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                Queja
              </span>
            ) : (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">
                Reclamo
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {new Date(reclamo.createdAt).toLocaleDateString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          {/* Columna izquierda: Cliente */}
          <div className="space-y-1">
            <SectionTitle>Datos del cliente</SectionTitle>
            <Field label="Fecha">{reclamo.fecha}</Field>
            <Field label="Documento">
              {reclamo.tipoDoc && reclamo.nroDoc
                ? `${reclamo.tipoDoc} - ${reclamo.nroDoc}`
                : reclamo.nroDoc || reclamo.tipoDoc}
            </Field>
            <Field label="Nombres">
              {[reclamo.nombres, reclamo.apellidos].filter(Boolean).join(' ')}
            </Field>
            <Field label="Email">{reclamo.email}</Field>
            <Field label="Teléfono">{reclamo.telefono}</Field>
            <Field label="Dirección">{reclamo.direccion}</Field>

            {(reclamo.menoNombres || reclamo.menoApellidos) && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                <SectionTitle>Representante (menor de edad)</SectionTitle>
                <Field label="Nombres">
                  {[reclamo.menoNombres, reclamo.menoApellidos].filter(Boolean).join(' ')}
                </Field>
                <Field label="Email">{reclamo.menoEmail}</Field>
                <Field label="Teléfono">{reclamo.menoTelefono}</Field>
                <Field label="Dirección">{reclamo.menoDireccion}</Field>
              </div>
            )}
          </div>

          {/* Columna derecha: Detalle */}
          <div className="space-y-1">
            <SectionTitle>Detalle del reclamo</SectionTitle>
            <Field label="Producto / Servicio">{reclamo.productoServicio}</Field>
            <Field label="Monto reclamado">
              {reclamo.monto ? `S/ ${reclamo.monto}` : '-'}
            </Field>
            <Field label="Descripción">{reclamo.descripcion}</Field>
            <Field label="Detalle">{reclamo.detalle}</Field>
            <Field label="Pedido">{reclamo.pedido}</Field>
          </div>
        </div>

        {/* Footer: acciones */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Estado:</label>
            <select
              value={reclamo.estado}
              onChange={(e) => handleCambiarEstado(reclamo.id, e.target.value)}
              disabled={updating === reclamo.id}
              className={`text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-black/20 ${
                updating === reclamo.id ? 'opacity-50' : ''
              }`}
            >
              {ESTADOS.map((est) => (
                <option key={est} value={est}>
                  {est.charAt(0).toUpperCase() + est.slice(1)}
                </option>
              ))}
            </select>
            {updating === reclamo.id && (
              <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
            )}
          </div>
          <button
            onClick={() => handleEliminar(reclamo.id)}
            className="px-3 py-1.5 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    );
  }
}
