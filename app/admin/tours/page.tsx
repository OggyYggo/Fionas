'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { MapPin, Plus, Search, Filter, Star, Eye, Edit, Trash2, ChevronDown } from 'lucide-react'
import { SimpleTourService } from '@/lib/simpleTourService'
import { Tour } from '@/types/tour'
import TourForm from '@/components/admin/TourForm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured' | 'standard'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null)

  useEffect(() => {
    fetchTours()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [tours, filter, searchTerm])

  const applyFilter = () => {
    let filtered = tours
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply type filter
    if (filter === 'all') {
      setFilteredTours(filtered)
    } else if (filter === 'featured') {
      setFilteredTours(filtered.filter(tour => tour.featured))
    } else if (filter === 'standard') {
      setFilteredTours(filtered.filter(tour => !tour.featured))
    }
  }

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

  const handleDeleteTour = (tour: Tour) => {
    setTourToDelete(tour)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTour = async () => {
    if (!tourToDelete) return
    
    try {
      const success = await SimpleTourService.deleteTour(tourToDelete.id)
      if (success) {
        await fetchTours()
        setSuccess(`Tour "${tourToDelete.title}" deleted successfully!`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to delete tour')
      }
    } catch (error) {
      console.error('Error deleting tour:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete tour')
    } finally {
      setDeleteDialogOpen(false)
      setTourToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setTourToDelete(null)
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
      <div className="space-y-6 pt-[30px]">
        <div className="text-left">
          <div className="text-left">
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
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 h-10">
            <Plus className="h-4 w-4 mr-2" />
            Add New Tour
          </Button>
        </div>
      </div>

     

      {/* Tours Table */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                All Tours
              </CardTitle>
              <CardDescription className="text-gray-600">Manage and organize your tour packages</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border">
                {filteredTours.length} of {tours.length} tours
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-xl">
                  <DropdownMenuItem onClick={() => setFilter('all')} className={`transition-colors ${filter === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${filter === 'all' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      All Tours
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('featured')} className={`transition-colors ${filter === 'featured' ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${filter === 'featured' ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                      Featured Only
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('standard')} className={`transition-colors ${filter === 'standard' ? 'bg-gray-100 text-gray-700 font-medium' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${filter === 'standard' ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                      Standard Only
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table className="border-separate border-spacing-0 w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200">
                  <TableHead className="w-[400px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Tour Details</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Price</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Duration</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Category</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Type</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Featured</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Capacity</TableHead>
                  <TableHead className="w-[180px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {filteredTours.map((tour, index) => (
                  <TableRow 
                    key={tour.id} 
                    className={`hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-teal-50/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-base mb-1 truncate">{tour.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {tour.description.length > 90 ? `${tour.description.substring(0, 90)}...` : tour.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {tour.price}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <span className="font-medium text-gray-700">{tour.duration}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="default" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md hover:shadow-lg transition-shadow duration-200 px-3 py-1">
                        {tour.tag}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge 
                        variant="default" 
                        className={`border-0 shadow-md hover:shadow-lg transition-shadow duration-200 px-3 py-1 ${
                          tour.tourType === 'Destinations' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {tour.tourType || 'Package'}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge 
                        variant={tour.featured ? 'default' : 'secondary'} 
                        className={`border-0 shadow-md hover:shadow-lg transition-shadow duration-200 px-3 py-1 ${
                          tour.featured 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {tour.featured && <Star className="w-3 h-3 fill-current" />}
                          {tour.featured ? 'Featured' : 'Standard'}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <span className="font-bold text-gray-900">{tour.maxPeople}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(`/tours/${tour.id}`, '_blank')} 
                          title="View Tour" 
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTour(tour)} 
                          title="Edit Tour" 
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteTour(tour)} 
                          title="Delete Tour"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Empty State */}
            {filteredTours.length === 0 && (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first tour package'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Tour
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tour "{tourToDelete?.title}" and remove all of its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTour}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
