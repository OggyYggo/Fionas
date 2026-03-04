// TypeScript types for Supabase schema
// These types match the database schema in supabase/schema.sql

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type TourType = 'custom' | 'countryside' | 'island_hopping' | 'dolphin_watching' | 'diving' | 'firefly_watching'
export type BudgetRange = 'standard' | 'premium' | 'luxury' | 'ultra_luxury'

// Main bookings table
export interface Booking {
  id: string
  booking_number: string
  
  // Customer Information
  full_name: string
  email: string
  phone: string
  
  // Tour Details
  tour_type: TourType
  tour_title?: string
  
  // Date Information
  start_date?: string
  end_date?: string
  
  // Guest Information
  number_of_guests: number
  
  // Pricing
  budget_range: BudgetRange
  total_price?: number
  
  // Preferences
  interests?: string[]
  destinations?: string[]
  additional_notes?: string
  
  // Status and Timestamps
  status: BookingStatus
  created_at: string
  updated_at: string
  
  // Admin fields
  admin_notes?: string
  confirmed_at?: string
  cancelled_at?: string
}

// Tour packages table
export interface TourPackage {
  id: string
  title: string
  description?: string
  tour_type: TourType
  
  // Pricing
  base_price: number
  budget_range: BudgetRange
  
  // Duration
  duration_hours?: number
  duration_days?: number
  
  // Details
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: any // JSON object
  
  // Media
  image_url?: string
  gallery_urls?: string[]
  
  // Availability
  max_guests?: number
  min_guests?: number
  
  // Status
  is_active: boolean
  featured: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Destinations table
export interface Destination {
  id: string
  name: string
  description?: string
  
  // Location
  location?: string
  coordinates?: { x: number; y: number } // Point type
  
  // Media
  image_url?: string
  gallery_urls?: string[]
  
  // Details
  category?: string
  highlights?: string[]
  
  // Status
  is_active: boolean
  featured: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Booking items table
export interface BookingItem {
  id: string
  booking_id: string
  
  // Item details
  item_type: string
  item_name: string
  description?: string
  
  // Pricing
  unit_price?: number
  quantity: number
  total_price?: number
  
  // Dates
  scheduled_date?: string
  scheduled_time?: string
  
  // Status
  status: BookingStatus
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Reviews table
export interface Review {
  id: string
  booking_id: string
  
  // Rating
  rating: number
  
  // Review content
  title?: string
  content?: string
  
  // Images
  review_images?: string[]
  
  // Status
  is_published: boolean
  is_verified: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Payments table
export interface Payment {
  id: string
  booking_id: string
  
  // Payment details
  amount: number
  currency: string
  payment_method?: string
  
  // Transaction info
  transaction_id?: string
  payment_gateway?: string
  
  // Status
  status: string // pending, completed, failed, refunded
  
  // Timestamps
  created_at: string
  updated_at: string
  paid_at?: string
}

// API Request/Response types
export interface CreateBookingRequest {
  fullName: string
  email: string
  phone: string
  tourType: TourType
  startDate?: string
  endDate?: string
  numberOfGuests: string | number
  budgetRange?: BudgetRange
  interests?: string[]
  destinations?: string[]
  additionalNotes?: string
}

export interface CreateBookingResponse {
  success: boolean
  message: string
  data?: {
    bookingId: string
    bookingNumber: string
    status: BookingStatus
    estimatedResponseTime: string
  }
}

export interface GetBookingsResponse {
  success: boolean
  data: Booking[]
  total: number
}

export interface UpdateBookingRequest {
  bookingId: string
  status?: BookingStatus
  adminNotes?: string
  additionalNotes?: string
}

export interface UpdateBookingResponse {
  success: boolean
  message: string
  data?: Booking
}

// Form types for the custom tour form
export interface CustomTourFormData {
  fullName: string
  email: string
  phone: string
  startDate: Date | null
  endDate: Date | null
  numberOfGuests: string
  budgetRange: string
  interests: string[]
  destinations: string[]
}

// Dashboard statistics types
export interface BookingStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  cancelledBookings: number
  totalRevenue: number
  monthlyBookings: {
    month: string
    bookings: number
    revenue: number
  }[]
  popularTours: {
    tourType: TourType
    count: number
  }[]
}

// Admin user type
export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'staff'
  name?: string
  created_at: string
}

// Database join types (for complex queries)
export interface BookingWithDetails extends Booking {
  booking_items?: BookingItem[]
  payments?: Payment[]
  review?: Review
}

export interface TourPackageWithBookings extends TourPackage {
  booking_count?: number
  total_revenue?: number
}

// Utility types
export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'booking_number' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'booking_number' | 'created_at'>>
      }
      tour_packages: {
        Row: TourPackage
        Insert: Omit<TourPackage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TourPackage, 'id' | 'created_at'>>
      }
      destinations: {
        Row: Destination
        Insert: Omit<Destination, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Destination, 'id' | 'created_at'>>
      }
      booking_items: {
        Row: BookingItem
        Insert: Omit<BookingItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BookingItem, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Payment, 'id' | 'created_at'>>
      }
    }
  }
}

// Supabase client type (if using with Supabase JS client)
export type SupabaseClient = any // Replace with actual SupabaseClient type if needed
