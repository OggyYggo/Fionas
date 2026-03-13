'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  Image as ImageIcon,
  Star,
  Heart,
  CheckCircle,
  MapPin,
  Users,
  DollarSign,
  Car,
  User
} from 'lucide-react'

interface PageData {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  formSteps: Array<{
    step: number
    title: string
    description: string
  }>
  destinations: Array<{
    id: string
    name: string
    description: string
    image?: string
    popular?: boolean
  }>
  activities: Array<{
    id: string
    name: string
    description: string
    category: string
    popular?: boolean
  }>
  accommodationOptions: Array<{
    id: string
    name: string
    description: string
    priceCategory: string
  }>
  transportationOptions: Array<{
    id: string
    name: string
    description: string
    priceCategory: string
  }>
  budgetRanges: Array<{
    id: string
    name: string
    description: string
    minPrice: number
    maxPrice: number
  }>
  tourGuideOptions: Array<{
    id: string
    name: string
    description: string
    language: string
    pricePerDay: number
  }>
  seoSettings: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
    workingHours: string
  }
}

const iconOptions = [
  { value: 'check', label: 'Check', icon: CheckCircle },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'map', label: 'Map Pin', icon: MapPin },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'dollar', label: 'Dollar', icon: DollarSign },
  { value: 'car', label: 'Car', icon: Car },
  { value: 'user', label: 'User', icon: User },
]

export default function CustomToursPageManagement() {
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('hero')
  const [previewItem, setPreviewItem] = useState<any>(null)
  const [previewType, setPreviewType] = useState<'destination' | 'activity' | 'accommodation' | 'transportation' | 'budget' | 'tour-guide' | null>(null)

  // Fetch page data
  const fetchPageData = async () => {
    try {
      const response = await fetch('/api/custom-tours/page-data')
      const data = await response.json()

      if (data.success) {
        setPageData(data.data)
      } else {
        setError(data.message || 'Failed to fetch page data')
      }
    } catch (error) {
      setError('Network error occurred')
      console.error('Error fetching page data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save page data
  const savePageData = async () => {
    if (!pageData) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/custom-tours/page-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Page data saved successfully!')
      } else {
        setError(data.message || 'Failed to save page data')
      }
    } catch (error) {
      setError('Network error occurred')
      console.error('Error saving page data:', error)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchPageData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            Failed to load page data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const updatePageData = (section: keyof PageData, value: any) => {
    setPageData(prev => prev ? { ...prev, [section]: value } : null)
  }

  const addArrayItem = (section: keyof PageData, newItem: any) => {
    setPageData(prev => {
      if (!prev) return null
      const currentArray = prev[section] as any[]
      return { ...prev, [section]: [...currentArray, newItem] }
    })
  }

  const removeArrayItem = (section: keyof PageData, index: number) => {
    setPageData(prev => {
      if (!prev) return null
      const currentArray = prev[section] as any[]
      return { ...prev, [section]: currentArray.filter((_, i) => i !== index) }
    })
  }

  const updateArrayItem = (section: keyof PageData, index: number, field: string, value: any) => {
    setPageData(prev => {
      if (!prev) return null
      const currentArray = prev[section] as any[]
      const newArray = [...currentArray]
      newArray[index] = { ...newArray[index], [field]: value }
      return { ...prev, [section]: newArray }
    })
  }

  // Preview functions
  const previewDestination = (destination: any) => {
    setPreviewItem(destination)
    setPreviewType('destination')
  }

  const previewActivity = (activity: any) => {
    setPreviewItem(activity)
    setPreviewType('activity')
  }

  const previewAccommodation = (accommodation: any) => {
    setPreviewItem(accommodation)
    setPreviewType('accommodation')
  }

  const previewTransportation = (transportation: any) => {
    setPreviewItem(transportation)
    setPreviewType('transportation')
  }

  const previewBudget = (budget: any) => {
    setPreviewItem(budget)
    setPreviewType('budget')
  }

  const previewTourGuide = (tourGuide: any) => {
    setPreviewItem(tourGuide)
    setPreviewType('tour-guide')
  }

  const closePreview = () => {
    setPreviewItem(null)
    setPreviewType(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Tours Page Management</h1>
          <p className="text-gray-600">Manage the custom tours page content and configuration</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => window.open('/custom', '_blank')}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview Page</span>
          </Button>
          <Button
            onClick={savePageData}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="seo">SEO & Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={pageData.heroTitle}
                  onChange={(e) => updatePageData('heroTitle', e.target.value)}
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={pageData.heroSubtitle}
                  onChange={(e) => updatePageData('heroSubtitle', e.target.value)}
                  placeholder="Enter hero subtitle"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="heroBackgroundImage">Hero Background Image</Label>
                <Input
                  id="heroBackgroundImage"
                  value={pageData.heroBackgroundImage}
                  onChange={(e) => updatePageData('heroBackgroundImage', e.target.value)}
                  placeholder="/images/custom-tours-hero.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageData.features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Feature {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('features', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)}
                        placeholder="Feature title"
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Select
                        value={feature.icon}
                        onValueChange={(value) => updateArrayItem('features', index, 'icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <option.icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateArrayItem('features', index, 'description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('features', {
                  title: '',
                  description: '',
                  icon: 'check'
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageData.formSteps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Step {step.step}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('formSteps', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateArrayItem('formSteps', index, 'title', e.target.value)}
                        placeholder="Step title"
                      />
                    </div>
                    <div>
                      <Label>Step Number</Label>
                      <Input
                        type="number"
                        value={step.step}
                        onChange={(e) => updateArrayItem('formSteps', index, 'step', parseInt(e.target.value))}
                        placeholder="Step number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateArrayItem('formSteps', index, 'description', e.target.value)}
                      placeholder="Step description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('formSteps', {
                  step: pageData.formSteps.length + 1,
                  title: '',
                  description: ''
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageData.destinations.map((destination, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{destination.name || 'New Destination'}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={destination.popular ? 'default' : 'secondary'}>
                        {destination.popular ? 'Popular' : 'Regular'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewDestination(destination)}
                        title="Preview Destination"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('destinations', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ID</Label>
                      <Input
                        value={destination.id}
                        onChange={(e) => updateArrayItem('destinations', index, 'id', e.target.value)}
                        placeholder="destination-id"
                      />
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={destination.name}
                        onChange={(e) => updateArrayItem('destinations', index, 'name', e.target.value)}
                        placeholder="Destination name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={destination.description}
                      onChange={(e) => updateArrayItem('destinations', index, 'description', e.target.value)}
                      placeholder="Destination description"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={destination.image || ''}
                        onChange={(e) => updateArrayItem('destinations', index, 'image', e.target.value)}
                        placeholder="/images/destination.jpg"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={destination.popular || false}
                        onCheckedChange={(checked) => updateArrayItem('destinations', index, 'popular', checked)}
                      />
                      <Label>Popular Destination</Label>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('destinations', {
                  id: `dest-${Date.now()}`,
                  name: '',
                  description: '',
                  popular: false
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageData.activities.map((activity, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{activity.name || 'New Activity'}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={activity.popular ? 'default' : 'secondary'}>
                        {activity.popular ? 'Popular' : 'Regular'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewActivity(activity)}
                        title="Preview Activity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('activities', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>ID</Label>
                      <Input
                        value={activity.id}
                        onChange={(e) => updateArrayItem('activities', index, 'id', e.target.value)}
                        placeholder="activity-id"
                      />
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={activity.name}
                        onChange={(e) => updateArrayItem('activities', index, 'name', e.target.value)}
                        placeholder="Activity name"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={activity.category}
                        onValueChange={(value) => updateArrayItem('activities', index, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="relaxation">Relaxation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={activity.description}
                      onChange={(e) => updateArrayItem('activities', index, 'description', e.target.value)}
                      placeholder="Activity description"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={activity.popular || false}
                      onCheckedChange={(checked) => updateArrayItem('activities', index, 'popular', checked)}
                    />
                    <Label>Popular Activity</Label>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('activities', {
                  id: `act-${Date.now()}`,
                  name: '',
                  description: '',
                  category: 'adventure',
                  popular: false
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accommodation Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageData.accommodationOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{option.name || 'New Option'}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewAccommodation(option)}
                          title="Preview Accommodation"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('accommodationOptions', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ID</Label>
                        <Input
                          value={option.id}
                          onChange={(e) => updateArrayItem('accommodationOptions', index, 'id', e.target.value)}
                          placeholder="option-id"
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => updateArrayItem('accommodationOptions', index, 'name', e.target.value)}
                          placeholder="Option name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={option.description}
                        onChange={(e) => updateArrayItem('accommodationOptions', index, 'description', e.target.value)}
                        placeholder="Option description"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Price Category</Label>
                      <Select
                        value={option.priceCategory}
                        onValueChange={(value) => updateArrayItem('accommodationOptions', index, 'priceCategory', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('accommodationOptions', {
                    id: `acc-${Date.now()}`,
                    name: '',
                    description: '',
                    priceCategory: 'standard'
                  })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accommodation Option
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transportation Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageData.transportationOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{option.name || 'New Option'}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewTransportation(option)}
                          title="Preview Transportation"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('transportationOptions', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ID</Label>
                        <Input
                          value={option.id}
                          onChange={(e) => updateArrayItem('transportationOptions', index, 'id', e.target.value)}
                          placeholder="option-id"
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => updateArrayItem('transportationOptions', index, 'name', e.target.value)}
                          placeholder="Option name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={option.description}
                        onChange={(e) => updateArrayItem('transportationOptions', index, 'description', e.target.value)}
                        placeholder="Option description"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Price Category</Label>
                      <Select
                        value={option.priceCategory}
                        onValueChange={(value) => updateArrayItem('transportationOptions', index, 'priceCategory', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('transportationOptions', {
                    id: `trans-${Date.now()}`,
                    name: '',
                    description: '',
                    priceCategory: 'standard'
                  })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transportation Option
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Ranges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageData.budgetRanges.map((range, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{range.name || 'New Range'}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewBudget(range)}
                          title="Preview Budget Range"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('budgetRanges', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ID</Label>
                        <Input
                          value={range.id}
                          onChange={(e) => updateArrayItem('budgetRanges', index, 'id', e.target.value)}
                          placeholder="range-id"
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={range.name}
                          onChange={(e) => updateArrayItem('budgetRanges', index, 'name', e.target.value)}
                          placeholder="Range name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={range.description}
                        onChange={(e) => updateArrayItem('budgetRanges', index, 'description', e.target.value)}
                        placeholder="Range description"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Price</Label>
                        <Input
                          type="number"
                          value={range.minPrice}
                          onChange={(e) => updateArrayItem('budgetRanges', index, 'minPrice', parseInt(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Max Price</Label>
                        <Input
                          type="number"
                          value={range.maxPrice}
                          onChange={(e) => updateArrayItem('budgetRanges', index, 'maxPrice', parseInt(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('budgetRanges', {
                    id: `budget-${Date.now()}`,
                    name: '',
                    description: '',
                    minPrice: 0,
                    maxPrice: 0
                  })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget Range
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tour Guide Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageData.tourGuideOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{option.name || 'New Guide'}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewTourGuide(option)}
                          title="Preview Tour Guide"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('tourGuideOptions', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ID</Label>
                        <Input
                          value={option.id}
                          onChange={(e) => updateArrayItem('tourGuideOptions', index, 'id', e.target.value)}
                          placeholder="guide-id"
                        />
                      </div>
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => updateArrayItem('tourGuideOptions', index, 'name', e.target.value)}
                          placeholder="Guide name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={option.description}
                        onChange={(e) => updateArrayItem('tourGuideOptions', index, 'description', e.target.value)}
                        placeholder="Guide description"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Language</Label>
                        <Input
                          value={option.language}
                          onChange={(e) => updateArrayItem('tourGuideOptions', index, 'language', e.target.value)}
                          placeholder="English"
                        />
                      </div>
                      <div>
                        <Label>Price Per Day</Label>
                        <Input
                          type="number"
                          value={option.pricePerDay}
                          onChange={(e) => updateArrayItem('tourGuideOptions', index, 'pricePerDay', parseInt(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('tourGuideOptions', {
                    id: `guide-${Date.now()}`,
                    name: '',
                    description: '',
                    language: 'English',
                    pricePerDay: 0
                  })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tour Guide Option
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={pageData.seoSettings.metaTitle}
                    onChange={(e) => updatePageData('seoSettings', {
                      ...pageData.seoSettings,
                      metaTitle: e.target.value
                    })}
                    placeholder="Page meta title"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={pageData.seoSettings.metaDescription}
                    onChange={(e) => updatePageData('seoSettings', {
                      ...pageData.seoSettings,
                      metaDescription: e.target.value
                    })}
                    placeholder="Page meta description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="ogImage">OG Image</Label>
                  <Input
                    id="ogImage"
                    value={pageData.seoSettings.ogImage}
                    onChange={(e) => updatePageData('seoSettings', {
                      ...pageData.seoSettings,
                      ogImage: e.target.value
                    })}
                    placeholder="/images/custom-tours-og.jpg"
                  />
                </div>
                <div>
                  <Label>Keywords (comma-separated)</Label>
                  <Input
                    value={pageData.seoSettings.keywords.join(', ')}
                    onChange={(e) => updatePageData('seoSettings', {
                      ...pageData.seoSettings,
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    })}
                    placeholder="custom tours, bohol tours, personalized itinerary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    value={pageData.contactInfo.email}
                    onChange={(e) => updatePageData('contactInfo', {
                      ...pageData.contactInfo,
                      email: e.target.value
                    })}
                    placeholder="custom@fionatravel.com"
                    type="email"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={pageData.contactInfo.phone}
                    onChange={(e) => updatePageData('contactInfo', {
                      ...pageData.contactInfo,
                      phone: e.target.value
                    })}
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div>
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    value={pageData.contactInfo.address}
                    onChange={(e) => updatePageData('contactInfo', {
                      ...pageData.contactInfo,
                      address: e.target.value
                    })}
                    placeholder="Tagbilaran City, Bohol, Philippines"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={pageData.contactInfo.workingHours}
                    onChange={(e) => updatePageData('contactInfo', {
                      ...pageData.contactInfo,
                      workingHours: e.target.value
                    })}
                    placeholder="Monday to Saturday, 8:00 AM - 6:00 PM"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewItem && previewType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Preview: {previewType.charAt(0).toUpperCase() + previewType.slice(1).replace('-', ' ')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closePreview}
                >
                  ✕
                </Button>
              </div>

              {previewType === 'destination' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Destination'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    {previewItem.popular && (
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800">Popular Destination</Badge>
                    )}
                    {previewItem.image && (
                      <div className="mt-4">
                        <img 
                          src={previewItem.image} 
                          alt={previewItem.name}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.jpg'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {previewType === 'activity' && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Activity'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {previewItem.category || 'uncategorized'}
                      </Badge>
                      {previewItem.popular && (
                        <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {previewType === 'accommodation' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Accommodation'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                      {previewItem.priceCategory || 'standard'} pricing
                    </Badge>
                  </div>
                </div>
              )}

              {previewType === 'transportation' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Transportation'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">
                      {previewItem.priceCategory || 'standard'} pricing
                    </Badge>
                  </div>
                </div>
              )}

              {previewType === 'budget' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Budget Range'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    <div className="mt-3 text-lg font-bold text-gray-900">
                      ₱{previewItem.minPrice?.toLocaleString() || '0'} - ₱{previewItem.maxPrice?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              )}

              {previewType === 'tour-guide' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{previewItem.name || 'Untitled Tour Guide'}</h3>
                    <p className="text-gray-600 mt-2">{previewItem.description || 'No description available'}</p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="text-sm text-gray-500">Language:</span>
                        <p className="font-medium">{previewItem.language || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Price per day:</span>
                        <p className="font-medium">₱{previewItem.pricePerDay?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <Button onClick={closePreview}>Close Preview</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
