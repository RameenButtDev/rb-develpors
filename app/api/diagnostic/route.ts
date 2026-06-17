import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Inquiry from '@/lib/models/Inquiry'

export async function GET() {
  const logs: string[] = []
  
  try {
    logs.push('🔍 Starting diagnostic...')
    
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      logs.push('❌ MONGO_URI not configured')
      return NextResponse.json({ success: false, error: 'MONGO_URI not set', logs }, { status: 500 })
    }
    
    const urlParts = mongoUri.split('@')
    const maskUri = `${mongoUri.substring(0, 25)}...${mongoUri.substring(mongoUri.length - 30)}`
    logs.push(`✓ MONGO_URI configured: ${maskUri}`)
    
    logs.push('🔗 Attempting MongoDB connection (with 15s timeout)...')
    const connectionStart = Date.now()
    
    // Try to connect with timeout
    const connectPromise = connectDB()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
    )
    
    await Promise.race([connectPromise, timeoutPromise])
    const connectionTime = Date.now() - connectionStart
    
    logs.push(`✅ MongoDB connected successfully (${connectionTime}ms)`)
    
    logs.push('📊 Testing Inquiry model...')
    const count = await Inquiry.countDocuments()
    logs.push(`✓ Inquiry model working. Total documents: ${count}`)
    
    return NextResponse.json({
      success: true,
      message: 'All systems operational',
      logs,
      diagnostics: {
        mongoUri: 'configured',
        mongoConnection: 'connected',
        inquiryModel: 'working',
        totalInquiries: count,
        connectionTime: `${connectionTime}ms`,
      },
    })
  } catch (error) {
    logs.push(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      logs.push('')
      logs.push('💡 TROUBLESHOOTING:')
      logs.push('1. Check if MongoDB Atlas cluster is RUNNING (not paused)')
      logs.push('2. Go to https://cloud.mongodb.com → Network Access')
      logs.push('3. Ensure YOUR IP is whitelisted (add 0.0.0.0/0 for development)')
      logs.push('4. Check if firewall/VPN is blocking MongoDB port')
      logs.push('5. Try: mongo "mongodb+srv://..." --eval "db.adminCommand(\'ping\')"')
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        logs,
      },
      { status: 500 }
    )
  }
}
