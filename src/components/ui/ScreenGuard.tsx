'use client';

import { useEffect, useRef } from 'react';

export function ScreenGuard() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Deshabilitar menú contextual (click derecho)
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', blockCtx);

    // Deshabilitar arrastre de elementos
    const blockDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', blockDrag);

    // Detectar atajos de captura de pantalla y mostrar pantalla negra
    const handleKey = (e: KeyboardEvent) => {
      const isMacShot = e.metaKey && e.shiftKey && ['3', '4', '5', '6'].includes(e.key);
      const isWinShot = e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'PrintScreen');

      if (isMacShot || isWinShot) {
        e.preventDefault();
        const el = overlayRef.current;
        if (!el) return;
        el.style.opacity = '1';
        setTimeout(() => { el.style.opacity = '0'; }, 2000);
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('contextmenu', blockCtx);
      document.removeEventListener('dragstart', blockDrag);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 80ms',
      }}
    />
  );
}
