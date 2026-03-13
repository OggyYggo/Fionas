-- Fix permissions for custom tours tables
-- Run this in Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Service role full access" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Users can manage own submissions" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Users can view own custom tour submissions" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Users can insert own custom tour submissions" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Admins can view all custom tour submissions" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Admins can update all custom tour submissions" ON custom_tour_submissions;

-- Disable RLS temporarily to reset permissions
ALTER TABLE custom_tour_submissions DISABLE ROW LEVEL SECURITY;

-- Grant permissions to service role
GRANT ALL ON custom_tour_submissions TO service_role;
GRANT ALL ON custom_tours_page_data TO service_role;

-- Grant permissions to authenticated users
GRANT ALL ON custom_tour_submissions TO authenticated;

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Re-enable RLS
ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

-- Create simple policy for service role (admin access)
CREATE POLICY "Service role full access" ON custom_tour_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (can insert and view their own data)
CREATE POLICY "Users can manage own submissions" ON custom_tour_submissions
    FOR ALL USING (auth.uid()::text = email OR auth.role() = 'service_role');

-- Test query
SELECT COUNT(*) as total_submissions FROM custom_tour_submissions;
