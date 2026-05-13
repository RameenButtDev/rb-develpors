'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ImageGallery from '@/components/ui/ImageGallery'
import InquiryForm from '@/components/forms/InquiryForm'

interface Property {
  _id: string
  slug: string
  title: string
  description: string
  location: { city: string; state: string; address: string; country: string }
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  images: string[]
  specs: {
    area: number
    bedrooms?: number
    bathrooms?: number
    yearBuilt?: number
    floors?: number
    units?: number
  }
  price: number
  amenities: string[]
  featured: boolean
}

interface ProjectDetailContentProps {
  property: Property
}

export default function ProjectDetailContent({ property }: ProjectDetailContentProps) {
  const statusLabels = {
    active: 'Now Selling',
    completed: 'Completed',
    upcoming: 'Coming Soon',
  }

  return (
    <div className="pb-24 lg:pb-32">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 lg:px-12 mb-8">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </motion.nav>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <span className={`
                px-3 py-1.5 text-xs tracking-widest uppercase
                ${property.status === 'active' ? 'bg-accent text-accent-foreground' : 
                  property.status === 'completed' ? 'bg-muted text-muted-foreground' : 
                  'bg-primary text-primary-foreground'}
              `}>
                {statusLabels[property.status]}
              </span>
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                {property.propertyType}
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight"
            >
              {property.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {property.location.address}, {property.location.city}, {property.location.state}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-right"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Starting From</p>
            <p className="font-serif text-4xl lg:text-5xl text-foreground">
              ${property.price.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ImageGallery images={property.images} title={property.title} />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-serif text-3xl text-foreground mb-6">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {property.description}
              </p>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-serif text-3xl text-foreground mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-6 bg-secondary">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Total Area</p>
                  <p className="font-serif text-2xl text-foreground">{property.specs.area.toLocaleString()} sq ft</p>
                </div>
                {property.specs.bedrooms && (
                  <div className="p-6 bg-secondary">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Bedrooms</p>
                    <p className="font-serif text-2xl text-foreground">{property.specs.bedrooms}</p>
                  </div>
                )}
                {property.specs.bathrooms && (
                  <div className="p-6 bg-secondary">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Bathrooms</p>
                    <p className="font-serif text-2xl text-foreground">{property.specs.bathrooms}</p>
                  </div>
                )}
                {property.specs.floors && (
                  <div className="p-6 bg-secondary">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Floors</p>
                    <p className="font-serif text-2xl text-foreground">{property.specs.floors}</p>
                  </div>
                )}
                {property.specs.units && (
                  <div className="p-6 bg-secondary">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Units</p>
                    <p className="font-serif text-2xl text-foreground">{property.specs.units}</p>
                  </div>
                )}
                {property.specs.yearBuilt && (
                  <div className="p-6 bg-secondary">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Year Built</p>
                    <p className="font-serif text-2xl text-foreground">{property.specs.yearBuilt}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="font-serif text-3xl text-foreground mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 py-3 border-b border-border">
                      <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32 bg-card border border-border p-8">
              <h3 className="font-serif text-2xl text-foreground mb-6">Inquire About This Property</h3>
              <InquiryForm propertyId={property._id} propertyTitle={property.title} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
