import Header from '@/components/Landing Page/Header'
import Hero from '@/components/Landing Page/Hero'
import ToursSection from '@/components/Landing Page/ToursSection'
import DestinationsSection from '@/components/Landing Page/Destinations'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

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
