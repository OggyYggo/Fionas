'use client'

import { useEffect, useState } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'

export default function TestimonialsSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      destinationsAnimations()
    }
  }, [isClient])

  const testimonials = [
    {
      id: 1,
      name: 'William Ashford',
      title: 'Product Manager',
      company: 'Google',
      image: 'https://i.pravatar.cc/150?img=1',
      content: 'The analytics tools have transformed how we approach financial planning and forecasting. We now make data-driven decisions.'
    },
    {
      id: 2,
      name: 'Laila Smith',
      title: 'Account Executive',
      company: 'Notion',
      image: 'https://i.pravatar.cc/150?img=2',
      content: 'The customer support has been outstanding. Whenever we have questions, their team is quick to respond and helpful.'
    },
    {
      id: 3,
      name: 'Samuel Kingsley',
      title: 'Financial Analyst',
      company: 'In Capital',
      image: 'https://i.pravatar.cc/150?img=3',
      content: 'The security features offered give us peace of mind knowing that our customer data is protected at all times.'
    },
    {
      id: 4,
      name: 'Henry Stewart',
      title: 'Co-Founder',
      company: 'NextGen',
      image: 'https://i.pravatar.cc/150?img=4',
      content: 'The integration process was seamless, and we were up and running in no time. Highly recommend this service!'
    }
  ]

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const [currentPage, setCurrentPage] = useState(0)
  const testimonialsPerPage = 4
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage
    return testimonials.slice(start, start + testimonialsPerPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section className="testimonials-section py-[90px] bg-white relative">
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="testimonials-header text-center mb-20 max-w-[800px] mx-auto">
          <span className="subtitle inline-block text-accent-green py-2.5">TRAVELER STORIES</span>
          <h2 className="text-gray-800 text-[40px] font-black mb-3 leading-tight">What Our Clients Are Saying</h2>
          <p className="text-gray-600 text-[18px] leading-[1.7]">Don't just take our word for it hear from travelers who've experienced the magic of Bohol with us</p>
          <div className="rating-info">
          </div>
        </div>
        
        <div className="testimonials-grid grid grid-cols-4 gap-6 mb-20">
          {getCurrentTestimonials().map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transition-all duration-400 opacity-0 translate-y-8 animate-fade-in-up hover:-translate-y-2.5 hover:shadow-xl hover:border-accent-teal h-full flex flex-col">
              <div className="testimonial-content mb-6 flex-grow">
                <p className="testimonial-text text-gray-700 text-[1.1rem] leading-relaxed mb-6 italic relative">"{truncateText(testimonial.content, 100)}"</p>
              </div>
              <div className="testimonial-author flex items-center gap-4 mt-auto">
                <div className="author-avatar w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="author-info self-center">
                  <h4 className="text-gray-800 text-base font-bold mb-1 m-0">{testimonial.name}</h4>
                  <p className="text-accent-green text-sm font-medium m-0">{testimonial.title}, <span>{testimonial.company}</span></p>
                  <div className="social-icon">
                    <i className="fa-brands fa-twitter"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-footer text-center">
          <button className="see-all-reviews-btn inline-flex items-center gap-2 bg-accent-teal text-white py-3 px-8 rounded-full border-none text-base font-bold cursor-pointer transition-all duration-300 hover:bg-accent-green hover:-translate-y-0.5 hover:shadow-lg">
            See All Reviews <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
