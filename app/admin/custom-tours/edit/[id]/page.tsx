'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

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

export default function EditCustomTourPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [submission, setSubmission] = useState<CustomTourSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Initialize with default values to prevent controlled/uncontrolled input issues
  const [formData, setFormData] = useState<Partial<CustomTourSubmission>>({
    fullName: '',
    email: '',
    phone: '',
    destination: '',
    startDate: '',
    endDate: '',
    adults: 0,
    children: 0,
    budgetRange: '',
    accommodation: '',
    transportation: '',
    status: 'pending'
  })

  useEffect(() => {
    fetchSubmission()
  }, [resolvedParams.id])

  const fetchSubmission = async () => {
    try {
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      const result = await CustomToursService.getSubmissions({ limit: 1000 })

      if (result.success && result.data) {
        const foundSubmission = result.data.find(s => s.id === resolvedParams.id)
        if (foundSubmission) {
          setSubmission(foundSubmission)
          setFormData(foundSubmission) // Update form data with fetched values
        } else {
          setError('Custom tour request not found')
        }
      } else {
        setError('Failed to fetch submission details')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!submission) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      const result = await CustomToursService.updateSubmission(submission.id, {
        status: formData.status || 'pending',
        fullName: formData.fullName || '',
        email: formData.email || '',
        destination: formData.destination || '',
        budgetRange: formData.budgetRange || '',
        adults: formData.adults || 0,
        children: formData.children || 0
      })

      if (result.success) {
        setSuccess('Custom tour request updated successfully!')
        setTimeout(() => {
          router.push('/admin/custom-tours')
        }, 2000)
      } else {
        setError(result.message || 'Failed to update submission')
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      setError('Network error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/custom-tours')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 pt-[30px] pb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800">Not Found</h4>
            <p className="text-sm text-red-700">Custom tour request not found</p>
          </div>
        </div>
        <Link href="/admin/custom-tours">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Custom Tours
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-[30px] px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/custom-tours">
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Custom Tour Request</h1>
            <p className="text-gray-600 mt-1">Update the custom tour request details for "{submission.fullName}"</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Save className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-800">Success!</h4>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800">Error!</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Customer Information
            </CardTitle>
            <CardDescription className="text-gray-600">Basic contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input 
                value={formData.fullName || ''}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input 
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Trip Details
            </CardTitle>
            <CardDescription className="text-gray-600">Destination and travel information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Destination</label>
              <Input 
                value={formData.destination || ''}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input 
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input 
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Budget Range</label>
              <Input 
                value={formData.budgetRange || ''}
                onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              Guest Information
            </CardTitle>
            <CardDescription className="text-gray-600">Number of travelers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Adults</label>
                <Input 
                  type="number"
                  value={formData.adults || 0}
                  onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value) || 0})}
                  className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Children</label>
                <Input 
                  type="number"
                  value={formData.children || 0}
                  onChange={(e) => setFormData({...formData, children: parseInt(e.target.value) || 0})}
                  className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Accommodation</label>
              <Input 
                value={formData.accommodation || ''}
                onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Transportation</label>
              <Input 
                value={formData.transportation || ''}
                onChange={(e) => setFormData({...formData, transportation: e.target.value})}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Management */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Status & Management
            </CardTitle>
            <CardDescription className="text-gray-600">Request status information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select 
                value={formData.status || 'pending'}
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Additional Information
            </CardTitle>
            <CardDescription className="text-gray-600">Read-only details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Activities</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                {submission.activities?.join(', ') || 'No activities specified'}
              </div>
            </div>
            {submission.otherActivity && (
              <div>
                <label className="text-sm font-medium text-gray-700">Other Activity</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {submission.otherActivity}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Special Requests</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                {submission.specialRequests || 'No special requests'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {submission.assignedTo || 'Not assigned'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quote Amount</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {submission.quoteAmount ? `${submission.quoteCurrency || 'USD'} ${submission.quoteAmount}` : 'No quote'}
                </div>
              </div>
            </div>
            {submission.internalNotes && (
              <div>
                <label className="text-sm font-medium text-gray-700">Internal Notes</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {submission.internalNotes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
