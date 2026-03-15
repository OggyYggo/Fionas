-- Simple RLS policies for testimonials table

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;

-- Simple policy: Allow all operations (for admin use)
-- This works because service role key bypasses RLS, but we need a policy for any authenticated access
CREATE POLICY "Allow all operations" ON testimonials FOR ALL USING (true);

-- Alternative: Disable RLS entirely for admin operations
-- Uncomment the line below if you want to disable RLS completely
-- ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
