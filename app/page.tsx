import Header from '@/components/Landing Page/Header'
import Hero from '@/components/Landing Page/Hero'
import ToursSection from '@/components/Landing Page/ToursSection'
import DestinationsSection from '@/components/Landing Page/Destinations'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  const deployTime = new Date().toLocaleString();
  
  return (
    <>
      <Header />
      <Hero />
      {/* Deployment test - remove this line after confirming deployment works */}
      <div className="text-center py-2 bg-blue-100 text-blue-800 text-sm">
        Last deployed: {deployTime}
      </div>
      <ToursSection />
      <DestinationsSection />
      <CTA />
      <Footer />
    </>
  )
}
