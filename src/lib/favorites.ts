export type FavoritesSubscriber = (ids: string[]) => void;

const KEY = 'coffee-favorites';
let subscribers: FavoritesSubscriber[] = [];

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {}
}

export const favorites = {
  get(): string[] {
    return readStorage();
  },
  set(ids: string[]) {
    writeStorage(ids);
    subscribers.forEach(s => s(ids));
  },
  subscribe(cb: FavoritesSubscriber) {
    subscribers.push(cb);
    // call immediately with current value
    try { cb(readStorage()); } catch {}
    return () => { subscribers = subscribers.filter(s => s !== cb); };
  }
};

export default favorites;
