-- ================================================================
-- RV ACADEMY - SUPABASE DATABASE SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ================================================================

-- 1. Profiles / Students Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  pw TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  ref TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  enrolled_course TEXT DEFAULT 'c1',
  earnings NUMERIC DEFAULT 0,
  active BOOLEAN DEFAULT false,
  phone TEXT DEFAULT '',
  acc TEXT DEFAULT '',
  joined DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enrolled_course TEXT DEFAULT 'c1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS earnings NUMERIC DEFAULT 0;

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT DEFAULT 'Rs. 25,000',
  description TEXT DEFAULT '',
  details TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  drive TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Lesson Requests Table
CREATE TABLE IF NOT EXISTS public.lesson_requests (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Private Class Requests Table
CREATE TABLE IF NOT EXISTS public.private_class_requests (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  topic TEXT NOT NULL,
  pref_time TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Downloads & Resources Table (Indicators, Softwares, Templates)
CREATE TABLE IF NOT EXISTS public.downloads (
  id TEXT PRIMARY KEY,
  course_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Indicator',
  description TEXT DEFAULT '',
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Withdrawals Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  acc TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create public policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_class_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on chapters" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on lesson_requests" ON public.lesson_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on private_class_requests" ON public.private_class_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on downloads" ON public.downloads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on withdrawals" ON public.withdrawals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Initial Seed Data
INSERT INTO public.courses (id, title, price, description, details) VALUES
('c1', 'Institutional Trading Mastery (Beginner to Pro)', 'Rs. 25,000', 'Learn Market Structure, Liquidity Engineering, Order Blocks, and High-Probability SMC Execution.', 'Comprehensive 8-week curriculum covering true institutional price action, liquidity sweeps, FVG mitigation, 1% risk rules, and funded account passing strategy.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chapters (id, course_id, title, sort_order) VALUES
('ch1', 'c1', 'Chapter 1 - Market Structure & Liquidity Mechanics', 1),
('ch2', 'c1', 'Chapter 2 - Risk Architecture & Trading Psychology', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.downloads (id, course_id, title, category, description, link) VALUES
('d1', 'c1', 'RV Academy SMC Killzone & FVG Indicator (TradingView)', 'Indicator', 'Official TradingView indicator script for identifying London & NY Killzones and Fair Value Gaps automatically.', 'https://www.tradingview.com'),
('d2', 'c1', 'Institutional Trade Journal & Risk Calculator (Excel / Notion)', 'Template', 'Custom risk management calculator and trade journaling template to maintain a disciplined 1% risk rule.', 'https://drive.google.com')
ON CONFLICT (id) DO NOTHING;
