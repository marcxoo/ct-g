export type DeviceInfo = { emoji: string; type: string; os: string };

export function parseDevice(ua: string): DeviceInfo {
  if (!ua) return { emoji: '📲', type: 'Desconocido', os: '' };
  if (/iPhone/i.test(ua))    return { emoji: '📱', type: 'iPhone',  os: 'iOS'     };
  if (/iPad/i.test(ua))      return { emoji: '📱', type: 'iPad',    os: 'iPadOS'  };
  if (/Android/i.test(ua))   return { emoji: '📱', type: 'Android', os: 'Android' };
  if (/Macintosh/i.test(ua)) return { emoji: '💻', type: 'Mac',     os: 'macOS'   };
  if (/Windows/i.test(ua))   return { emoji: '💻', type: 'PC',      os: 'Windows' };
  if (/Linux/i.test(ua))     return { emoji: '💻', type: 'Linux',   os: 'Linux'   };
  return { emoji: '📲', type: 'Dispositivo', os: 'Desconocido' };
}

export function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 10)    return 'ahora mismo';
  if (diff < 60)    return `hace ${Math.floor(diff)}s`;
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

// Activo si estuvo presente en los últimos 3 minutos
export function isActiveSession(lastSeen: string): boolean {
  return (Date.now() - new Date(lastSeen).getTime()) < 3 * 60 * 1000;
}
