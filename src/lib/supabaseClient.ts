import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Singleton — anon client para reads públicos (useRecipes, etc.)
let _anon: SupabaseClient | null = null;
export function getAnonSupabase(): SupabaseClient {
  if (!_anon) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    _anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return _anon;
}

// Singleton — service role para operaciones server-side privilegiadas
let _service: SupabaseClient | null = null;
export function getServiceSupabase(): SupabaseClient {
  if (!_service) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !serviceKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL');
    }
    _service = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return _service;
}

// Backward-compat: exportar el cliente anon como default
// (usado por useRecipes / useSession para reads)
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? getAnonSupabase() : null;
export { supabase };
export default supabase;
