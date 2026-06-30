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

const BADGE: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  'en proceso': 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
};

function Badge({ estado }: { estado: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${BADGE[estado] || 'bg-gray-100 text-gray-800'}`}>
      {estado}
    </span>
  );
}

export default function ListarReclamos() {
  const { showToast } = useToast();
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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
      if (expandedId === id) setExpandedId(null);
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

  return (
    <section className="space-y-6 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Libro de Reclamaciones</h2>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{reclamos.length} registro{reclamos.length !== 1 ? 's' : ''}</span>
          <button
            onClick={cargarReclamos}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Actualizar
          </button>
        </div>
      </div>

      {reclamos.length === 0 && (
        <p className="text-center text-gray-500 py-10">No hay reclamos registrados.</p>
      )}

      {reclamos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-400 tracking-wider">
                <th className="py-3 px-3 w-14">#</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3 hidden sm:table-cell">Documento</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 hidden md:table-cell">Fecha</th>
                <th className="py-3 px-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {reclamos.map((r) => (
                <FragmentReclamo
                  key={r.id}
                  reclamo={r}
                  isExpanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  updating={updating}
                  onCambiarEstado={handleCambiarEstado}
                  onEliminar={handleEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FragmentReclamo({
  reclamo,
  isExpanded,
  onToggle,
  updating,
  onCambiarEstado,
  onEliminar,
}: {
  reclamo: Reclamo;
  isExpanded: boolean;
  onToggle: () => void;
  updating: number | null;
  onCambiarEstado: (id: number, estado: string) => Promise<void>;
  onEliminar: (id: number) => Promise<void>;
}) {
  const fecha = new Date(reclamo.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
          isExpanded ? 'bg-gray-50' : ''
        }`}
      >
        <td className="py-3 px-3 font-mono text-gray-400 text-xs">{reclamo.id}</td>
        <td className="py-3 px-3 font-medium text-gray-900 truncate max-w-[180px]">
          {reclamo.nombres} {reclamo.apellidos}
        </td>
        <td className="py-3 px-3 text-gray-600 hidden sm:table-cell truncate max-w-[130px]">
          {reclamo.nroDoc || '-'}
        </td>
        <td className="py-3 px-3">
          <span className={`text-xs font-medium ${reclamo.tipo === 'queja' ? 'text-purple-600' : 'text-orange-600'}`}>
            {reclamo.tipo === 'queja' ? 'Queja' : 'Reclamo'}
          </span>
        </td>
        <td className="py-3 px-3"><Badge estado={reclamo.estado} /></td>
        <td className="py-3 px-3 text-gray-400 text-xs hidden md:table-cell">{fecha}</td>
        <td className="py-3 px-3 text-center">
          <span className={`inline-block transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr key={`${reclamo.id}-detail`}>
          <td colSpan={7} className="p-0">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-5 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                    Datos del cliente
                  </p>
                  <Row label="Fecha" value={reclamo.fecha} />
                  <Row label="Documento" value={reclamo.tipoDoc && reclamo.nroDoc ? `${reclamo.tipoDoc} - ${reclamo.nroDoc}` : reclamo.nroDoc || reclamo.tipoDoc} />
                  <Row label="Nombres" value={[reclamo.nombres, reclamo.apellidos].filter(Boolean).join(' ')} />
                  <Row label="Email" value={reclamo.email} />
                  <Row label="Teléfono" value={reclamo.telefono} />
                  <Row label="Dirección" value={reclamo.direccion} />

                  {(reclamo.menoNombres || reclamo.menoApellidos) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Representante (menor de edad)
                      </p>
                      <Row label="Nombres" value={[reclamo.menoNombres, reclamo.menoApellidos].filter(Boolean).join(' ')} />
                      <Row label="Email" value={reclamo.menoEmail} />
                      <Row label="Teléfono" value={reclamo.menoTelefono} />
                      <Row label="Dirección" value={reclamo.menoDireccion} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                    Detalle del reclamo
                  </p>
                  <Row label="Producto / Servicio" value={reclamo.productoServicio} />
                  <Row label="Monto" value={reclamo.monto ? `S/ ${reclamo.monto}` : '-'} />
                  <Row label="Descripción" value={reclamo.descripcion} />
                  <Row label="Detalle" value={reclamo.detalle} />
                  <Row label="Pedido" value={reclamo.pedido} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium">Estado:</label>
                  <select
                    value={reclamo.estado}
                    onChange={(e) => onCambiarEstado(reclamo.id, e.target.value)}
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
                  onClick={() => onEliminar(reclamo.id)}
                  className="px-3 py-1.5 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="text-gray-400">{label}:</span>{' '}
      <span className="text-gray-800">{value || '-'}</span>
    </p>
  );
}
