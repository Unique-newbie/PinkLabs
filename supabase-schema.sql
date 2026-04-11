-- =====================================================
-- Pink Labs — Complete Supabase CMS Schema
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up
-- the entire CMS backend for the PinkLabs website.
-- =====================================================

-- ========================
-- 1. SITE SETTINGS
-- ========================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.site_settings IS 'Key-value store for all site-wide settings';

-- ========================
-- 2. HERO SECTION
-- ========================
CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT DEFAULT '',
  title_line1 TEXT DEFAULT '',
  title_highlight TEXT DEFAULT '',
  description TEXT DEFAULT '',
  btn_primary_text TEXT DEFAULT '',
  btn_primary_link TEXT DEFAULT '#work',
  btn_secondary_text TEXT DEFAULT '',
  btn_secondary_link TEXT DEFAULT '#contact',
  hero_image_url TEXT DEFAULT '',
  floating_card1_label TEXT DEFAULT '',
  floating_card1_value TEXT DEFAULT '',
  floating_card2_label TEXT DEFAULT '',
  floating_card2_value TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 3. STATS
-- ========================
CREATE TABLE IF NOT EXISTS public.stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER DEFAULT 0,
  suffix TEXT DEFAULT '+',
  label TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 4. TRUST BAR LOGOS
-- ========================
CREATE TABLE IF NOT EXISTS public.trust_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 5. SERVICES
-- ========================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon_svg TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 6. PROCESS STEPS
-- ========================
CREATE TABLE IF NOT EXISTS public.process_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number TEXT DEFAULT '',
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon_svg TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 7. PORTFOLIO PROJECTS
-- ========================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tag TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 8. TESTIMONIALS
-- ========================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT DEFAULT '',
  client_role TEXT DEFAULT '',
  client_company TEXT DEFAULT '',
  client_initials TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 9. TEAM MEMBERS
-- ========================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT '',
  role TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 10. PRICING PLANS
-- ========================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  currency TEXT DEFAULT '₹',
  price TEXT DEFAULT '',
  period TEXT DEFAULT 'starting',
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE,
  btn_text TEXT DEFAULT 'Get Started',
  btn_link TEXT DEFAULT '#contact',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 11. FAQ ITEMS
-- ========================
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT DEFAULT '',
  answer TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 12. SOCIAL LINKS
-- ========================
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT DEFAULT '',
  url TEXT DEFAULT '',
  icon_svg TEXT DEFAULT '',
  is_floating BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 13. CONTACT SUBMISSIONS
-- ========================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 14. SECTION HEADERS
-- ========================
CREATE TABLE IF NOT EXISTS public.section_headers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  tag_text TEXT DEFAULT '',
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 15. NAVBAR CONFIG
-- ========================
CREATE TABLE IF NOT EXISTS public.nav_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT DEFAULT '',
  href TEXT DEFAULT '',
  is_cta BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 16. FOOTER CONFIG
-- ========================
CREATE TABLE IF NOT EXISTS public.footer_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  links JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_columns ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon can read active content)
CREATE POLICY "anon_read" ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON public.hero_content FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.stats FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.trust_logos FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.services FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.process_steps FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.projects FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.team_members FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.pricing_plans FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.faq_items FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.social_links FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.section_headers FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.nav_links FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_read" ON public.footer_columns FOR SELECT TO anon USING (is_active = true);

-- Anon can submit contact forms
CREATE POLICY "anon_insert" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- Authenticated full access (admin)
CREATE POLICY "auth_all" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.hero_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.trust_logos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.process_steps FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.pricing_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.faq_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.section_headers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.nav_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.footer_columns FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AUTO-UPDATE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'site_settings','hero_content','stats','trust_logos','services',
      'process_steps','projects','testimonials','team_members',
      'pricing_plans','faq_items','social_links','contact_submissions',
      'section_headers','nav_links','footer_columns'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON public.%s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'media');

-- Allow authenticated uploads
CREATE POLICY "Auth upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Auth update media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');

CREATE POLICY "Auth delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- ============================================================
-- SEED: Section headers (empty, admin fills these in)
-- ============================================================
INSERT INTO public.section_headers (section_key, tag_text, title, subtitle) VALUES
  ('services', 'What We Do', 'Our Services', 'What we can build for you.'),
  ('process', 'Our Process', 'How We Work', 'Our proven development process.'),
  ('portfolio', 'Our Portfolio', 'Recent Work', 'Projects we are proud of.'),
  ('testimonials', 'Testimonials', 'Client Feedback', 'What our clients say about us.'),
  ('team', 'Our Team', 'Meet the Team', 'The people behind the work.'),
  ('pricing', 'Pricing', 'Our Plans', 'Transparent pricing for every stage.'),
  ('faq', 'FAQ', 'Common Questions', 'Answers to frequently asked questions.'),
  ('contact', 'Get In Touch', 'Contact Us', 'Let us know about your project.')
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- SEED: Default site settings
-- ============================================================
INSERT INTO public.site_settings (key, value) VALUES
  ('brand', '{"name": "Pink Labs", "tagline": "Web Development Agency", "description": "Transforming ideas into digital excellence.", "email": "", "phone": "", "location": "India"}'),
  ('footer', '{"copyright": "© 2026 Pink Labs. All rights reserved.", "built_with": "Built with 🩷 by Pink Labs"}'),
  ('seo', '{"og_title": "Pink Labs — Web Development Agency", "og_description": "Premium web development agency.", "og_image": ""}'),
  ('contact_form', '{"project_types": ["Custom Website", "E-Commerce Store", "SaaS Platform", "Dashboard / Admin Panel", "UI/UX Design", "Other"], "budget_ranges": ["₹15,000 — ₹25,000", "₹25,000 — ₹50,000", "₹50,000 — ₹1,00,000", "₹1,00,000+"]}')
ON CONFLICT (key) DO NOTHING;

-- Seed: Default nav links
INSERT INTO public.nav_links (label, href, is_cta, sort_order) VALUES
  ('Home', '#home', false, 1),
  ('Services', '#services', false, 2),
  ('Work', '#work', false, 3),
  ('Pricing', '#pricing', false, 4),
  ('Team', '#team', false, 5),
  ('FAQ', '#faq', false, 6),
  ('Contact Us', '#contact', true, 7);
