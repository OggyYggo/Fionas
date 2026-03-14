import { NextRequest, NextResponse } from 'next/server'
import CustomToursService from '@/lib/custom-tours-db'

// GET /api/custom-tours/submissions/[id] - Get specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get all submissions and filter by ID (since we don't have a specific get by ID method)
    const result = await CustomToursService.getSubmissions({ limit: 1000 })
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    const submission = result.data.find((sub: any) => sub.id === id)
    
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: submission
    })
  } catch (error) {
    console.error('Error in GET /api/custom-tours/submissions/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/custom-tours/submissions/[id] - Update submission status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, ...updateData } = await request.json()

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'contacted', 'quoted', 'accepted', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const result = await CustomToursService.updateSubmissionStatus(id, status, updateData)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: result.data
    })
  } catch (error) {
    console.error('Error in PUT /api/custom-tours/submissions/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/custom-tours/submissions/[id] - Delete submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Note: You would need to add a delete method to CustomToursService
    // For now, we'll return a not implemented response
    return NextResponse.json(
      { success: false, message: 'Delete functionality not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/custom-tours/submissions/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
