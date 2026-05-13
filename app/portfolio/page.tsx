import { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PortfolioContent from './PortfolioContent'

export const metadata: Metadata = {
  title: 'Portfolio | RB Developers',
  description: 'Explore our portfolio of premium residential and commercial real estate developments across the country.',
}

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <Suspense fallback={null}>
          <PortfolioContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
