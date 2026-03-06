-- Add DELETE policy for bookings table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
DROP POLICY IF EXISTS "Enable select for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update for all users" ON bookings;

-- Create comprehensive policies for all operations
CREATE POLICY "Enable insert for all users" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON bookings
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON bookings
    FOR DELETE USING (true);

-- Alternatively, if you want to disable RLS entirely:
-- ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
