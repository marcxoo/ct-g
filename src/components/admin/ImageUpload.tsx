'use client';
import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';

type Props = {
  value?: string;
  onChange: (url: string | undefined) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Error al subir'); return; }
      onChange(json.url);
    } catch {
      setError('No se pudo conectar');
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-widest font-black text-stone-400">Imagen</p>

      {value ? (
        /* Vista previa con botón para eliminar */
        <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Imagen de la receta" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center active:bg-black/80"
            aria-label="Eliminar imagen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 h-8 px-3 rounded-full bg-black/60 text-white text-xs font-bold flex items-center gap-1.5 active:bg-black/80"
          >
            <Upload className="w-3.5 h-3.5" /> Cambiar
          </button>
        </div>
      ) : (
        /* Zona de drop */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          disabled={loading}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center gap-3 text-stone-400 active:bg-stone-100 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <><Loader2 className="w-8 h-8 animate-spin" /><span className="text-sm font-bold">Subiendo…</span></>
          ) : (
            <><ImageIcon className="w-8 h-8" /><span className="text-sm font-bold">Tocar para subir imagen</span><span className="text-xs">JPG, PNG, WebP · máx 8 MB</span></>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
