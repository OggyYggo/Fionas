'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tour } from '@/types/tour'

interface TourFormProps {
  tour?: Tour
  onSubmit: (tour: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TourForm({ tour, onSubmit, onCancel, isLoading }: TourFormProps) {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    description: tour?.description || '',
    image: tour?.image || '',
    price: tour?.price || '',
    tag: tour?.tag || 'Island Hopping',
    featured: tour?.featured || false,
    gallery_urls: tour?.gallery_urls || [],
    tour_type: tour?.tourType || 'Package',
    highlights: tour?.highlights || [],
    itinerary: tour?.itinerary || [],
    included: tour?.included || [],
    notIncluded: tour?.notIncluded || [],
    why_choose: tour?.why_choose || [],
    reviews: tour?.reviews || [],
    faqs: tour?.faqs || []
  })

  const [mainImages, setMainImages] = useState<File[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isMainImageUploading, setIsMainImageUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'package' | 'destinations'>((tour?.tourType === 'Destinations' ? 'destinations' : 'package'))

  const formatPrice = (value: string): string => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, '')
    // Add commas as thousand separators
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digits
    const formattedValue = formatPrice(rawValue)
    setFormData(prev => ({ ...prev, price: formattedValue ? `₱${formattedValue}` : '' }))
  }

  const handleUploadTypeChange = (value: 'package' | 'destinations') => {
    setUploadType(value)
    const tourType = value === 'destinations' ? 'Destinations' : 'Package'
    setFormData(prev => ({ ...prev, tour_type: tourType }))
    
    // Clear excess images if switching to destinations (1 photo limit)
    if (value === 'destinations' && mainImages.length > 1) {
      setMainImages(prev => prev.slice(0, 1))
    }
  }

  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Skip conversion for small WebP files to improve performance
      if (file.type === 'image/webp' && file.size < 2 * 1024 * 1024) {
        resolve(file)
        return
      }
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Limit maximum dimensions to improve performance
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Use lower quality for better performance
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp'
            })
            resolve(webpFile)
          } else {
            reject(new Error('Failed to convert to WebP'))
          }
        }, 'image/webp', 0.8) // Reduced quality from 0.9 to 0.8
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File must be an image')
        return
      }
      
      setIsMainImageUploading(true)
      try {
        // Convert to WebP if not already WebP
        const processedFile = file.type === 'image/webp' ? file : await convertToWebP(file)
        setImageFile(processedFile)
        // Create preview URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }))
          setIsMainImageUploading(false)
        }
        reader.readAsDataURL(processedFile)
      } catch (error) {
        console.error('Error processing image:', error)
        setIsMainImageUploading(false)
        alert('Failed to process image. Please try a different file.')
      }
    }
  }

  const handleMainImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Validate all files
      const invalidFiles = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
          return true
        }
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not an image.`)
          return true
        }
        return false
      })
      
      if (invalidFiles.length > 0) return
      
      // Set limit based on upload type
      const maxImages = uploadType === 'package' ? 5 : 1
      const remainingSlots = maxImages - mainImages.length
      const filesToProcess = files.slice(0, remainingSlots)
      
      if (files.length > remainingSlots) {
        const limitText = uploadType === 'package' ? '5 photos for packages' : '1 photo for destinations'
        alert(`You can only upload up to ${limitText}. Only the first ${remainingSlots} images will be processed.`)
      }
      
      setIsMainImageUploading(true)
      const processedFiles: File[] = []
      
      try {
        // Process images in parallel for better performance
        const processingPromises = filesToProcess.map(async (file) => {
          // Convert to WebP if not already WebP
          return file.type === 'image/webp' ? file : await convertToWebP(file)
        })
        
        const processedResults = await Promise.all(processingPromises)
        processedFiles.push(...processedResults)
        
        setMainImages(prev => [...prev, ...processedFiles])
        
        // Set the first image as the main image for backward compatibility
        if (processedFiles.length > 0 && !formData.image) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result as string }))
          }
          reader.readAsDataURL(processedFiles[0])
        }
      } catch (error) {
        console.error('Error processing main images:', error)
        alert('Failed to process some images. Please try again.')
      } finally {
        setIsMainImageUploading(false)
      }
    }
  }

  const removeMainImage = (index: number) => {
    setMainImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      
      // Update the main image if the first image was removed
      if (index === 0 && newImages.length > 0) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }))
        }
        reader.readAsDataURL(newImages[0])
      } else if (index === 0 && newImages.length === 0) {
        setFormData(prev => ({ ...prev, image: '' }))
      }
      
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 TourForm handleSubmit called')
    console.log('🔍 Form data:', formData)
    
    // Basic validation
    if (!formData.title.trim()) {
      console.error('❌ Validation error: Title is required')
      alert('Tour title is required')
      return
    }
    
    if (!formData.description.trim()) {
      console.error('❌ Validation error: Description is required')
      alert('Tour description is required')
      return
    }
    
    if (!formData.price.trim()) {
      console.error('❌ Validation error: Price is required')
      alert('Tour price is required')
      return
    }
    
    if (!formData.tag || formData.tag.trim() === '') {
      console.error('❌ Validation error: Category tag is required')
      alert('Please select a tour category from the dropdown')
      return
    }
    
    const submitData = { ...formData }
    
    // Filter out empty items before saving to database
    submitData.itinerary = formData.itinerary.filter((item: string) => item.trim() !== '')
    submitData.highlights = formData.highlights.filter((item: string) => item.trim() !== '')
    submitData.included = formData.included.filter((item: string) => item.trim() !== '')
    submitData.notIncluded = formData.notIncluded.filter((item: string) => item.trim() !== '')
    submitData.why_choose = formData.why_choose.filter((item: string) => item.trim() !== '')
    submitData.reviews = formData.reviews.filter((review: any) => review.author.trim() !== '' || review.comment.trim() !== '')
    submitData.faqs = formData.faqs.filter((faq: any) => faq.question.trim() !== '' || faq.answer.trim() !== '')
    
    console.log('🔍 Submit data prepared:', submitData)
    
    // Handle main images upload (up to 5 photos)
    if (mainImages.length > 0) {
      console.log('🔍 Uploading main images:', mainImages.length, 'files')
      try {
        const { SimpleTourService } = await import('@/lib/simpleTourService')
        
        // Upload images in parallel for better performance
        const uploadPromises = mainImages.map(file => SimpleTourService.saveImage(file))
        const mainImageUrls = await Promise.all(uploadPromises)
        
        submitData.image = mainImageUrls[0] // Use first image as primary
        submitData.gallery_urls = mainImageUrls.slice(1) // Use remaining as gallery
        console.log('✅ Main images uploaded successfully:', mainImageUrls)
      } catch (error) {
        console.error('❌ Error uploading main images:', error)
        console.log('🔄 Using placeholder image instead...')
        submitData.image = `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.title || 'Tour')}`
        submitData.gallery_urls = []
        alert('Main images upload failed. Using placeholder image. You can update the images later.')
      }
    } else if (!submitData.image) {
      // Use placeholder if no image provided
      console.log('🔄 No main image provided, using placeholder...')
      submitData.image = `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.title || 'Tour')}`
    }
    
    console.log('🔍 Calling onSubmit with data:', submitData)
    onSubmit(submitData)
  }

  return (
    <div className="w-full space-y-8 pt-[50px] pb-[50px]">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Tour Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Panglao Island Hopping"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Tour Description</Label>
              <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
              }}
              placeholder="Describe the tour experience in detail..."
              rows={6}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              required
              maxLength={500}
            />
            {formData.description.length > 490 && (
              <p className="text-xs text-amber-600">You're approaching the character limit!</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">Base Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₱</span>
                <Input
                  id="price"
                  value={formData.price.replace('₱', '')}
                  onChange={handlePriceChange}
                  placeholder="3,500"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="tag" className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-lg">
                  <SelectItem value="Island Hopping">Island Hopping</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Nature">Nature</SelectItem>
                  <SelectItem value="Water Sports">Water Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tour Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Images</h2>
            <div className="flex items-center space-x-3">
              {/* Upload Type Dropdown */}
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700">Type:</Label>
                <Select value={uploadType} onValueChange={handleUploadTypeChange}>
                  <SelectTrigger className="h-8 w-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="destinations">Destinations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                {mainImages.length}/{uploadType === 'package' ? '5' : '1'} photos
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                multiple={uploadType === 'package'}
                onChange={handleMainImagesChange}
                className="hidden"
                disabled={isMainImageUploading}
              />
              
              {/* Show upload area if under limit */}
              {mainImages.length < (uploadType === 'package' ? 5 : 1) && (
                <label htmlFor="image" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200 group">
                  {isMainImageUploading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {mainImages.length > 0 ? 'Processing additional images...' : 'Processing images...'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Converting to WebP and optimizing...
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center pt-6 pb-8 px-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm font-medium text-gray-700"><span className="text-blue-600">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 text-center">PNG, JPG, GIF, WebP up to 10MB each<br/><span className="text-blue-600 font-medium">Maximum {uploadType === 'package' ? '5 photos' : '1 photo'} • Auto-converted to WebP</span></p>
                  </div>
                </label>
              )}

              {/* Display uploaded main images */}
              {mainImages.length > 0 && (
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Uploaded Tour Images</p>
                    <span className="text-xs text-blue-600 font-medium">{mainImages.length} photos</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {mainImages.map((file, index) => (
                      <div key={`main-${index}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Tour image ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMainImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tour Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Details</h2>
          
          {/* 1. Tour Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">1. Tour Highlights</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  highlights: [...prev.highlights, ''] 
                }))}
                className="h-8 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                + Add Highlight
              </Button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...formData.highlights]
                      newHighlights[index] = e.target.value
                      setFormData(prev => ({ ...prev, highlights: newHighlights }))
                    }}
                    placeholder="Enter tour highlight..."
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formData.highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newHighlights = formData.highlights.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, highlights: newHighlights }))
                      }}
                      className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              {formData.highlights.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Highlight" to add tour highlights</p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Tour Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">2. Tour Itinerary</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  itinerary: [...prev.itinerary, ''] 
                }))}
                className="h-8 px-3 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                + Add Itinerary Item
              </Button>
            </div>
            <div className="space-y-2">
              {formData.itinerary.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-purple-100 text-purple-600 rounded-lg font-semibold text-sm">
                    {index + 1}
                  </div>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItinerary = [...formData.itinerary]
                      newItinerary[index] = e.target.value
                      setFormData(prev => ({ ...prev, itinerary: newItinerary }))
                    }}
                    placeholder="Enter itinerary item..."
                    className="h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  {formData.itinerary.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItinerary = formData.itinerary.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, itinerary: newItinerary }))
                      }}
                      className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              {formData.itinerary.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Itinerary Item" to add tour itinerary items</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Tour Inclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">3. Tour Inclusions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  included: [...prev.included, ''] 
                }))}
                className="h-8 px-3 text-xs border-green-200 text-green-600 hover:bg-green-50"
              >
                + Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {formData.included.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newIncluded = [...formData.included]
                      newIncluded[index] = e.target.value
                      setFormData(prev => ({ ...prev, included: newIncluded }))
                    }}
                    placeholder="Enter included item..."
                    className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {formData.included.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIncluded = formData.included.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, included: newIncluded }))
                      }}
                      className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              {formData.included.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Item" to add included items</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Tour Exclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">4. Tour Exclusions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  notIncluded: [...prev.notIncluded, ''] 
                }))}
                className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
              >
                + Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {formData.notIncluded.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newNotIncluded = [...formData.notIncluded]
                      newNotIncluded[index] = e.target.value
                      setFormData(prev => ({ ...prev, notIncluded: newNotIncluded }))
                    }}
                    placeholder="Enter not included item..."
                    className="h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  {formData.notIncluded.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newNotIncluded = formData.notIncluded.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, notIncluded: newNotIncluded }))
                      }}
                      className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              {formData.notIncluded.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Item" to add not included items</p>
                </div>
              )}
            </div>
          </div>
        </div>

        
        {/* Why Choose This Tour */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Why Choose This Tour</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Reasons to Choose</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  why_choose: [...prev.why_choose, ''] 
                }))}
                className="h-8 px-3 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                + Add Reason
              </Button>
            </div>
            <div className="space-y-2">
              {formData.why_choose.map((reason, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-indigo-100 text-indigo-600 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Input
                    value={reason}
                    onChange={(e) => {
                      const newWhyChoose = [...formData.why_choose]
                      newWhyChoose[index] = e.target.value
                      setFormData(prev => ({ ...prev, why_choose: newWhyChoose }))
                    }}
                    placeholder="Enter reason to choose this tour..."
                    className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {formData.why_choose.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newWhyChoose = formData.why_choose.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, why_choose: newWhyChoose }))
                      }}
                      className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              {formData.why_choose.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Reason" to add reasons why customers should choose this tour</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Customer Reviews</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Reviews</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  reviews: [...prev.reviews, { author: '', rating: 5, comment: '', date: '' }] 
                }))}
                className="h-8 px-3 text-xs border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              >
                + Add Review
              </Button>
            </div>
            <div className="space-y-4">
              {formData.reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={review.author}
                      onChange={(e) => {
                        const newReviews = [...formData.reviews]
                        newReviews[index].author = e.target.value
                        setFormData(prev => ({ ...prev, reviews: newReviews }))
                      }}
                      placeholder="Author name"
                      className="h-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium text-gray-700">Rating:</Label>
                      <Select 
                        value={review.rating.toString()} 
                        onValueChange={(value) => {
                          const newReviews = [...formData.reviews]
                          newReviews[index].rating = parseInt(value)
                          setFormData(prev => ({ ...prev, reviews: newReviews }))
                        }}
                      >
                        <SelectTrigger className="h-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={review.date}
                      onChange={(e) => {
                        const newReviews = [...formData.reviews]
                        newReviews[index].date = e.target.value
                        setFormData(prev => ({ ...prev, reviews: newReviews }))
                      }}
                      placeholder="Date (optional)"
                      className="h-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  <Textarea
                    value={review.comment}
                    onChange={(e) => {
                      const newReviews = [...formData.reviews]
                      newReviews[index].comment = e.target.value
                      setFormData(prev => ({ ...prev, reviews: newReviews }))
                    }}
                    placeholder="Review comment..."
                    rows={3}
                    className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
                  />
                  {formData.reviews.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newReviews = formData.reviews.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, reviews: newReviews }))
                      }}
                      className="h-8 w-20 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.reviews.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add Review" to add customer reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">FAQs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  faqs: [...prev.faqs, { question: '', answer: '' }] 
                }))}
                className="h-8 px-3 text-xs border-green-200 text-green-600 hover:bg-green-50"
              >
                + Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                      Q
                    </div>
                    <Input
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].question = e.target.value
                        setFormData(prev => ({ ...prev, faqs: newFaqs }))
                      }}
                      placeholder="Question..."
                      className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mt-2">
                      A
                    </div>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].answer = e.target.value
                        setFormData(prev => ({ ...prev, faqs: newFaqs }))
                      }}
                      placeholder="Answer..."
                      rows={2}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  {formData.faqs.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFaqs = formData.faqs.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, faqs: newFaqs }))
                      }}
                      className="h-8 w-20 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.faqs.length === 0 && (
                <div className="min-h-[40px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500">Click "Add FAQ" to add frequently asked questions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tour Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Settings</h2>
          
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                />
                {formData.featured && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <Label htmlFor="featured" className="text-sm font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                  Featured Tour
                  {formData.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Active</span>
                  )}
                </Label>
                <p className="text-xs text-gray-600 mt-1">Display this tour prominently on the website homepage and featured sections</p>
              </div>
            </div>
            {formData.featured && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-sm font-medium text-yellow-600">Featured</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-6 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
            className="h-11 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 min-w-[100px]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
          >
            {isLoading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
          </Button>
        </div>
      </form>
    </div>
  )
}
