'use client';
import React, { useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  addLabel?: string;
};

export default function ListEditor({ label, items, onChange, placeholder, multiline = false, addLabel = 'Agregar' }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  function update(i: number, value: string) {
    const next = items.slice();
    next[i] = value;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, '']);
    // scroll al nuevo campo tras render
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-widest font-black text-stone-400">{label}</p>

      {items.length === 0 && (
        <p className="text-sm text-stone-300 italic py-1">Sin {label.toLowerCase()} aún</p>
      )}

      <div className="space-y-2">
        {items.map((value, i) => (
          <div key={i} className="flex gap-2 items-start">
            {/* Número */}
            <span className="shrink-0 w-7 h-12 flex items-center justify-center text-xs font-black text-stone-300">
              {i + 1}
            </span>

            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-base outline-none focus:border-stone-400 focus:bg-white transition-colors resize-none"
              />
            ) : (
              <input
                value={value}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className="flex-1 h-12 px-4 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-base outline-none focus:border-stone-400 focus:bg-white transition-colors"
              />
            )}

            {/* Botón borrar */}
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 w-12 h-12 rounded-2xl bg-red-50 text-red-400 active:bg-red-100 flex items-center justify-center transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div ref={bottomRef} />

      <button
        type="button"
        onClick={add}
        className="w-full h-12 rounded-2xl border-2 border-dashed border-stone-200 text-stone-500 font-bold text-sm flex items-center justify-center gap-2 active:bg-stone-50 transition-colors"
      >
        <Plus className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );
}
