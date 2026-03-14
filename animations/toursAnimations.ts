import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const toursAnimations = () => {
  // Only run animations on client side
  if (typeof window === 'undefined') return () => {}

  try {
    console.log('Tours animations starting...')
    gsap.registerPlugin(ScrollTrigger)
    
    // Wait for DOM to be ready and content to load
    const initAnimations = () => {
      // Check if elements exist before animating
      const sectionHeader = document.querySelector('.section-header')
      const tourCards = document.querySelectorAll('.tour-card')
      
      console.log('Found tours header:', !!sectionHeader)
      console.log('Found tour cards:', tourCards.length)
      
      if (!sectionHeader || tourCards.length === 0) {
        console.warn('Required elements not found, retrying in 100ms...')
        setTimeout(initAnimations, 100)
        return
      }
      
      // Kill any existing animations for this section to prevent duplicates
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === document.querySelector('.tours-section')) {
          trigger.kill()
        }
      })
    
        // Set initial state for animation
      gsap.set(sectionHeader, { opacity: 0, y: 50 })
      if (tourCards.length > 0) {
        gsap.set(tourCards, { opacity: 0, y: 60, scale: 0.9 })
      }
      
      // Fallback: ensure elements are visible after 2 seconds even if animation fails
      setTimeout(() => {
        console.log('Tours fallback timeout triggered')
        gsap.set(sectionHeader, { opacity: 1, y: 0 })
        if (tourCards.length > 0) {
          gsap.set(tourCards, { opacity: 1, y: 0, scale: 1 })
        }
      }, 2000)
      
      // Animate section header
      gsap.to(sectionHeader, {
        scrollTrigger: {
          trigger: '.tours-section',
          start: 'top 80%'
        },
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        onComplete: () => console.log('Tours header animation completed')
      })

      // Animate tour cards with stagger effect
      gsap.to(tourCards, {
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
      })

      // Store event handlers for proper cleanup
      const mouseEnterHandlers: Array<EventListener> = []
      const mouseLeaveHandlers: Array<EventListener> = []
      
      // Add hover effects for tour cards
      tourCards.forEach(card => {
        const handleMouseEnter = (e: Event) => {
          gsap.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            ease: 'power2.out'
          })
        }

        const handleMouseLeave = (e: Event) => {
          gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
          })
        }

        mouseEnterHandlers.push(handleMouseEnter)
        mouseLeaveHandlers.push(handleMouseLeave)
        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)
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
          start: 'top 80%'
        },
        duration: 0.6,
        y: 10,
        opacity: 1,
        delay: 0.3,
        stagger: 0.1,
        ease: 'power2.out'
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

      // Return cleanup function for this specific animation instance
      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === document.querySelector('.tours-section')) {
            trigger.kill()
          }
        })
        tourCards.forEach((card, index) => {
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
    console.warn('GSAP animations failed to load:', error)
    return () => {}
  }
}
