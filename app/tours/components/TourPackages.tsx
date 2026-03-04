'use client'

import { useEffect, useState } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'

export default function TourPackages({ searchTerm, selectedCategory }: { 
  searchTerm: string
  selectedCategory: string 
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      toursAnimations()
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

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || 
                            tour.tag === selectedCategory.replace(' Tours', '')
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* 80px gap after hero section */}
      <div className="h-20"></div>
      
      <section className="tours-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
        <div className="container max-w-[1440px] mx-auto px-5">
          
          <div className="tour-grid grid grid-cols-3 gap-8 justify-center">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <div key={tour.id} className="tour-card w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 reveal">
                  <div className="card-image relative h-[310px]">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    {tour.featured && <span className="badge-featured absolute top-4 left-4 bg-warning text-white py-1 px-3 rounded-md text-xs font-bold">⭐ Featured</span>}
                    <span className="tag absolute bottom-4 left-4 bg-white py-1 px-3 rounded-2xl text-xs text-gray-800">{tour.tag}</span>
                  </div>
                  <div className="card-content p-6">
                    <h3 className="text-gray-800 text-[1.7rem] mb-2 transition-colors duration-300">{tour.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{tour.description}</p>
                    <div className="tour-meta flex gap-4 text-xs text-gray-500 mb-6">
                      <span className="flex items-center gap-1"><i className="far fa-clock w-3 h-3"></i> {tour.duration}</span>
                      <span className="flex items-center gap-1"><i className="fas fa-users w-3 h-3"></i> {tour.maxPeople}</span>
                    </div>
                      <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
                    <div className="price-box flex flex-col items-start gap-1">
                      <span className="from-text block text-xs text-gray-500">For as Low as</span>
                      <span className="price-amount text-green-600 text-[1.8rem] font-semibold leading-none">{tour.price}</span>
                    </div>
                    <a href="#" className="btn-details w-[145px] h-12 bg-gray-900 text-white no-underline rounded-lg flex items-center justify-center font-bold p-4 gap-11 transition-all duration-300 hover:bg-gray-900">View <i className="fa-solid fa-circle-chevron-right btn-icon ml-3 text-base align-middle"></i></a>
                  </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No tours found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter settings.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}