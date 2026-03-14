import { supabase } from './supabase'

// Custom Tours Page Data Service
export class CustomToursService {
  // Save custom tour page configuration/content
  static async savePageData(pageData: {
    heroTitle?: string
    heroSubtitle?: string
    heroBackgroundImage?: string
    features?: Array<{
      title: string
      description: string
      icon?: string
    }>
    formSteps?: Array<{
      step: number
      title: string
      description: string
    }>
    destinations?: Array<{
      id: string
      name: string
      description: string
      image?: string
      popular?: boolean
    }>
    activities?: Array<{
      id: string
      name: string
      description: string
      category: string
      popular?: boolean
    }>
    accommodationOptions?: Array<{
      id: string
      name: string
      description: string
      priceCategory: string
    }>
    transportationOptions?: Array<{
      id: string
      name: string
      description: string
      priceCategory: string
    }>
    budgetRanges?: Array<{
      id: string
      name: string
      description: string
      minPrice: number
      maxPrice: number
    }>
    tourGuideOptions?: Array<{
      id: string
      name: string
      description: string
      language: string
      pricePerDay: number
    }>
    seoSettings?: {
      metaTitle?: string
      metaDescription?: string
      keywords?: string[]
      ogImage?: string
    }
    contactInfo?: {
      email?: string
      phone?: string
      address?: string
      workingHours?: string
    }
  }) {
    try {
      const { data, error } = await supabase
        .from('custom_tours_page_data')
        .upsert({
          id: 'main', // Single record for page data
          data: pageData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving custom tours page data:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in CustomToursService.savePageData:', error)
      return { success: false, message: 'Failed to save page data' }
    }
  }

  // Get custom tour page data
  static async getPageData() {
    try {
      const { data, error } = await supabase
        .from('custom_tours_page_data')
        .select('*')
        .eq('id', 'main')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return default data
          return { success: true, data: this.getDefaultPageData() }
        }
        console.error('Error fetching custom tours page data:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data: data?.data || this.getDefaultPageData() }
    } catch (error) {
      console.error('Error in CustomToursService.getPageData:', error)
      return { success: false, message: 'Failed to fetch page data' }
    }
  }

  // Save custom tour form submission (separate from bookings)
  static async saveFormSubmission(formData: {
    fullName: string
    email: string
    phone: string
    destination: string
    startDate: string
    endDate?: string
    adults: number
    children: number
    activities: string[]
    otherActivity?: string
    budgetRange: string
    accommodation: string
    transportation: string
    tourGuide?: string
    specialRequests?: string
    agreement: boolean
    status?: 'pending' | 'reviewed' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
    assignedTo?: string
    internalNotes?: string
    quoteAmount?: number
    quoteCurrency?: string
    followUpDate?: string
  }) {
    try {
      console.log('🔍 CustomToursService: Starting saveFormSubmission with data:', formData)
      
      // Check Supabase configuration
      console.log('🔍 CustomToursService: Checking Supabase config...')
      console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔍 Supabase client exists:', !!supabase)
      
      if (!supabase) {
        console.error('❌ CustomToursService: Supabase client not initialized')
        return { success: false, message: 'Supabase client not initialized' }
      }
      
      // Test if table exists by trying to describe it
      console.log('🔍 CustomToursService: Testing if table exists...')
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('custom_tour_submissions')
          .select('*')
          .limit(1)
        
        console.log('🔍 CustomToursService: Table test result - tableInfo:', tableInfo, 'tableError:', tableError)
        
        if (tableError && !tableError.message?.includes('does not exist')) {
          console.error('❌ CustomToursService: Table access error:', tableError)
        }
      } catch (tableTestError) {
        console.error('❌ CustomToursService: Table test exception:', tableTestError)
      }
      
      // Try with minimal data first
      console.log('🔍 CustomToursService: Trying with minimal data...')
      const minimalData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        start_date: formData.startDate,
        adults: formData.adults,
        children: formData.children,
        budget_range: formData.budgetRange,
        agreement: formData.agreement,
        status: 'pending',
        submission_date: new Date().toISOString()
      }
      
      console.log('🔍 CustomToursService: Minimal data to insert:', minimalData)
      
      // Try the insert with detailed logging
      console.log('🔍 CustomToursService: About to call supabase.insert...')
      
      try {
        const insertPromise = supabase
          .from('custom_tour_submissions')
          .insert(minimalData)
        
        console.log('🔍 CustomToursService: Insert promise created:', insertPromise)
        
        const result = await insertPromise
        
        console.log('🔍 CustomToursService: Insert promise resolved')
        console.log('🔍 CustomToursService: Full result object:', result)
        console.log('🔍 CustomToursService: Result data:', result.data)
        console.log('🔍 CustomToursService: Result error:', result.error)
        console.log('🔍 CustomToursService: Result count:', result.count)
        
        // Check if result has the expected structure
        if (!result) {
          console.error('❌ CustomToursService: No result returned from insert')
          return { success: false, message: 'No result returned from insert operation' }
        }
        
        const { data, error } = result
        
        // Check error object more thoroughly
        if (error) {
          console.error('❌ CustomToursService: Insert error detected')
          console.error('❌ Error object:', error)
          console.error('❌ Error type:', typeof error)
          console.error('❌ Error constructor:', error.constructor.name)
          console.error('❌ Error prototype:', Object.getPrototypeOf(error))
          console.error('❌ Error is plain object:', {}.toString.call(error) === '[object Object]')
          
          // Try to stringify with more detail
          try {
            const errorString = JSON.stringify(error)
            console.error('❌ JSON.stringify(error):', errorString)
          } catch (stringifyError) {
            console.error('❌ Cannot stringify error:', stringifyError)
          }
          
          // Try to enumerate properties manually
          console.error('❌ Manual property enumeration:')
          for (const prop in error) {
            console.error(`❌ ${prop}:`, error[prop])
          }
          
          // Try Object.keys with fallback
          try {
            const keys = Object.keys(error)
            console.error('❌ Object.keys(error):', keys)
          } catch (keysError) {
            console.error('❌ Object.keys failed:', keysError)
          }
          
          return { success: false, message: `Database error: ${error?.message || 'Unknown error'}` }
        }
        
        console.log('✅ CustomToursService: Insert successful - data:', data)
        
        if (data && data.length > 0) {
          return { success: true, data: data[0] }
        } else {
          console.log('🔍 CustomToursService: No data returned, but insert succeeded')
          return { success: true, data: { id: 'unknown', ...minimalData } }
        }
        
      } catch (insertException) {
        console.error('❌ CustomToursService: Insert exception caught:', insertException)
        console.error('❌ Exception type:', typeof insertException)
        console.error('❌ Exception message:', insertException.message)
        console.error('❌ Exception stack:', insertException.stack)
        console.error('❌ Exception name:', insertException.name)
        
        return { success: false, message: `Insert exception: ${insertException.message}` }
      }
    } catch (error) {
      console.error('❌ CustomToursService: Top-level error:', error)
      console.error('❌ Top-level error type:', typeof error)
      console.error('❌ Top-level error message:', error.message)
      return { success: false, message: `Top-level error: ${error.message || 'Unknown error'}` }
    }
  }

  // Get custom tour submissions with filtering
  static async getSubmissions(filters?: {
    status?: string
    email?: string
    destination?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
    offset?: number
  }) {
    try {
      console.log('🔍 CustomToursService: Starting getSubmissions with filters:', filters)
      
      let query = supabase
        .from('custom_tour_submissions')
        .select('*', { count: 'exact' })

      console.log('🔍 CustomToursService: Base query created')

      // Apply filters
      if (filters?.status) {
        console.log('🔍 CustomToursService: Applying status filter:', filters.status)
        query = query.eq('status', filters.status)
      }
      if (filters?.email) {
        console.log('🔍 CustomToursService: Applying email filter:', filters.email)
        query = query.eq('email', filters.email)
      }
      if (filters?.destination) {
        console.log('🔍 CustomToursService: Applying destination filter:', filters.destination)
        query = query.eq('destination', filters.destination)
      }
      if (filters?.dateFrom) {
        console.log('🔍 CustomToursService: Applying dateFrom filter:', filters.dateFrom)
        query = query.gte('submission_date', filters.dateFrom)
      }
      if (filters?.dateTo) {
        console.log('🔍 CustomToursService: Applying dateTo filter:', filters.dateTo)
        query = query.lte('submission_date', filters.dateTo)
      }

      // Apply pagination
      if (filters?.limit) {
        console.log('🔍 CustomToursService: Applying limit:', filters.limit)
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        console.log('🔍 CustomToursService: Applying offset:', filters.offset)
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      // Order by submission date
      query = query.order('submission_date', { ascending: false })
      console.log('🔍 CustomToursService: Final query configured, executing...')

      const { data, error, count } = await query
      console.log('🔍 CustomToursService: Query executed')
      console.log('🔍 CustomToursService: Raw data:', data)
      console.log('🔍 CustomToursService: Data length:', data?.length)
      console.log('🔍 CustomToursService: Error:', error)
      console.log('🔍 CustomToursService: Count:', count)

      if (error) {
        console.error('❌ CustomToursService: Error fetching custom tour submissions:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        return { success: false, data: [], total: 0 }
      }

      console.log('🔍 CustomToursService: Mapping data from snake_case to camelCase...')
      
      // Map snake_case to camelCase for frontend
      const mappedData = (data || []).map(item => {
        console.log('🔍 CustomToursService: Mapping item:', item)
        return {
          id: item.id,
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          destination: item.destination,
          startDate: item.start_date,
          endDate: item.end_date,
          adults: item.adults,
          children: item.children,
          activities: item.activities,
          otherActivity: item.other_activity,
          budgetRange: item.budget_range,
          accommodation: item.accommodation,
          transportation: item.transportation,
          tourGuide: item.tour_guide,
          specialRequests: item.special_requests,
          agreement: item.agreement,
          status: item.status,
          assignedTo: item.assigned_to,
          internalNotes: item.internal_notes,
          quoteAmount: item.quote_amount,
          quoteCurrency: item.quote_currency,
          followUpDate: item.follow_up_date,
          submissionDate: item.submission_date,
          updatedAt: item.updated_at
        }
      })

      console.log('🔍 CustomToursService: Mapped data length:', mappedData.length)
      console.log('🔍 CustomToursService: Sample mapped data:', mappedData.slice(0, 2))

      return { success: true, data: mappedData, total: count || 0 }
    } catch (error) {
      console.error('❌ CustomToursService: Error in getSubmissions:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return { success: false, data: [], total: 0, message: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
  }

  // Update submission status
  static async updateSubmissionStatus(submissionId: string, status: string, updateData?: {
    assignedTo?: string
    internalNotes?: string
    quoteAmount?: number
    quoteCurrency?: string
    followUpDate?: string
  }) {
    try {
      // Map camelCase to snake_case for database
      const dbUpdateData = {
        status,
        assigned_to: updateData?.assignedTo,
        internal_notes: updateData?.internalNotes,
        quote_amount: updateData?.quoteAmount,
        quote_currency: updateData?.quoteCurrency,
        follow_up_date: updateData?.followUpDate,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('custom_tour_submissions')
        .update(dbUpdateData)
        .eq('id', submissionId)
        .select()
        .single()

      if (error) {
        console.error('Error updating submission status:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in CustomToursService.updateSubmissionStatus:', error)
      return { success: false, message: 'Failed to update submission' }
    }
  }

  // Get submission statistics
  static async getSubmissionStats() {
    try {
      console.log('🔍 CustomToursService: Fetching submission stats...')
      
      // Test basic connection first
      const { data: testData, error: testError } = await supabase
        .from('custom_tour_submissions')
        .select('id')
        .limit(1)
      
      console.log('🔍 CustomToursService: Connection test - testData:', testData, 'testError:', testError)
      
      if (testError) {
        console.error('❌ CustomToursService: Database connection failed:', testError)
        return { success: false, message: `Database connection failed: ${testError.message}` }
      }

      // Fetch the actual stats data
      const { data, error } = await supabase
        .from('custom_tour_submissions')
        .select('status, destination, submission_date')

      console.log('🔍 CustomToursService: Stats query - data length:', data?.length, 'error:', error)

      if (error) {
        console.error('❌ CustomToursService: Error fetching submission stats:', error)
        return { success: false, message: `Database query failed: ${error.message}` }
      }

      const stats = {
        totalSubmissions: data?.length || 0,
        pendingSubmissions: data?.filter((s: any) => s.status === 'pending').length || 0,
        reviewedSubmissions: data?.filter((s: any) => s.status === 'reviewed').length || 0,
        contactedSubmissions: data?.filter((s: any) => s.status === 'contacted').length || 0,
        quotedSubmissions: data?.filter((s: any) => s.status === 'quoted').length || 0,
        acceptedSubmissions: data?.filter((s: any) => s.status === 'accepted').length || 0,
        rejectedSubmissions: data?.filter((s: any) => s.status === 'rejected').length || 0,
        popularDestinations: this.getPopularDestinations(data || []),
        monthlySubmissions: this.getMonthlySubmissions(data || [])
      }

      console.log('✅ CustomToursService: Stats calculated successfully:', stats)

      return { success: true, data: stats }
    } catch (error) {
      console.error('❌ CustomToursService: Error in getSubmissionStats:', error)
      return { success: false, message: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
  }

  // Helper methods
  private static getDefaultPageData() {
    return {
      heroTitle: "Plan Your Bohol Itinerary",
      heroSubtitle: "Tell us your preferences and we'll create a personalized itinerary for you",
      heroBackgroundImage: "/images/custom-tours-hero.jpg",
      features: [
        {
          title: "Free Consultation",
          description: "No obligation. We'll review your request and get back to you within 24 hours",
          icon: "check"
        },
        {
          title: "Personalized Itinerary",
          description: "Get a custom tour designed specifically for your preferences and budget",
          icon: "star"
        },
        {
          title: "Flexible Options",
          description: "Make changes until it's perfect. Your dream tour, your way",
          icon: "heart"
        }
      ],
      formSteps: [
        {
          step: 1,
          title: "Trip Details",
          description: "Tell us about your travel dates and destination preferences"
        },
        {
          step: 2,
          title: "Activities & Interests",
          description: "Select activities that interest you most"
        },
        {
          step: 3,
          title: "Budget & Preferences",
          description: "Set your budget and travel preferences"
        },
        {
          step: 4,
          title: "Contact Information",
          description: "Provide your contact details for follow-up"
        }
      ],
      destinations: [
        { id: "panglao", name: "Panglao Island", description: "Beaches and diving paradise", popular: true },
        { id: "chocolate-hills", name: "Chocolate Hills", description: "Iconic geological formation", popular: true },
        { id: "loboc-river", name: "Loboc River", description: "Scenic river cruise", popular: false },
        { id: "tarsier-sanctuary", name: "Tarsier Sanctuary", description: "See the world's smallest primate", popular: false }
      ],
      activities: [
        { id: "island-hopping", name: "Island Hopping", description: "Explore multiple islands", category: "adventure", popular: true },
        { id: "diving", name: "Scuba Diving", description: "Underwater exploration", category: "adventure", popular: true },
        { id: "snorkeling", name: "Snorkeling", description: "Surface water activities", category: "water", popular: false },
        { id: "cultural-tour", name: "Cultural Tour", description: "Historical and cultural sites", category: "cultural", popular: false },
        { id: "wildlife-watching", name: "Wildlife Watching", description: "Nature and wildlife encounters", category: "nature", popular: false }
      ],
      accommodationOptions: [
        { id: "budget", name: "Budget-Friendly", description: "Clean and comfortable accommodations", priceCategory: "budget" },
        { id: "mid-range", name: "Mid-Range Hotels", description: "3-star hotels with good amenities", priceCategory: "standard" },
        { id: "luxury", name: "Luxury Resorts", description: "Premium resorts and spas", priceCategory: "luxury" }
      ],
      transportationOptions: [
        { id: "private", name: "Private Vehicle", description: "Dedicated transportation for your group", priceCategory: "premium" },
        { id: "shared", name: "Shared Transport", description: "Cost-effective shared transportation", priceCategory: "standard" },
        { id: "public", name: "Public Transport", description: "Local buses and tricycles", priceCategory: "budget" }
      ],
      budgetRanges: [
        { id: "budget", name: "Budget", description: "Economical options", minPrice: 1000, maxPrice: 3000 },
        { id: "standard", name: "Standard", description: "Good value for money", minPrice: 3000, maxPrice: 6000 },
        { id: "premium", name: "Premium", description: "Enhanced experiences", minPrice: 6000, maxPrice: 10000 },
        { id: "luxury", name: "Luxury", description: "Premium exclusive experiences", minPrice: 10000, maxPrice: 20000 }
      ],
      tourGuideOptions: [
        { id: "local", name: "Local Guide", description: "Knowledgeable local guides", language: "English/Tagalog", pricePerDay: 1500 },
        { id: "professional", name: "Professional Guide", description: "Certified tour guides", language: "English", pricePerDay: 2500 },
        { id: "specialized", name: "Specialized Guide", description: "Expert guides for specific activities", language: "English", pricePerDay: 3500 }
      ],
      seoSettings: {
        metaTitle: "Custom Bohol Tours - Personalized Itineraries | Fiona Travel",
        metaDescription: "Create your personalized Bohol tour itinerary. Custom tours designed around your preferences, budget, and schedule.",
        keywords: ["custom tours", "bohol tours", "personalized itinerary", "bohol travel"],
        ogImage: "/images/custom-tours-og.jpg"
      },
      contactInfo: {
        email: "custom@fionatravel.com",
        phone: "+63 912 345 6789",
        address: "Tagbilaran City, Bohol, Philippines",
        workingHours: "Monday to Saturday, 8:00 AM - 6:00 PM"
      }
    }
  }

  private static getPopularDestinations(submissions: any[]) {
    const destinationCounts: { [key: string]: number } = {}
    submissions.forEach(sub => {
      if (sub.destination) {
        destinationCounts[sub.destination] = (destinationCounts[sub.destination] || 0) + 1
      }
    })
    return Object.entries(destinationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }

  private static getMonthlySubmissions(submissions: any[]) {
    const monthlyData: { [key: string]: number } = {}
    submissions.forEach(sub => {
      const month = new Date(sub.submission_date).toISOString().slice(0, 7)
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })
    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  // Delete submission
  static async deleteSubmission(submissionId: string) {
    try {
      const { error } = await supabase
        .from('custom_tour_submissions')
        .delete()
        .eq('id', submissionId)

      if (error) {
        console.error('Error deleting submission:', error)
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in CustomToursService.deleteSubmission:', error)
      return { success: false, message: 'Failed to delete submission' }
    }
  }

  // Update submission (for edit functionality)
  static async updateSubmission(submissionId: string, updateData: {
    fullName?: string
    email?: string
    destination?: string
    budgetRange?: string
    adults?: number
    children?: number
    status?: string
  }) {
    try {
      // Map camelCase to snake_case for database
      const dbUpdateData = {
        full_name: updateData.fullName,
        email: updateData.email,
        destination: updateData.destination,
        budget_range: updateData.budgetRange,
        adults: updateData.adults,
        children: updateData.children,
        status: updateData.status,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('custom_tour_submissions')
        .update(dbUpdateData)
        .eq('id', submissionId)
        .select()
        .single()

      if (error) {
        console.error('Error updating submission:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in CustomToursService.updateSubmission:', error)
      return { success: false, message: 'Failed to update submission' }
    }
  }
}

export default CustomToursService
