import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const destinationsAnimations = () => {
  // Only run animations on client side
  if (typeof window === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  // Destinations section animations
  gsap.from('.destinations-header', {
    scrollTrigger: {
      trigger: '.destinations-section',
      start: 'top 80%'
    },
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out'
  })

  gsap.from('.featured-card', {
    scrollTrigger: {
      trigger: '.destinations-section',
      start: 'top 70%'
    },
    duration: 1,
    x: -50,
    opacity: 0,
    delay: 0.2,
    ease: 'power3.out'
  })

  // Fix the destination items animation - they should animate TO visible state
  gsap.fromTo('.destination-item', 
    {
      y: 30,
      opacity: 0
    },
    {
      scrollTrigger: {
        trigger: '.destinations-section',
        start: 'top 60%'
      },
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power3.out'
    }
  )
}
