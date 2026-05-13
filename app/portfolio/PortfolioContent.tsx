'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProjectGrid from '@/components/sections/ProjectGrid'
import { cn } from '@/lib/utils'

// Sample properties data (will be replaced with API data)
const sampleProperties = [
  {
    _id: '1',
    slug: 'the-greenwich',
    title: 'The Greenwich',
    description: 'Luxury waterfront residences offering unparalleled views.',
    location: { city: 'New York', state: 'NY', address: '123 Park Ave', country: 'USA' },
    status: 'active' as const,
    propertyType: 'residential' as const,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    specs: { area: 45000, bedrooms: 4, bathrooms: 5 },
    price: 4500000,
    amenities: [],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    slug: 'azure-tower',
    title: 'Azure Tower',
    description: 'A stunning mixed-use development in the heart of Miami.',
    location: { city: 'Miami', state: 'FL', address: '456 Ocean Dr', country: 'USA' },
    status: 'active' as const,
    propertyType: 'mixed-use' as const,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    specs: { area: 120000, floors: 45, units: 200 },
    price: 8500000,
    amenities: [],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    slug: 'parkside-residences',
    title: 'Parkside Residences',
    description: 'Elegant homes overlooking the citys most beautiful park.',
    location: { city: 'Chicago', state: 'IL', address: '789 Lake Shore', country: 'USA' },
    status: 'completed' as const,
    propertyType: 'residential' as const,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    specs: { area: 68000, bedrooms: 3, bathrooms: 4 },
    price: 3200000,
    amenities: [],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    slug: 'the-metropolitan',
    title: 'The Metropolitan',
    description: 'Premier commercial space in downtown Los Angeles.',
    location: { city: 'Los Angeles', state: 'CA', address: '101 Wilshire Blvd', country: 'USA' },
    status: 'active' as const,
    propertyType: 'commercial' as const,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
    specs: { area: 250000, floors: 52 },
    price: 15000000,
    amenities: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    slug: 'harbor-point',
    title: 'Harbor Point',
    description: 'Waterfront living at its finest.',
    location: { city: 'Boston', state: 'MA', address: '200 Harbor Way', country: 'USA' },
    status: 'upcoming' as const,
    propertyType: 'residential' as const,
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
    specs: { area: 85000, bedrooms: 5, bathrooms: 6 },
    price: 6800000,
    amenities: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    slug: 'skyline-plaza',
    title: 'Skyline Plaza',
    description: 'Mixed-use development with stunning city views.',
    location: { city: 'Seattle', state: 'WA', address: '300 Pike St', country: 'USA' },
    status: 'completed' as const,
    propertyType: 'mixed-use' as const,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    specs: { area: 175000, floors: 38, units: 150 },
    price: 12000000,
    amenities: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const statusFilters = [
  { value: '', label: 'All Projects' },
  { value: 'active', label: 'Now Selling' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Coming Soon' },
]

const typeFilters = [
  { value: '', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'mixed-use', label: 'Mixed-Use' },
]

export default function PortfolioContent() {
  const searchParams = useSearchParams()
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [statusFilter, typeFilter])

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      if (statusFilter && property.status !== statusFilter) return false
      if (typeFilter && property.propertyType !== typeFilter) return false
      return true
    })
  }, [statusFilter, typeFilter])

  return (
    <div className="pb-24 lg:pb-32">
      {/* Page Header */}
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
        >
          Our Work
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight"
        >
          Portfolio
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Explore our collection of distinguished developments, from luxury residences 
          to landmark commercial spaces, each designed with exceptional attention to detail.
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container mx-auto px-6 lg:px-12 mb-12"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8 border-b border-border">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'px-4 py-2 text-sm tracking-wide transition-all duration-300',
                  statusFilter === filter.value
                    ? 'bg-foreground text-background'
                    : 'bg-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  'px-4 py-2 text-sm tracking-wide transition-all duration-300',
                  typeFilter === filter.value
                    ? 'bg-foreground text-background'
                    : 'bg-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'project' : 'projects'}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 lg:px-12">
        <ProjectGrid projects={filteredProperties} isLoading={isLoading} />
      </div>
    </div>
  )
}
