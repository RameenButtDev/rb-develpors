import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

interface Property {
  _id: string
  title: string
  slug: string
  description: string
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
  }
  images: string[]
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  specs: {
    bedrooms?: number
    bathrooms?: number
    area: number
    yearBuilt?: number
    floors?: number
    units?: number
  }
  amenities: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface PropertyState {
  properties: Property[]
  featuredProperties: Property[]
  selectedProperty: Property | null
  filters: {
    status: string
    propertyType: string
    city: string
  }
  setProperties: (properties: Property[]) => void
  setFeaturedProperties: (properties: Property[]) => void
  setSelectedProperty: (property: Property | null) => void
  setFilters: (filters: Partial<PropertyState['filters']>) => void
  clearFilters: () => void
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  featuredProperties: [],
  selectedProperty: null,
  filters: {
    status: '',
    propertyType: '',
    city: '',
  },
  setProperties: (properties) => set({ properties }),
  setFeaturedProperties: (properties) => set({ featuredProperties: properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ 
    filters: { status: '', propertyType: '', city: '' } 
  }),
}))

interface Inquiry {
  _id: string
  property?: {
    _id: string
    title: string
  }
  name: string
  email: string
  phone: string
  message: string
  inquiryType: 'general' | 'property' | 'viewing'
  status: 'new' | 'contacted' | 'closed'
  createdAt: string
}

interface InquiryState {
  inquiries: Inquiry[]
  setInquiries: (inquiries: Inquiry[]) => void
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void
}

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiries: [],
  setInquiries: (inquiries) => set({ inquiries }),
  updateInquiryStatus: (id, status) => set((state) => ({
    inquiries: state.inquiries.map((inq) =>
      inq._id === id ? { ...inq, status } : inq
    ),
  })),
}))
