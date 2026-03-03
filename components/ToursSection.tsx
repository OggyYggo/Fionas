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
    <section id="tours" className="tours-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="section-header text-center mb-12 reveal">
          <span className="subtitle text-accent-green font-bold text-sm tracking-wider">CURATED EXPERIENCES</span>
          <h2 className="text-gray-800 text-[2.5rem] font-black my-2">Popular Tour Packages</h2>
          <p className="text-gray-600 text-lg max-w-[600px] mx-auto">Handpicked adventures designed to showcase best of Bohol's natural wonders and cultural heritage</p>
          <div className="flex justify-center mt-5">
            <button className="view-all-btn flex items-center gap-2 border-none text-gray-900 rounded-lg text-lg font-medium bg-transparent cursor-pointer no-underline transition-colors duration-300 hover:text-accent-green">
              View All <i className="fa-solid fa-circle-chevron-right btn-icon text-base"></i>
            </button>
          </div>
        </div>

        <div className="tour-grid grid grid-cols-3 gap-8 justify-center">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 reveal">
              <div className="card-image relative h-[310px]">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                {tour.featured && <span className="badge-featured absolute top-4 left-4 bg-warning text-white py-1 px-3 rounded-md text-xs font-bold">⭐ Featured</span>}
                <span className="tag absolute bottom-4 left-4 bg-white py-1 px-3 rounded-2xl text-xs text-gray-800">{tour.tag}</span>
              </div>
              <div className="card-content p-6">
                <h3 className="text-gray-800 text-[1.4rem] mb-2 transition-colors duration-300">{tour.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{tour.description}</p>
                <div className="tour-meta flex gap-4 text-xs text-gray-500 mb-6">
                  <span><i className="far fa-clock mr-1"></i> {tour.duration}</span>
                  <span><i className="fas fa-users mr-1"></i> {tour.maxPeople}</span>
                </div>
                <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
                  <div className="price-box flex flex-col items-start gap-1">
                    <span className="from-text block text-xs text-gray-500">For as Low as</span>
                    <span className="price-amount text-accent-green text-[1.8rem] font-semibold leading-none">{tour.price}</span>
                  </div>
                  <a href="#" className="btn-details w-[145px] h-12 bg-gray-900 text-white no-underline rounded-lg flex items-center justify-center font-bold p-4 gap-11 transition-all duration-300 hover:bg-gray-900">View <i className="fa-solid fa-circle-chevron-right btn-icon ml-3 text-base align-middle"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
