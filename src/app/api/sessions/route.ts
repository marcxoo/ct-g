import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabaseClient';

export type SessionRow = {
  sid:          string;
  user_name:    string;
  role:         string;
  device_emoji: string;
  device_type:  string;
  device_os:    string;
  ip:           string;
  last_seen:    string;
  created_at:   string;
};

// GET → lista de sesiones activas (solo admin)
export async function GET() {
  const store   = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const supabase = getServiceSupabase();

  // Limpiar sesiones expiradas (> 13h sin actividad)
  const cutoff = new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString();
  await supabase.from('sessions').delete().lt('last_seen', cutoff);

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('last_seen', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}
