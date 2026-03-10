-- Remove duration and max_people columns from tours table
-- This script removes the duration and max_people fields that are no longer needed

-- First, drop the dependent view
DROP VIEW IF EXISTS tours_with_image_count;

-- Now drop the columns from the tours table
ALTER TABLE tours 
DROP COLUMN IF EXISTS duration;

ALTER TABLE tours 
DROP COLUMN IF EXISTS max_people;

-- Recreate the view without the duration and max_people columns
CREATE OR REPLACE VIEW tours_with_image_count AS
SELECT 
  tours.*,
  CASE 
    WHEN gallery_urls IS NOT NULL AND array_length(gallery_urls, 1) > 0 
    THEN array_length(gallery_urls, 1) 
    ELSE 1 
  END as image_count
FROM tours;

-- Note: No indexes to drop since these were simple TEXT/VARCHAR columns without indexes

-- Verify the columns have been removed
-- \d tours
