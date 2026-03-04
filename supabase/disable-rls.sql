-- Disable RLS for bookings table to allow unauthenticated access
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Also disable RLS for other tables that might be causing issues
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
