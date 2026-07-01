'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import ResumenDashboard from './components/ResumenDashboard';
import ListarUsuarios from './components/ListaUsuarios';
import CrearProductoForm from './components/CrearProductoForm';
import ListarProductosAdmin from './components/ListarProductosAdmin';
import CrearCategoriaForm from './components/CrearCategoriaForm';
import ListaCategorias from './components/ListaCategorias';
import VistaOrdenes from './components/VistaOrdenes';
import ListarReclamos from './components/ListarReclamos';
import VentasView from './components/VentasView';

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string[];
  seleccionado: boolean;
  activo?: boolean | number | string;
  variantes?: any[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [vista, setVista] = useState('dashboard');
  const [refreshCategorias, setRefreshCategorias] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn || role !== 'admin') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const handleCategoriaCreada = () => {
    setRefreshCategorias((prev) => prev + 1);
  };

  if (!authorized) return null;

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900 font-sans font-bold">
      <Sidebar onSelect={setVista} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto">
        {vista === 'dashboard' && <ResumenDashboard />}
        {vista === 'usuarios' && <ListarUsuarios />}
        {vista === 'productos' && <ListarProductosAdmin />}
        {vista === 'crear-producto' && (
          <div className="space-y-2">
            <CrearProductoForm onGuardado={() => setVista('productos')} />
            <button
              onClick={() => setVista('productos')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        )}
        {vista === 'categorias' && (
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <div className="bg-white p-6 rounded-xl shadow border w-full lg:w-1/3">
              <CrearCategoriaForm onCategoriaCreada={handleCategoriaCreada} />
            </div>
            <div className="bg-white rounded-xl shadow border flex-1 max-h-[450px] overflow-y-auto">
              <div className="sticky top-0 bg-white px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Lista de Categorías</h2>
              </div>
              <div className="p-4">
                <ListaCategorias key={refreshCategorias} />
              </div>
            </div>
          </div>
        )}
        {vista === 'ordenes' && <VistaOrdenes />}
        {vista === 'reclamos' && <ListarReclamos />}
        {vista === 'ventas' && <VentasView />}
      </main>
    </div>
  );
}
