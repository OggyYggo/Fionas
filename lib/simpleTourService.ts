import { Tour } from '@/types/tour'

export interface PaginatedToursResponse {
  tours: Tour[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export class SimpleTourService {
  private static async getSupabase() {
    try {
      const { supabase } = await import('@/lib/supabase')
      console.log('🔍 SimpleTourService: Supabase import successful')
      
      // Test connection using tours table (the actual table name)
      const { error } = await supabase
        .from('tours')
        .select('id', { head: true, count: 'exact' })
      if (error) {
        console.error('❌ SimpleTourService: Supabase connection test failed:', error)
        throw new Error(`Database connection failed: ${error.message}`)
      }
      
      console.log('✅ SimpleTourService: Supabase connection test passed')
      return supabase
    } catch (error) {
      console.error('❌ SimpleTourService: Failed to get Supabase client:', error)
      throw error
    }
  }

  static async getToursPaginated(
    page: number = 1,
    limit: number = 9,
    search?: string,
    category?: string
  ): Promise<PaginatedToursResponse> {
    try {
      const supabase = await this.getSupabase()
      
      let query = supabase
        .from('tours')
        .select('*', { count: 'exact' })
        .neq('tour_type', 'Destinations') // Exclude destinations - only show packages
      
      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }
      
      if (category && category !== 'All Categories') {
        query = query.eq('tag', category)
      }
      
      // Apply pagination and ordering
      const { data, error, count } = await query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) {
        console.error('❌ Error fetching paginated tours:', error)
        throw new Error(error.message)
      }

      const tours = (data || []).map(tour => ({
        ...tour,
        maxPeople: tour.max_people,
        notIncluded: tour.not_included
      }))
      
      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / limit)

      return {
        tours,
        totalCount,
        currentPage: page,
        totalPages
      }
    } catch (error) {
      console.error('❌ Error in getToursPaginated:', error)
      throw error
    }
  }

  static async getAllTours(): Promise<Tour[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .neq('tour_type', 'Destinations') // Exclude destinations - only show packages
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching tours:', error)
        throw new Error(error.message)
      }

      return (data || []).map(tour => ({
        ...tour,
        maxPeople: tour.max_people,
        notIncluded: tour.not_included,
        gallery_urls: tour.gallery_urls || [],
        tourType: tour.tour_type || 'Package'
      }))
    } catch (error) {
      console.error('❌ Error in getAllTours:', error)
      throw error
    }
  }

  static async getTourById(id: number): Promise<Tour | null> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching tour:', error)
        return null
      }

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: data.tour_type || 'Package'
      }
    } catch (error) {
      console.error('❌ Error in getTourById:', error)
      return null
    }
  }

  static async createTour(tourData: Omit<Tour, 'id'>): Promise<Tour> {
    try {
      console.log('🔍 SimpleTourService: Creating tour:', tourData)
      console.log('🔍 SimpleTourService: Using TOURS table (not tour_packages)')
      
      const supabase = await this.getSupabase()
      console.log('🔍 SimpleTourService: Supabase client obtained')

      const resolvedTourType = (tourData as any).tour_type || tourData.tourType || 'Package'
      
      const dbData = {
        title: tourData.title,
        description: tourData.description,
        image: tourData.image,
        gallery_urls: tourData.gallery_urls || [],
        tour_type: resolvedTourType,
        price: tourData.price,
        tag: tourData.tag,
        featured: tourData.featured,
        highlights: tourData.highlights || [],
        itinerary: tourData.itinerary || [],
        included: tourData.included || [],
        not_included: tourData.notIncluded || [],
        why_choose: (tourData as any).why_choose || tourData.why_choose || [],
        reviews: tourData.reviews || [],
        faqs: tourData.faqs || [],
        pricing: tourData.pricing || {}
      }

      console.log('🔍 SimpleTourService: Prepared data for DB:', dbData)

      console.log('🔍 SimpleTourService: Making INSERT call to tours table...')
      const { data, error } = await supabase
        .from('tours')
        .insert([dbData])
        .select()
        .single()

      console.log('🔍 SimpleTourService: Insert response:', { data, error })

      if (error) {
        console.error('❌ SimpleTourService: Insert error:', error)
        throw new Error(error.message)
      }

      if (!data) {
        console.error('❌ SimpleTourService: No data returned from insert')
        throw new Error('Failed to create tour: No data returned')
      }

      console.log('✅ SimpleTourService: Tour saved successfully:', data)

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: data.tour_type || 'Package'
      }
    } catch (error) {
      console.error('❌ SimpleTourService: Error creating tour:', error)
      throw error
    }
  }

  static async updateTour(id: number, tourData: Partial<Tour>): Promise<Tour | null> {
    try {
      console.log('🔍 SimpleTourService: Updating tour:', { id, tourData })
      
      const supabase = await this.getSupabase()
      console.log('🔍 SimpleTourService: Supabase client obtained for update')
      
      const dbData: any = {}
      
      if (tourData.title) dbData.title = tourData.title
      if (tourData.description) dbData.description = tourData.description
      if (tourData.image) dbData.image = tourData.image
      if (tourData.price) dbData.price = tourData.price
      if (tourData.tag) dbData.tag = tourData.tag
      if (tourData.featured !== undefined) dbData.featured = tourData.featured
      if (tourData.gallery_urls) dbData.gallery_urls = tourData.gallery_urls
      if (tourData.highlights) dbData.highlights = tourData.highlights
      if (tourData.itinerary) dbData.itinerary = tourData.itinerary
      if (tourData.included) dbData.included = tourData.included
      if (tourData.notIncluded) dbData.not_included = tourData.notIncluded
      if ((tourData as any).why_choose || tourData.why_choose) dbData.why_choose = (tourData as any).why_choose || tourData.why_choose
      if (tourData.reviews) dbData.reviews = tourData.reviews
      if (tourData.faqs) dbData.faqs = tourData.faqs
      if (tourData.pricing) dbData.pricing = tourData.pricing
      if ((tourData as any).tour_type || tourData.tourType) dbData.tour_type = (tourData as any).tour_type || tourData.tourType

      console.log('🔍 SimpleTourService: Prepared update data:', dbData)

      const { data, error } = await supabase
        .from('tours')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      console.log('🔍 SimpleTourService: Update response:', { data, error })

      if (error) {
        console.error('❌ SimpleTourService: Update error:', error)
        return null
      }

      if (!data) {
        console.error('❌ SimpleTourService: No data returned from update')
        return null
      }

      console.log('✅ SimpleTourService: Tour updated successfully:', data)

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: data.tour_type || 'Package'
      }
    } catch (error) {
      console.error('❌ SimpleTourService: Error in updateTour:', error)
      return null
    }
  }

  static async deleteTour(id: number): Promise<boolean> {
    try {
      const supabase = await this.getSupabase()
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting tour:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('❌ Error in deleteTour:', error)
      return false
    }
  }

  static async saveImage(file: File): Promise<string> {
    try {
      console.log('🔍 SimpleTourService: Starting image upload:', file.name, file.size, file.type)
      
      const supabase = await this.getSupabase()
      console.log('🔍 SimpleTourService: Supabase client obtained for image upload')
      
      // Validate file
      if (!file) {
        throw new Error('No file provided')
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size must be less than 5MB')
      }
      
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `tours/${fileName}`
      
      console.log('🔍 SimpleTourService: Upload details:', { fileName, filePath, fileSize: file.size })

      // Skip bucket listing check since we know the bucket exists
      console.log('🔍 SimpleTourService: Using tour-images bucket (assumed to exist)')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('🔍 SimpleTourService: Upload response:', { uploadData, uploadError })

      if (uploadError) {
        console.error('❌ SimpleTourService: Upload error:', uploadError)
        
        // Provide more specific error messages
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket "tour-images" not found. Please create it in Supabase Dashboard.')
        } else if (uploadError.message.includes('Permission')) {
          throw new Error('Permission denied. Check Supabase storage policies.')
        } else if (uploadError.message.includes('size')) {
          throw new Error('File too large. Maximum size is 5MB.')
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }
      }

      if (!uploadData) {
        console.error('❌ SimpleTourService: No upload data returned')
        throw new Error('Upload failed: No data returned')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      console.log('✅ SimpleTourService: Image uploaded successfully:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ SimpleTourService: Error saving image:', error)
      throw error
    }
  }
}
