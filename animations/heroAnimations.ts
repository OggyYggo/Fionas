import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const heroAnimations = () => {
  // Only run animations on client side
  if (typeof window === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)
  // Hero animations
  gsap.from('.hero-content h1', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })

  gsap.from('.hero-content p', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
  })

  gsap.from('.hero-btns', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.6,
    ease: 'power3.out'
  })
}
