import { NextResponse } from 'next/server'
import dns from 'dns'

export async function GET() {
  const results: Record<string, unknown> = {}

  try {
    // 1. Check env
    results['env_mongo_uri'] = process.env.MONGO_URI ? '✓ Configured' : '❌ Missing'

    // 2. Test DNS resolution
    results['dns_test'] = await new Promise((resolve) => {
      dns.resolveSrv(
        '_mongodb._tcp.cluster0.vuukewn.mongodb.net',
        (err, addresses) => {
          if (err) {
            resolve(`❌ DNS SRV failed: ${err.message}`)
          } else {
            resolve(`✓ DNS resolved to ${addresses?.length || 0} servers`)
          }
        }
      )
    })

    // 3. Test basic connectivity with manual connection
    results['mongoose_import'] = '✓ Mongoose available'
    
    results['manual_test'] = 'Attempting manual connection (this may take 10-15s)...'
    
    // Import mongoose here for fresh attempt
    const mongoose = await import('mongoose')
    
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI not set')
    }

    const testConnection = await Promise.race([
      mongoose.default.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 8000)
      ),
    ])

    results['manual_test'] = '✓ Connection successful'
    
    // Disconnect
    await mongoose.default.disconnect()
    results['cleanup'] = '✓ Disconnected'

    return NextResponse.json({
      success: true,
      message: 'MongoDB connectivity test passed',
      results,
    })
  } catch (error) {
    results['error'] = error instanceof Error ? error.message : String(error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connectivity test failed',
        results,
        troubleshooting: [
          '1. Verify MongoDB Atlas cluster is RUNNING (not paused)',
          '2. Check IP whitelist: https://cloud.mongodb.com → Network Access',
          '3. Ensure your IP is added (use 0.0.0.0/0 for development)',
          '4. Check if firewall/VPN is blocking connections',
          '5. Try pinging: ping cluster0.vuukewn.mongodb.net',
        ],
      },
      { status: 500 }
    )
  }
}
