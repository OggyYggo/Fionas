'use client'

import { useState } from 'react'
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
    duration: tour?.duration || 'Full Day',
    maxPeople: tour?.maxPeople || '',
    price: tour?.price || '',
    tag: tour?.tag || 'Island Hopping',
    featured: tour?.featured || false,
    highlights: tour?.highlights || [
      'Professional tour guide',
      'Hotel pickup and drop-off',
      'All entrance fees included',
      'Small group experience'
    ],
    included: tour?.included || [
      'Hotel pickup and drop-off',
      'Boat transfers',
      'Snorkeling equipment',
      'Local guide',
      'Morning snacks',
      'Environmental fees'
    ],
    notIncluded: tour?.notIncluded || [
      'Lunch',
      'Underwater camera',
      'Tips and gratuities',
      'Personal expenses'
    ],
    pricing: tour?.pricing || {
      local: [
        { pax: 1, price: '₱3,500' },
        { pax: 2, price: '₱2,000' },
        { pax: 3, price: '₱1,500' },
        { pax: 4, price: '₱1,200' },
        { pax: 5, price: '₱1,000' },
        { pax: 6, price: '₱900' },
        { pax: 7, price: '₱800' },
        { pax: 8, price: '₱750' },
        { pax: 9, price: '₱700' },
        { pax: '10+', price: '₱650' }
      ],
      foreigner: [
        { pax: 1, price: '$70' },
        { pax: 2, price: '$40' },
        { pax: 3, price: '$30' },
        { pax: 4, price: '$25' },
        { pax: 5, price: '$20' },
        { pax: 6, price: '$18' },
        { pax: 7, price: '$16' },
        { pax: 8, price: '$15' },
        { pax: 9, price: '$14' },
        { pax: '10+', price: '$13' }
      ]
    }
  })

  const [imageFile, setImageFile] = useState<File | null>(null)

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
    
    if (!formData.duration || formData.duration.trim() === '') {
      console.error('❌ Validation error: Duration is required')
      alert('Please select a tour duration from the dropdown')
      return
    }
    
    if (!formData.maxPeople.trim()) {
      console.error('❌ Validation error: Max people is required')
      alert('Maximum number of people is required')
      return
    }
    
    if (!formData.tag || formData.tag.trim() === '') {
      console.error('❌ Validation error: Category tag is required')
      alert('Please select a tour category from the dropdown')
      return
    }
    
    const submitData = { ...formData }
    console.log('🔍 Submit data prepared:', submitData)
    
    // If there's a new image file, handle upload
    if (imageFile) {
      console.log('🔍 Uploading image file:', imageFile.name)
      try {
        const { SimpleTourService } = await import('@/lib/simpleTourService')
        const imageUrl = await SimpleTourService.saveImage(imageFile)
        submitData.image = imageUrl
        console.log('✅ Image uploaded successfully:', imageUrl)
      } catch (error) {
        console.error('❌ Error uploading image:', error)
        // If image upload fails, use a placeholder instead of blocking the entire form
        console.log('🔄 Using placeholder image instead...')
        submitData.image = `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.title || 'Tour')}`
        alert('Image upload failed. Using placeholder image. You can update the image later.')
      }
    } else if (!submitData.image) {
      // Use placeholder if no image provided
      console.log('🔄 No image provided, using placeholder...')
      submitData.image = `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.title || 'Tour')}`
    }
    
    console.log('🔍 Calling onSubmit with data:', submitData)
    onSubmit(submitData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{tour ? 'Edit Tour' : 'Add New Tour'}</h1>
        <p className="text-gray-600">
          {tour ? 'Update the tour information below.' : 'Fill in the details to create a new tour package.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            
            <div className="space-y-3">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">Base Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., ₱3,500"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the tour experience..."
              rows={4}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                  <SelectItem value="Full Day">Full Day</SelectItem>
                  <SelectItem value="2 Hours">2 Hours</SelectItem>
                  <SelectItem value="3 Hours">3 Hours</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxPeople" className="text-sm font-medium text-gray-700">Max People</Label>
              <Input
                id="maxPeople"
                value={formData.maxPeople}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPeople: e.target.value }))}
                placeholder="e.g., 10"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tag" className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Image</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
              
            {formData.image && (
              <div className="relative">
                <img 
                  src={formData.image} 
                  alt="Tour preview" 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tour Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Tour Highlights</Label>
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
              <div className="min-h-[100px] bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 text-center">Click "Add Highlight" to add tour highlights</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">What's Included</Label>
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
              <div className="min-h-[100px] bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 text-center">Click "Add Item" to add included items</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Not Included</Label>
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
            <div className="min-h-[100px] bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 text-center">Click "Add Item" to add not included items</p>
            </div>
          </div>
        </div>

        {/* Package Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Package Pricing</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Local Rates
              </h3>
              <div className="space-y-3">
                {formData.pricing.local.map((rate, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <Input
                        value={rate.pax}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.local[index].pax = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Pax"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={rate.price}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.local[index].price = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Price"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Foreigner Rates
              </h3>
              <div className="space-y-3">
                {formData.pricing.foreigner.map((rate, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <Input
                        value={rate.pax}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.foreigner[index].pax = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Pax"
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={rate.price}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.foreigner[index].price = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Price"
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tour Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">Tour Settings</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                className="data-[state=checked]:bg-blue-600"
              />
              <div>
                <Label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">Featured Tour</Label>
                <p className="text-xs text-gray-500">Display this tour prominently on the website</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
            className="h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
          </Button>
        </div>
      </form>
    </div>
  )
}
