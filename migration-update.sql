-- ================================================
-- PinkLabs — Incremental Update (Run This Once)
-- Creates the 'about' table, updates team_members,
-- and sets up RLS policies + default data.
-- ================================================

-- 1. Create the about table
CREATE TABLE IF NOT EXISTS public.about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT 'A Team Passionate About Digital Craft',
  description TEXT DEFAULT '',
  stats JSONB DEFAULT '[{"value":"50+","label":"Projects"},{"value":"30+","label":"Clients"},{"value":"3+","label":"Years"}]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add new columns to team_members (safe: IF NOT EXISTS)
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';

-- 3. Enable RLS on about table
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for about table (drop if exists to be safe)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about' AND policyname = 'anon_read') THEN
    CREATE POLICY "anon_read" ON public.about FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about' AND policyname = 'auth_all') THEN
    CREATE POLICY "auth_all" ON public.about FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. Insert default about row (only if table is empty)
INSERT INTO public.about (title, description, stats)
SELECT
  'A Team Passionate About Digital Craft',
  'We combine creativity and technology to build remarkable digital experiences that help businesses grow and succeed.',
  '[{"value":"50+","label":"Projects"},{"value":"30+","label":"Clients"},{"value":"3+","label":"Years"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.about LIMIT 1);

-- 6. Create 'media' storage bucket for image uploads (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 5242880, ARRAY['image/png','image/jpeg','image/gif','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- 7. Storage RLS: Allow public reads and authenticated uploads
CREATE POLICY "public_read" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'media');
CREATE POLICY "auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');

-- Done! ✅
