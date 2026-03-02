'use client'

import { useEffect, useState } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'
import PhotoGallery from './PhotoGallery'
import TestimonialsSection from './TestimonialsSection'

export default function DestinationsSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // destinationsAnimations() // Temporarily disabled
    }
  }, [isClient])
  const destinations = [
    {
      number: '02',
      image: 'https://i.pinimg.com/1200x/d8/e5/31/d8e531299e463d7185cf4e1071fecafb.jpg',
      title: 'Tarsier Sanctuary'
    },
    {
      number: '03',
      image: 'https://i.pinimg.com/1200x/01/cc/b8/01ccb885b9140da317faf9fcb2a11d3c.jpg',
      title: 'Loboc River Cruise'
    },
    {
      number: '04',
      image: 'https://i.pinimg.com/1200x/2d/68/97/2d689751ecf948ec79f62faf0a1c95c5.jpg',
      title: 'Man Made Forest'
    },
    {
      number: '05',
      image: 'https://i.pinimg.com/1200x/ca/ab/91/caab91c6b26d164d8200815391de75c3.jpg',
      title: 'Panglao Island'
    }
  ]

  return (
    <>
      <section id="destinations" className="destinations-section">
        <div className="container">
          <div className="destinations-header">
            <div className="destinations-content">
              <span className="subtitle">MUST VISIT PLACES</span>
              <h2>Iconic Destinations</h2>
              <p>Explore Bohol's most breathtaking attractions that have captivated travelers from around the world.</p>
              <button className="view-all-btn">
                View All <i className="fa-solid fa-circle-chevron-right btn-icon"></i>
              </button>
            </div>
          </div>

          <div className="destinations-layout">
            {/* Featured Large Left Image */}
            <div className="featured-card">
              <img src="https://i.pinimg.com/736x/3f/8f/fa/3f8ffaded6ac0f091eebbe77b07c4903.jpg" alt="Chocolate Hills" />
              <div className="featured-overlay">
                <span className="location"><i className="fas fa-map-marker-alt"></i> Carmen, Bohol</span>
                <h3>Chocolate Hills</h3>
                <p>The Chocolate Hills are Bohol's most famous landmark. Over 1,268 perfectly cone-shaped hills spread across 50 square kilometers.</p>
              </div>
            </div>

            {/* Right Side 2x2 Grid */}
            <div className="destinations-grid">
              {destinations.map((dest, index) => (
                <div key={index} className="destination-item">
                  <img src={dest.image} alt={dest.title} />
                  <span className="dest-number">{dest.number}</span>
                  <div className="destination-overlay">
                    <h4>{dest.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <PhotoGallery />
    </>
  )
}
