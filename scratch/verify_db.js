const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://phadgprgjyndtddytaim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYWRncHJnanluZHRkZHl0YWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjAyMDUsImV4cCI6MjA5MTQ5NjIwNX0.igaZp6GxjaCjzxATYRgahuNJBg5JKW8joPzwevWa_IY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const tables = ['services', 'projects', 'testimonials', 'team_members', 'faqs', 'process_steps', 'company_values', 'brands', 'site_stats', 'site_settings', 'hero_content'];
  for (const table of tables) {
    try {
      const { data, count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`${table}: Error - ${JSON.stringify(error)}`);
      } else {
        console.log(`${table}: ${count} rows`);
      }
    } catch (e) {
      console.log(`${table}: Exception - ${e.message}`);
    }
  }
}

check();
