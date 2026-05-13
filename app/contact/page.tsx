import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact | RB Developers',
  description: 'Get in touch with RB Developers. We are here to help you find your perfect property.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <ContactContent />
      </main>
      <Footer />
    </>
  )
}
