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
            <img src="/Logo.png" alt="Fiona Travel & Tours Logo" />
            <div className="logo-text">
              <span className="brand-name">Fiona Travel & Tours</span>
              <span className="tagline">Your Bohol Adventure Partner</span>
            </div>
          </div>

          <ul className="nav-links">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#tours">Tours</a></li>
            <li><a href="#custom-tour">Custom</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <div className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <a href="#booking" className="btn-book">Book Now</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
