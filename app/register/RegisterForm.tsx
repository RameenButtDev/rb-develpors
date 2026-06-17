'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      setUser({
        id: result.data.id,
        name: result.data.fullName,
        email: result.data.email,
        role: result.data.role,
      })

      toast.success('Account created successfully!')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors',
            errors.fullName ? 'border-destructive' : 'border-border'
          )}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Email
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors',
            errors.password ? 'border-destructive' : 'border-border'
          )}
          placeholder="At least 6 characters"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm tracking-wide text-muted-foreground uppercase mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className={cn(
            'w-full px-4 py-3 bg-transparent border text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-accent transition-colors',
            errors.confirmPassword ? 'border-destructive' : 'border-border'
          )}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
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
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="text-center text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground hover:text-accent transition-colors underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
