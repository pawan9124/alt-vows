-- ============================================================
-- Alt-Vows: Row Level Security Policies
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- 1. Enable RLS on both tables
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- 2. websites: owners can do everything with their own sites
CREATE POLICY "owners_all" ON websites
  FOR ALL USING (auth.uid() = owner_id);

-- 3. websites: anyone can read production sites (for guests viewing)
CREATE POLICY "public_read_production" ON websites
  FOR SELECT USING (status = 'production');

-- 4. guests: anyone can insert (RSVP — no auth required)
CREATE POLICY "anyone_can_rsvp" ON guests
  FOR INSERT WITH CHECK (true);

-- 5. guests: site owners can read their guests
CREATE POLICY "owners_read_guests" ON guests
  FOR SELECT USING (
    wedding_id IN (
      SELECT slug FROM websites WHERE owner_id = auth.uid()
    )
  );
