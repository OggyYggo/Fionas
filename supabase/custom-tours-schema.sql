-- Custom Tours Database Schema
-- Additional tables for custom tours page data and submissions

-- Custom tours page data table (for storing page configuration)
CREATE TABLE IF NOT EXISTS custom_tours_page_data (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom tour submissions table (separate from main bookings)
CREATE TABLE IF NOT EXISTS custom_tour_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Trip Details
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    
    -- Activity Preferences
    activities TEXT[],
    other_activity TEXT,
    
    -- Budget & Preferences
    budget_range VARCHAR(50) NOT NULL,
    accommodation VARCHAR(100),
    transportation VARCHAR(100),
    tour_guide VARCHAR(100),
    special_requests TEXT,
    
    -- Agreement
    agreement BOOLEAN NOT NULL DEFAULT false,
    
    -- Status Management
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to VARCHAR(255),
    internal_notes TEXT,
    quote_amount DECIMAL(10,2),
    quote_currency VARCHAR(3) DEFAULT 'PHP',
    follow_up_date DATE,
    
    -- Timestamps
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT custom_tours_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT custom_tours_guests_check CHECK (adults >= 0 AND children >= 0),
    CONSTRAINT custom_tours_dates_check CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT custom_tours_status_check CHECK (status IN ('pending', 'reviewed', 'contacted', 'quoted', 'accepted', 'rejected'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_tour_submissions_status ON custom_tour_submissions(status);
CREATE INDEX IF NOT EXISTS idx_custom_tour_submissions_email ON custom_tour_submissions(email);
CREATE INDEX IF NOT EXISTS idx_custom_tour_submissions_destination ON custom_tour_submissions(destination);
CREATE INDEX IF NOT EXISTS idx_custom_tour_submissions_submission_date ON custom_tour_submissions(submission_date);
CREATE INDEX IF NOT EXISTS idx_custom_tour_submissions_follow_up_date ON custom_tour_submissions(follow_up_date);

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_custom_tour_submissions_updated_at ON custom_tour_submissions;
CREATE TRIGGER update_custom_tour_submissions_updated_at 
    BEFORE UPDATE ON custom_tour_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for custom tour submissions
ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then create them
DROP POLICY IF EXISTS "Users can view own custom tour submissions" ON custom_tour_submissions;
CREATE POLICY "Users can view own custom tour submissions" ON custom_tour_submissions
    FOR SELECT USING (auth.uid()::text = email);

DROP POLICY IF EXISTS "Users can insert own custom tour submissions" ON custom_tour_submissions;
CREATE POLICY "Users can insert own custom tour submissions" ON custom_tour_submissions
    FOR INSERT WITH CHECK (auth.uid()::text = email);

DROP POLICY IF EXISTS "Admins can view all custom tour submissions" ON custom_tour_submissions;
CREATE POLICY "Admins can view all custom tour submissions" ON custom_tour_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update all custom tour submissions" ON custom_tour_submissions;
CREATE POLICY "Admins can update all custom tour submissions" ON custom_tour_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert default page data
INSERT INTO custom_tours_page_data (id, data) 
VALUES (
    'main',
    '{
        "heroTitle": "Plan Your Bohol Itinerary",
        "heroSubtitle": "Tell us your preferences and we''ll create a personalized itinerary for you",
        "heroBackgroundImage": "/images/custom-tours-hero.jpg",
        "features": [
            {
                "title": "Free Consultation",
                "description": "No obligation. We''ll review your request and get back to you within 24 hours",
                "icon": "check"
            },
            {
                "title": "Personalized Itinerary",
                "description": "Get a custom tour designed specifically for your preferences and budget",
                "icon": "star"
            },
            {
                "title": "Flexible Options",
                "description": "Make changes until it''s perfect. Your dream tour, your way",
                "icon": "heart"
            }
        ],
        "formSteps": [
            {
                "step": 1,
                "title": "Trip Details",
                "description": "Tell us about your travel dates and destination preferences"
            },
            {
                "step": 2,
                "title": "Activities & Interests",
                "description": "Select activities that interest you most"
            },
            {
                "step": 3,
                "title": "Budget & Preferences",
                "description": "Set your budget and travel preferences"
            },
            {
                "step": 4,
                "title": "Contact Information",
                "description": "Provide your contact details for follow-up"
            }
        ],
        "destinations": [
            { "id": "panglao", "name": "Panglao Island", "description": "Beaches and diving paradise", "popular": true },
            { "id": "chocolate-hills", "name": "Chocolate Hills", "description": "Iconic geological formation", "popular": true },
            { "id": "loboc-river", "name": "Loboc River", "description": "Scenic river cruise", "popular": false },
            { "id": "tarsier-sanctuary", "name": "Tarsier Sanctuary", "description": "See the world''s smallest primate", "popular": false }
        ],
        "activities": [
            { "id": "island-hopping", "name": "Island Hopping", "description": "Explore multiple islands", "category": "adventure", "popular": true },
            { "id": "diving", "name": "Scuba Diving", "description": "Underwater exploration", "category": "adventure", "popular": true },
            { "id": "snorkeling", "name": "Snorkeling", "description": "Surface water activities", "category": "water", "popular": false },
            { "id": "cultural-tour", "name": "Cultural Tour", "description": "Historical and cultural sites", "category": "cultural", "popular": false },
            { "id": "wildlife-watching", "name": "Wildlife Watching", "description": "Nature and wildlife encounters", "category": "nature", "popular": false }
        ],
        "accommodationOptions": [
            { "id": "budget", "name": "Budget-Friendly", "description": "Clean and comfortable accommodations", "priceCategory": "budget" },
            { "id": "mid-range", "name": "Mid-Range Hotels", "description": "3-star hotels with good amenities", "priceCategory": "standard" },
            { "id": "luxury", "name": "Luxury Resorts", "description": "Premium resorts and spas", "priceCategory": "luxury" }
        ],
        "transportationOptions": [
            { "id": "private", "name": "Private Vehicle", "description": "Dedicated transportation for your group", "priceCategory": "premium" },
            { "id": "shared", "name": "Shared Transport", "description": "Cost-effective shared transportation", "priceCategory": "standard" },
            { "id": "public", "name": "Public Transport", "description": "Local buses and tricycles", "priceCategory": "budget" }
        ],
        "budgetRanges": [
            { "id": "budget", "name": "Budget", "description": "Economical options", "minPrice": 1000, "maxPrice": 3000 },
            { "id": "standard", "name": "Standard", "description": "Good value for money", "minPrice": 3000, "maxPrice": 6000 },
            { "id": "premium", "name": "Premium", "description": "Enhanced experiences", "minPrice": 6000, "maxPrice": 10000 },
            { "id": "luxury", "name": "Luxury", "description": "Premium exclusive experiences", "minPrice": 10000, "maxPrice": 20000 }
        ],
        "tourGuideOptions": [
            { "id": "local", "name": "Local Guide", "description": "Knowledgeable local guides", "language": "English/Tagalog", "pricePerDay": 1500 },
            { "id": "professional", "name": "Professional Guide", "description": "Certified tour guides", "language": "English", "pricePerDay": 2500 },
            { "id": "specialized", "name": "Specialized Guide", "description": "Expert guides for specific activities", "language": "English", "pricePerDay": 3500 }
        ],
        "seoSettings": {
            "metaTitle": "Custom Bohol Tours - Personalized Itineraries | Fiona Travel",
            "metaDescription": "Create your personalized Bohol tour itinerary. Custom tours designed around your preferences, budget, and schedule.",
            "keywords": ["custom tours", "bohol tours", "personalized itinerary", "bohol travel"],
            "ogImage": "/images/custom-tours-og.jpg"
        },
        "contactInfo": {
            "email": "custom@fionatravel.com",
            "phone": "+63 912 345 6789",
            "address": "Tagbilaran City, Bohol, Philippines",
            "workingHours": "Monday to Saturday, 8:00 AM - 6:00 PM"
        }
    }'
) ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON custom_tours_page_data TO authenticated;
GRANT ALL ON custom_tours_page_data TO service_role;
GRANT SELECT ON custom_tours_page_data TO anon;

GRANT ALL ON custom_tour_submissions TO authenticated;
GRANT ALL ON custom_tour_submissions TO service_role;
GRANT SELECT ON custom_tour_submissions TO anon;

-- Additional permissions for API access
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
