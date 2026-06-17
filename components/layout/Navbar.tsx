'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CircleUserRound, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/portfolio', label: 'Buy', hasMenu: true },
  { href: '/portfolio?type=rent', label: 'Rent', hasMenu: true },
  { href: '/portfolio?status=upcoming', label: 'New Homes', hasMenu: true },
  { href: '/portfolio?type=commercial', label: 'Commercial', hasMenu: true },
  { href: '/about', label: 'Advice Hub', hasMenu: true },
  { href: '/contact', label: 'Mortgages' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActiveLink = (href: string) => {
    const path = href.split('?')[0]
    return pathname === path || (path !== '/' && pathname.startsWith(path))
  }

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white text-slate-950 shadow-sm transition-shadow duration-300',
        isScrolled && 'shadow-md'
      )}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="RB Developers home">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#1f86ff] text-[#1f86ff]">
            <Home className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-[28px] font-bold leading-none tracking-tight">
            <span className="text-[#1f86ff]">rb</span>
            <span className="text-slate-800">developers</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-9 px-8 lg:flex">
          {navLinks.map((link, index) => (
            <Link
              key={`${link.label}-${index}`}
              href={link.href}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap text-[16px] font-medium text-slate-950 transition-colors hover:text-[#1f86ff]',
                isActiveLink(link.href) && 'text-[#1f86ff]'
              )}
            >
              <span>{link.label}</span>
              {link.hasMenu && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-8 lg:flex">
          <Link
            href="/contact"
            className="flex items-center gap-2 whitespace-nowrap text-[16px] font-medium text-slate-950 transition-colors hover:text-[#1f86ff]"
          >
            <span>Place Ad</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            aria-label="User account"
            className="text-slate-900 transition-colors hover:text-[#1f86ff]"
          >
            <CircleUserRound className="h-8 w-8" aria-hidden="true" />
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-slate-950 lg:hidden"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-current transition-colors"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="h-0.5 w-6 bg-current transition-colors"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-current transition-colors"
          />
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="flex flex-col px-8 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between border-b border-slate-100 py-4 text-base font-medium text-slate-950 transition-colors hover:text-[#1f86ff]',
                      isActiveLink(link.href) && 'text-[#1f86ff]'
                    )}
                  >
                    <span>{link.label}</span>
                    {link.hasMenu && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
                className="flex items-center justify-between gap-4 pt-5"
              >
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-base font-medium text-slate-950 transition-colors hover:text-[#1f86ff]"
                >
                  <span>Place Ad</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  aria-label="User account"
                  className="text-slate-900 transition-colors hover:text-[#1f86ff]"
                >
                  <CircleUserRound className="h-8 w-8" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
