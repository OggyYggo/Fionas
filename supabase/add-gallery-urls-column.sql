-- Add gallery_urls column to tours table for supporting up to 5 photos
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];

-- Add tour_type column to tours table for Destinations vs Package classification
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS tour_type VARCHAR(20) DEFAULT 'Package';

-- Add comment to document the purpose and limits
COMMENT ON COLUMN tours.gallery_urls IS 'Array of up to 5 additional tour photo URLs';
COMMENT ON COLUMN tours.tour_type IS 'Tour type: either "Destinations" or "Package"';

-- Create a migration script to update existing tours with empty gallery arrays and default tour type
UPDATE tours 
SET gallery_urls = '{}', tour_type = 'Package'
WHERE gallery_urls IS NULL OR tour_type IS NULL;

-- Add index for better performance on gallery queries (optional)
CREATE INDEX IF NOT EXISTS idx_tours_gallery_urls ON tours USING GIN(gallery_urls);
CREATE INDEX IF NOT EXISTS idx_tours_tour_type ON tours(tour_type);

-- Verify the columns were added successfully
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tours' AND column_name IN ('gallery_urls', 'tour_type');
