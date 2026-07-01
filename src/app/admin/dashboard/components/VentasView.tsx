'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { format, parseISO, eachMonthOfInterval, eachDayOfInterval, startOfYear, endOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, TrendingUp, Calendar as CalendarIcon, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Orden {
  id: number;
  total: number;
  createdAt: string;
}

const formatterSoles = (n: number) =>
  `S/. ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

function SolesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="5" y="17" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">S</text>
      <line x1="14" y1="5" x2="11" y2="19" />
    </svg>
  );
}

export default function VentasView() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaFiltro, setFechaFiltro] = useState(format(new Date(), 'yyyy-MM-dd'));
  const fechaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get<Orden[]>(`${process.env.NEXT_PUBLIC_API_URL}/ordenes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const normalized = data.map((o: any) => ({
          ...o,
          total: typeof o.total === 'string' ? parseFloat(o.total) : Number(o.total || 0),
        }));
        setOrdenes(normalized as Orden[]);
      } catch (e) {
        setError('No se pudieron cargar las ventas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalVentas = useMemo(
    () => ordenes.reduce((s, o) => s + Number(o.total || 0), 0),
    [ordenes]
  );

  const promedioPorOrden = useMemo(
    () => (ordenes.length > 0 ? totalVentas / ordenes.length : 0),
    [ordenes, totalVentas]
  );

  const ordenesDiaFiltro = useMemo(
    () => ordenes.filter((o) => format(parseISO(o.createdAt), 'yyyy-MM-dd') === fechaFiltro).length,
    [ordenes, fechaFiltro]
  );

  const ventasMes = useMemo(() => {
    const meses = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfToday(),
    }).map((d) => ({
      mes: format(d, 'MMM', { locale: es }),
      total: 0,
    }));

    ordenes.forEach((o) => {
      const date = parseISO(o.createdAt);
      const idx = date.getMonth();
      if (idx < meses.length) meses[idx].total += o.total;
    });

    return meses;
  }, [ordenes]);

  const ordenesDia = useMemo(() => {
    const dias = eachDayOfInterval({
      start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      end: endOfToday(),
    }).map((d) => ({
      dia: format(d, 'dd/MM'),
      ordenes: 0,
    }));

    ordenes.forEach((o) => {
      const date = parseISO(o.createdAt);
      const key = format(date, 'dd/MM');
      const obj = dias.find((d) => d.dia === key);
      if (obj) obj.ordenes += 1;
    });

    return dias;
  }, [ordenes]);

  const maxVentasMes = useMemo(
    () => Math.max(...ventasMes.map((m) => m.total), 1),
    [ventasMes]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 bg-red-50 px-6 py-3 rounded-lg border border-red-200">{error}</p>
      </div>
    );

  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();

    const resumen = [
      ['Métrica', 'Valor'],
      ['Total vendido', formatterSoles(totalVentas)],
      ['Órdenes totales', ordenes.length],
      ['Promedio por orden', formatterSoles(promedioPorOrden)],
      ['Órdenes en fecha', `${format(parseISO(fechaFiltro), 'dd/MM/yyyy')}: ${ordenesDiaFiltro}`],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(resumen);
    XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

    const ventas = [['Mes', 'Total']];
    ventasMes.forEach((m) => ventas.push([m.mes, m.total]));
    const ws2 = XLSX.utils.aoa_to_sheet(ventas);
    XLSX.utils.book_append_sheet(wb, ws2, 'Ventas por mes');

    const ordenes7d = [['Día', 'Órdenes']];
    ordenesDia.forEach((d) => ordenes7d.push([d.dia, d.ordenes]));
    const ws3 = XLSX.utils.aoa_to_sheet(ordenes7d);
    XLSX.utils.book_append_sheet(wb, ws3, 'Órdenes 7 días');

    const filtradas = ordenes.filter((o) => format(parseISO(o.createdAt), 'yyyy-MM-dd') === fechaFiltro);
    const detalle = [['ID', 'Total', 'Fecha']];
    filtradas.forEach((o) => detalle.push([o.id, o.total, format(parseISO(o.createdAt), 'dd/MM/yyyy HH:mm')]));
    const ws4 = XLSX.utils.aoa_to_sheet(detalle);
    XLSX.utils.book_append_sheet(wb, ws4, 'Órdenes del día');

    XLSX.writeFile(wb, `Reporte_Ventas_${fechaFiltro}.xlsx`);
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Resumen de Ventas</h2>
            <p className="text-gray-300 mt-1 text-sm">Panel de monitoreo de ingresos y órdenes</p>
          </div>
          <button onClick={exportarExcel} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total vendido" value={formatterSoles(totalVentas)} accent="from-green-500 to-emerald-600">
          <SolesIcon className="w-6 h-6" />
        </StatCard>
        <StatCard label="Órdenes totales" value={ordenes.length.toString()} accent="from-blue-500 to-indigo-600">
          <ShoppingBag className="w-6 h-6" />
        </StatCard>
        <StatCard label="Promedio por orden" value={formatterSoles(promedioPorOrden)} accent="from-purple-500 to-violet-600">
          <TrendingUp className="w-6 h-6" />
        </StatCard>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-xl shadow-lg text-white bg-gradient-to-r from-amber-500 to-orange-600"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider opacity-80">Órdenes por día</p>
              <p className="text-2xl font-extrabold">{ordenesDiaFiltro.toString()}</p>
            </div>
          </div>
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => fechaInputRef.current?.showPicker()}
              className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 text-sm font-medium"
            >
              <CalendarIcon className="w-4 h-4" />
              {format(parseISO(fechaFiltro), 'dd/MM/yyyy')}
            </button>
            <input ref={fechaInputRef} type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} className="absolute inset-0 opacity-0 pointer-events-none" />
          </div>
        </motion.article>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-black rounded-full inline-block" />
            Ventas por mes (año actual)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ventasMes} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1000]} tickFormatter={(v) => v >= 1000 ? 'S/ ' + (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k' : 'S/ ' + v} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => [formatterSoles(v), 'Total']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="total" barSize={32} radius={[4, 4, 0, 0]} fill="#1f2937" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-black rounded-full inline-block" />
            Órdenes últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ordenesDia} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Line
                dataKey="ordenes"
                stroke="#1f2937"
                strokeWidth={3}
                dot={{ r: 5, fill: '#1f2937', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#1f2937' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla resumen rápida */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Órdenes del {format(parseISO(fechaFiltro), 'dd/MM/yyyy')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordenes.filter((o) => format(parseISO(o.createdAt), 'yyyy-MM-dd') === fechaFiltro).slice(-10).reverse().map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium">#{o.id}</td>
                  <td className="px-6 py-3">{formatterSoles(o.total)}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {format(parseISO(o.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Completada
                    </span>
                  </td>
                </tr>
              ))}
              {ordenes.filter((o) => format(parseISO(o.createdAt), 'yyyy-MM-dd') === fechaFiltro).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    No hay órdenes en esta fecha
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  children,
  label,
  value,
  accent,
}: {
  children: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-5 rounded-xl shadow-lg text-white flex items-center gap-4 bg-gradient-to-r ${accent}`}
    >
      <div className="p-3 bg-white/20 rounded-full">
        {children}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
        <p className="text-2xl font-extrabold">{value}</p>
      </div>
    </motion.article>
  );
}
