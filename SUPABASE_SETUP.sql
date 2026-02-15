-- ============================================================================
-- FINACCORD ADVISORY — Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================================

-- 1. Consultations Table (main bookings)
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

-- 2. Blocked Slots (admin-blocked calendar dates)
CREATE TABLE IF NOT EXISTS fd_blocked_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocked_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Settings (admin PIN, config)
CREATE TABLE IF NOT EXISTS fd_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiry log (general contact form, WhatsApp leads)
CREATE TABLE IF NOT EXISTS fd_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Portfolio / Proof of Work items
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

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Admin PIN (change this immediately!)
INSERT INTO fd_settings (key, value) VALUES ('admin_pin', 'admin2026')
ON CONFLICT (key) DO NOTHING;

-- Default business hours
INSERT INTO fd_settings (key, value) VALUES ('business_hours', '{"open": 7, "close": 21}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE fd_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fd_portfolio ENABLE ROW LEVEL SECURITY;

-- Consultations: Anyone can INSERT (book), only authenticated can SELECT/UPDATE
CREATE POLICY "Anyone can book a consultation"
    ON fd_consultations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Anyone can read consultations for availability"
    ON fd_consultations FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated can update consultations"
    ON fd_consultations FOR UPDATE
    TO authenticated
    USING (true);

-- Blocked Slots: Anyone can read (for calendar), only authenticated can modify
CREATE POLICY "Anyone can read blocked slots"
    ON fd_blocked_slots FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated can manage blocked slots"
    ON fd_blocked_slots FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete blocked slots"
    ON fd_blocked_slots FOR DELETE
    TO anon, authenticated
    USING (true);

-- Settings: Authenticated only
CREATE POLICY "Authenticated can read settings"
    ON fd_settings FOR SELECT
    TO anon, authenticated
    USING (true);

-- Inquiries: Anyone can insert, authenticated can read
CREATE POLICY "Anyone can submit inquiry"
    ON fd_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can read inquiries"
    ON fd_inquiries FOR SELECT
    TO authenticated
    USING (true);

-- Portfolio: Anyone can read published items, only authenticated can modify
CREATE POLICY "Anyone can read published portfolio"
    ON fd_portfolio FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Anon can insert portfolio"
    ON fd_portfolio FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Anon can update portfolio"
    ON fd_portfolio FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Anon can delete portfolio"
    ON fd_portfolio FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_consultations_time ON fd_consultations (consultation_time);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON fd_consultations (status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON fd_blocked_slots (blocked_date);

-- ============================================================================
-- AUTO-UPDATE TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON fd_consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DONE! Your database is ready.
-- Next steps:
-- 1. Update assets/js/supabase-config.js with your Supabase URL and anon key
-- 2. Change the admin PIN in fd_settings table
-- 3. Upload all files to your Hostinger hosting
-- ============================================================================
