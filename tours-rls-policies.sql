-- RLS Policies for tours table (development mode)
-- Run this in Supabase SQL Editor to enable database operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON tours;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tours;
DROP POLICY IF EXISTS "Enable update access for all users" ON tours;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tours;

-- Enable RLS on tours table
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tours (development mode)
CREATE POLICY "Enable read access for all users" ON tours
  FOR SELECT USING (true);

-- Allow anyone to insert tours (development mode)
CREATE POLICY "Enable insert access for all users" ON tours
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update tours (development mode)
CREATE POLICY "Enable update access for all users" ON tours
  FOR UPDATE USING (true);

-- Allow anyone to delete tours (development mode)
CREATE POLICY "Enable delete access for all users" ON tours
  FOR DELETE USING (true);
