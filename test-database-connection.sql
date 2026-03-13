-- Test database connection and data
-- Run this in Supabase SQL Editor

-- 1. Check if table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'custom_tour_submissions';

-- 2. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'custom_tour_submissions'
ORDER BY ordinal_position;

-- 3. Check if there's any data
SELECT COUNT(*) as total_records FROM custom_tour_submissions;

-- 4. Show sample data if exists
SELECT * FROM custom_tour_submissions LIMIT 5;

-- 5. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'custom_tour_submissions';

-- 6. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_tour_submissions';

-- 7. Test simple insert
INSERT INTO custom_tour_submissions (
    full_name, 
    email, 
    phone, 
    destination, 
    start_date, 
    adults, 
    children, 
    budget_range, 
    agreement, 
    status, 
    submission_date
) VALUES (
    'Test User', 
    'test@example.com', 
    '1234567890', 
    'Test Destination', 
    '2024-12-01', 
    2, 
    0, 
    'standard', 
    true, 
    'pending', 
    NOW()
);

-- 8. Verify insert worked
SELECT * FROM custom_tour_submissions WHERE email = 'test@example.com';
