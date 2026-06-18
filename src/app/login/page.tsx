'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const params  = useSearchParams();
  const [user,    setUser]    = useState('');
  const [pass,    setPass]    = useState('');
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000); // timeout 8s

    try {
      const res = await fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user, pass }),
        signal:  controller.signal,
      });
      clearTimeout(timer);

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Usuario o contraseña incorrectos');
        setLoading(false);
        return;
      }

      // Navegación completa: evita router.refresh() que bloquea 1-3s en dev
      const from = params.get('from');
      window.location.href = from && from.startsWith('/') ? from : '/';
      // No reseteamos loading — la página ya está navegando
    } catch (err: unknown) {
      clearTimeout(timer);
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      setError(isTimeout ? 'Tiempo de espera agotado, intentá de nuevo' : 'No se pudo conectar');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-linear-to-b from-[#144639] to-[#0a231c]">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/10 rounded-4xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo
            className="w-56"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <p className="text-white/50 text-sm font-bold mt-3">Inicia sesión para continuar</p>
        </div>

        <label className="block mb-4">
          <span className="text-[11px] uppercase tracking-widest font-black text-white/50">Usuario</span>
          <div className="relative mt-2">
            <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              autoFocus
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[var(--color-accent,#cab470)] transition-colors"
              placeholder="Usuario"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </label>

        <label className="block mb-6">
          <span className="text-[11px] uppercase tracking-widest font-black text-white/50">Contraseña</span>
          <div className="relative mt-2">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[var(--color-accent,#cab470)] transition-colors"
              placeholder="••••••••"
            />
          </div>
        </label>

        {error && (
          <div className="mb-4 text-sm font-bold text-red-300 bg-red-500/10 border border-red-400/20 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-13 rounded-2xl bg-[var(--color-accent,#cab470)] text-[#144639] font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
