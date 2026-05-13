'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  // Check if we're on a page with hero (transparent navbar)
  const isHeroPage = pathname === '/' || pathname.startsWith('/portfolio/')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navbarBg = isScrolled || !isHeroPage || isMobileMenuOpen
    ? 'bg-background/95 backdrop-blur-md border-b border-border'
    : 'bg-transparent'

  const textColor = isScrolled || !isHeroPage || isMobileMenuOpen
    ? 'text-foreground'
    : 'text-white'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        navbarBg
      )}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              'font-serif text-2xl lg:text-3xl tracking-tight transition-colors duration-300',
              textColor
            )}
          >
            RB Developers
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-70',
                  textColor,
                  pathname === link.href && 'border-b border-current pb-1'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Link
                href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className={cn(
                  'text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-70',
                  textColor
                )}
              >
                {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'px-6 py-2.5 text-sm tracking-widest uppercase border transition-all duration-300',
                  isScrolled || !isHeroPage
                    ? 'border-foreground text-foreground hover:bg-foreground hover:text-background'
                    : 'border-white text-white hover:bg-white hover:text-foreground'
                )}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5',
              textColor
            )}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-current transition-colors"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-current transition-colors"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-current transition-colors"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'text-lg tracking-wide transition-colors hover:text-accent',
                      pathname === link.href ? 'text-accent' : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-4 border-t border-border"
              >
                {isAuthenticated ? (
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="text-lg tracking-wide text-foreground hover:text-accent transition-colors"
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-block px-8 py-3 border border-foreground text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all"
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
