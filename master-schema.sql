-- =====================================================
-- Pink Labs — MASTER DATABASE SCHEMA (Unified)
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to initialize
-- your entire Agency CMS and Client Portal Backend.
-- =====================================================

-- ========================
-- 0. UTILITIES
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================
-- 1. SITE SETTINGS (Brand, Logo, SEO)
-- ========================

-- Ensure clean slate for content tables before recreating
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.hero_content CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.process_steps CASCADE;
DROP TABLE IF EXISTS public.company_values CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.site_stats CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 2. HERO SECTION
-- ========================
CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT DEFAULT 'Premium Software Development Agency',
  title_line1 TEXT DEFAULT 'We build digital products that',
  title_highlight TEXT DEFAULT 'drive growth',
  description TEXT DEFAULT 'Transform your ideas into reality.',
  btn_primary_text TEXT DEFAULT 'Start Your Project',
  btn_primary_link TEXT DEFAULT '/join',
  btn_secondary_text TEXT DEFAULT 'View Our Work',
  btn_secondary_link TEXT DEFAULT '#portfolio',
  hero_image_url TEXT DEFAULT '',
  floating_card1_label TEXT DEFAULT 'Successful Projects',
  floating_card1_value TEXT DEFAULT '150+',
  floating_card2_label TEXT DEFAULT 'Client Satisfaction',
  floating_card2_value TEXT DEFAULT '99%',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 3. SERVICES
-- ========================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Code', -- Lucide icon name
  features TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 4. PROJECTS (Portfolio)
-- ========================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Web Application',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 5. TESTIMONIALS
-- ========================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT DEFAULT '',
  client_company TEXT DEFAULT '',
  quote TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 5.5. TEAM MEMBERS
-- ========================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 5.6. NEW: FAQS, PROCESS, VALUES, BRANDS, STATS
-- ========================

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.process_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number TEXT NOT NULL, -- e.g. "01"
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Search',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Heart',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Activity',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 5.7. CONTACT MESSAGES (Leads)
-- ========================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 6. PROFILES (Users & Roles)
-- ========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 7. ORDERS (Project Requests)
-- ========================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  budget_range TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'discovery', 'design', 'development', 'handoff', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 8. SUPPORT TICKETS
-- ========================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- ========================

-- 1. Create a secure function to check admin status (SECURITY DEFINER bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Public Read for CMS items
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero" ON public.hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Team Members" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Process" ON public.process_steps FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Values" ON public.company_values FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Brands" ON public.brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Stats" ON public.site_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public Insert Contact" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin Full Access (Profiles check via is_admin function to avoid recursion)
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Hero" ON public.hero_content FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Services" ON public.services FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Team Members" ON public.team_members FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All FAQs" ON public.faqs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Process" ON public.process_steps FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Values" ON public.company_values FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Brands" ON public.brands FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Stats" ON public.site_stats FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Contact" ON public.contact_messages FOR ALL USING (public.is_admin());

-- Profiles Policies
DROP POLICY IF EXISTS "Users View Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
CREATE POLICY "Users View Own Profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Order Policies
DROP POLICY IF EXISTS "Clients View Own Orders" ON public.orders;
DROP POLICY IF EXISTS "Clients Insert Own Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;
CREATE POLICY "Clients View Own Orders" ON public.orders FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients Insert Own Orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (public.is_admin());

-- Ticket Policies
DROP POLICY IF EXISTS "Clients View Own Tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Clients Insert Own Tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admin All Tickets" ON public.support_tickets;
CREATE POLICY "Clients View Own Tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients Insert Own Tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Admin All Tickets" ON public.support_tickets FOR ALL USING (public.is_admin());

-- ========================
-- TRIGGERS & SEED DATA
-- ========================

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE WHEN NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN 'admin' ELSE 'client' END,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Default Hero
INSERT INTO public.hero_content (badge_text, title_line1, title_highlight, description)
VALUES ('Premium Software Development Agency', 'We build digital products that', 'drive growth', 'Transform your ideas into reality with our expert team.')
ON CONFLICT DO NOTHING;

-- Seed Default Site Settings
INSERT INTO public.site_settings (key, value)
VALUES ('brand', '{"name": "Pink Labs", "logo_url": ""}')
ON CONFLICT (key) DO NOTHING;

-- Done! ✅
