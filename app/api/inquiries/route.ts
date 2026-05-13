import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Inquiry from '@/lib/models/Inquiry'
import { getCurrentUser, isAdmin } from '@/lib/auth'

// GET /api/inquiries - List all inquiries (Admin only)
export async function GET() {
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const inquiries = await Inquiry.find()
      .populate('property', 'title slug')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: inquiries })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

// POST /api/inquiries - Submit a new inquiry (Public)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, phone, message, inquiryType, property } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      inquiryType: inquiryType || 'general',
      property: property || undefined,
      status: 'new',
    })

    return NextResponse.json(
      { success: true, data: inquiry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
