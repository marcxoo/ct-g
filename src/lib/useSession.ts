'use client';
import { useEffect, useState, useCallback } from 'react';
import type { Role } from './auth';

export type ClientSession = { user: string; role: Role; sid?: string } | null;

export function useSession() {
  const [session, setSession] = useState<ClientSession>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res  = await fetch('/api/login', { cache: 'no-store' });
      const json = await res.json();
      setSession(json.session ?? null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res  = await fetch('/api/login', { cache: 'no-store' });
        const json = await res.json();
        if (active) setSession(json.session ?? null);
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/login', { method: 'DELETE' });
    window.location.href = '/login';
  }, []);

  const isAdmin = session?.role === 'admin';
  return { session, loading, isAdmin, refresh, logout };
}

export default useSession;
