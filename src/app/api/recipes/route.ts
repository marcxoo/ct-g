import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getServiceSupabase } from '../../../lib/supabaseClient';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { COFFEE_DATA } from '@/data/coffee-data';

// ---------- Schema Zod ----------
const ItemSchema = z.object({
  id:          z.string().min(1),
  name:        z.string().min(1, 'El nombre es requerido'),
  price:       z.number().nonnegative().optional(),
  type:        z.enum(['recipe', 'procedure', 'info']),
  tags:        z.array(z.string()).default([]),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  steps:       z.array(z.string()).optional(),
  notes:       z.array(z.string()).optional(),
  image:       z.string().url().optional(),
});

const CategorySchema = z.object({
  id:    z.string().min(1),
  name:  z.string().min(1, 'El nombre de la categoría es requerido'),
  icon:  z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color debe ser hexadecimal (#rrggbb)'),
  items: z.array(ItemSchema),
});

const RecipesSchema = z.array(CategorySchema).min(1, 'Se necesita al menos una categoría');

// ---------- Helpers ----------
function isValidData(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

// ---------- GET ----------
export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('key', 'coffee_data')
      .single();

    if (error) throw error;
    const value = data?.value;
    if (isValidData(value)) {
      return NextResponse.json({ data: value, source: 'supabase' });
    }
    return NextResponse.json({ data: COFFEE_DATA, source: 'fallback-empty' });
  } catch {
    return NextResponse.json({ data: COFFEE_DATA, source: 'fallback-error' });
  }
}

// ---------- POST ----------
export async function POST(req: Request) {
  // Solo admin puede guardar
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  // Validación con Zod
  const parsed = RecipesSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json(
      { error: 'Datos inválidos', issues },
      { status: 400 },
    );
  }

  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('content')
      .upsert({ key: 'coffee_data', value: parsed.data });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
