import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Inquiry from '@/lib/models/Inquiry'
import { isAdmin } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/inquiries/[id] - Get a single inquiry (Admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const { id } = await params

    const inquiry = await Inquiry.findById(id)
      .populate('property', 'title slug')
      .lean()

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: inquiry })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}

// PUT /api/inquiries/[id] - Update inquiry status (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const { id } = await params
    const { status } = await request.json()

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('property', 'title slug')

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: inquiry })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE /api/inquiries/[id] - Delete an inquiry (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const { id } = await params

    const inquiry = await Inquiry.findByIdAndDelete(id)

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
