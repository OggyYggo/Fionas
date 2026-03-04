-- Fix RLS policies to allow unauthenticated bookings for testing

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Create new policies that allow unauthenticated access for testing
CREATE POLICY "Enable insert for all users" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON bookings
    FOR UPDATE USING (true);

-- Alternatively, you can disable RLS entirely for testing:
-- ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
