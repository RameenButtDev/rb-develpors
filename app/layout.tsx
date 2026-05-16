import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'rbdevelopers | Buy, Rent & Discover Property',
  description: 'Search homes for sale, rental properties, new homes, commercial spaces, mortgages, and property advice.',
  keywords: ['real estate', 'homes for sale', 'rentals', 'new homes', 'commercial property', 'mortgages'],
  authors: [{ name: 'RB Developers' }],
  openGraph: {
    title: 'rbdevelopers | Buy, Rent & Discover Property',
    description: 'Search homes, rentals, new developments, commercial spaces, mortgages, and property advice.',
    type: 'website',
    siteName: 'rbdevelopers',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
