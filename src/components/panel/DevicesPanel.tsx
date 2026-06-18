'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { SessionRow } from '@/app/api/sessions/route';
import { relativeTime, isActiveSession } from '@/lib/deviceUtils';

export default function DevicesPanel({ currentSid }: { currentSid?: string }) {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/sessions', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json.sessions)) setSessions(json.sessions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Refrescar cada 15 segundos para que el estado activo/inactivo sea en tiempo real
  useEffect(() => {
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, [load]);

  const active   = sessions.filter(s => isActiveSession(s.last_seen));
  const inactive = sessions.filter(s => !isActiveSession(s.last_seen));

  return (
    <div className="bg-white rounded-4xl border border-stone-200 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black">Dispositivos</h3>
          <p className="text-xs text-stone-400 font-bold mt-0.5">
            {active.length} activo{active.length !== 1 ? 's' : ''} · {sessions.length} total
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="w-9 h-9 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-400 active:bg-stone-50 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && sessions.length === 0 ? (
        <p className="text-sm text-stone-400 font-bold text-center py-4">Cargando…</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-stone-400 font-bold text-center py-4">Sin sesiones registradas</p>
      ) : (
        <div className="space-y-2">
          {[...active, ...inactive].map(s => {
            const alive    = isActiveSession(s.last_seen);
            const isSelf   = s.sid === currentSid;
            const rolLabel = s.role === 'admin' ? 'Admin' : 'Empleado';

            return (
              <div
                key={s.sid}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                  alive ? 'bg-green-50/60 border-green-100' : 'bg-stone-50 border-stone-100'
                }`}
              >
                {/* Emoji dispositivo */}
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-stone-100 shrink-0">
                  {s.device_emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-stone-900 text-sm">{s.user_name}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      s.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {rolLabel}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">
                        este dispositivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                    {s.device_type}{s.device_os ? ` · ${s.device_os}` : ''} · {s.ip}
                  </p>
                </div>

                {/* Estado */}
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${alive ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`} />
                    <span className={`text-xs font-black ${alive ? 'text-green-600' : 'text-stone-400'}`}>
                      {alive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {relativeTime(s.last_seen)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
