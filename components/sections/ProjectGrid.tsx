'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Property {
  _id: string
  slug: string
  title: string
  location: { city: string; state: string }
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  images: string[]
  specs: { area: number; bedrooms?: number; bathrooms?: number }
  price: number
}

interface ProjectGridProps {
  projects: Property[]
  isLoading?: boolean
}

function ProjectSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-muted" />
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-muted w-1/3" />
        <div className="h-8 bg-muted w-2/3" />
        <div className="h-4 bg-muted w-1/2" />
      </div>
    </div>
  )
}

export default function ProjectGrid({ projects, isLoading }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {[...Array(6)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-lg">
          No properties found matching your criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/portfolio/${project.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={project.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                
                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <span className={cn(
                    'px-3 py-1.5 text-xs tracking-widest uppercase',
                    project.status === 'active' && 'bg-white text-foreground',
                    project.status === 'completed' && 'bg-accent text-accent-foreground',
                    project.status === 'upcoming' && 'bg-muted text-muted-foreground'
                  )}>
                    {project.status === 'active' ? 'Now Selling' : project.status}
                  </span>
                </div>

                {/* Property Type Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1.5 bg-black/50 text-white text-xs tracking-widest uppercase">
                    {project.propertyType}
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
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{project.specs.area.toLocaleString()} sq ft</span>
                  {project.specs.bedrooms && (
                    <>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{project.specs.bedrooms} beds</span>
                    </>
                  )}
                  {project.specs.bathrooms && (
                    <>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{project.specs.bathrooms} baths</span>
                    </>
                  )}
                </div>
                <p className="mt-3 font-serif text-xl text-foreground">
                  ${project.price.toLocaleString()}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
