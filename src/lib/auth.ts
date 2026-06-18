// Login simple basado en cookie firmada (HMAC-SHA256).
// Usa Web Crypto (globalThis.crypto.subtle) => funciona en runtime node y edge.

export type Role = 'admin' | 'employee';
export const SESSION_COOKIE = 'ct_session';
const MAX_AGE = 60 * 60 * 12; // 12h en segundos

export type Session = { user: string; role: Role; exp: number; sid?: string };

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('Missing AUTH_SECRET environment variable');
  return s;
}

async function hmac(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

// Comparación en tiempo constante para evitar timing attacks.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(user: string, role: Role, sid?: string): Promise<string> {
  const exp = Math.floor(nowSeconds()) + MAX_AGE;
  const payload: Session = { user, role, exp, sid };
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = await hmac(body);
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body))) as Session;
    if (!payload.exp || payload.exp < nowSeconds()) return null;
    if (payload.role !== 'admin' && payload.role !== 'employee') return null;
    return payload;
  } catch {
    return null;
  }
}

// Date.now puede no estar disponible en algunos contextos restringidos; fallback seguro.
function nowSeconds(): number {
  return Date.now() / 1000;
}

// Verifica usuario/contraseña contra las variables de entorno.
export function checkCredentials(user: string, pass: string): Role | null {
  const u = (user || '').trim();
  if (process.env.ADMIN_USER && u === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return 'admin';
  }
  if (process.env.EMPLOYEE_USER && u === process.env.EMPLOYEE_USER && pass === process.env.EMPLOYEE_PASS) {
    return 'employee';
  }
  return null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === 'production',
};
