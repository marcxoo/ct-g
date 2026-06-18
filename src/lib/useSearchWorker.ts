"use client";
import { useCallback, useMemo, useState } from 'react';
import { buildFuseIndex, type SearchEntry } from './searchIndex';

// Fuse.js sobre 130 ítems es sub-milisegundo: el Web Worker ya no es necesario.
// Mantiene la misma interfaz { results, search } para que page.tsx no cambie.
export function useSearchWorker(index: SearchEntry[]) {
  const [results, setResults] = useState<SearchEntry[]>([]);

  // Se recrea solo cuando la data dinámica cambia (recarga desde Supabase)
  const fuse = useMemo(() => buildFuseIndex(index), [index]);

  const search = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) { setResults([]); return; }
    setResults(fuse.search(trimmed).map(r => r.item));
  }, [fuse]);

  return { results, search };
}

export default useSearchWorker;
