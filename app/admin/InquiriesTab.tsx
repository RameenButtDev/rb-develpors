'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface Inquiry {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  inquiryType: 'general' | 'property' | 'viewing'
  status: 'new' | 'contacted' | 'closed'
  property?: { _id: string; title: string }
  createdAt: string
}

export default function InquiriesTab() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/inquiries')
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      
      const data = await response.json()
      setInquiries(data.data || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast.error('Failed to load inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update')
      
      setInquiries(inquiries.map((inq) =>
        inq._id === id ? { ...inq, status: newStatus } : inq
      ))
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus })
      }
      toast.success('Status updated')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      
      setInquiries(inquiries.filter((inq) => inq._id !== id))
      if (selectedInquiry?._id === id) setSelectedInquiry(null)
      toast.success('Inquiry deleted')
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      toast.error('Failed to delete inquiry')
    }
  }

  const statusColors = {
    new: 'bg-green-100 text-green-800',
    contacted: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
  }

  const typeLabels = {
    general: 'General',
    property: 'Property Info',
    viewing: 'Viewing Request',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 1000 * 60 * 60) {
      const mins = Math.floor(diff / (1000 * 60))
      return `${mins} min ago`
    } else if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      return `${hours} hours ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inquiries List */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-foreground">All Inquiries</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {inquiries.filter((i) => i.status === 'new').length} new
          </div>
        </div>

        <div className="bg-card border border-border divide-y divide-border">
          <AnimatePresence>
            {inquiries.map((inquiry) => (
              <motion.div
                key={inquiry._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'p-4 cursor-pointer transition-colors',
                  selectedInquiry?._id === inquiry._id ? 'bg-muted' : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-foreground">{inquiry.name}</span>
                      <span className={cn(
                        'px-2 py-0.5 text-xs rounded capitalize',
                        statusColors[inquiry.status]
                      )}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{inquiry.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{typeLabels[inquiry.inquiryType]}</span>
                      {inquiry.property && (
                        <>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                          <span>{inquiry.property.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {inquiries.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No inquiries yet.
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Detail */}
      <div className="lg:col-span-1">
        <AnimatePresence mode="wait">
          {selectedInquiry ? (
            <motion.div
              key={selectedInquiry._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card border border-border p-6 sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-foreground">Inquiry Details</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</p>
                  <p className="text-foreground">{selectedInquiry.name}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-accent hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>

                {selectedInquiry.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-accent hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}

                {selectedInquiry.property && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Property</p>
                    <p className="text-foreground">{selectedInquiry.property.title}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</p>
                  <p className="text-foreground">{typeLabels[selectedInquiry.inquiryType]}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Message</p>
                  <p className="text-foreground text-sm leading-relaxed">{selectedInquiry.message}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status</p>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value as Inquiry['status'])}
                    className="w-full px-3 py-2 bg-transparent border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-border flex gap-2">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex-1 py-2 bg-foreground text-background text-center text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedInquiry._id)}
                    className="px-4 py-2 border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border p-6 text-center text-muted-foreground"
            >
              <p>Select an inquiry to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
