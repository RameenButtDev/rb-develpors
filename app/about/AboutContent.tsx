'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const values = [
  {
    title: 'Excellence',
    description: 'We pursue the highest standards in every project, from design to construction to customer service.',
  },
  {
    title: 'Integrity',
    description: 'We build lasting relationships through honest communication, transparency, and ethical business practices.',
  },
  {
    title: 'Innovation',
    description: 'We embrace new technologies and sustainable practices to create forward-thinking developments.',
  },
  {
    title: 'Community',
    description: 'We design spaces that enhance neighborhoods and create lasting value for residents and cities alike.',
  },
]

const team = [
  {
    name: 'Robert Blake',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Chief Design Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Development',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Director of Sales',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
]

export default function AboutContent() {
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)
  
  const isStoryInView = useInView(storyRef, { once: true, margin: '-100px' })
  const isValuesInView = useInView(valuesRef, { once: true, margin: '-100px' })
  const isTeamInView = useInView(teamRef, { once: true, margin: '-100px' })

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
          Our Story
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight"
        >
          About RB Developers
        </motion.h1>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-6 lg:px-12 mb-24"
      >
        <div className="relative aspect-[21/9] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="RB Developers headquarters"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Our Story */}
      <section ref={storyRef} className="container mx-auto px-6 lg:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
              Building <span className="italic">Legacy</span> Since 1995
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded by Robert Blake in 1995, RB Developers began with a simple vision: 
                to create living spaces that stand the test of time. What started as a small 
                residential development firm has grown into one of the most respected names 
                in premium real estate.
              </p>
              <p>
                Over three decades, we have developed over 150 properties across 25 cities, 
                from luxury condominiums in Manhattan to mixed-use developments in Miami. 
                Each project reflects our commitment to quality, design excellence, and 
                creating spaces where people truly want to live.
              </p>
              <p>
                Today, RB Developers continues to push boundaries, incorporating sustainable 
                practices and innovative design while staying true to our founding principles 
                of integrity, craftsmanship, and community.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
              alt="RB Developers project"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={valuesRef} className="py-24 bg-secondary mb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
              What Drives Us
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-serif text-2xl text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section ref={teamRef} className="container mx-auto px-6 lg:px-12 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
            Our People
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Leadership Team
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-xl text-foreground">{member.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary text-primary-foreground p-12 lg:p-20 text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you are looking for your dream home or an investment opportunity, 
            we are here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/portfolio"
              className="px-10 py-4 bg-primary-foreground text-primary text-sm tracking-widest uppercase hover:bg-primary-foreground/90 transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border border-primary-foreground/30 text-primary-foreground text-sm tracking-widest uppercase hover:border-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
