#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found at', envPath);
  process.exit(2);
}
const env = fs.readFileSync(envPath, 'utf8');
env.split(/\n/).forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  const idx = line.indexOf('=');
  if (idx === -1) return;
  const k = line.slice(0, idx);
  const v = line.slice(idx + 1);
  process.env[k] = v;
});

(async function main(){
  const { createClient } = require('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('MISSING NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(2);
  }

  const supabase = createClient(url, key);

  try {
    console.log('Testing connection to', url);
    // Simple request: try a basic select from `content`
    const res = await supabase.from('content').select('key').limit(1);
    if (res.error) {
      console.error('Query failed:', res.error);
      process.exit(1);
    }
    console.log('Query succeeded, rows:', res.data.length);
    process.exit(0);
  } catch (e) {
    console.error('EXCEPTION', e.message || e);
    process.exit(1);
  }
})();
