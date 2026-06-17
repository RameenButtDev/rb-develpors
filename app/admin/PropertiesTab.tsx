'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import PropertyFormModal from './PropertyFormModal'

interface Property {
  _id: string
  title: string
  slug: string
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  location: { city: string; state: string }
  price: number
  images: string[]
  featured: boolean
  createdAt: string
}

// Sample data for demonstration
const sampleProperties: Property[] = []

export default function PropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties?limit=100')
      if (!response.ok) throw new Error('Failed to fetch properties')
      
      const data = await response.json()
      setProperties(data.data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      
      setProperties(properties.filter((p) => p._id !== id))
      toast.success('Property deleted')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProperty(null)
    fetchProperties() // Refresh list after modal closes
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-foreground">All Properties</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
        >
          Add Property
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Property</th>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Location</th>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-left text-xs tracking-widest uppercase text-muted-foreground">Featured</th>
                <th className="px-6 py-4 text-right text-xs tracking-widest uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {properties.map((property) => (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 bg-muted flex-shrink-0">
                          {property.images[0] && (
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{property.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {property.location.city}, {property.location.state}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">
                      {property.propertyType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-2 py-1 text-xs rounded capitalize',
                        statusColors[property.status]
                      )}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {property.featured ? (
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {properties.length === 0 && !isLoading && (
          <div className="py-12 text-center text-muted-foreground">
            No properties found. Add your first property to get started.
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        property={editingProperty}
      />
    </div>
  )
}
