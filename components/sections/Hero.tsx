'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const heroVideos = [
  'https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4',
  'https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=174&oauth2_token_id=57447761',
]

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
          aria-label="Luxury real estate video background"
        >
          {heroVideos.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-sm tracking-[0.3em] uppercase mb-6"
          >
            Buy, rent, and discover homes
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.1] tracking-tight"
          >
            Find
            <br />
            <span className="italic">your next</span>
            <br />
            home
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
          >
            Search residences, new homes, commercial spaces, and trusted property advice in one simple place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 w-full max-w-3xl overflow-hidden rounded-md bg-white p-2 shadow-2xl"
          >
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4 py-3 text-slate-500">
                <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-left text-base">Search by city, community, or property name</span>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded bg-[#1f86ff] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#126bd3]"
              >
                Search
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              {[
                { href: '/portfolio', label: 'Buy' },
                { href: '/portfolio?type=rent', label: 'Rent' },
                { href: '/portfolio?status=upcoming', label: 'New Homes' },
                { href: '/portfolio?type=commercial', label: 'Commercial' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#1f86ff] hover:text-[#1f86ff]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <svg 
            className="w-4 h-4 text-white/50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
