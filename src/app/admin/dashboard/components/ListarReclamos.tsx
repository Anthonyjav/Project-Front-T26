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

export default function ListarReclamos() {
  const { showToast } = useToast();
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reclamos`)
      .then((res) => res.json())
      .then((data) => setReclamos(data))
      .catch((err) => {
        console.error('Error al cargar reclamos:', err);
        showToast('No se pudieron cargar los reclamos', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEliminar = async (id: number) => {
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
    return <p className="text-center text-gray-600">Cargando reclamos...</p>;
  }

  if (reclamos.length === 0) {
    return <p className="text-center text-gray-600">No hay reclamos registrados.</p>;
  }

  return (
    <section className="space-y-6 px-6">
      <h2 className="text-2xl font-bold text-black">Reclamos Registrados</h2>
      <ul className="space-y-4">
        {reclamos.map((reclamo) => (
          <li
            key={reclamo.id}
            className="bg-white border border-black rounded p-4 transition hover:shadow-md"
          >
            <div className="text-sm space-y-1 text-black">
              <p><strong>Reclamo ID:</strong> {reclamo.id}</p>
              <p><strong>Estado:</strong> <span className="font-medium capitalize">{reclamo.estado}</span></p>
              <p className="text-xs text-gray-500">Enviado el: {new Date(reclamo.createdAt).toLocaleString()}</p>

              <hr className="my-2 border-gray-200" />

              <p className="font-semibold text-base">Datos del cliente</p>
              <p><strong>Fecha:</strong> {reclamo.fecha || '-'}</p>
              <p><strong>Documento:</strong> {reclamo.tipoDoc} {reclamo.nroDoc ? `- ${reclamo.nroDoc}` : ''}</p>
              <p><strong>Nombres:</strong> {reclamo.nombres} {reclamo.apellidos}</p>
              <p><strong>Email:</strong> {reclamo.email}</p>
              <p><strong>Teléfono:</strong> {reclamo.telefono}</p>
              <p><strong>Dirección:</strong> {reclamo.direccion}</p>

              {(reclamo.menoNombres || reclamo.menoApellidos) && (
                <>
                  <hr className="my-2 border-gray-200" />
                  <p className="font-semibold text-base">Datos del representante (menor de edad)</p>
                  <p><strong>Nombres:</strong> {reclamo.menoNombres} {reclamo.menoApellidos}</p>
                  <p><strong>Email:</strong> {reclamo.menoEmail}</p>
                  <p><strong>Teléfono:</strong> {reclamo.menoTelefono}</p>
                  <p><strong>Dirección:</strong> {reclamo.menoDireccion}</p>
                </>
              )}

              <hr className="my-2 border-gray-200" />
              <p className="font-semibold text-base">Detalle del reclamo</p>
              <p><strong>Tipo:</strong> <span className="capitalize">{reclamo.tipo}</span></p>
              <p><strong>Producto/Servicio:</strong> {reclamo.productoServicio}</p>
              <p><strong>Monto:</strong> S/ {reclamo.monto}</p>
              <p><strong>Descripción:</strong> {reclamo.descripcion}</p>
              <p><strong>Detalle:</strong> {reclamo.detalle}</p>
              <p><strong>Pedido:</strong> {reclamo.pedido}</p>
            </div>
            <button
              onClick={() => handleEliminar(reclamo.id)}
              className="mt-3 px-4 py-1.5 rounded border border-black bg-black text-white hover:bg-white hover:text-black transition text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
