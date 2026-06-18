'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, Settings, Home, Coffee, Heart, User, ChevronLeft, X, Share2, Check, ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COFFEE_DATA, Category, Item } from '@/data/coffee-data';
import { cn } from '@/lib/utils';
import filterItems from '@/lib/filterItems';
import useFavorites from '@/lib/useFavorites';
import useRecipes from '@/lib/useRecipes';
import { useDebounce } from '@/lib/useDebounce';
import { buildIndex, SearchEntry } from '@/lib/searchIndex';
import useSearchWorker from '@/lib/useSearchWorker';
import useSession from '@/lib/useSession';
import { Logo } from '@/components/ui/Logo';
import DevicesPanel from '@/components/panel/DevicesPanel';

export default function App() {
  const { data, setData } = useRecipes();
  const [activeCategory, setActiveCategory] = useState<string>(COFFEE_DATA[0].id);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedItem,   setSelectedItem]   = useState<({ item: Item; cat: Category }) | null>(null);
  const [activeTab,      setActiveTab]      = useState('home');
  const fav = useFavorites();
  const { session, isAdmin, logout } = useSession();

  const toggleFavorite = (itemId: string) => fav.toggle(itemId);
  const index = useMemo(() => buildIndex(data), [data]);

  useEffect(() => {
    if (data.length > 0 && !data.some(c => c.id === activeCategory)) {
      setActiveCategory(data[0].id);
    }
  }, [data, activeCategory]);

  const debouncedQuery = useDebounce(searchQuery, 150);
  const { results: workerResults, search: workerSearch } = useSearchWorker(index);

  useEffect(() => {
    if (debouncedQuery) workerSearch(debouncedQuery);
  }, [debouncedQuery, workerSearch]);

  const filteredItems = useMemo(() => {
    if (debouncedQuery) {
      return workerResults.map((r: SearchEntry) => ({ item: r.item, cat: r.cat }));
    }
    return filterItems({ data, query: '', activeCategory, activeTab, favorites: fav.list });
  }, [debouncedQuery, workerResults, activeCategory, activeTab, fav.list, data]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedItem(null); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      window.history.pushState(null, '', `?item=${selectedItem.item.id}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  }, [selectedItem]);

  const urlItemLoaded = useRef(false);
  useEffect(() => {
    if (urlItemLoaded.current || data.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('item');
    if (!itemId) return;
    for (const cat of data) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) { setSelectedItem({ item: found, cat }); urlItemLoaded.current = true; break; }
    }
  }, [data]);

  const [shared,         setShared]         = useState(false);
  const [showDotMenu,    setShowDotMenu]    = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef  = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll container ref — scroll is internal to this div, not window
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToTop = useCallback((smooth = false) => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  const openSearch = () => {
    scrollToTop();
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  // Blur keyboard before opening detail modal so it never overlaps it
  const openDetail = (item: Item, cat: Category) => {
    searchInputRef.current?.blur();
    setSelectedItem({ item, cat });
  };

  async function handleImageUpload(file: File) {
    if (!selectedItem) return;
    setUploadingImage(true);
    setShowDotMenu(false);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || !json.url) return;
      const url = json.url as string;
      const newData = data.map(c => ({
        ...c,
        items: c.items.map(it => it.id === selectedItem.item.id ? { ...it, image: url } : it),
      }));
      setData(newData);
      setSelectedItem(prev => prev ? { ...prev, item: { ...prev.item, image: url } } : null);
      await fetch('/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleRemoveImage() {
    if (!selectedItem) return;
    setShowDotMenu(false);
    const newData = data.map(c => ({
      ...c,
      items: c.items.map(it => {
        if (it.id !== selectedItem.item.id) return it;
        const { image: _, ...rest } = it;
        return rest;
      }),
    }));
    setData(newData);
    setSelectedItem(prev => prev ? { ...prev, item: { ...prev.item, image: undefined } } : null);
    await fetch('/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
  }

  const handleShare = async () => {
    if (!selectedItem) return;
    const url = `${window.location.origin}${window.location.pathname}?item=${selectedItem.item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: selectedItem.item.name, text: `Receta: ${selectedItem.item.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch { /* cancelled */ }
  };

  return (
    /*
      Shell fijo: position:fixed + inset:0 ancla el layout al layout-viewport.
      El teclado iOS solo encoge el visual-viewport — el shell nunca se redimensiona.
      Todo queda exactamente en su lugar mientras el teclado está activo o al cerrarlo.
      El scroll es interno (scrollAreaRef), no del body.
    */
    <div
      className="fixed inset-0 flex flex-col font-sans antialiased selection:bg-amber-100"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--text-default)' }}
    >

      {/* ── Header (shrink-0 — nunca se encoge) ─────────────────────────── */}
      <header
        className="shrink-0 z-40 px-5 pb-3 bg-white/90 backdrop-blur-xl border-b border-stone-100"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 28px), 28px)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <Logo className="w-32 h-auto" />
          <button
            onClick={() => { setActiveTab('admin'); setSearchQuery(''); }}
            className={cn(
              "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-95",
              activeTab === 'admin'
                ? "bg-[#144639] border-[#144639] text-white"
                : "bg-white border-stone-200 text-stone-500"
            )}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Search — dentro del header fijo, siempre visible sin necesitar scroll */}
        {activeTab !== 'admin' && (
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                enterKeyHint="search"
                placeholder="Recetas, ingredientes..."
                className="w-full h-11 pl-10 pr-9 bg-stone-100 rounded-2xl text-[15px] font-medium outline-none placeholder:text-stone-400 text-stone-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-300 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                </button>
              )}
            </div>
            {searchQuery && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearSearch}
                className="text-[#144639] font-semibold text-[15px] whitespace-nowrap shrink-0 active:opacity-60"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Área scrollable (flex-1) ─────────────────────────────────────── */}
      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
      >
        {/* Categorías */}
        {!searchQuery && activeTab !== 'saved' && activeTab !== 'admin' && (
          <div className="flex gap-4 overflow-x-auto px-6 py-5 scrollbar-hide snap-x snap-mandatory overscroll-x-contain">
            {data.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); scrollToTop(true); }}
                className={cn(
                  "relative flex flex-col items-center gap-2.5 min-w-[88px] p-3 rounded-2xl transition-all duration-300 shrink-0 border snap-center",
                  activeCategory === cat.id
                    ? "surface-card cat-selected"
                    : "bg-white/50 border-stone-100 cat-dimmed active:scale-95 shadow-sm"
                )}
              >
                <span className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xl">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight whitespace-nowrap cat-label">{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Lista */}
        <main className="px-6 mt-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-stone-900">
              {activeTab === 'saved'  ? 'Favoritos' :
               activeTab === 'admin'  ? 'Configuración' :
               activeTab === 'manual' ? 'Recetas' :
               searchQuery ? 'Resultados' :
               data.find(c => c.id === activeCategory)?.name}
            </h2>
            {activeTab !== 'admin' && (
              <span className="text-stone-400 font-bold text-xs tabular-nums">{filteredItems.length}</span>
            )}
          </div>

          {activeTab === 'admin' ? (
            <div className="space-y-6 pb-8">
              <div className="bg-white p-8 rounded-4xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-black text-stone-400">Sesión</p>
                    <h3 className="text-xl font-black">{session?.user ?? '—'}</h3>
                  </div>
                </div>
                <button onClick={logout} className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                  Cerrar sesión
                </button>
              </div>

              {isAdmin ? (
                <div className="bg-white p-8 rounded-4xl border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-black mb-4">Administración</h3>
                  <p className="text-stone-500 font-bold mb-6">Gestiona las recetas y configuraciones del manual desde aquí.</p>
                  <a href="/admin" className="block text-center w-full py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-95 transition-colors btn-primary">Abrir Editor</a>
                </div>
              ) : (
                <div className="bg-stone-50 p-8 rounded-4xl border border-stone-200">
                  <h3 className="text-xl font-black text-stone-700 mb-2">Solo lectura</h3>
                  <p className="text-stone-500 font-bold">Tu perfil de empleado permite consultar el manual, pero no editar recetas.</p>
                </div>
              )}

              <div className="bg-amber-50 p-8 rounded-4xl border border-amber-100">
                <h3 className="text-xl font-black text-amber-900 mb-2">Estado del Sistema</h3>
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />V2.0.0
                </div>
              </div>

              {isAdmin && <DevicesPanel currentSid={session?.sid} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-6">
              {filteredItems.length > 0 ? (
                filteredItems.map(({ item, cat }) => (
                  <div
                    key={item.id}
                    onClick={() => openDetail(item, cat)}
                    className="group bg-white px-5 py-5 border border-stone-100 transition-all duration-200 active:scale-[0.97] active:opacity-80 active:bg-stone-50 cursor-pointer flex items-center gap-4 overflow-hidden rounded-3xl shadow-sm"
                  >
                    <div className="w-18 h-18 rounded-2xl bg-stone-100 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                      {item.image
                        /* eslint-disable-next-line @next/next/no-img-element */
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                        {item.type === 'recipe' ? 'Receta' : item.type === 'procedure' ? 'Proceso' : 'Info'}
                      </span>
                      <h3 className="text-[19px] font-bold text-stone-900 line-clamp-2 leading-[1.2] mt-0.5 mb-1.5">{item.name}</h3>
                      {item.price && <span className="text-sm font-semibold text-stone-400">$ {item.price.toFixed(2)}</span>}
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-75", fav.list.includes(item.id) ? "text-red-400" : "text-stone-200 hover:text-red-300")}
                      >
                        <Heart className={cn("w-5 h-5", fav.list.includes(item.id) && "fill-current")} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 flex flex-col items-center">
                  {activeTab === 'saved' ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-5"><Heart className="w-8 h-8 text-stone-200" /></div>
                      <p className="text-xl font-black text-stone-300">Sin favoritos aún</p>
                      <p className="text-stone-300 text-sm mt-1 font-medium">Toca el corazón en cualquier receta</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-5"><Search className="w-8 h-8 text-stone-200" /></div>
                      <p className="text-xl font-black text-stone-300">Sin resultados</p>
                      <p className="text-stone-300 text-sm mt-1 font-medium">Intenta con otro término</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Nav (shrink-0 — parte del flex column, nunca se mueve) ──────── */}
      <div
        className="shrink-0 flex justify-center px-5 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)' }}
      >
        <nav className="w-full max-w-[400px] h-[68px] bg-[#EBE8E1] rounded-[34px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between px-2">
          {([
            { id: 'home',   icon: Home,   label: 'Inicio',    action: () => { setActiveTab('home');   setActiveCategory(data[0]?.id ?? ''); setSearchQuery(''); setSelectedItem(null); scrollToTop(true); } },
            { id: 'manual', icon: Coffee, label: 'Recetas',   action: () => { const c = data.find(cat => cat.items.some(i => i.type === 'recipe')); setActiveTab('manual'); setActiveCategory(c?.id ?? data[0]?.id ?? ''); setSearchQuery(''); setSelectedItem(null); scrollToTop(true); } },
            { id: 'search', icon: Search, label: 'Buscar',    action: openSearch },
            { id: 'saved',  icon: Heart,  label: 'Guardados', action: () => { setActiveTab('saved');  setSearchQuery(''); setSelectedItem(null); scrollToTop(); } },
            { id: 'admin',  icon: User,   label: 'Panel',     action: () => { setActiveTab('admin');  setSearchQuery(''); setSelectedItem(null); scrollToTop(); } },
          ] as const).map((btn) => (
            <button
              key={btn.id}
              onClick={btn.action}
              className={cn(
                "apple-nav-btn",
                btn.id === 'search' && searchQuery ? "apple-nav-btn--active" :
                btn.id !== 'search' && activeTab === btn.id ? "apple-nav-btn--active" : ""
              )}
            >
              <btn.icon className="w-[22px] h-[22px] mb-0.5" />
              <span className="text-[9px]">{btn.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Modal de Detalle ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.7 }}
            className="fixed inset-0 z-60 flex flex-col overflow-hidden bg-linear-to-b from-[#144639] to-[#0a231c]"
          >
            {/* Barra superior fija dentro del modal */}
            <div
              className="shrink-0 flex items-center justify-between px-5 pb-3 z-10"
              style={{ paddingTop: 'max(env(safe-area-inset-top, 48px), 48px)' }}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 bg-white/10 border border-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <ChevronLeft className="w-6 h-6 mr-0.5" strokeWidth={2.5} />
              </button>
              <div className="w-10 h-1 bg-white/20 rounded-full" />
              <div className="relative">
                <button
                  onClick={() => setShowDotMenu(v => !v)}
                  className="w-10 h-10 bg-white/10 border border-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  {uploadingImage
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <div className="flex gap-1"><span className="w-1 h-1 rounded-full bg-white" /><span className="w-1 h-1 rounded-full bg-white" /><span className="w-1 h-1 rounded-full bg-white" /></div>}
                </button>
                {showDotMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDotMenu(false)} />
                    <div className="absolute right-0 top-12 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden min-w-52 border border-white/20">
                      <button onClick={() => imageInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-4 text-stone-800 font-bold text-sm active:bg-stone-100 transition-colors">
                        <ImageIcon className="w-5 h-5 text-stone-500 shrink-0" />
                        <span>{selectedItem.item.image ? 'Cambiar imagen' : 'Agregar imagen'}</span>
                      </button>
                      {selectedItem.item.image && (
                        <button onClick={handleRemoveImage} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold text-sm active:bg-red-50 transition-colors border-t border-stone-100">
                          <Trash2 className="w-5 h-5 shrink-0" /><span>Quitar imagen</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />
              </div>
            </div>

            {/* Contenido scrollable del modal */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Hero */}
              <div className="relative h-[55vh] w-full flex items-center justify-center overflow-hidden">
                {selectedItem.item.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedItem.item.image} alt={selectedItem.item.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a231c] via-[#144639]/60 to-transparent" />
                  </>
                ) : (
                  <>
                    <motion.div initial={{ scale: 1.2, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 150, delay: 0.1 }}>
                      <span className="text-[200px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">{selectedItem.cat.icon}</span>
                    </motion.div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a231c] via-[#144639]/40 to-transparent" />
                  </>
                )}
              </div>

              <div className="px-6 relative -mt-32 pb-[max(env(safe-area-inset-bottom),24px)]">
                <h1 className="text-[2.6rem] font-bold leading-[1.1] text-white mb-3">{selectedItem.item.name}</h1>
                <p className="text-(--color-accent) font-bold text-[15px] mb-8">{selectedItem.cat.name} • Coffee Time</p>

                <div className="flex items-center divide-x divide-white/10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl py-4 mb-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                  {selectedItem.item.price && (
                    <div className="flex-1 px-4">
                      <p className="text-[10px] text-white/50 mb-1 font-black uppercase tracking-widest">Precio</p>
                      <p className="text-xl font-black text-white tracking-wide">${selectedItem.item.price.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex-1 px-4">
                    <p className="text-[10px] text-white/50 mb-1 font-black uppercase tracking-widest">Tipo</p>
                    <p className="text-xl font-black text-(--color-accent) tracking-wide capitalize">
                      {selectedItem.item.type === 'recipe' ? 'Receta' : selectedItem.item.type === 'procedure' ? 'Proceso' : selectedItem.item.type}
                    </p>
                  </div>
                </div>

                <div className={cn("grid gap-3 mb-12", isAdmin ? "grid-cols-2" : "grid-cols-1")}>
                  <button
                    onClick={() => toggleFavorite(selectedItem.item.id)}
                    className={cn("flex items-center justify-center gap-2.5 h-14 rounded-[20px] text-[15px] font-bold transition-all border shadow-sm active:scale-95",
                      fav.list.includes(selectedItem.item.id) ? "bg-(--color-accent) text-[#144639] border-(--color-accent)" : "bg-white/10 text-white border-white/10 hover:bg-white/20")}
                  >
                    <Heart className={cn("w-5 h-5", fav.list.includes(selectedItem.item.id) && "fill-current")} />
                    <span>{fav.list.includes(selectedItem.item.id) ? "Guardado" : "Guardar"}</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleShare}
                      className={cn("flex items-center justify-center gap-2.5 h-14 rounded-[20px] text-[15px] font-bold transition-all border shadow-sm active:scale-95",
                        shared ? "bg-green-500/80 text-white border-green-400/50" : "bg-white/10 text-white border-white/10 hover:bg-white/20")}
                    >
                      {shared ? <><Check className="w-5 h-5" /><span>¡Copiado!</span></> : <><Share2 className="w-5 h-5" /><span>Compartir</span></>}
                    </button>
                  )}
                </div>

                <div className="space-y-12 pb-32">
                  {selectedItem.item.ingredients && selectedItem.item.ingredients.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6">Ingredientes</h3>
                      <div className="space-y-4">
                        {selectedItem.item.ingredients.map((ing, i) => (
                          <div key={i} className="flex gap-4 items-center pb-4 border-b border-white/10 last:border-0 text-white/90 text-lg font-medium">
                            <span className="w-2 h-2 rounded-full bg-(--color-accent) shrink-0" />{ing}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {selectedItem.item.steps && selectedItem.item.steps.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6">Instrucciones</h3>
                      <div className="space-y-8">
                        {selectedItem.item.steps.map((step, k) => (
                          <div key={k} className="flex gap-5 items-start text-lg font-medium text-white/80 leading-relaxed">
                            <span className="font-black text-(--color-accent) min-w-[1ch] mt-0.5 shrink-0 text-xl">{k + 1}.</span>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {selectedItem.item.notes && selectedItem.item.notes.length > 0 && (
                    <section className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                      <h3 className="text-lg font-bold text-white mb-3">Notas Importantes</h3>
                      <div className="space-y-3">
                        {selectedItem.item.notes.map((note, idx) => (
                          <p key={idx} className="text-white/70 text-[17px] leading-relaxed font-medium">{note}</p>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
