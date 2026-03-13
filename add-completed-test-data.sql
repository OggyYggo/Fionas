-- Add complete test data with all fields filled
-- Run this in your Supabase SQL Editor

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
    other_activity,
    budget_range, 
    accommodation, 
    transportation, 
    tour_guide,
    special_requests,
    agreement, 
    status
) VALUES 
    (
        'John Smith', 
        'john.smith@email.com', 
        '+63 912 345 6789', 
        'Panglao Island', 
        '2024-12-15', 
        '2024-12-18',
        2, 
        1, 
        ARRAY['island-hopping', 'snorkeling'],
        'Beach relaxation',
        'standard', 
        'mid-range', 
        'private', 
        'local',
        'Prefer morning tours',
        true, 
        'pending'
    ),
    (
        'Maria Garcia', 
        'maria.garcia@email.com', 
        '+63 913 456 7890', 
        'Chocolate Hills', 
        '2024-12-20', 
        '2024-12-22',
        4, 
        2, 
        ARRAY['cultural-tour', 'wildlife-watching'],
        null,
        'premium', 
        'luxury', 
        'private', 
        'professional',
        'Vegetarian meals required',
        true, 
        'accepted'
    ),
    (
        'David Chen', 
        'david.chen@email.com', 
        '+63 914 567 8901', 
        'Loboc River', 
        '2025-01-05', 
        '2025-01-07',
        2, 
        0, 
        ARRAY['diving', 'island-hopping'],
        'Underwater photography',
        'budget', 
        'budget', 
        'shared', 
        null,
        null,
        true, 
        'reviewed'
    ),
    (
        'Sarah Johnson', 
        'sarah.j@email.com', 
        '+63 915 678 9012', 
        'Tarsier Sanctuary', 
        '2025-01-10', 
        '2025-01-12',
        3, 
        1, 
        ARRAY['wildlife-watching', 'cultural-tour'],
        'Kids friendly activities',
        'luxury', 
        'luxury', 
        'private', 
        'specialized',
        'Wheelchair accessibility needed',
        true, 
        'quoted'
    ),
    (
        'Michael Brown', 
        'michael.b@email.com', 
        '+63 916 789 0123', 
        'Panglao Island', 
        '2025-01-15', 
        '2025-01-18',
        2, 
        2, 
        ARRAY['island-hopping', 'snorkeling', 'diving'],
        null,
        'standard', 
        'mid-range', 
        'private', 
        'local',
        null,
        true, 
        'contacted'
    );

-- Verify the data was inserted
SELECT 
    id, 
    full_name, 
    email, 
    destination, 
    start_date,
    end_date,
    adults, 
    children, 
    budget_range, 
    status,
    CASE 
        WHEN activities IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END as has_activities,
    CASE 
        WHEN accommodation IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END as has_accommodation,
    CASE 
        WHEN transportation IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END as has_transportation
FROM custom_tour_submissions 
ORDER BY submission_date DESC;

-- Show count by status
SELECT 
    status,
    COUNT(*) as count
FROM custom_tour_submissions 
GROUP BY status 
ORDER BY status;
