'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, Plus, Search, Filter, Star, Eye, Edit, Trash2 } from 'lucide-react'
import { SimpleTourService } from '@/lib/simpleTourService'
import { Tour } from '@/types/tour'
import TourForm from '@/components/admin/TourForm'

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      const toursData = await SimpleTourService.getAllTours()
      setTours(toursData)
    } catch (error) {
      console.error('Error fetching tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTour = async (tourData: any) => {
    console.log('🔍 handleCreateTour called with:', tourData)
    setFormLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      console.log('🔍 Calling SimpleTourService.createTour...')
      const newTour = await SimpleTourService.createTour(tourData)
      console.log('✅ Tour created successfully:', newTour)
      await fetchTours()
      setShowForm(false)
      setSuccess(`Tour "${newTour.title}" created successfully!`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('❌ Error creating tour:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create tour'
      setError(errorMessage)
      console.error('❌ Full error details:', {
        error,
        message: errorMessage,
        tourData
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTour = async (tourData: any) => {
    if (!editingTour) return
    
    console.log('🔍 handleUpdateTour called with:', { tourId: editingTour.id, tourData })
    setFormLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      console.log('🔍 Calling SimpleTourService.updateTour...')
      const updatedTour = await SimpleTourService.updateTour(editingTour.id, tourData)
      console.log('✅ Tour updated successfully:', updatedTour)
      await fetchTours()
      setShowForm(false)
      setEditingTour(null)
      setSuccess(`Tour "${updatedTour?.title}" updated successfully!`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('❌ Error updating tour:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update tour'
      setError(errorMessage)
      console.error('❌ Full error details:', {
        error,
        message: errorMessage,
        tourId: editingTour.id,
        tourData
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTour = async (id: number) => {
    const tour = tours.find(t => t.id === id)
    if (!tour) return
    
    if (!confirm(`Are you sure you want to delete "${tour.title}"?`)) return
    
    try {
      const success = await SimpleTourService.deleteTour(id)
      if (success) {
        await fetchTours()
        setSuccess(`Tour "${tour.title}" deleted successfully!`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to delete tour')
      }
    } catch (error) {
      console.error('Error deleting tour:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete tour')
    }
  }

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTour(null)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingTour ? 'Edit Tour' : 'Add New Tour'}
            </h1>
            <p className="text-gray-600">
              {editingTour ? 'Update tour information' : 'Create a new tour package'}
            </p>
          </div>
        </div>
        <TourForm
          tour={editingTour || undefined}
          onSubmit={editingTour ? handleUpdateTour : handleCreateTour}
          onCancel={handleCancelForm}
          isLoading={formLoading}
        />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
          <p className="text-gray-600">Manage your tour packages and activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tour
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
            <p className="text-xs text-gray-500">Active packages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,072</div>
            <p className="text-xs text-gray-500">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-gray-500">From 2,341 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱2.8M</div>
            <p className="text-xs text-gray-500">From tour sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tours</CardTitle>
              <CardDescription>Manage your tour packages</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{tour.title}</div>
                        <div className="text-sm text-gray-500">{tour.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{tour.price}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {tour.tag}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tour.featured ? 'default' : 'secondary'}>
                      {tour.featured ? 'Featured' : 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>{tour.maxPeople}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(`/tours/${tour.id}`, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditTour(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteTour(tour.id)} 
                        title="Delete Tour"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
