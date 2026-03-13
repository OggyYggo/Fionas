-- Fix RLS policy for custom tours submissions
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Service role full access" ON custom_tour_submissions;
DROP POLICY IF EXISTS "Users can manage own submissions" ON custom_tour_submissions;

-- Disable RLS temporarily
ALTER TABLE custom_tour_submissions DISABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert (for public submissions)
CREATE POLICY "Allow public insert" ON custom_tour_submissions
    FOR INSERT WITH CHECK (true);

-- Create policy that allows service role to do everything
CREATE POLICY "Service role full access" ON custom_tour_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy that allows authenticated users to see their own data
CREATE POLICY "Users can view own submissions" ON custom_tour_submissions
    FOR SELECT USING (auth.uid()::text = email OR auth.role() = 'service_role');

-- Re-enable RLS
ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

-- Test the policy
SELECT COUNT(*) as total_submissions FROM custom_tour_submissions;
