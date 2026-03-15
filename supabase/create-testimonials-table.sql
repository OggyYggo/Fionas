-- Create testimonials table for customer feedback management
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Tour Information
    tour_name VARCHAR(255) NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Testimonial Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    testimonial_text TEXT NOT NULL,
    
    -- Status Management
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    
    -- Engagement Metrics
    helpful_count INTEGER DEFAULT 0,
    
    -- Timestamps
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT testimonials_email_check CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT testimonials_helpful_check CHECK (helpful_count >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_date ON testimonials(date);
CREATE INDEX IF NOT EXISTS idx_testimonials_customer_name ON testimonials(customer_name);
CREATE INDEX IF NOT EXISTS idx_testimonials_tour_name ON testimonials(tour_name);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials" ON testimonials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Admins can insert testimonials
CREATE POLICY "Admins can insert testimonials" ON testimonials
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Admins can update testimonials
CREATE POLICY "Admins can update testimonials" ON testimonials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials" ON testimonials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Public can view approved testimonials only
CREATE POLICY "Public can view approved testimonials" ON testimonials
    FOR SELECT USING (status = 'approved');

-- Insert sample data for testing
INSERT INTO testimonials (customer_name, email, phone, tour_name, rating, testimonial_text, status, helpful_count, date) VALUES
('Sarah Johnson', 'sarah.j@email.com', '+1234567890', 'Chocolate Hills Adventure', 5, 'Absolutely amazing experience! The tour guide was knowledgeable and the scenery was breathtaking. Highly recommend this tour to anyone visiting Bohol.', 'approved', 24, '2024-03-10'),
('Michael Chen', 'mchen@email.com', NULL, 'Loboc River Cruise', 4, 'Great cruise experience with delicious lunch buffet. The floating restaurants were unique and the scenery along the river was beautiful.', 'approved', 18, '2024-03-08'),
('Emma Wilson', 'emma.w@email.com', NULL, 'Panglao Island Beach Tour', 5, 'Paradise! The beaches were pristine and the water was crystal clear. Our guide made sure we had the best experience possible.', 'pending', 12, '2024-03-05'),
('Carlos Rodriguez', 'carlos.r@email.com', '+0987654321', 'Tarsier Sanctuary Visit', 5, 'Fascinating to see the tarsiers up close! The sanctuary is well-maintained and the staff were very informative about conservation efforts.', 'approved', 31, '2024-03-03'),
('Lisa Anderson', 'lisa.a@email.com', NULL, 'Bohol Countryside Tour', 3, 'Good tour overall, but felt a bit rushed at some locations. The guide was friendly though.', 'rejected', 5, '2024-03-01'),
('David Kim', 'david.k@email.com', '+1122334455', 'Danao Adventure Park', 4, 'Exciting activities! The zip line was amazing and the scenery was spectacular. Staff were very professional.', 'pending', 15, '2024-02-28');
