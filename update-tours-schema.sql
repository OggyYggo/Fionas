-- Update tours table to support all form fields
-- Run this in Supabase SQL Editor

-- Add new columns to support additional tour data
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS included JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS not_included JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{}';

-- Update existing tours to have default values if columns were just added
UPDATE tours 
SET 
  highlights = COALESCE(highlights, '[]'),
  included = COALESCE(included, '[]'),
  not_included = COALESCE(not_included, '[]'),
  pricing = COALESCE(pricing, '{}')
WHERE highlights IS NULL OR included IS NULL OR not_included IS NULL OR pricing IS NULL;

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;
