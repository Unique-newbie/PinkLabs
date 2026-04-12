const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key) env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
});

const supaUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const supaKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supaUrl, supaKey);

async function seed() {
  const { error } = await supabase.from('trust_logos').insert([
    { name: 'TechVentures', sort_order: 1 },
    { name: 'GlobalScale', sort_order: 2 },
    { name: 'Nexus IT', sort_order: 3 },
    { name: 'DataFlow', sort_order: 4 },
    { name: 'CloudSync', sort_order: 5 }
  ]);
  if (error) console.error(error);
  else console.log('Successfully seeded trust_logos');
}
seed();
