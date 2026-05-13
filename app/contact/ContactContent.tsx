'use client'

import { motion } from 'framer-motion'
import InquiryForm from '@/components/forms/InquiryForm'

const offices = [
  {
    city: 'New York',
    address: '123 Park Avenue',
    location: 'New York, NY 10022',
    phone: '+1 (212) 555-0100',
    email: 'nyc@rbdevelopers.com',
  },
  {
    city: 'Miami',
    address: '456 Ocean Drive',
    location: 'Miami, FL 33139',
    phone: '+1 (305) 555-0200',
    email: 'miami@rbdevelopers.com',
  },
  {
    city: 'Los Angeles',
    address: '789 Wilshire Blvd',
    location: 'Los Angeles, CA 90017',
    phone: '+1 (213) 555-0300',
    email: 'la@rbdevelopers.com',
  },
]

export default function ContactContent() {
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
          Get in Touch
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          We would love to hear from you. Whether you are interested in our properties or have questions about our developments, our team is here to assist.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="font-serif text-3xl text-foreground mb-8">Send Us a Message</h2>
            <InquiryForm />
          </motion.div>

          {/* Office Locations */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="font-serif text-3xl text-foreground mb-8">Our Offices</h2>
            <div className="space-y-10">
              {offices.map((office, index) => (
                <motion.div
                  key={office.city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="pb-10 border-b border-border last:border-0"
                >
                  <h3 className="font-serif text-2xl text-foreground mb-4">{office.city}</h3>
                  <address className="not-italic space-y-2 text-muted-foreground">
                    <p>{office.address}</p>
                    <p>{office.location}</p>
                    <p className="pt-2">
                      <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="hover:text-foreground transition-colors">
                        {office.phone}
                      </a>
                    </p>
                    <p>
                      <a href={`mailto:${office.email}`} className="hover:text-foreground transition-colors">
                        {office.email}
                      </a>
                    </p>
                  </address>
                </motion.div>
              ))}
            </div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 p-8 bg-secondary"
            >
              <h3 className="font-serif text-xl text-foreground mb-4">Office Hours</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>By Appointment</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
