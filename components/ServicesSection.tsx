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
    <section className="services-section py-24 bg-gray-50 relative">
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="services-header text-center mb-20 max-w-[700px] mx-auto">
          <span className="services-label inline-block bg-gradient-to-r from-accent-teal to-accent-green text-white py-2.5 px-5 rounded-full text-sm font-bold mb-5 tracking-wider">🎯 Our Services</span>
          <h2 className="text-gray-800 text-[3rem] font-black mb-5 leading-tight">What We Offer</h2>
          <p className="text-gray-600 text-xl leading-[1.7]">
            Discover our comprehensive range of travel services designed to make your journey 
            unforgettable. From custom tours to culinary experiences, we've got you covered.
          </p>
        </div>

        <div className="services-grid grid grid-cols-3 gap-10 mb-20">
          {services.map((service, index) => (
            <div key={service.id} className="service-card bg-white rounded-2xl py-10 px-8 shadow-sm border border-gray-200 transition-all duration-400 opacity-0 translate-y-8 animate-fade-in-up hover:-translate-y-2.5 hover:shadow-xl hover:border-accent-teal" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="service-icon w-[70px] h-[70px] bg-gradient-to-r from-accent-teal to-accent-green rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <i className={service.icon + " text-[1.8rem] text-white"}></i>
              </div>
              <div className="service-content">
                <h3 className="text-gray-800 text-[1.5rem] font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-5">{service.description}</p>
                <ul className="service-features list-none p-0 m-0">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-gray-700 text-sm mb-2 font-medium">
                      <i className="fas fa-check-circle text-accent-green text-sm"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta text-center bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-10 rounded-2xl relative overflow-hidden">
          <div className="services-cta::before absolute top-0 left-0 w-full h-full opacity-30"></div>
          <h3 className="text-[2.2rem] font-extrabold mb-4 relative z-10">Need a Custom Service?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-[500px] mx-auto relative z-10">We can create personalized travel experiences based on your unique requirements</p>
          <button className="cta-button inline-flex items-center gap-7 bg-gradient-to-r from-accent-teal to-accent-green text-white py-1.5 px-9 rounded-full border-none text-xl font-bold cursor-pointer transition-all duration-300 no-underline relative z-10 hover:-translate-y-0.75 hover:shadow-xl">
            Get Custom Quote <i className="fas fa-arrow-right text-base transition-transform duration-300 hover:translate-x-1.5"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
