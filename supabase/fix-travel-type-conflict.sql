-- Fix travel_type field conflict
-- Run this in Supabase SQL editor to remove the conflicting travel_type field

-- Remove the conflicting travel_type field since we already have tour_type
ALTER TABLE bookings DROP COLUMN IF EXISTS travel_type;

-- Add tour_type column if it doesn't exist (using the existing enum type)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'tour_type'
    ) THEN
        ALTER TABLE bookings ADD COLUMN tour_type tour_type NOT NULL DEFAULT 'custom';
    END IF;
END $$;

-- Add a comment to clarify the purpose of tour_type
COMMENT ON COLUMN bookings.tour_type IS 'Main tour type: custom, countryside, island_hopping, dolphin_watching, diving, firefly_watching';

-- The travel preference (solo, couple, family, group) will be stored in additional_notes
