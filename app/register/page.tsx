import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Register | RB Developers',
  description: 'Create your RB Developers account.',
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="max-w-md mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-center mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground text-center mb-10">
              Join us to explore premium properties
            </p>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
