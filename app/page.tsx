import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import VisionStatement from '@/components/sections/VisionStatement'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VisionStatement />
        <FeaturedProjects />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
