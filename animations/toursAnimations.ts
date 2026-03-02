import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const toursAnimations = () => {
  // Only run animations on client side
  if (typeof window === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)
  // Animate section header
  gsap.from('.section-header', {
    scrollTrigger: {
      trigger: '.tours-section',
      start: 'top 80%'
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })

  // Animate tour cards with stagger effect
  gsap.fromTo('.tour-card',
    {
      y: 60,
      opacity: 0,
      scale: 0.9
    },
    {
      scrollTrigger: {
        trigger: '.tours-section',
        start: 'top 70%'
      },
      duration: 0.8,
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    }
  )

  // Add hover effects for tour cards
  const tourCards = document.querySelectorAll('.tour-card')
  tourCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        duration: 0.3,
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.3,
        y: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ease: 'power2.out'
      })
    })
  })

  // Animate badge and tag appearances
  gsap.from('.badge-featured', {
    scrollTrigger: {
      trigger: '.tours-section',
      start: 'top 60%'
    },
    duration: 0.6,
    scale: 0,
    opacity: 0,
    delay: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })

  gsap.from('.tag', {
    scrollTrigger: {
      trigger: '.tours-section',
      start: 'top 60%'
    },
    duration: 0.6,
    x: -20,
    opacity: 0,
    delay: 1,
    stagger: 0.1,
    ease: 'power2.out'
  })

  // Animate price boxes and buttons
  gsap.from('.price-box', {
    scrollTrigger: {
      trigger: '.tours-section',
      start: 'top 50%'
    },
    duration: 0.8,
    y: 20,
    opacity: 0,
    delay: 1.2,
    stagger: 0.15,
    ease: 'power3.out'
  })

  gsap.fromTo('.btn-details',
    {
      x: 20,
      opacity: 0
    },
    {
      scrollTrigger: {
        trigger: '.tours-section',
        start: 'top 50%'
      },
      duration: 0.8,
      x: 0,
      opacity: 1,
      delay: 1.4,
      stagger: 0.15,
      ease: 'power3.out'
    }
  )

  // Cleanup function
  return () => {
    tourCards.forEach(card => {
      card.removeEventListener('mouseenter', () => {})
      card.removeEventListener('mouseleave', () => {})
    })
  }
}
