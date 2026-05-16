'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function VisionStatement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 lg:py-48 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
          >
            Why RB Developers
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight text-balance"
          >
            A simpler way to{' '}
            <span className="italic text-accent">search</span>, compare, and{' '}
            <span className="italic text-accent">choose</span> property.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Browse homes for sale, rental listings, new developments, and commercial
            spaces with clear details, helpful filters, and direct inquiry options.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {[
              { value: '150+', label: 'Active Listings' },
              { value: '25', label: 'Local Areas' },
              { value: '12K', label: 'Monthly Searches' },
              { value: '4', label: 'Property Categories' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                  {stat.value}
                </span>
                <p className="mt-2 text-sm tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
