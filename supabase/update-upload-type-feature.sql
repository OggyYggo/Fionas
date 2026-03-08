-- Update tours table to support upload type feature (Package vs Destinations)
-- This script ensures proper setup for the new upload type dropdown functionality

-- 1. Ensure tour_type column exists with proper constraints
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS tour_type VARCHAR(20) DEFAULT 'Package';

-- 2. Add constraint to ensure only valid values (check if constraint doesn't exist first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_tour_type') THEN
        ALTER TABLE tours 
        ADD CONSTRAINT check_tour_type 
        CHECK (tour_type IN ('Package', 'Destinations'));
    END IF;
END $$;

-- 3. Ensure gallery_urls column exists for multiple photo support
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];

-- 4. Update any existing records to have default values
UPDATE tours 
SET tour_type = 'Package' 
WHERE tour_type IS NULL;

UPDATE tours 
SET gallery_urls = '{}' 
WHERE gallery_urls IS NULL;

-- 5. Add comments for documentation
COMMENT ON COLUMN tours.tour_type IS 'Tour upload type: "Package" allows up to 5 photos, "Destinations" allows 1 photo';
COMMENT ON COLUMN tours.gallery_urls IS 'Array of additional tour photo URLs (max 4 for Package, 0 for Destinations)';

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_tour_type ON tours(tour_type);
CREATE INDEX IF NOT EXISTS idx_tours_gallery_urls ON tours USING GIN(gallery_urls);

-- 7. Add validation function to ensure photo limits match tour type
CREATE OR REPLACE FUNCTION validate_tour_photos()
RETURNS TRIGGER AS $$
BEGIN
  -- For Destinations: ensure no gallery photos (only main image)
  IF NEW.tour_type = 'Destinations' AND (NEW.gallery_urls IS NOT NULL AND array_length(NEW.gallery_urls, 1) > 0) THEN
    RAISE EXCEPTION 'Destinations tours can only have 1 photo (main image)';
  END IF;
  
  -- For Package: ensure max 5 total photos (1 main + 4 gallery)
  IF NEW.tour_type = 'Package' AND (NEW.gallery_urls IS NOT NULL AND array_length(NEW.gallery_urls, 1) > 4) THEN
    RAISE EXCEPTION 'Package tours can have maximum 5 photos (1 main + 4 gallery)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to validate photo limits
DROP TRIGGER IF EXISTS validate_tour_photos_trigger ON tours;
CREATE TRIGGER validate_tour_photos_trigger
  BEFORE INSERT OR UPDATE ON tours
  FOR EACH ROW
  EXECUTE FUNCTION validate_tour_photos();

-- 9. Verify the setup
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'tours' 
  AND column_name IN ('tour_type', 'gallery_urls')
ORDER BY column_name;

-- 10. Show current data distribution
SELECT 
  tour_type,
  COUNT(*) as tour_count,
  AVG(array_length(gallery_urls, 1)) as avg_gallery_photos
FROM tours 
GROUP BY tour_type
ORDER BY tour_type;
