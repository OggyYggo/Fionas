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
        <h1>Your <span className="accent-text">Bohol Adventure</span> Starts Here</h1>
        <p>Experience pristine beaches, iconic Chocolate Hills, and unforgettable adventures in the heart of the Visayas. Your dream Philippine getaway starts here.</p>
        <div className="hero-btns">
          <a href="#explore" className="btn-explore">Explore</a>
          <a href="#destinations" className="btn-outline">Destinations</a>
        </div>
      </div>
    </section>
  )
}
