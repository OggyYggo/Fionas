-- Remove short_description column from tours table
-- This script removes the short_description field that is no longer needed

-- Drop the short_description column
ALTER TABLE tours 
DROP COLUMN IF EXISTS short_description;

-- Note: No indexes to drop since short_description was a TEXT column without indexes

-- Verify the column has been removed
-- \d tours
