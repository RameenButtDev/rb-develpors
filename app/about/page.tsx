import { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About | RB Developers',
  description: 'Learn about RB Developers, our history, values, and commitment to exceptional real estate development.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
