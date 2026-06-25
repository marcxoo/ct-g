// Lógica compartida por las exportaciones del manual (Word y PDF).
import { getServiceSupabase } from '@/lib/supabaseClient';
import { COFFEE_DATA, type Category, type Item } from '@/data/coffee-data';

// Datos del negocio (tomados del instructivo oficial de referencia).
export const BIZ = {
  name: 'Coffee Time',
  tagline: 'Specialty Coffee',
  responsable: 'Tnlgo. Miguel Ángel Díaz Castro',
  area: 'Personal de Sala',
  code: 'IGP-PS-CT-V1',
  address: 'Principal: Calle Andrés Bello e Ibarra   ·   Sucursal 1: Calle Guaranda y Leonidas Plaza Gutiérrez',
};

export const TYPE_LABEL: Record<Item['type'], string> = {
  recipe: 'RECETA',
  procedure: 'PROCEDIMIENTO',
  info: 'INFORMACIÓN',
};

// Carga los datos del manual desde Supabase, con respaldo al dataset local.
export async function loadManualData(): Promise<Category[]> {
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from('content')
      .select('value')
      .eq('key', 'coffee_data')
      .single();
    const value = data?.value;
    if (Array.isArray(value) && value.length > 0) return value as Category[];
  } catch {
    /* fallback abajo */
  }
  return COFFEE_DATA;
}

export function fmtPrice(p?: number): string | null {
  return typeof p === 'number' ? `$${p.toFixed(2)}` : null;
}

export function todayStr(): string {
  return new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Quita emojis/símbolos (los fonts estándar del PDF no los dibujan).
export function stripEmoji(s: string): string {
  return s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️]/gu, '').trim();
}

export function manualStats(data: Category[]) {
  return { categories: data.length, items: data.reduce((n, c) => n + c.items.length, 0) };
}

// Unidades conocidas → permiten separar "286 gr de leche" en cantidad/unidad/nombre.
const UNITS = new Set([
  'gr', 'g', 'grs', 'kg', 'ml', 'l', 'lt', 'cc', 'oz', 'onz', 'onza', 'onzas',
  'u', 'und', 'unid', 'unidad', 'unidades', 'disparo', 'disparos', 'shot', 'shots',
  'pump', 'pumps', 'cda', 'cdas', 'cdta', 'cdtas', 'taza', 'tazas', 'vaso', 'vasos',
  'scoop', 'scoops', 'bola', 'bolas', 'hoja', 'hojas', 'rodaja', 'rodajas',
  'gota', 'gotas', 'pizca', 'pizcas', 'diente', 'dientes', 'rebanada', 'rebanadas',
  'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas',
]);

export type ParsedIngredient = { name: string; qty: string; unit: string };

// Separa un ingrediente en nombre / cantidad / unidad para mostrarlo en tabla.
// Ej: "286 gr de leche" → { name: "leche", qty: "286", unit: "gr" }
//     "Agua caliente"   → { name: "Agua caliente", qty: "", unit: "" }
export function parseIngredient(raw: string): ParsedIngredient {
  const t = (raw || '').trim();
  const m = t.match(/^(\d+(?:[.,]\d+)?|\d+\/\d+|[½¼¾⅓⅔⅛⅜⅝⅞])\s*(.*)$/);
  if (!m) return { name: t, qty: '', unit: '' };
  const qty = m[1];
  let rest = m[2].trim();
  let unit = '';
  const um = rest.match(/^([A-Za-zÁÉÍÓÚáéíóúÑñ.]+)\.?\s+(.*)$/);
  if (um && UNITS.has(um[1].toLowerCase().replace(/\./g, ''))) {
    unit = um[1].replace(/\./g, '');
    rest = um[2].trim();
  }
  rest = rest.replace(/^de\s+/i, '').trim();
  return { name: rest || t, qty, unit };
}
