import Header from '@/components/Landing Page/Header'
import Hero from '@/components/Landing Page/Hero'
import ToursSection from '@/components/Landing Page/ToursSection'
import DestinationsSection from '@/components/Landing Page/Destinations'
import CTA from '@/components/Landing Page/CTA'
import Footer from '@/components/Landing Page/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ToursSection />
      <DestinationsSection />
      <CTA />
      <Footer />
    </>
  )
}
