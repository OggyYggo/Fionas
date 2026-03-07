-- Migrate bookings table to match the expected schema
-- Run this in Supabase SQL editor to fix the schema mismatch

-- First, let's see if the new schema already exists by checking for full_name column
DO $$
BEGIN
    -- Check if we need to migrate (old schema doesn't have full_name column)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customer_name'
    ) THEN
        -- We have the old schema, need to migrate
        
        -- Create a backup of existing data
        CREATE TABLE IF NOT EXISTS bookings_backup AS SELECT * FROM bookings;
        
        -- Drop the old table
        DROP TABLE IF EXISTS bookings;
        
        -- Create the new table with correct schema
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
            cancelled_at TIMESTAMP WITH TIME ZONE
        );
        
        -- Set up Row Level Security (RLS)
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
        
        -- Allow public read access to bookings
        CREATE POLICY "Bookings are publicly viewable" ON bookings
          FOR SELECT USING (true);
        
        -- Allow authenticated users to manage bookings
        CREATE POLICY "Authenticated users can manage bookings" ON bookings
          FOR ALL USING (auth.role() = 'authenticated');
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
        CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(start_date);
        CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
        CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
        
        RAISE NOTICE 'Migration completed: Old schema migrated to new schema';
    ELSE
        RAISE NOTICE 'No migration needed: New schema already exists';
    END IF;
END $$;

-- Create trigger to update updated_at timestamp (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_bookings_updated_at'
    ) THEN
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
