"use client";
import { useEffect, useState, useCallback, useRef } from 'react';

export function useFavorites() {
  const [list,   setList]   = useState<string[]>([]);
  const [synced, setSynced] = useState(false);
  const pendingRef = useRef<string[] | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    fetch('/api/favorites', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.item_ids) {
          setList(data.item_ids);
        }
        setSynced(true);
        // Flush any toggle that happened before sync completed
        if (pendingRef.current !== null) {
          save(pendingRef.current);
          pendingRef.current = null;
        }
      })
      .catch(() => setSynced(true));
  }, []);

  const save = useCallback((ids: string[]) => {
    fetch('/api/favorites', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ item_ids: ids }),
    }).catch(() => {});
  }, []);

  const toggle = useCallback((id: string) => {
    setList(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev];
      if (synced) {
        save(next);
      } else {
        pendingRef.current = next;
      }
      return next;
    });
  }, [synced, save]);

  return { list, toggle };
}

export default useFavorites;
