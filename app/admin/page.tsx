import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminDashboardContent from './AdminDashboardContent'

export const metadata: Metadata = {
  title: 'Admin Dashboard | RB Developers',
  description: 'Manage properties and inquiries.',
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  
  // Redirect if not authenticated or not admin
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  return <AdminDashboardContent />
}
