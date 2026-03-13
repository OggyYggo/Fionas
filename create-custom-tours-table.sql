-- Create custom_tour_submissions table
-- Run this in your Supabase SQL Editor

-- Drop table if it exists (for clean recreation)
DROP TABLE IF EXISTS custom_tour_submissions CASCADE;

-- Create the table
CREATE TABLE custom_tour_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    activities TEXT[],
    other_activity TEXT,
    budget_range TEXT NOT NULL,
    accommodation TEXT,
    transportation TEXT,
    tour_guide TEXT,
    special_requests TEXT,
    agreement BOOLEAN NOT NULL DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'quoted', 'accepted', 'rejected')),
    assigned_to TEXT,
    internal_notes TEXT,
    quote_amount NUMERIC,
    quote_currency TEXT DEFAULT 'PHP',
    follow_up_date DATE,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON custom_tour_submissions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON custom_tour_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON custom_tour_submissions
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON custom_tour_submissions
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_custom_tour_submissions_status ON custom_tour_submissions(status);
CREATE INDEX idx_custom_tour_submissions_destination ON custom_tour_submissions(destination);
CREATE INDEX idx_custom_tour_submissions_submission_date ON custom_tour_submissions(submission_date);
CREATE INDEX idx_custom_tour_submissions_email ON custom_tour_submissions(email);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_tour_submissions_updated_at 
    BEFORE UPDATE ON custom_tour_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
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
        'standard', 
        'mid-range', 
        'private', 
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
        'premium', 
        'luxury', 
        'private', 
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
        'budget', 
        'budget', 
        'shared', 
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
        'luxury', 
        'luxury', 
        'private', 
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
        'standard', 
        'mid-range', 
        'private', 
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
