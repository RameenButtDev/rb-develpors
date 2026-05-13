import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Property from '@/lib/models/Property'
import { isAdmin } from '@/lib/auth'

// GET /api/properties - List all properties with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const propertyType = searchParams.get('type')
    const featured = searchParams.get('featured')
    const city = searchParams.get('city')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1)

    // Build query
    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (propertyType) query.propertyType = propertyType
    if (featured === 'true') query.featured = true
    if (city) query['location.city'] = { $regex: city, $options: 'i' }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create a new property (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()

    const property = await Property.create(body)

    return NextResponse.json(
      { success: true, data: property },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
