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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{tour ? 'Edit Tour' : 'Add New Tour'}</CardTitle>
        <CardDescription>
          {tour ? 'Update the tour information below.' : 'Fill in the details to create a new tour package.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tour Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Panglao Island Hopping"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., ₱3,500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the tour experience..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="maxPeople">Max People</Label>
              <Input
                id="maxPeople"
                value={formData.maxPeople}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPeople: e.target.value }))}
                placeholder="e.g., Max 10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Category Tag</Label>
              <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}>
                <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="image">Tour Image</Label>
            <div className="space-y-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Tour preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              {!imageFile && tour?.image && (
                <p className="text-sm text-gray-500">
                  Current image: {tour.image}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tour Highlights</Label>
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
                    placeholder="Enter tour highlight"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newHighlights = formData.highlights.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, highlights: newHighlights }))
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  highlights: [...prev.highlights, ''] 
                }))}
              >
                Add Highlight
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>What's Included</Label>
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
                      placeholder="Enter included item"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIncluded = formData.included.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, included: newIncluded }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    included: [...prev.included, ''] 
                  }))}
                >
                  Add Item
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Not Included</Label>
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
                      placeholder="Enter not included item"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newNotIncluded = formData.notIncluded.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, notIncluded: newNotIncluded }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    notIncluded: [...prev.notIncluded, ''] 
                  }))}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Package Pricing</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Local Rates</Label>
                <div className="space-y-2 mt-2">
                  {formData.pricing.local.map((rate, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={rate.pax}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.local[index].pax = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Pax"
                        className="w-20"
                      />
                      <Input
                        value={rate.price}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.local[index].price = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Price"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Foreigner Rates</Label>
                <div className="space-y-2 mt-2">
                  {formData.pricing.foreigner.map((rate, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={rate.pax}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.foreigner[index].pax = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Pax"
                        className="w-20"
                      />
                      <Input
                        value={rate.price}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing }
                          newPricing.foreigner[index].price = e.target.value
                          setFormData(prev => ({ ...prev, pricing: newPricing }))
                        }}
                        placeholder="Price"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured Tour</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
