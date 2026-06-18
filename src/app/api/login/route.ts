import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE, checkCredentials, createSessionToken,
  verifySessionToken, sessionCookieOptions,
} from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { parseDevice } from '@/lib/deviceUtils';

function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'desconocida'
  );
}

// GET → devuelve la sesión actual y refresca last_seen
export async function GET(req: Request) {
  const store   = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ session: null });

  // Actualizar last_seen en segundo plano (sin bloquear la respuesta)
  if (session.sid) {
    const supabase = getServiceSupabase();
    supabase
      .from('sessions')
      .update({ last_seen: new Date().toISOString() })
      .eq('sid', session.sid)
      .then(() => {});
  }

  return NextResponse.json({ session: { user: session.user, role: session.role, sid: session.sid } });
}

// POST → login { user, pass }
export async function POST(req: Request) {
  let body: { user?: string; pass?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }); }

  const role = checkCredentials(body.user || '', body.pass || '');
  if (!role) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  const userName = (body.user || '').trim();
  const sid      = crypto.randomUUID();
  const ua       = req.headers.get('user-agent') || '';
  const device   = parseDevice(ua);
  const ip       = getIp(req);
  const now      = new Date().toISOString();

  // Registrar sesión en Supabase
  const supabase = getServiceSupabase();
  await supabase.from('sessions').upsert({
    sid,
    user_name:   userName,
    role,
    device_emoji: device.emoji,
    device_type:  device.type,
    device_os:    device.os,
    ip,
    last_seen:   now,
    created_at:  now,
  });

  const token = await createSessionToken(userName, role, sid);
  const res   = NextResponse.json({ ok: true, role });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}

// DELETE → logout
export async function DELETE(req: Request) {
  const store   = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);

  if (session?.sid) {
    const supabase = getServiceSupabase();
    await supabase.from('sessions').delete().eq('sid', session.sid);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
