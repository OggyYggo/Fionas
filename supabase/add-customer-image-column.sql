-- Add customer_image column to testimonials table
ALTER TABLE testimonials 
ADD COLUMN customer_image VARCHAR(500);

-- Add comment
COMMENT ON COLUMN testimonials.customer_image IS 'URL to customer profile image';
