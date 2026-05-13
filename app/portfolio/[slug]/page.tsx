import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectDetailContent from './ProjectDetailContent'

// Sample properties data (same as portfolio for now)
const sampleProperties = [
  {
    _id: '1',
    slug: 'the-greenwich',
    title: 'The Greenwich',
    description: 'Luxury waterfront residences offering unparalleled views of the Manhattan skyline. The Greenwich represents the pinnacle of modern living, featuring meticulously designed interiors, premium finishes, and an array of world-class amenities. Each residence has been thoughtfully crafted to maximize natural light and showcase breathtaking vistas.',
    location: { city: 'New York', state: 'NY', address: '123 Park Avenue', country: 'USA' },
    status: 'active' as const,
    propertyType: 'residential' as const,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    ],
    specs: { area: 45000, bedrooms: 4, bathrooms: 5, yearBuilt: 2024, floors: 32 },
    price: 4500000,
    amenities: ['24/7 Concierge', 'Private Gym', 'Rooftop Terrace', 'Wine Cellar', 'Spa', 'Valet Parking', 'Private Cinema', 'Dog Park'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    slug: 'azure-tower',
    title: 'Azure Tower',
    description: 'A stunning mixed-use development in the heart of Miami, Azure Tower redefines urban living with its seamless blend of residential, commercial, and retail spaces. Rising 45 stories above Biscayne Bay, the tower offers panoramic ocean views and direct access to the citys most vibrant neighborhoods.',
    location: { city: 'Miami', state: 'FL', address: '456 Ocean Drive', country: 'USA' },
    status: 'active' as const,
    propertyType: 'mixed-use' as const,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    ],
    specs: { area: 120000, floors: 45, units: 200 },
    price: 8500000,
    amenities: ['Infinity Pool', 'Business Center', 'Restaurant', 'Retail Spaces', 'Fitness Center', 'Beach Club Access'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    slug: 'parkside-residences',
    title: 'Parkside Residences',
    description: 'Elegant homes overlooking Chicagos most beautiful park. Parkside Residences offers a sanctuary of sophistication in the heart of the city. With unobstructed views of Millennium Park and Lake Michigan, these homes provide an unparalleled living experience for discerning buyers.',
    location: { city: 'Chicago', state: 'IL', address: '789 Lake Shore Drive', country: 'USA' },
    status: 'completed' as const,
    propertyType: 'residential' as const,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    specs: { area: 68000, bedrooms: 3, bathrooms: 4, yearBuilt: 2022, floors: 28 },
    price: 3200000,
    amenities: ['Park Views', 'Private Balconies', 'Smart Home', 'Pet Spa', 'Library', 'Guest Suites'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    slug: 'the-metropolitan',
    title: 'The Metropolitan',
    description: 'Premier commercial space in downtown Los Angeles. The Metropolitan stands as a testament to contemporary architecture and sustainable design, featuring LEED Platinum certification and state-of-the-art building systems that set new standards for commercial real estate.',
    location: { city: 'Los Angeles', state: 'CA', address: '101 Wilshire Boulevard', country: 'USA' },
    status: 'active' as const,
    propertyType: 'commercial' as const,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    ],
    specs: { area: 250000, floors: 52, units: 100 },
    price: 15000000,
    amenities: ['LEED Platinum', 'Executive Conference', 'Helipad', 'Private Dining', 'Fitness Center', 'Underground Parking'],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    slug: 'harbor-point',
    title: 'Harbor Point',
    description: 'Waterfront living at its finest in historic Boston. Harbor Point brings together maritime heritage and modern luxury in an exclusive collection of residences designed for those who appreciate the finer things in life.',
    location: { city: 'Boston', state: 'MA', address: '200 Harbor Way', country: 'USA' },
    status: 'upcoming' as const,
    propertyType: 'residential' as const,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    ],
    specs: { area: 85000, bedrooms: 5, bathrooms: 6, yearBuilt: 2025, floors: 24 },
    price: 6800000,
    amenities: ['Marina Access', 'Yacht Club', 'Waterfront Dining', 'Infinity Pool', 'Private Beach', 'Concierge'],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    slug: 'skyline-plaza',
    title: 'Skyline Plaza',
    description: 'Mixed-use development with stunning city views in Seattle. Skyline Plaza represents the future of urban development, combining residential comfort with commercial convenience in one of the Pacific Northwests most dynamic cities.',
    location: { city: 'Seattle', state: 'WA', address: '300 Pike Street', country: 'USA' },
    status: 'completed' as const,
    propertyType: 'mixed-use' as const,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    ],
    specs: { area: 175000, floors: 38, units: 150 },
    price: 12000000,
    amenities: ['Sky Lounge', 'Co-Working Spaces', 'Retail Podium', 'Green Terraces', 'EV Charging', 'Bike Storage'],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = sampleProperties.find((p) => p.slug === slug)
  
  if (!property) {
    return {
      title: 'Property Not Found | RB Developers',
    }
  }

  return {
    title: `${property.title} | RB Developers`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images[0] ? [property.images[0]] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = sampleProperties.find((p) => p.slug === slug)

  if (!property) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <ProjectDetailContent property={property} />
      </main>
      <Footer />
    </>
  )
}
