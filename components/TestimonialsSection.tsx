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
      content: 'The analytics tools have transformed how we approach financial planning and forecasting. We now make data-driven decisions that positively impact our business.'
    },
    {
      id: 2,
      name: 'Laila Smith',
      title: 'Account Executive',
      company: 'Notion',
      image: 'https://i.pravatar.cc/150?img=2',
      content: 'The customer support has been outstanding. Whenever we have questions or need assistance, their team is quick to respond and incredibly helpful.'
    },
    {
      id: 3,
      name: 'Samuel Kingsley',
      title: 'Financial Analyst',
      company: 'In Capital',
      image: 'https://i.pravatar.cc/150?img=3',
      content: 'The security features offered give us peace of mind knowing that our customer data is protected.'
    },
    {
      id: 4,
      name: 'Henry Stewart',
      title: 'Co-Founder',
      company: 'NextGen',
      image: 'https://i.pravatar.cc/150?img=4',
      content: 'The integration process was seamless, and we were up and running in no time.'
    }
  ]

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
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="subtitle">TRAVELER STORIES</span>
          <h2>What Our Clients Are Saying</h2>
          <p>Don't just take our word for it hear from travelers who've experienced the magic of Bohol with us</p>
          <div className="rating-info">
          </div>
        </div>
        
        <div className="testimonials-grid">
          {getCurrentTestimonials().map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.title}, <span>{testimonial.company}</span></p>
                  <div className="social-icon">
                    <i className="fa-brands fa-twitter"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`dot ${index === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <div className="testimonials-footer">
          <button className="see-all-reviews-btn">
            See All Reviews <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
