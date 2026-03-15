'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Star, MessageSquare, ThumbsUp, Calendar, User, Search, Filter, CheckCircle, XCircle, Clock, RefreshCw, Loader2, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Testimonial {
  id: string
  customer_name: string
  tour_name: string
  rating: number
  testimonial_text: string
  helpful_count: number
  date: string
  created_at: string
  updated_at: string
  customer_image?: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newTestimonial, setNewTestimonial] = useState({
    customer_name: '',
    tour_name: '',
    rating: 5,
    testimonial_text: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/testimonials')
      const result = await response.json()
      
      console.log('Fetched testimonials result:', result)
      
      if (result.success) {
        console.log('Testimonials data:', result.data)
        setTestimonials(result.data)
      } else {
        console.error('Failed to fetch testimonials:', result.error)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    try {
      console.log('Updating testimonial:', { id, newStatus })
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const result = await response.json()
      console.log('Update response:', result)
      
      if (result.success) {
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === id ? { ...testimonial, status: newStatus } : testimonial
        ))
      } else {
        console.error('Failed to update testimonial status:', result.error)
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error)
    }
  }

  const handleAddTestimonial = async () => {
    if (!newTestimonial.customer_name || !newTestimonial.tour_name || !newTestimonial.testimonial_text) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      // First upload image if selected
      let imageUrl = null
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.url
        } else {
          console.error('Failed to upload image')
          alert('Failed to upload image')
          return
        }
      }

      const testimonialData = {
        ...newTestimonial,
        customer_image: imageUrl
      }

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTestimonials(prev => [result.data, ...prev])
        setIsAddDialogOpen(false)
        setNewTestimonial({
          customer_name: '',
          tour_name: '',
          rating: 5,
          testimonial_text: '',
          date: new Date().toISOString().split('T')[0]
        })
        setSelectedImage(null)
        setImagePreview(null)
      } else {
        console.error('Failed to add testimonial:', result.error)
        alert('Failed to add testimonial')
      }
    } catch (error) {
      console.error('Error adding testimonial:', error)
      alert('Error adding testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select an image file')
      }
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setNewTestimonial({
      customer_name: testimonial.customer_name,
      tour_name: testimonial.tour_name,
      rating: testimonial.rating,
      testimonial_text: testimonial.testimonial_text,
      date: testimonial.date
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial || !newTestimonial.customer_name || !newTestimonial.tour_name || !newTestimonial.testimonial_text) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/testimonials?id=${editingTestimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTestimonial),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === editingTestimonial.id ? result.data : testimonial
        ))
        setIsEditDialogOpen(false)
        setEditingTestimonial(null)
        setNewTestimonial({
          customer_name: '',
          tour_name: '',
          rating: 5,
          testimonial_text: '',
          date: new Date().toISOString().split('T')[0]
        })
      } else {
        console.error('Failed to update testimonial:', result.error)
        alert('Failed to update testimonial')
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
      alert('Error updating testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    console.log('Attempting to delete testimonial with ID:', id)

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      console.log('Delete response:', result)
      
      if (result.success) {
        setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id))
        console.log('Testimonial deleted successfully from frontend')
      } else {
        console.error('Failed to delete testimonial:', result.error)
        alert('Failed to delete testimonial')
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Error deleting testimonial')
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.tour_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.testimonial_text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = ratingFilter === 'all' || testimonial.rating.toString() === ratingFilter
    
    return matchesSearch && matchesRating
  })

  const stats = {
    total: testimonials.length,
    averageRating: (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-medium">Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Testimonials Management
            </h1>
            <p className="text-gray-600 text-lg">Manage customer feedback and reviews</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 rounded-xl font-medium">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Testimonial</DialogTitle>
                  <DialogDescription>
                    Create a new testimonial for a customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Customer Name *</Label>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={newTestimonial.customer_name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tour_name">Tour Name *</Label>
                    <Input
                      id="tour_name"
                      value={newTestimonial.tour_name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, tour_name: e.target.value }))}
                      placeholder="Enter tour name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating *</Label>
                    <Select value={newTestimonial.rating.toString()} onValueChange={(value) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        <SelectItem value="4">4 Stars - Very Good</SelectItem>
                        <SelectItem value="3">3 Stars - Good</SelectItem>
                        <SelectItem value="2">2 Stars - Fair</SelectItem>
                        <SelectItem value="1">1 Star - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTestimonial.date}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonial_text">Testimonial Text *</Label>
                  <Textarea
                    id="testimonial_text"
                    value={newTestimonial.testimonial_text}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, testimonial_text: e.target.value }))}
                    placeholder="Enter the customer's testimonial..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_image">Customer Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="customer_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Customer preview" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 text-white hover:bg-red-600 border-red-500"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                  {selectedImage && (
                    <p className="text-sm text-gray-500">
                      Selected: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTestimonial} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Testimonial
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Testimonial Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Edit Testimonial</DialogTitle>
                <DialogDescription>
                  Update the testimonial information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_customer_name">Customer Name *</Label>
                    <Input
                      id="edit_customer_name"
                      value={newTestimonial.customer_name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={newTestimonial.email}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_phone">Phone</Label>
                    <Input
                      id="edit_phone"
                      value={newTestimonial.phone}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_tour_name">Tour Name *</Label>
                    <Input
                      id="edit_tour_name"
                      value={newTestimonial.tour_name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, tour_name: e.target.value }))}
                      placeholder="Enter tour name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_booking_id">Booking ID</Label>
                    <Input
                      id="edit_booking_id"
                      value={newTestimonial.booking_id}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, booking_id: e.target.value }))}
                      placeholder="Optional booking ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_rating">Rating *</Label>
                    <Select value={newTestimonial.rating.toString()} onValueChange={(value) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        <SelectItem value="4">4 Stars - Very Good</SelectItem>
                        <SelectItem value="3">3 Stars - Good</SelectItem>
                        <SelectItem value="2">2 Stars - Fair</SelectItem>
                        <SelectItem value="1">1 Star - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={newTestimonial.status} onValueChange={(value: 'approved' | 'pending' | 'rejected') => setNewTestimonial(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_date">Date</Label>
                    <Input
                      id="edit_date"
                      type="date"
                      value={newTestimonial.date}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_testimonial_text">Testimonial Text *</Label>
                  <Textarea
                    id="edit_testimonial_text"
                    value={newTestimonial.testimonial_text}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, testimonial_text: e.target.value }))}
                    placeholder="Enter the customer's testimonial..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTestimonial} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Edit className="h-4 w-4 mr-2" />}
                  Update Testimonial
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 mb-8'>
        <Card className='border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl overflow-hidden relative'>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <CardContent className='p-8 relative z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Total Testimonials</p>
                <div className='text-4xl font-bold text-white mb-1'>{stats.total}</div>
                <p className="text-blue-200 text-sm">All customer feedback</p>
              </div>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-800 text-white rounded-2xl overflow-hidden relative'>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <CardContent className='p-8 relative z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className="text-purple-100 text-sm font-medium mb-2">Average Rating</p>
                <div className='text-4xl font-bold text-white mb-1'>{stats.averageRating}</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(parseFloat(stats.averageRating)) ? 'fill-yellow-300 text-yellow-300' : 'text-purple-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Table */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                All Testimonials
              </CardTitle>
              <p className="text-sm text-gray-500 ml-10">
                {filteredTestimonials.length} of {testimonials.length} testimonials
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Filters removed - status, email, phone, booking_id no longer needed */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table className="border-separate border-spacing-0 w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200">
                  <TableHead className="w-[400px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Customer Details</TableHead>
                  <TableHead className="w-[200px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Tour</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Rating</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</TableHead>
                  <TableHead className="w-[180px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {filteredTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((testimonial, index) => (
                    <TableRow 
                      key={testimonial.id} 
                      className={`hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-teal-50/30 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {testimonial.customer_image ? (
                              <img 
                                src={testimonial.customer_image} 
                                alt={testimonial.customer_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-teal-700" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-base mb-1">{testimonial.customer_name}</div>
                            <div className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {testimonial.testimonial_text.length > 80 ? `${testimonial.testimonial_text.substring(0, 80)}...` : testimonial.testimonial_text}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="font-medium text-gray-900">{testimonial.tour_name}</div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {renderStars(testimonial.rating)}
                          <span className="text-sm text-gray-600 ml-1">({testimonial.rating}.0)</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{testimonial.helpful_count} helpful</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditTestimonial(testimonial)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 h-7 px-2 text-xs"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 h-7 px-2 text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
