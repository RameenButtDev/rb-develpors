'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.enum(['general', 'property', 'viewing']),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryFormProps {
  propertyId?: string
  propertyTitle?: string
  className?: string
}

export default function InquiryForm({ propertyId, propertyTitle, className }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      inquiryType: propertyId ? 'property' : 'general',
    },
  })

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          property: propertyId,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit inquiry')

      toast.success('Thank you! We will be in touch soon.')
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      {propertyTitle && (
        <div className="pb-6 border-b border-border">
          <p className="text-sm text-muted-foreground">Inquiring about</p>
          <p className="mt-1 font-serif text-xl text-foreground">{propertyTitle}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors',
            errors.name ? 'border-destructive' : 'border-border'
          )}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors',
            errors.email ? 'border-destructive' : 'border-border'
          )}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
          placeholder="+1 (234) 567-890"
        />
      </div>

      {/* Inquiry Type */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          I am interested in <span className="text-destructive">*</span>
        </label>
        <select
          id="inquiryType"
          {...register('inquiryType')}
          className="w-full px-4 py-3 bg-transparent border border-border text-foreground focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
        >
          <option value="general">General Inquiry</option>
          <option value="property">Property Information</option>
          <option value="viewing">Schedule a Viewing</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors resize-none',
            errors.message ? 'border-destructive' : 'border-border'
          )}
          placeholder="Tell us more about what you're looking for..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-4 bg-foreground text-background text-sm tracking-widest uppercase',
          'hover:bg-foreground/90 transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
      </p>
    </form>
  )
}
