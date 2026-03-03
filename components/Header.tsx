'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img src="/Logo.png" alt="Fiona Travel & Tours Logo" className="h-20 w-auto object-contain" />
            <div className="logo-text">
              <span className="brand-name font-bold text-gray-800 text-base">Fiona Travel & Tours</span>
              <span className="tagline text-xs text-gray-500">Your Bohol Adventure Partner</span>
            </div>
          </div>

          <ul className="nav-links list-none flex gap-10">
            <li><a href="#home" className="active no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">Home</a></li>
            <li><a href="#tours" className="no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">Tours</a></li>
            <li><a href="#custom-tour" className="no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">Custom</a></li>
            <li><a href="#destinations" className="no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">Destinations</a></li>
            <li><a href="#about" className="no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">About</a></li>
            <li><a href="#contact" className="no-underline text-gray-500 font-medium transition-colors duration-300 hover:text-accent-teal">Contact</a></li>
          </ul>

          <div className="nav-actions flex items-center gap-5">
            <div className="cart-icon bg-accent-green text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <a href="#booking" className="btn-book bg-accent-teal text-white py-3 px-6 rounded-sm no-underline font-semibold transition-colors duration-300 hover:bg-accent-teal-dark">Book Now</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
