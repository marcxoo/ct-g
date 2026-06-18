import Fuse from 'fuse.js';
import { Category, Item } from '@/data/coffee-data';

export type SearchEntry = { item: Item; cat: Category; text: string };

export function buildIndex(data: Category[]): SearchEntry[] {
  const idx: SearchEntry[] = [];
  data.forEach(cat => {
    cat.items.forEach(item => {
      const parts: string[] = [item.name || ''];
      if (item.description) parts.push(item.description);
      if (item.ingredients) parts.push(...item.ingredients);
      if (item.tags) parts.push(...item.tags);
      parts.push(cat.name || '');
      idx.push({ item, cat, text: parts.join(' ').toLowerCase() });
    });
  });
  return idx;
}

// Fuse instance con pesos por campo para búsqueda fuzzy
export function buildFuseIndex(index: SearchEntry[]): Fuse<SearchEntry> {
  return new Fuse(index, {
    keys: [
      { name: 'item.name',        weight: 4 },
      { name: 'item.tags',        weight: 2 },
      { name: 'item.ingredients', weight: 1.5 },
      { name: 'item.description', weight: 1 },
      { name: 'cat.name',         weight: 1 },
    ],
    threshold: 0.4,       // 0 = match exacto, 1 = todo
    minMatchCharLength: 2,
    includeScore: true,
    ignoreLocation: true,  // busca en cualquier posición del string
  });
}

export default { buildIndex, buildFuseIndex };
