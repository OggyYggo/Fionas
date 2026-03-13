-- Fix admin access for custom tours submissions
-- Run this in Supabase SQL Editor

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public insert" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Service role full access" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON custom_tour_submissions;

-- Disable RLS temporarily
ALTER TABLE custom_tour_submissions DISABLE ROW LEVEL SECURITY;

-- Grant permissions to service role (for admin access)
GRANT ALL ON custom_tour_submissions TO service_role;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT ON custom_tour_submissions TO authenticated;

-- Grant basic permissions to public (for submissions)
GRANT INSERT ON custom_tour_submissions TO anon;

-- Re-enable RLS
ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies

-- 1. Allow anyone to insert (public submissions)
CREATE POLICY "Allow public insert" ON custom_tour_submissions
    FOR INSERT WITH CHECK (true);

-- 2. Allow service role to do everything (admin access)
CREATE POLICY "Service role full access" ON custom_tour_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- 3. Allow authenticated users to view all data (admin panel access)
CREATE POLICY "Authenticated users can view all" ON custom_tour_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users to update data (admin management)
CREATE POLICY "Authenticated users can update" ON custom_tour_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Allow authenticated users to delete data (admin management)
CREATE POLICY "Authenticated users can delete" ON custom_tour_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Test the policies
SELECT COUNT(*) as total_submissions FROM custom_tour_submissions;

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_tour_submissions';
