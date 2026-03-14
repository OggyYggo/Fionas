import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const destinationsAnimations = () => {
  // Only run animations on client side
  if (typeof window === 'undefined') return () => {}

  try {
    console.log('Destinations animations starting...')
    gsap.registerPlugin(ScrollTrigger)

    // Wait for DOM to be ready and content to load
    const initAnimations = () => {
      // Check if elements exist before animating
      const destinationsHeader = document.querySelector('.destinations-header')
      const destinationCards = document.querySelectorAll('.featured-card, .destination-item')
      
      console.log('Found header:', !!destinationsHeader)
      console.log('Found cards:', destinationCards.length)
      
      if (!destinationsHeader || destinationCards.length === 0) {
        console.warn('Required elements not found, retrying in 100ms...')
        setTimeout(initAnimations, 100)
        return
      }

      // Kill any existing animations for this section to prevent duplicates
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === document.querySelector('.destinations-section')) {
          trigger.kill()
        }
      })

      // Set initial state for animation
      gsap.set(destinationsHeader, { opacity: 0, y: 30 })
      if (destinationCards.length > 0) {
        gsap.set(destinationCards, { opacity: 0, y: 30, scale: 0.95 })
      }
      
      // Fallback: ensure elements are visible after 2 seconds even if animation fails
      setTimeout(() => {
        console.log('Destinations fallback timeout triggered')
        gsap.set(destinationsHeader, { opacity: 1, y: 0 })
        if (destinationCards.length > 0) {
          gsap.set(destinationCards, { opacity: 1, y: 0, scale: 1 })
        }
      }, 2000)

      // Destinations section animations
      gsap.to(destinationsHeader, {
        scrollTrigger: {
          trigger: '.destinations-section',
          start: 'top 80%'
        },
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        onComplete: () => console.log('Header animation completed')
      })

      // Destination cards animation
      if (destinationCards.length > 0) {
        gsap.to(destinationCards, {
          scrollTrigger: {
            trigger: '.destinations-section',
            start: 'top 75%'
          },
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power2.out',
          onComplete: () => console.log('Cards animation completed')
        })
      }

      // Add hover effects for destination cards
      const mouseEnterHandlers: Array<EventListener> = []
      const mouseLeaveHandlers: Array<EventListener> = []
      
      destinationCards.forEach(card => {
        const handleMouseEnter = (e: Event) => {
          gsap.to(card, {
            duration: 0.3,
            scale: 1.05,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            ease: 'power2.out'
          })
          
          // Animate overlay for destination items
          const overlay = card.querySelector('.destination-overlay')
          if (overlay) {
            gsap.to(overlay, {
              duration: 0.3,
              opacity: 1,
              ease: 'power2.out'
            })
          }
        }

        const handleMouseLeave = (e: Event) => {
          gsap.to(card, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
          })
          
          // Animate overlay for destination items
          const overlay = card.querySelector('.destination-overlay')
          if (overlay) {
            gsap.to(overlay, {
              duration: 0.3,
              opacity: 0,
              ease: 'power2.out'
            })
          }
        }

        mouseEnterHandlers.push(handleMouseEnter)
        mouseLeaveHandlers.push(handleMouseLeave)
        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)
      })

      // Return cleanup function for this specific animation instance
      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === document.querySelector('.destinations-section')) {
            trigger.kill()
          }
        })
        destinationCards.forEach((card, index) => {
          if (mouseEnterHandlers[index]) {
            card.removeEventListener('mouseenter', mouseEnterHandlers[index])
          }
          if (mouseLeaveHandlers[index]) {
            card.removeEventListener('mouseleave', mouseLeaveHandlers[index])
          }
        })
      }
    }

    // Start initialization
    return initAnimations()
  } catch (error) {
    console.warn('GSAP destinations animations failed to load:', error)
    return () => {}
  }
}
