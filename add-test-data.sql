-- Add test data for custom tours submissions
-- Run this in Supabase SQL Editor

-- Insert multiple test submissions
INSERT INTO custom_tour_submissions (
    full_name, 
    email, 
    phone, 
    destination, 
    start_date, 
    end_date,
    adults, 
    children, 
    activities,
    budget_range, 
    accommodation, 
    transportation, 
    agreement, 
    status, 
    submission_date
) VALUES 
    (
        'John Smith', 
        'john.smith@email.com', 
        '555-123-4567', 
        'Panglao Island', 
        '2024-12-15', 
        '2024-12-18',
        2, 
        1, 
        ARRAY['island-hopping', 'snorkeling'],
        'standard', 
        'mid-range', 
        'private', 
        true, 
        'pending', 
        NOW() - INTERVAL '2 days'
    ),
    (
        'Maria Garcia', 
        'maria.garcia@email.com', 
        '555-987-6543', 
        'Chocolate Hills', 
        '2024-12-20', 
        '2024-12-22',
        4, 
        2, 
        ARRAY['cultural-tour', 'wildlife-watching'],
        'premium', 
        'luxury', 
        'private', 
        true, 
        'accepted', 
        NOW() - INTERVAL '1 day'
    ),
    (
        'David Chen', 
        'david.chen@email.com', 
        '555-456-7890', 
        'Loboc River', 
        '2025-01-05', 
        '2025-01-07',
        2, 
        0, 
        ARRAY['diving', 'island-hopping'],
        'budget', 
        'budget', 
        'shared', 
        true, 
        'reviewed', 
        NOW() - INTERVAL '3 hours'
    ),
    (
        'Sarah Johnson', 
        'sarah.j@email.com', 
        '555-234-5678', 
        'Tarsier Sanctuary', 
        '2025-01-10', 
        '2025-01-12',
        3, 
        1, 
        ARRAY['wildlife-watching', 'cultural-tour'],
        'luxury', 
        'luxury', 
        'private', 
        true, 
        'quoted', 
        NOW() - INTERVAL '1 hour'
    ),
    (
        'Michael Brown', 
        'michael.b@email.com', 
        '555-345-6789', 
        'Panglao Island', 
        '2025-01-15', 
        '2025-01-18',
        2, 
        2, 
        ARRAY['island-hopping', 'snorkeling', 'diving'],
        'standard', 
        'mid-range', 
        'private', 
        true, 
        'contacted', 
        NOW()
    );

-- Verify the data was inserted
SELECT 
    id, 
    full_name, 
    email, 
    destination, 
    start_date, 
    adults, 
    children, 
    budget_range, 
    status,
    submission_date
FROM custom_tour_submissions 
ORDER BY submission_date DESC;

-- Show count by status
SELECT 
    status,
    COUNT(*) as count
FROM custom_tour_submissions 
GROUP BY status 
ORDER BY status;
