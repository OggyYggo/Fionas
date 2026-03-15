-- Fix RLS policies for testimonials table to work with service role key

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;

-- Create new policies that work with service role key and authenticated admin users

-- Policy: Service role can do everything (bypasses RLS)
CREATE POLICY "Service role full access" ON testimonials
    FOR ALL USING (
        -- Service role key bypasses RLS automatically, but we add this for clarity
        current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
        OR
        -- Also allow authenticated admin users
        auth.role() = 'authenticated' AND 
        auth.jwt()->>'role' = 'admin'
    );

-- Policy: Public can view approved testimonials (for frontend display)
CREATE POLICY "Public can view approved testimonials" ON testimonials
    FOR SELECT USING (status = 'approved');

-- Alternative simpler approach: Allow service role to bypass RLS entirely
-- This is often used for admin operations
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- Then re-enable with service role bypass
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to bypass RLS
CREATE POLICY "Allow service role operations" ON testimonials
    FOR ALL USING (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role')
    WITH CHECK (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role');

-- Public read policy for approved testimonials
CREATE POLICY "Public read approved testimonials" ON testimonials
    FOR SELECT USING (status = 'approved');
