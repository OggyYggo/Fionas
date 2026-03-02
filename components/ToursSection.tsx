'use client'

import { useEffect, useState } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'

export default function ToursSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const cleanup = toursAnimations()
      return cleanup
    }
  }, [isClient])

  const tours = [
    {
      id: 1,
      title: 'Panglao Island Hopping',
      description: 'Explore Balicasag Island, snorkel with sea turtles, and visit the stunning Virgin Island sandbar.',
      image: 'https://i.pinimg.com/1200x/ca/ab/91/caab91c6b26d164d8200815391de75c3.jpg',
      duration: 'Full Day',
      maxPeople: 'Max 10',
      price: '₱3,500',
      tag: 'Island Hopping',
      featured: true
    },
    {
      id: 2,
      title: 'Dolphin & Whale Watching',
      description: 'Early morning dolphin watching cruise with Pamilacan Island snorkeling adventure.',
      image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?q=80&w=384&h=310&fit=crop',
      duration: 'Half Day',
      maxPeople: 'Max 8',
      price: '₱3,000',
      tag: 'Adventure',
      featured: true
    },
    {
      id: 3,
      title: 'Philippine Tarsier Sanctuary',
      description: 'Get up close with the world\'s smallest primate in their natural rainforest habitat.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=384&h=310&fit=crop',
      duration: 'Half Day',
      maxPeople: 'Max 12',
      price: '₱2,500',
      tag: 'Wildlife',
      featured: true
    }
  ]

  return (
    <section id="tours" className="tours-section">
      <div className="container">
        <div className="section-header reveal">
          <span className="subtitle">CURATED EXPERIENCES</span>
          <h2>Popular Tour Packages</h2>
          <p>Handpicked adventures designed to showcase the best of Bohol's natural wonders and cultural heritage</p>
          <button className="view-all-btn">
            View All <i className="fa-solid fa-circle-chevron-right btn-icon"></i>
          </button>
        </div>

        <div className="tour-grid">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card reveal">
              <div className="card-image">
                <img src={tour.image} alt={tour.title} />
                {tour.featured && <span className="badge-featured">⭐ Featured</span>}
                <span className="tag">{tour.tag}</span>
              </div>
              <div className="card-content">
                <h3>{tour.title}</h3>
                <p>{tour.description}</p>
                <div className="tour-meta">
                  <span><i className="far fa-clock"></i> {tour.duration}</span>
                  <span><i className="fas fa-users"></i> {tour.maxPeople}</span>
                </div>
                <div className="card-footer">
                  <div className="price-box">
                    <span className="from-text">For as Low as</span>
                    <span className="price-amount">{tour.price}</span>
                  </div>
                  <a href="#" className="btn-details">View <i className="fa-solid fa-circle-chevron-right btn-icon"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
