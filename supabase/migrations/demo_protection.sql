-- Demo Protection Migration
-- Run this SQL in Supabase SQL Editor
-- Adds the site_id column and updates RLS policies

-- 1. Add site_id column to websites table
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS site_id VARCHAR(8) UNIQUE;

-- 2. Backfill existing rows with random 4-char IDs
UPDATE websites
SET site_id = substr(md5(random()::text), 1, 4)
WHERE site_id IS NULL;

-- 3. Make site_id NOT NULL after backfill
ALTER TABLE websites ALTER COLUMN site_id SET NOT NULL;

-- 4. Create index for fast lookups by site_id
CREATE INDEX IF NOT EXISTS idx_websites_site_id ON websites(site_id);

-- 5. Update RLS SELECT policy for demo protection
-- Drop existing select policy first
DROP POLICY IF EXISTS "Allow public read for production sites" ON websites;
DROP POLICY IF EXISTS "Public can view production sites" ON websites;
DROP POLICY IF EXISTS "Owners can view own sites" ON websites;

-- Create new policies:
-- a) Anyone can read production sites (public wedding invitations)
CREATE POLICY "Public can view production sites" ON websites
    FOR SELECT
    USING (status = 'production');

-- b) Owners can always read their own sites (any status)
CREATE POLICY "Owners can view own sites" ON websites
    FOR SELECT
    USING (owner_id = auth.uid());

-- Verify
SELECT site_id, slug, status FROM websites LIMIT 10;
