'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !password) {
      setMensaje('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data?.error || 'Error al registrar el usuario');
      } else {
        setMensaje('Registro exitoso ✅');

        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          router.push('/login');
        }, 500);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setMensaje('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white pt-24">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="font-[Beige] text-3xl text-black mb-2 tracking-wide">
            Crear cuenta
          </h2>
          <p className="text-gray-500 text-sm">
            Únete a SG Studio y descubre nuestra colección
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
                Nombre
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  id="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
            <div>
              <label htmlFor="apellido" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
                Apellido
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
                  placeholder="Apellido"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
              Correo electrónico
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
              Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-animated"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {mensaje && (
          <div className={`mt-5 p-3 rounded-lg text-center text-sm font-medium animate-fade-in-left ${
            mensaje.includes('exitoso')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {mensaje}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
