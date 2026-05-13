import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'RB Developers | Premium Real Estate Development',
  description: 'Crafting exceptional living spaces with timeless design and uncompromising quality. Discover our portfolio of luxury residential and commercial developments.',
  keywords: ['real estate', 'luxury homes', 'property development', 'residential', 'commercial', 'premium'],
  authors: [{ name: 'RB Developers' }],
  openGraph: {
    title: 'RB Developers | Premium Real Estate Development',
    description: 'Crafting exceptional living spaces with timeless design and uncompromising quality.',
    type: 'website',
    siteName: 'RB Developers',
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
