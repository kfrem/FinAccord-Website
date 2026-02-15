-- ============================================================================
-- FINACCORD ADVISORY — Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================================

CREATE TABLE IF NOT EXISTS fd_consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    industry TEXT,
    timezone TEXT,
    pain_points TEXT,
    consultation_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    whatsapp_confirm BOOLEAN DEFAULT FALSE,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fd_blocked_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocked_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fd_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fd_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fd_portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'dashboard',
    category_label TEXT,
    icon TEXT DEFAULT '📊',
    image_url TEXT,
    tags TEXT,
    published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO fd_settings (key, value) VALUES ('admin_pin', 'admin2026') ON CONFLICT (key) DO NOTHING;
INSERT INTO fd_settings (key, value) VALUES ('business_hours', '{"open": 7, "close": 21}') ON CONFLICT (key) DO NOTHING;

ALTER TABLE fd_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can book" ON fd_consultations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read consultations" ON fd_consultations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth can update consultations" ON fd_consultations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can read blocked" ON fd_blocked_slots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can manage blocked" ON fd_blocked_slots FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can delete blocked" ON fd_blocked_slots FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can read settings" ON fd_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit inquiry" ON fd_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Auth can read inquiries" ON fd_inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read portfolio" ON fd_portfolio FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert portfolio" ON fd_portfolio FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update portfolio" ON fd_portfolio FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete portfolio" ON fd_portfolio FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_consultations_time ON fd_consultations (consultation_time);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON fd_consultations (status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON fd_blocked_slots (blocked_date);

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON fd_consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
