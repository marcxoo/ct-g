'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { COFFEE_DATA, Category } from '@/data/coffee-data';

// Cliente Supabase solo para el browser (anon key pública).
// Se instancia una sola vez a nivel módulo para compartir el canal de Realtime.
const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const sb = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

export function useRecipes() {
  const [data,    setData]    = useState<Category[]>(COFFEE_DATA);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<NonNullable<typeof sb>['channel']> | null>(null);

  // Carga inicial desde /api/recipes (que usa service_role y tiene fallback estático)
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/recipes', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        setData(json.data as Category[]);
      }
    } catch {
      // mantiene el fallback estático
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();

    if (!sb) return;

    // Suscripción Realtime: cuando el admin guarda en Supabase, todos los
    // clientes conectados reciben el nuevo valor en < 1 segundo sin recargar.
    const channel = sb
      .channel('coffee-data-changes')
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'content',
          filter: 'key=eq.coffee_data',
        },
        (payload: { new: { value: unknown } }) => {
          const value = payload.new?.value;
          if (Array.isArray(value) && value.length > 0) {
            setData(value as Category[]);
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [reload]);

  return { data, setData, loading, reload };
}

export default useRecipes;
