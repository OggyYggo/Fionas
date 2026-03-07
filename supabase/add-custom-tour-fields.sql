-- Add custom tour fields to bookings table
-- Run this in Supabase SQL editor to update the schema

-- Add custom tour specific fields
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS destination VARCHAR(255),
ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS travel_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS activities TEXT[],
ADD COLUMN IF NOT EXISTS other_activity TEXT,
ADD COLUMN IF NOT EXISTS accommodation VARCHAR(100),
ADD COLUMN IF NOT EXISTS transportation VARCHAR(100),
ADD COLUMN IF NOT EXISTS tour_guide VARCHAR(50),
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Add constraints for the new fields
ALTER TABLE bookings 
ADD CONSTRAINT bookings_adults_check CHECK (adults >= 0),
ADD CONSTRAINT bookings_children_check CHECK (children >= 0);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_destination ON bookings(destination);
CREATE INDEX IF NOT EXISTS idx_bookings_activities ON bookings USING GIN(activities);

-- Update the booking_status enum to include 'completed'
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'completed';

-- Update the tour_type enum to ensure 'custom' is included
-- Note: PostgreSQL doesn't support removing enum values or adding IF NOT EXISTS for enum values
-- The 'custom' value should already be in the enum from the original schema
