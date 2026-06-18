import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabaseClient';

async function getUser(): Promise<string | null> {
  const store  = await cookies();
  const token  = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.user ?? null;
}

// GET → returns favorites for the logged-in user
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from('favorites')
    .select('item_ids')
    .eq('user_name', user)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item_ids: data?.item_ids ?? [] });
}

// POST → saves favorites for the logged-in user
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { item_ids } = await req.json() as { item_ids: string[] };
  if (!Array.isArray(item_ids)) {
    return NextResponse.json({ error: 'item_ids must be an array' }, { status: 400 });
  }

  const sb = getServiceSupabase();
  const { error } = await sb
    .from('favorites')
    .upsert({ user_name: user, item_ids }, { onConflict: 'user_name' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
