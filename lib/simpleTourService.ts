import { Tour } from '@/types/tour'

export class SimpleTourService {
  private static async getSupabase() {
    try {
      const { supabase } = await import('@/lib/supabase')
      console.log('🔍 SimpleTourService: Supabase import successful')
      
      // Test connection using tours table (the actual table name)
      const { data, error } = await supabase.from('tours').select('count').limit(1)
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

  static async getAllTours(): Promise<Tour[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching tours:', error)
        throw new Error(error.message)
      }

      return (data || []).map(tour => ({
        ...tour,
        maxPeople: tour.max_people,
        notIncluded: tour.not_included
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
        notIncluded: data.not_included
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
      
      const dbData = {
        title: tourData.title,
        description: tourData.description,
        image: tourData.image,
        duration: tourData.duration,
        max_people: tourData.maxPeople,
        price: tourData.price,
        tag: tourData.tag,
        featured: tourData.featured,
        highlights: tourData.highlights || [],
        included: tourData.included || [],
        not_included: tourData.notIncluded || [],
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
        notIncluded: data.not_included
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
      if (tourData.duration) dbData.duration = tourData.duration
      if (tourData.maxPeople) dbData.max_people = tourData.maxPeople
      if (tourData.price) dbData.price = tourData.price
      if (tourData.tag) dbData.tag = tourData.tag
      if (tourData.featured !== undefined) dbData.featured = tourData.featured
      if (tourData.highlights) dbData.highlights = tourData.highlights
      if (tourData.included) dbData.included = tourData.included
      if (tourData.notIncluded) dbData.not_included = tourData.notIncluded
      if (tourData.pricing) dbData.pricing = tourData.pricing

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
        notIncluded: data.not_included
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
