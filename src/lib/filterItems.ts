import { COFFEE_DATA, Category, Item } from '@/data/coffee-data';

export type FilterArgs = {
  data?: Category[];
  query?: string;
  activeCategory?: string;
  activeTab?: string;
  favorites?: string[];
};

export function filterItems({ data = COFFEE_DATA, query = '', activeCategory, activeTab, favorites = [] }: FilterArgs) {
  const itemsToFilter: { item: Item; cat: Category }[] = [];

  if (activeTab === 'saved') {
    // Build a lookup map for O(1) access
    const itemMap = new Map<string, { item: Item; cat: Category }>();
    data.forEach(cat => cat.items.forEach(item => itemMap.set(item.id, { item, cat })));
    // Return in favorites order (index 0 = most recently added)
    return favorites.flatMap(id => {
      const entry = itemMap.get(id);
      return entry ? [entry] : [];
    });
  }

  if (query) {
    const q = query.toLowerCase();
    data.forEach(cat => {
      cat.items.forEach(item => {
        if (
          item.name.toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.ingredients || []).some(ing => ing.toLowerCase().includes(q))
        ) {
          itemsToFilter.push({ item, cat });
        }
      });
    });
    return itemsToFilter;
  }

  const cat = data.find(c => c.id === activeCategory);
  if (cat) return cat.items.map(item => ({ item, cat }));

  return itemsToFilter;
}

export default filterItems;
