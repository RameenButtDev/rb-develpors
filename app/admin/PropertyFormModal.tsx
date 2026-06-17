'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const propertySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  status: z.enum(['active', 'completed', 'upcoming']),
  propertyType: z.enum(['residential', 'commercial', 'mixed-use']),
  area: z.number().min(1, 'Area is required'),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  floors: z.number().optional(),
  yearBuilt: z.number().optional(),
  featured: z.boolean(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface Property {
  _id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  location: { city: string; state: string; address?: string }
  price: number
  specs?: { area?: number; bedrooms?: number; bathrooms?: number; floors?: number; yearBuilt?: number }
  featured: boolean
}

interface PropertyFormModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export default function PropertyFormModal({ isOpen, onClose, property }: PropertyFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'active',
      propertyType: 'residential',
      featured: false,
    },
  })

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description || '',
        price: property.price,
        address: property.location.address || '',
        city: property.location.city,
        state: property.location.state,
        status: property.status,
        propertyType: property.propertyType,
        area: property.specs?.area || 0,
        bedrooms: property.specs?.bedrooms,
        bathrooms: property.specs?.bathrooms,
        floors: property.specs?.floors,
        yearBuilt: property.specs?.yearBuilt,
        featured: property.featured,
      })
    } else {
      reset({
        status: 'active',
        propertyType: 'residential',
        featured: false,
      })
    }
  }, [property, reset])

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      const location = `${data.address}, ${data.city}, ${data.state}`
      
      const payload = {
        title: data.title,
        description: data.description,
        location,
        price: data.price,
      }

      const url = property ? `/api/properties/${property._id}` : '/api/properties'
      const method = property ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save property')
      }

      toast.success(property ? 'Property updated!' : 'Property created!')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-2xl text-foreground">
              {property ? 'Edit Property' : 'Add Property'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className={cn(
                  'w-full px-4 py-3 bg-transparent border text-foreground',
                  'focus:outline-none focus:border-accent transition-colors',
                  errors.title ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={cn(
                  'w-full px-4 py-3 bg-transparent border text-foreground resize-none',
                  'focus:outline-none focus:border-accent transition-colors',
                  errors.description ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                Price <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className={cn(
                  'w-full px-4 py-3 bg-transparent border text-foreground',
                  'focus:outline-none focus:border-accent transition-colors',
                  errors.price ? 'border-destructive' : 'border-border'
                )}
              />
              {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className={cn(
                    'w-full px-4 py-3 bg-transparent border text-foreground',
                    'focus:outline-none focus:border-accent transition-colors',
                    errors.address ? 'border-destructive' : 'border-border'
                  )}
                />
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  City <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className={cn(
                    'w-full px-4 py-3 bg-transparent border text-foreground',
                    'focus:outline-none focus:border-accent transition-colors',
                    errors.city ? 'border-destructive' : 'border-border'
                  )}
                />
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  State <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className={cn(
                    'w-full px-4 py-3 bg-transparent border text-foreground',
                    'focus:outline-none focus:border-accent transition-colors',
                    errors.state ? 'border-destructive' : 'border-border'
                  )}
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Property Type
                </label>
                <select
                  {...register('propertyType')}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed-use">Mixed-Use</option>
                </select>
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Area (sq ft) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  {...register('area', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  {...register('yearBuilt', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="w-5 h-5 border-border"
              />
              <label htmlFor="featured" className="text-sm text-foreground">
                Featured Property
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-border text-foreground text-sm tracking-widest uppercase hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'flex-1 py-3 bg-foreground text-background text-sm tracking-widest uppercase',
                  'hover:bg-foreground/90 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Saving...' : property ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
