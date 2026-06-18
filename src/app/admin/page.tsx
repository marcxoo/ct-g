'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Trash2, Save, Check,
  ChevronRight, ChevronDown, X, Tag, List, FileText, DollarSign, BookOpen,
} from 'lucide-react';
import type { Category, Item } from '@/data/coffee-data';
import ListEditor from '@/components/admin/ListEditor';
import ImageUpload from '@/components/admin/ImageUpload';

// ─── tipos ────────────────────────────────────────────────────────────────────
type ItemType = Item['type'];
const TYPE_OPTIONS: { value: ItemType; label: string; emoji: string }[] = [
  { value: 'recipe',    label: 'Receta',      emoji: '☕' },
  { value: 'procedure', label: 'Proceso',     emoji: '📋' },
  { value: 'info',      label: 'Información', emoji: 'ℹ️' },
];

function genId(prefix: string) {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rnd}`;
}

// ─── componente principal ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [data,        setData]        = useState<Category[]>([]);
  const [activeCatId, setActiveCatId] = useState('');
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [dirty,       setDirty]       = useState(false);
  const [toast,       setToast]       = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // vista actual: lista de ítems | editor de ítem | editor de categoría
  const [view, setView] = useState<
    { kind: 'list' } | { kind: 'item'; itemId: string } | { kind: 'cat' }
  >({ kind: 'list' });

  // sheet de categorías
  const [showCatSheet, setShowCatSheet] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── carga ──────────────────────────────────────────────────────────────────
  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch('/api/recipes', { cache: 'no-store' });
      const json = await res.json();
      const arr: Category[] = Array.isArray(json.data) ? json.data : [];
      setData(arr);
      setActiveCatId(arr[0]?.id ?? '');
      setDirty(false);
    } catch {
      showToast('err', 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  }

  function showToast(kind: 'ok' | 'err', text: string) {
    setToast({ kind, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  // ── mutadores categorías ───────────────────────────────────────────────────
  function patchCategory(catId: string, patch: Partial<Category>) {
    setData(d => d.map(c => c.id === catId ? { ...c, ...patch } : c));
    setDirty(true);
  }
  function addCategory() {
    const id  = genId('cat');
    const cat: Category = { id, name: 'Nueva categoría', icon: '📁', color: '#888888', items: [] };
    setData(d => [...d, cat]);
    setActiveCatId(id);
    setView({ kind: 'cat' });
    setShowCatSheet(false);
    setDirty(true);
  }
  function deleteCategory(catId: string) {
    if (!confirm('¿Borrar esta categoría y todas sus recetas?')) return;
    setData(d => {
      const next = d.filter(c => c.id !== catId);
      setActiveCatId(prev => prev === catId ? next[0]?.id ?? '' : prev);
      return next;
    });
    setView({ kind: 'list' });
    setDirty(true);
  }

  // ── mutadores ítems ────────────────────────────────────────────────────────
  function patchItem(catId: string, itemId: string, patch: Partial<Item>) {
    setData(d => d.map(c =>
      c.id !== catId ? c :
      { ...c, items: c.items.map(it => it.id === itemId ? { ...it, ...patch } : it) }
    ));
    setDirty(true);
  }
  function addItem(catId: string) {
    const id   = genId('item');
    const item: Item = { id, name: '', type: 'recipe', tags: [], ingredients: [], steps: [], notes: [] };
    setData(d => d.map(c => c.id === catId ? { ...c, items: [...c.items, item] } : c));
    setView({ kind: 'item', itemId: id });
    setDirty(true);
  }
  function deleteItem(catId: string, itemId: string) {
    if (!confirm('¿Borrar este ítem?')) return;
    setData(d => d.map(c => c.id !== catId ? c : { ...c, items: c.items.filter(it => it.id !== itemId) }));
    setView({ kind: 'list' });
    setDirty(true);
  }

  // ── guardar ────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true);
    try {
      const res  = await fetch('/api/recipes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast('err', json.error === 'forbidden' ? 'No autorizado' : (json.issues?.[0] ?? json.error ?? 'Error guardando'));
      } else {
        showToast('ok', 'Guardado ✓');
        setDirty(false);
      }
    } catch {
      showToast('err', 'No se pudo conectar');
    } finally {
      setSaving(false);
    }
  }

  // ── derivados ──────────────────────────────────────────────────────────────
  const activeCat  = data.find(c => c.id === activeCatId) ?? null;
  const editingItem = view.kind === 'item'
    ? activeCat?.items.find(it => it.id === view.itemId) ?? null
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER: editor de ítem (pantalla completa)
  // ─────────────────────────────────────────────────────────────────────────
  if (view.kind === 'item' && editingItem && activeCat) {
    return (
      <div className="min-h-screen bg-stone-50 pb-32" style={{ color: '#1C1917' }}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView({ kind: 'list' })}
              className="w-11 h-11 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-100 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest font-black text-stone-400">{activeCat.icon} {activeCat.name}</p>
              <h1 className="text-base font-black truncate">{editingItem.name || 'Nuevo ítem'}</h1>
            </div>
            <button
              onClick={() => deleteItem(activeCat.id, editingItem.id)}
              className="w-11 h-11 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center active:bg-red-100 shrink-0"
              aria-label="Borrar ítem"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="px-4 py-5 space-y-5 max-w-xl mx-auto">

          {/* Nombre */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4 space-y-1">
            <label className="text-[11px] uppercase tracking-widest font-black text-stone-400">Nombre</label>
            <input
              autoFocus
              value={editingItem.name}
              onChange={e => patchItem(activeCat.id, editingItem.id, { name: e.target.value })}
              placeholder="Ej: Capuccino Ideal"
              className="w-full h-14 px-4 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-lg font-bold outline-none focus:border-stone-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Tipo + Precio */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4 space-y-4">
            {/* Tipo: chips grandes */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 mb-3 block">Tipo</label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => patchItem(activeCat.id, editingItem.id, { type: t.value })}
                    className={`flex-1 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 font-bold text-xs transition-all ${
                      editingItem.type === t.value
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-100 bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 mb-2 block flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Precio <span className="font-medium normal-case tracking-normal">(opcional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={editingItem.price ?? ''}
                  onChange={e => patchItem(activeCat.id, editingItem.id, {
                    price: e.target.value === '' ? undefined : parseFloat(e.target.value),
                  })}
                  placeholder="0.00"
                  className="w-full h-14 pl-8 pr-4 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-lg font-bold outline-none focus:border-stone-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4">
            <ImageUpload
              value={editingItem.image}
              onChange={url => patchItem(activeCat.id, editingItem.id, { image: url })}
            />
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4 space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Descripción <span className="font-medium normal-case tracking-normal">(opcional)</span>
            </label>
            <textarea
              value={editingItem.description ?? ''}
              onChange={e => patchItem(activeCat.id, editingItem.id, { description: e.target.value || undefined })}
              placeholder="Descripción breve de la receta…"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-base outline-none focus:border-stone-400 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              <ListEditor
                label="Tags"
                items={editingItem.tags ?? []}
                onChange={next => patchItem(activeCat.id, editingItem.id, { tags: next })}
                placeholder="café, dulce…"
                addLabel="Agregar tag"
              />
            </div>
          </div>

          {/* Ingredientes */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <List className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <ListEditor
              label="Ingredientes"
              items={editingItem.ingredients ?? []}
              onChange={next => patchItem(activeCat.id, editingItem.id, { ingredients: next })}
              placeholder="8 gr de café"
              addLabel="Agregar ingrediente"
            />
          </div>

          {/* Pasos */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <ListEditor
              label="Pasos"
              items={editingItem.steps ?? []}
              onChange={next => patchItem(activeCat.id, editingItem.id, { steps: next })}
              placeholder="Moler el café y extraer entre 20 y 30 segundos…"
              multiline
              addLabel="Agregar paso"
            />
          </div>

          {/* Notas */}
          <div className="bg-white rounded-3xl border border-stone-100 p-4">
            <ListEditor
              label="Notas"
              items={editingItem.notes ?? []}
              onChange={next => patchItem(activeCat.id, editingItem.id, { notes: next })}
              placeholder="Servir de inmediato"
              multiline
              addLabel="Agregar nota"
            />
          </div>
        </main>

        {/* Barra flotante guardar */}
        <FloatingSave dirty={dirty} saving={saving} onSave={save} />
        <Toast toast={toast} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER: editor de categoría
  // ─────────────────────────────────────────────────────────────────────────
  if (view.kind === 'cat' && activeCat) {
    return (
      <div className="min-h-screen bg-stone-50 pb-32" style={{ color: '#1C1917' }}>
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView({ kind: 'list' })}
              className="w-11 h-11 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-100 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-base font-black">Editar categoría</h1>
            <button
              onClick={() => deleteCategory(activeCat.id)}
              className="w-11 h-11 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center active:bg-red-100 shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="px-4 py-5 space-y-4 max-w-xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-100 p-4 space-y-4">
            {/* Ícono */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Ícono (emoji)</label>
              <input
                value={activeCat.icon}
                onChange={e => patchCategory(activeCat.id, { icon: e.target.value })}
                placeholder="☕"
                className="w-24 h-16 text-center text-4xl rounded-2xl border-2 border-stone-100 bg-stone-50 outline-none focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Nombre</label>
              <input
                value={activeCat.name}
                onChange={e => patchCategory(activeCat.id, { name: e.target.value })}
                className="w-full h-14 px-4 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-900 text-lg font-bold outline-none focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Color */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-black text-stone-400 mb-2 block">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(activeCat.color) ? activeCat.color : '#888888'}
                  onChange={e => patchCategory(activeCat.id, { color: e.target.value })}
                  className="w-16 h-14 rounded-2xl border-2 border-stone-100 bg-stone-50 cursor-pointer p-1"
                />
                <span className="text-base font-mono text-stone-500">{activeCat.color}</span>
              </div>
            </div>
          </div>
        </main>

        <FloatingSave dirty={dirty} saving={saving} onSave={save} />
        <Toast toast={toast} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER: lista de ítems (vista principal)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 pb-32" style={{ color: '#1C1917' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="w-11 h-11 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-100 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black truncate">Editor del manual</h1>
            <p className="text-[11px] text-stone-400 font-bold">
              {loading ? 'Cargando…' : `${data.length} categorías · ${data.reduce((n, c) => n + c.items.length, 0)} ítems`}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4 max-w-xl mx-auto">
        {loading ? (
          <div className="py-16 text-center text-stone-300 font-bold">Cargando…</div>
        ) : (
          <>
            {/* Selector de categoría */}
            <div className="space-y-2">
              {/* Botón categoría activa */}
              <button
                onClick={() => setShowCatSheet(true)}
                className="w-full h-16 bg-white rounded-3xl border border-stone-100 flex items-center gap-4 px-4 active:bg-stone-50 transition-colors"
              >
                <span className="text-3xl">{activeCat?.icon ?? '📁'}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-black text-stone-400">Categoría activa</p>
                  <p className="font-black text-stone-900 truncate">{activeCat?.name ?? '—'}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-stone-300 shrink-0" />
              </button>

              {/* Botones rápidos de categoría */}
              <div className="flex gap-2">
                <button
                  onClick={() => activeCat && setView({ kind: 'cat' })}
                  disabled={!activeCat}
                  className="flex-1 h-11 rounded-2xl border border-stone-200 text-stone-600 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-stone-50 disabled:opacity-40"
                >
                  Editar categoría
                </button>
                <button
                  onClick={addCategory}
                  className="flex-1 h-11 rounded-2xl border border-dashed border-stone-300 text-stone-600 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-stone-50"
                >
                  <Plus className="w-4 h-4" /> Nueva
                </button>
              </div>
            </div>

            {/* Lista de ítems */}
            {activeCat && (
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] uppercase tracking-widest font-black text-stone-400">
                    Ítems ({activeCat.items.length})
                  </p>
                  <button
                    onClick={() => addItem(activeCat.id)}
                    className="h-9 px-4 rounded-2xl font-black text-sm text-white flex items-center gap-1.5 active:opacity-80"
                    style={{ background: '#144639' }}
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>

                {activeCat.items.length === 0 ? (
                  <button
                    onClick={() => addItem(activeCat.id)}
                    className="w-full py-12 rounded-3xl border-2 border-dashed border-stone-200 text-stone-400 font-bold flex flex-col items-center gap-2 active:bg-stone-50"
                  >
                    <Plus className="w-8 h-8" />
                    <span>Agregar primer ítem</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {activeCat.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setView({ kind: 'item', itemId: item.id })}
                        className="w-full bg-white rounded-3xl border border-stone-100 flex items-center gap-4 px-4 py-3.5 active:bg-stone-50 transition-colors text-left"
                      >
                        {/* Badge tipo */}
                        <span className="text-2xl shrink-0">
                          {TYPE_OPTIONS.find(t => t.value === item.type)?.emoji ?? '☕'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-stone-900 truncate">{item.name || '(sin nombre)'}</p>
                          <p className="text-xs text-stone-400 font-medium mt-0.5 flex gap-3">
                            <span>{TYPE_OPTIONS.find(t => t.value === item.type)?.label}</span>
                            {typeof item.price === 'number' && <span className="text-stone-600 font-bold">${item.price.toFixed(2)}</span>}
                            {item.ingredients && item.ingredients.length > 0 && (
                              <span>{item.ingredients.length} ingrediente{item.ingredients.length !== 1 ? 's' : ''}</span>
                            )}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {/* Sheet: selector de categoría */}
      {showCatSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowCatSheet(false)}
          />
          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl">
            {/* Handle */}
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

            <div className="flex items-center justify-between px-5 pb-3 shrink-0">
              <h2 className="font-black text-lg">Categorías</h2>
              <button
                onClick={() => setShowCatSheet(false)}
                className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 pb-6 space-y-1">
              {data.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveCatId(c.id); setShowCatSheet(false); }}
                  className={`w-full flex items-center gap-4 px-4 h-16 rounded-2xl transition-colors text-left ${
                    c.id === activeCatId
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-50 text-stone-800 active:bg-stone-100'
                  }`}
                >
                  <span className="text-2xl shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{c.name}</p>
                    <p className={`text-xs ${c.id === activeCatId ? 'text-stone-300' : 'text-stone-400'}`}>
                      {c.items.length} ítems
                    </p>
                  </div>
                  {c.id === activeCatId && <Check className="w-5 h-5 shrink-0" />}
                </button>
              ))}

              <button
                onClick={addCategory}
                className="w-full flex items-center gap-4 px-4 h-16 rounded-2xl border-2 border-dashed border-stone-200 text-stone-500 font-bold active:bg-stone-50"
              >
                <Plus className="w-6 h-6" />
                <span>Nueva categoría</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingSave dirty={dirty} saving={saving} onSave={save} />
      <Toast toast={toast} />
    </div>
  );
}

// ─── Botón flotante guardar ────────────────────────────────────────────────────
function FloatingSave({ dirty, saving, onSave }: { dirty: boolean; saving: boolean; onSave: () => void }) {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 flex justify-center">
      <button
        onClick={onSave}
        disabled={saving}
        className={`h-14 px-8 rounded-full font-black text-base flex items-center gap-3 shadow-xl transition-all ${
          dirty
            ? 'text-white scale-100 opacity-100'
            : 'bg-stone-200 text-stone-400 scale-95 opacity-70'
        } disabled:opacity-60`}
        style={dirty ? { background: '#144639' } : {}}
      >
        <Save className="w-5 h-5" />
        {saving ? 'Guardando…' : dirty ? 'Guardar cambios' : 'Todo guardado'}
      </button>
    </div>
  );
}

// ─── Toast notification ────────────────────────────────────────────────────────
function Toast({ toast }: { toast: { kind: 'ok' | 'err'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-20 left-4 right-4 z-50 flex justify-center pointer-events-none`}>
      <div className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 ${
        toast.kind === 'ok'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}>
        {toast.kind === 'ok' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        {toast.text}
      </div>
    </div>
  );
}
