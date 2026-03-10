-- Update tours table with all enhanced tour fields
-- This script adds all the new fields for the comprehensive tour information

-- Add new columns for enhanced tour information
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS why_choose JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance on JSON fields
CREATE INDEX IF NOT EXISTS idx_tours_itinerary_gin ON tours USING GIN (itinerary);
CREATE INDEX IF NOT EXISTS idx_tours_why_choose_gin ON tours USING GIN (why_choose);
CREATE INDEX IF NOT EXISTS idx_tours_reviews_gin ON tours USING GIN (reviews);
CREATE INDEX IF NOT EXISTS idx_tours_faqs_gin ON tours USING GIN (faqs);

-- Add comments for documentation
COMMENT ON COLUMN tours.itinerary IS 'JSON array of itinerary items describing the tour schedule';
COMMENT ON COLUMN tours.why_choose IS 'JSON array of reasons why customers should choose this tour';
COMMENT ON COLUMN tours.reviews IS 'JSON array of customer reviews with author, rating, and comment';
COMMENT ON COLUMN tours.faqs IS 'JSON array of frequently asked questions with answers';

-- Update existing tours with sample data (optional - can be removed if not needed)
UPDATE tours 
SET 
  itinerary = COALESCE(itinerary, '["Morning departure", "Island hopping", "Lunch break", "Beach activities", "Return trip"]'::jsonb),
  why_choose = COALESCE(why_choose, '["Expert guides", "Small group sizes", "All-inclusive pricing", "Safety first"]'::jsonb),
  reviews = COALESCE(reviews, '[{"author": "John Doe", "rating": 5, "comment": "Amazing experience!", "date": "2024-01-15"}]'::jsonb),
  faqs = COALESCE(faqs, '[{"question": "What should I bring?", "answer": "Bring sunscreen, towel, and camera."}]'::jsonb)
WHERE itinerary IS NULL OR why_choose IS NULL OR reviews IS NULL OR faqs IS NULL;

-- Verify the columns have been added
-- \d tours
