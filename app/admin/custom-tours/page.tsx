'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search,
  Filter,
  Download,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Settings,
  FileText,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Activity,
  Home,
  Car,
  User,
  Phone
} from 'lucide-react'

interface CustomTourSubmission {
  id: string
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
  status: 'pending' | 'reviewed' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
  assignedTo?: string
  internalNotes?: string
  quoteAmount?: number
  quoteCurrency?: string
  followUpDate?: string
  submissionDate: string
  updatedAt: string
}

interface Stats {
  totalSubmissions: number
  pendingSubmissions: number
  reviewedSubmissions: number
  contactedSubmissions: number
  quotedSubmissions: number
  acceptedSubmissions: number
  rejectedSubmissions: number
  popularDestinations: Array<{ name: string; count: number }>
  monthlySubmissions: Array<{ month: string; count: number }>
}

export default function CustomToursAdmin() {
  const [submissions, setSubmissions] = useState<CustomTourSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<CustomTourSubmission[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'contacted' | 'quoted' | 'accepted' | 'rejected'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<CustomTourSubmission | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [viewingSubmission, setViewingSubmission] = useState<CustomTourSubmission | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      console.log('🔍 Admin: Starting fetchSubmissions...')
      
      // First, try a direct Supabase query to test the connection
      console.log('🔍 Admin: Testing direct Supabase connection...')
      const { supabase } = await import('@/lib/supabase')
      
      const { data: testData, error: testError } = await supabase
        .from('custom_tour_submissions')
        .select('id, full_name, email')
        .limit(5)
      
      console.log('🔍 Admin: Direct test result - data:', testData)
      console.log('🔍 Admin: Direct test result - error:', testError)
      
      if (testError) {
        console.error('❌ Admin: Direct Supabase test failed:', testError)
        setError(`Database test failed: ${testError.message}`)
        return
      }
      
      // If direct test works, try the service
      console.log('🔍 Admin: Direct test passed, trying CustomToursService...')
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      
      console.log('🔍 Admin: CustomToursService imported')
      console.log('🔍 Admin: Status filter:', statusFilter)
      
      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined
      console.log('🔍 Admin: Using filters:', filters)
      
      const result = await CustomToursService.getSubmissions(filters)
      console.log('🔍 Admin: getSubmissions result:', result)

      if (result.success) {
        console.log('🔍 Admin: Fetch successful, data length:', result.data.length)
        console.log('🔍 Admin: Sample data:', result.data.slice(0, 2))
        setSubmissions(result.data)
      } else {
        console.error('❌ Admin: Fetch failed')
        setError('Failed to fetch submissions')
      }
    } catch (error) {
      console.error('❌ Admin: Network error occurred:', error)
      setError('Network error occurred')
      console.error('Error fetching submissions:', error)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      const result = await CustomToursService.getSubmissionStats()

      if (result.success && result.data) {
        setStats(result.data)
      } else {
        console.error('Failed to fetch stats:', result.message)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Update submission status
  const updateSubmissionStatus = async (submissionId: string, status: string) => {
    try {
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      const result = await CustomToursService.updateSubmissionStatus(submissionId, status)

      if (result.success) {
        // Refresh submissions
        await fetchSubmissions()
        await fetchStats()
      } else {
        setError(result.message || 'Failed to update submission')
      }
    } catch (error) {
      setError('Network error occurred')
      console.error('Error updating submission:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchSubmissions(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [statusFilter])

  useEffect(() => {
    applyFilters()
  }, [submissions, searchTerm, statusFilter])

  const applyFilters = () => {
    let filtered = submissions
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(submission => 
        submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter)
    }
    
    setFilteredSubmissions(filtered)
  }

  const handleEditSubmission = (submission: CustomTourSubmission) => {
    window.location.href = `/admin/custom-tours/edit/${submission.id}`
  }

  const handleViewDetails = (submission: CustomTourSubmission) => {
    setViewingSubmission(submission)
    setViewDetailsOpen(true)
  }

  const handleDeleteSubmission = (submission: CustomTourSubmission) => {
    setSubmissionToDelete(submission)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteSubmission = async () => {
    if (!submissionToDelete) return
    
    try {
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      const result = await CustomToursService.deleteSubmission(submissionToDelete.id)
      
      if (result.success) {
        await fetchSubmissions()
        await fetchStats()
        setDeleteDialogOpen(false)
        setSubmissionToDelete(null)
        
        // Show success message
        setSuccessMessage(`Custom tour request from "${submissionToDelete.fullName}" has been successfully deleted.`)
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } else {
        console.error('Delete failed:', result.message)
        alert(`Failed to delete submission: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert('Error deleting submission. Please check the console for details.')
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setSubmissionToDelete(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white border-0 shadow-md'
      case 'reviewed': return 'bg-blue-500 text-white border-0 shadow-md'
      case 'contacted': return 'bg-purple-500 text-white border-0 shadow-md'
      case 'quoted': return 'bg-orange-500 text-white border-0 shadow-md'
      case 'accepted': return 'bg-green-500 text-white border-0 shadow-md'
      case 'rejected': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md'
      default: return 'bg-gray-500 text-white border-0 shadow-md'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Custom Tours Management</h1>
            <p className="text-gray-600">Manage and track all custom tour requests</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Success!</h4>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Tours Management</h1>
          <p className="text-gray-600">Manage and track all custom tour requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search custom tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button variant="outline" className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/custom-tours/page-management">
            <Button variant="outline" className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
              <Settings className="h-4 w-4 mr-2" />
              Page Management
            </Button>
          </Link>
          <Link href="/custom" target="_blank">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 h-10">
              <FileText className="h-4 w-4 mr-2" />
              View Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-teal-100 font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.totalSubmissions || 0}</div>
            <p className="text-teal-100 text-sm mt-1">All custom tour requests</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-100 font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.pendingSubmissions || 0}</div>
            <p className="text-yellow-100 text-sm mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-100 font-medium flex items-center gap-2">
              <Star className="h-5 w-5" />
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.acceptedSubmissions || 0}</div>
            <p className="text-blue-100 text-sm mt-1">{stats?.totalSubmissions ? `${((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1)}%` : '0%'} conversion rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-100 font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Popular Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.popularDestinations?.[0]?.name || 'N/A'}
            </div>
            <p className="text-purple-100 text-sm mt-1">
              {stats?.popularDestinations?.[0]?.count || 0} requests
            </p>
          </CardContent>
        </Card>
      </div>

                {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Custom Tours Table */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                All Custom Tour Requests
              </CardTitle>
              <CardDescription className="text-gray-600">Manage your custom tour submissions</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border">
                {filteredSubmissions.length} of {submissions.length} requests
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border-gray-200 text-gray-700 bg-white border px-3 py-1.5 rounded-lg text-sm shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table className="border-separate border-spacing-0 w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200">
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Request ID</TableHead>
                  <TableHead className="w-[200px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="w-[150px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Destination</TableHead>
                  <TableHead className="w-[150px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Travel Dates</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Guests</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Budget</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {filteredSubmissions.map((submission, index) => (
                  <TableRow 
                    key={submission.id} 
                    className={`hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-emerald-50/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="font-bold text-gray-900">{submission.id}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{submission.fullName}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        {submission.phone && (
                          <div className="text-sm text-gray-500">{submission.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="text-gray-700">{submission.destination}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div>
                        <div className="text-gray-700">{new Date(submission.startDate).toLocaleDateString()}</div>
                        {submission.endDate && (
                          <div className="text-sm text-gray-500">to {new Date(submission.endDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{submission.adults + submission.children}</span>
                        <div className="text-xs text-gray-500">
                          {submission.adults}A {submission.children}C
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="text-gray-700">{submission.budgetRange}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(submission)}
                          title="View Details"
                          className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditSubmission(submission)}
                          title="Edit Request"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteSubmission(submission)} 
                          title="Delete Request"
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
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No custom tour requests found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No custom tour requests have been submitted yet'}
                </p>
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
              This action cannot be undone. This will permanently delete the custom tour request from "{submissionToDelete?.fullName}" for "{submissionToDelete?.destination}" and remove all of its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSubmission}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      
      {/* View Details Modal */}
      <AlertDialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Custom Tour Request Details
            </AlertDialogTitle>
            <AlertDialogDescription>
              Complete information for "{viewingSubmission?.fullName}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {viewingSubmission && (
            <div className="grid gap-6 py-4">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{viewingSubmission.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{viewingSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone
                    </label>
                    <p className="text-gray-900">{viewingSubmission.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={getStatusColor(viewingSubmission.status)}>
                      {viewingSubmission.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Trip Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Destination</label>
                    <p className="text-gray-900">{viewingSubmission.destination}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Travel Dates</label>
                    <p className="text-gray-900">
                      {new Date(viewingSubmission.startDate).toLocaleDateString()}
                      {viewingSubmission.endDate && ` to ${new Date(viewingSubmission.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                    <p className="text-gray-900">
                      {viewingSubmission.adults} Adults, {viewingSubmission.children} Children
                      <span className="text-sm text-gray-500"> ({viewingSubmission.adults + viewingSubmission.children} total)</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Budget Range</label>
                    <p className="text-gray-900 capitalize">{viewingSubmission.budgetRange}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activities & Interests
                </h3>
                <div className="space-y-2">
                  {viewingSubmission.activities && viewingSubmission.activities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingSubmission.activities.map((activity, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No specific activities selected</p>
                  )}
                  {viewingSubmission.otherActivity && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Other Activities:</label>
                      <p className="text-gray-900">{viewingSubmission.otherActivity}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Travel Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Accommodation
                    </label>
                    <p className="text-gray-900 capitalize">{viewingSubmission.accommodation || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      Transportation
                    </label>
                    <p className="text-gray-900 capitalize">{viewingSubmission.transportation || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tour Guide</label>
                    <p className="text-gray-900 capitalize">{viewingSubmission.tourGuide || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {viewingSubmission.specialRequests && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <p className="text-gray-900">{viewingSubmission.specialRequests}</p>
                </div>
              )}

              {/* Submission Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Submission Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submission Date</label>
                    <p className="text-gray-900">
                      {new Date(viewingSubmission.submissionDate).toLocaleDateString()} at {new Date(viewingSubmission.submissionDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Request ID</label>
                    <p className="text-gray-900 font-mono text-xs">{viewingSubmission.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setViewDetailsOpen(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
