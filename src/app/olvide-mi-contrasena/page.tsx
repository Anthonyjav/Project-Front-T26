'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function OlvideMiContrasenaPage() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMensaje('Ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEnviado(true);
      } else {
        setMensaje(data.error || 'Error al procesar la solicitud');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white pt-24">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-lg border border-gray-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6"
        >
          <FaArrowLeft className="text-xs" />
          Volver al inicio de sesión
        </Link>

        {enviado ? (
          <div className="text-center animate-fade-in-left">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-green-600 text-xl" />
            </div>
            <h2 className="font-[Beige] text-2xl text-black mb-2">Revisa tu correo</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Si el correo <strong className="text-black">{email}</strong> está registrado,
              recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-gray-400 text-xs mt-4">Revisa también tu carpeta de spam.</p>
          </div>
        ) : (
          <>
            <h2 className="font-[Beige] text-2xl text-black mb-2">¿Olvidaste tu contraseña?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-animated"
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            {mensaje && (
              <div className="mt-5 p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-600 border border-red-200 animate-fade-in-left">
                {mensaje}
              </div>
            )}
          </>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
