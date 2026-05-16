'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Sample featured projects data (will be replaced with API data)
const featuredProjects = [
  {
    _id: '1',
    slug: 'the-greenwich',
    title: 'Family Home in Greenwich',
    location: { city: 'New York', state: 'NY' },
    status: 'active',
    propertyType: 'residential',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    specs: { area: 45000 },
  },
  {
    _id: '2',
    slug: 'azure-tower',
    title: 'Azure Tower Apartment',
    location: { city: 'Miami', state: 'FL' },
    status: 'active',
    propertyType: 'mixed-use',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    specs: { area: 120000 },
  },
  {
    _id: '3',
    slug: 'parkside-residences',
    title: 'Parkside New Homes',
    location: { city: 'Chicago', state: 'IL' },
    status: 'completed',
    propertyType: 'residential',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    specs: { area: 68000 },
  },
]

function ProjectCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
          
          {/* Status Badge */}
          <div className="absolute top-6 left-6">
            <span className={`
              px-3 py-1.5 text-xs tracking-widest uppercase
              ${project.status === 'active' 
                ? 'bg-white text-foreground' 
                : project.status === 'completed'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {project.status === 'active' ? 'Now Selling' : project.status}
            </span>
          </div>

          {/* Arrow Icon */}
          <div className="absolute bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-white text-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm tracking-wide text-muted-foreground uppercase">
            {project.location.city}, {project.location.state}
          </p>
          <h3 className="mt-2 font-serif text-2xl md:text-3xl text-foreground group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {project.specs.area.toLocaleString()} sq ft | {project.propertyType.charAt(0).toUpperCase() + project.propertyType.slice(1)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function FeaturedProjects() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
            >
              Featured Listings
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight"
            >
              Homes people are viewing now
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground hover:text-accent transition-colors group"
            >
              View All Listings
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
