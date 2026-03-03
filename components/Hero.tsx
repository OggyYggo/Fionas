'use client'

import { useEffect, useState } from 'react'
import { heroAnimations } from '@/animations/heroAnimations'

export default function Hero() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      heroAnimations()
    }
  }, [isClient])

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="font-primary text-[72px] font-black mb-5 leading-tight tracking-[-1.5px]">
          Your <span className="text-accent-light">Bohol Adventure</span> Starts Here
        </h1>
        <p className="font-primary text-xl font-normal leading-relaxed mb-10 text-gray-300">
          Experience pristine beaches, iconic Chocolate Hills, and unforgettable adventures in the heart of the Visayas. Your dream Philippine getaway starts here.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a href="#explore" className="btn-explore">Explore</a>
          <a href="#destinations" className="btn-outline">Destinations</a>
        </div>
      </div>
    </section>
  )
}
