'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensaje('Token inválido. Solicita un nuevo enlace.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMensaje('Token inválido. Solicita un nuevo enlace.');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setExitoso(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMensaje(data.error || 'Error al restablecer la contraseña');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-red-500 text-xl" />
        </div>
        <h2 className="font-[Beige] text-2xl text-black mb-2">Enlace inválido</h2>
        <p className="text-gray-500 text-sm mb-6">
          Este enlace no es válido o ha expirado. Solicita uno nuevo.
        </p>
        <Link
          href="/olvide-mi-contrasena"
          className="inline-block bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  if (exitoso) {
    return (
      <div className="text-center animate-fade-in-left">
        <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
        <h2 className="font-[Beige] text-2xl text-black mb-2">Contraseña actualizada</h2>
        <p className="text-gray-500 text-sm mb-6">
          Serás redirigido al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-[Beige] text-2xl text-black mb-2">Nueva contraseña</h2>
      <p className="text-gray-500 text-sm mb-6">
        Ingresa tu nueva contraseña.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
            Nueva contraseña
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
              placeholder="Mínimo 6 caracteres"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-xs text-gray-600 mb-1 uppercase tracking-wide font-medium">
            Confirmar contraseña
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black transition-all placeholder:text-gray-400"
              placeholder="Repite la contraseña"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-animated"
        >
          {loading ? 'Actualizando...' : 'Restablecer contraseña'}
        </button>
      </form>

      {mensaje && (
        <div className="mt-5 p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-600 border border-red-200 animate-fade-in-left">
          {mensaje}
        </div>
      )}
    </>
  );
}

export default function ResetearContrasenaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white pt-24">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-lg border border-gray-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6"
        >
          <FaLock className="text-xs" />
          Volver al inicio de sesión
        </Link>

        <Suspense fallback={
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto" />
          </div>
        }>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
