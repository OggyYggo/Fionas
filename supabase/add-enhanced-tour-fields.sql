-- Add new fields to tours table for enhanced tour information
-- This migration adds the following fields:
-- - short_description: Brief description for tour listings
-- - itinerary: JSON array of itinerary items
-- - why_choose: JSON array of reasons to choose this tour
-- - reviews: JSON array of review objects
-- - faqs: JSON array of FAQ objects

-- Add short_description column
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add itinerary column (JSON array)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;

-- Add why_choose column (JSON array)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS why_choose JSONB DEFAULT '[]'::jsonb;

-- Add reviews column (JSON array of review objects)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb;

-- Add faqs column (JSON array of FAQ objects)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance on JSON fields
CREATE INDEX IF NOT EXISTS idx_tours_itinerary_gin ON tours USING GIN (itinerary);
CREATE INDEX IF NOT EXISTS idx_tours_why_choose_gin ON tours USING GIN (why_choose);
CREATE INDEX IF NOT EXISTS idx_tours_reviews_gin ON tours USING GIN (reviews);
CREATE INDEX IF NOT EXISTS idx_tours_faqs_gin ON tours USING GIN (faqs);

-- Add comments for documentation
COMMENT ON COLUMN tours.short_description IS 'Brief description for tour listings and previews';
COMMENT ON COLUMN tours.itinerary IS 'JSON array of itinerary items describing the tour schedule';
COMMENT ON COLUMN tours.why_choose IS 'JSON array of reasons why customers should choose this tour';
COMMENT ON COLUMN tours.reviews IS 'JSON array of customer reviews with author, rating, and comment';
COMMENT ON COLUMN tours.faqs IS 'JSON array of frequently asked questions with answers';

-- Sample data update for existing tours (optional)
-- UPDATE tours 
-- SET 
--   short_description = SUBSTRING(description, 1, 150) || '...',
--   itinerary = '["Morning departure", "Island hopping", "Lunch break", "Beach activities", "Return trip"]'::jsonb,
--   why_choose = '["Expert guides", "Small group sizes", "All-inclusive pricing", "Safety first"]'::jsonb,
--   reviews = '[{"author": "John Doe", "rating": 5, "comment": "Amazing experience!", "date": "2024-01-15"}]'::jsonb,
--   faqs = '[{"question": "What should I bring?", "answer": "Bring sunscreen, towel, and camera."}]'::jsonb
-- WHERE short_description IS NULL OR itinerary IS NULL;
