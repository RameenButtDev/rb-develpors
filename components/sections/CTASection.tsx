'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      ref={ref} 
      className="relative py-32 lg:py-48 bg-primary text-primary-foreground overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm tracking-[0.3em] uppercase text-primary-foreground/60"
          >
            Begin Your Journey
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-balance"
          >
            Ready to discover your next{' '}
            <span className="italic">exceptional</span> space?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
          >
            Our team of experts is ready to guide you through our portfolio 
            and help you find the perfect property that matches your vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary-foreground text-primary text-sm tracking-widest uppercase hover:bg-primary-foreground/90 transition-all duration-300"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-10 py-4 border border-primary-foreground/30 text-primary-foreground text-sm tracking-widest uppercase hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            >
              Explore Properties
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
