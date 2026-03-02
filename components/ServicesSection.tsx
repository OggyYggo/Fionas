'use client'

import { useEffect, useState } from 'react'

export default function ServicesSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const services = [
    {
      id: 1,
      icon: 'fas fa-route',
      title: 'Custom Tours',
      description: 'Personalized travel experiences tailored to your preferences and interests',
      features: ['Personalized Itineraries', 'Local Guides', 'Flexible Scheduling']
    },
    {
      id: 2,
      icon: 'fas fa-hotel',
      title: 'Accommodation',
      description: 'Handpicked hotels and resorts that offer comfort and authentic experiences',
      features: ['Premium Hotels', 'Budget Options', 'Local Stays']
    },
    {
      id: 3,
      icon: 'fas fa-plane',
      title: 'Transportation',
      description: 'Seamless travel arrangements with reliable transportation options',
      features: ['Airport Transfers', 'Private Vehicles', 'Public Transport']
    },
    {
      id: 4,
      icon: 'fas fa-users',
      title: 'Group Travel',
      description: 'Organized group tours with like-minded travelers and expert guides',
      features: ['Small Groups', 'Large Groups', 'Corporate Tours']
    },
    {
      id: 5,
      icon: 'fas fa-camera',
      title: 'Photography Tours',
      description: 'Specialized tours for photography enthusiasts with stunning locations',
      features: ['Professional Guides', 'Best Locations', 'Workshops']
    },
    {
      id: 6,
      icon: 'fas fa-utensils',
      title: 'Culinary Experiences',
      description: 'Food tours and cooking classes to explore local cuisine and culture',
      features: ['Food Tours', 'Cooking Classes', 'Local Markets']
    }
  ]

  return (
    <section className="services-section">
      <div className="container">
        <div className="services-header">
          <span className="services-label">🎯 Our Services</span>
          <h2>What We Offer</h2>
          <p>
            Discover our comprehensive range of travel services designed to make your journey 
            unforgettable. From custom tours to culinary experiences, we've got you covered.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h3>Need a Custom Service?</h3>
          <p>We can create personalized travel experiences based on your unique requirements</p>
          <button className="cta-button">
            Get Custom Quote <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
