-- Fiona Travel & Tours Booking System Schema
-- Supabase SQL Schema

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for enums
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE tour_type AS ENUM ('custom', 'countryside', 'island_hopping', 'dolphin_watching', 'diving', 'firefly_watching');
CREATE TYPE budget_range AS ENUM ('standard', 'premium', 'luxury', 'ultra_luxury');

-- Main bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Customer Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Tour Details
    tour_type tour_type NOT NULL DEFAULT 'custom',
    tour_title VARCHAR(255),
    
    -- Date Information
    start_date DATE,
    end_date DATE,
    
    -- Guest Information
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    
    -- Pricing
    budget_range budget_range DEFAULT 'standard',
    total_price DECIMAL(10,2),
    
    -- Preferences
    interests TEXT[], -- Array of interests
    destinations TEXT[], -- Array of destinations
    additional_notes TEXT,
    
    -- Status and Timestamps
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Admin fields
    admin_notes TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT bookings_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT bookings_guests_check CHECK (number_of_guests > 0),
    CONSTRAINT bookings_dates_check CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT bookings_price_check CHECK (total_price IS NULL OR total_price >= 0)
);

-- Create index for performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);

-- Tour packages table (for predefined tours)
CREATE TABLE tour_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tour_type tour_type NOT NULL,
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    budget_range budget_range NOT NULL,
    
    -- Duration
    duration_hours INTEGER,
    duration_days INTEGER,
    
    -- Details
    inclusions TEXT[],
    exclusions TEXT[],
    itinerary JSONB, -- Store detailed itinerary as JSON
    
    -- Media
    image_url VARCHAR(500),
    gallery_urls TEXT[],
    
    -- Availability
    max_guests INTEGER DEFAULT 20,
    min_guests INTEGER DEFAULT 1,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations table
CREATE TABLE destinations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    
    -- Location
    location VARCHAR(255),
    coordinates POINT, -- PostGIS point for maps
    
    -- Media
    image_url VARCHAR(500),
    gallery_urls TEXT[],
    
    -- Details
    category VARCHAR(100), -- e.g., 'beach', 'historical', 'natural'
    highlights TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking items table (for tours with multiple items/activities)
CREATE TABLE booking_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Item details
    item_type VARCHAR(100) NOT NULL, -- e.g., 'tour', 'accommodation', 'transport'
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    unit_price DECIMAL(10,2),
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    
    -- Dates
    scheduled_date DATE,
    scheduled_time TIME,
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Rating
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Review content
    title VARCHAR(255),
    content TEXT,
    
    -- Images
    review_images TEXT[],
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table (for payment tracking)
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    payment_method VARCHAR(100), -- e.g., 'credit_card', 'bank_transfer', 'cash'
    
    -- Transaction info
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Format: BK + YYYYMMDD + 4-digit sequence
    NEW.booking_number := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(DAY FROM NOW())::TEXT, 2, '0') || LPAD(floor(random() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking number
CREATE TRIGGER generate_booking_number_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW
    WHEN (NEW.booking_number IS NULL)
    EXECUTE FUNCTION generate_booking_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_packages_updated_at BEFORE UPDATE ON tour_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_items_updated_at BEFORE UPDATE ON booking_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid()::text = email);

-- Policy: Users can only insert their own bookings
CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Policy: Users can only update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE USING (auth.uid()::text = email);

-- Policy: Users can only view their own reviews
CREATE POLICY "Users can view own reviews" ON reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.email = auth.uid()::text
        )
    );

-- Policy: Users can only insert their own reviews
CREATE POLICY "Users can insert own reviews" ON reviews
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.email = auth.uid()::text
        )
    );

-- Policy: Users can only view their own payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.email = auth.uid()::text
        )
    );

-- Admin policies (assuming admin role)
CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update all bookings" ON bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert sample data (optional)
INSERT INTO tour_packages (title, description, tour_type, base_price, budget_range, duration_hours, inclusions) VALUES
('Countryside Tour', 'Explore Bohol''s famous countryside attractions including Chocolate Hills and Tarsier Sanctuary', 'countryside', 2500.00, 'standard', 8, 
 ARRAY['Hotel pickup and drop-off', 'Air-conditioned transportation', 'Licensed tour guide', 'Entrance fees', 'Lunch']),
('Island Hopping', 'Discover pristine beaches and marine sanctuaries around Panglao Island', 'island_hopping', 3500.00, 'standard', 6,
 ARRAY['Boat transfer', 'Snorkeling gear', 'Guide', 'Lunch', 'Environmental fees']),
('Dolphin Watching', 'Early morning dolphin watching tour with island hopping', 'dolphin_watching', 1800.00, 'standard', 4,
 ARRAY['Boat transfer', 'Guide', 'Snorkeling gear', 'Breakfast snacks']);

INSERT INTO destinations (name, description, location, category, highlights) VALUES
('Chocolate Hills', 'Famous geological formation with over 1,200 cone-shaped hills', 'Carmen, Bohol', 'natural', 
 ARRAY['UNESCO Heritage Site candidate', 'Best viewed during dry season', '214 steps to viewing deck']),
('Panglao Island', 'Premier beach destination with white sand beaches', 'Panglao, Bohol', 'beach',
 ARRAY['Alona Beach', 'Diving spots', 'Beach resorts', 'Nightlife']),
('Loboc River', 'Scenic river with floating restaurants and cultural shows', 'Loboc, Bohol', 'natural',
 ARRAY['River cruise', 'Floating restaurant', 'Cultural show', 'Firefly watching at night']),
('Tarsier Sanctuary', 'Conservation center for the world''s smallest primate', 'Corella, Bohol', 'wildlife',
 ARRAY['See live tarsiers', 'Educational center', 'Photography', 'Conservation efforts']);
