-- Update tours table to support multiple images
-- This migration adds support for storing multiple tour images (up to 5)

-- Add gallery_urls column to store additional images
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';

-- Add highlights column (if not exists)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';

-- Add included column (if not exists) 
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS included TEXT[] DEFAULT '{}';

-- Add not_included column (if not exists)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS not_included TEXT[] DEFAULT '{}';

-- Add pricing column (if not exists)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{}';

-- Add tour_type column (if not exists)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS tour_type VARCHAR(50) DEFAULT 'Package';

-- Update existing records to have default values for new columns
UPDATE tours 
SET 
  gallery_urls = '{}',
  highlights = '{}',
  included = '{}',
  not_included = '{}',
  pricing = '{"local": [{"pax": 1, "price": "₱3,500"}, {"pax": 2, "price": "₱2,000"}], "foreigner": [{"pax": 1, "price": "$70"}, {"pax": 2, "price": "$40"}]}',
  tour_type = 'Package'
WHERE gallery_urls IS NULL OR highlights IS NULL OR included IS NULL OR not_included IS NULL OR pricing IS NULL OR tour_type IS NULL;

-- Create index for gallery_urls for better performance
CREATE INDEX IF NOT EXISTS idx_tours_gallery_urls ON tours USING GIN(gallery_urls);

-- Create index for highlights for better performance  
CREATE INDEX IF NOT EXISTS idx_tours_highlights ON tours USING GIN(highlights);

-- Create index for included for better performance
CREATE INDEX IF NOT EXISTS idx_tours_included ON tours USING GIN(included);

-- Create index for not_included for better performance
CREATE INDEX IF NOT EXISTS idx_tours_not_included ON tours USING GIN(not_included);

-- Create index for tour_type for better performance
CREATE INDEX IF NOT EXISTS idx_tours_tour_type ON tours(tour_type);

-- Create index for pricing for better performance
CREATE INDEX IF NOT EXISTS idx_tours_pricing ON tours USING GIN(pricing);

-- Add comment to explain the new columns
COMMENT ON COLUMN tours.gallery_urls IS 'Array of URLs for additional tour images (up to 5 images total including main image)';
COMMENT ON COLUMN tours.highlights IS 'Array of tour highlights/key features';
COMMENT ON COLUMN tours.included IS 'Array of items included in the tour package';
COMMENT ON COLUMN tours.not_included IS 'Array of items not included in the tour package';
COMMENT ON COLUMN tours.pricing IS 'JSON object containing pricing structure for different passenger types';
COMMENT ON COLUMN tours.tour_type IS 'Type of tour (Package, Destinations, etc.)';

-- Create a function to validate gallery_urls length (optional constraint)
CREATE OR REPLACE FUNCTION validate_gallery_urls()
RETURNS TRIGGER AS $$
BEGIN
  IF ARRAY_LENGTH(NEW.gallery_urls, 1) > 4 THEN -- 4 additional + 1 main = 5 total
    RAISE EXCEPTION 'Tour can have maximum of 5 images total (1 main + 4 additional)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate gallery_urls length
DROP TRIGGER IF EXISTS validate_tours_gallery_urls ON tours;
CREATE TRIGGER validate_tours_gallery_urls
  BEFORE INSERT OR UPDATE ON tours
  FOR EACH ROW
  EXECUTE FUNCTION validate_gallery_urls();

-- Update storage bucket to allow more files and larger sizes
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760, -- 10MB per file
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'tour-images';

-- Create a view for tours with image count (useful for queries)
CREATE OR REPLACE VIEW tours_with_image_count AS
SELECT 
  t.*,
  CASE 
    WHEN t.image IS NOT NULL AND t.image != '' THEN 1 
    ELSE 0 
  END as main_image_count,
  CASE 
    WHEN t.gallery_urls IS NOT NULL THEN ARRAY_LENGTH(t.gallery_urls, 1)
    ELSE 0 
  END as gallery_image_count,
  CASE 
    WHEN t.image IS NOT NULL AND t.image != '' AND t.gallery_urls IS NOT NULL THEN 
      1 + COALESCE(ARRAY_LENGTH(t.gallery_urls, 1), 0)
    WHEN t.image IS NOT NULL AND t.image != '' THEN 1
    WHEN t.gallery_urls IS NOT NULL THEN COALESCE(ARRAY_LENGTH(t.gallery_urls, 1), 0)
    ELSE 0
  END as total_image_count
FROM tours t;

-- Add comment to view
COMMENT ON VIEW tours_with_image_count IS 'View of tours with calculated image counts for easy querying';
