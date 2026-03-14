'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img src="/New Logo 02.svg" alt="Fiona Travel & Tours Logo" className="h-20 w-auto object-contain" />
            <div className="logo-text">
              <span className="brand-name font-bold text-gray-800 text-base">Fiona Travel & Tours</span>
              <span className="tagline text-xs text-gray-500">Your Bohol Adventure Partner</span>
            </div>
          </div>

          <ul className="nav-links list-none flex gap-10 hidden lg:flex">
            <li><a href="/" className={`${isActive('/') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>Home</a></li>
            <li><a href="/tours" className={`${isActive('/tours') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>Tours</a></li>
            <li><a href="/custom" className={`${isActive('/custom') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>Custom</a></li>
            <li><a href="/destinations" className={`${isActive('/destinations') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>Destinations</a></li>
            <li><a href="/about" className={`${isActive('/about') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>About</a></li>
            <li><a href="/contact" className={`${isActive('/contact') ? 'active font-semibold' : 'font-medium'} no-underline text-gray-500 transition-colors duration-300 hover:text-accent-teal`}>Contact</a></li>
          </ul>

          <div className="nav-actions flex items-center gap-5 hidden lg:flex">
            <div className="cart-icon bg-accent-green text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <a href="#booking" className="btn-book bg-accent-teal text-white py-3 px-6 rounded-sm no-underline font-semibold transition-colors duration-300 hover:bg-accent-teal-dark">Book Now</a>
          </div>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-accent-teal transition-colors duration-300"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}>
          <div className="max-w-[1700px] mx-auto pl-5 pr-5 py-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a 
                  href="/" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/tours" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/tours') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  Tours
                </a>
              </li>
              <li>
                <a 
                  href="/custom" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/custom') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  Custom
                </a>
              </li>
              <li>
                <a 
                  href="/destinations" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/destinations') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  Destinations
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/about') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  onClick={handleLinkClick}
                  className={`block py-2 px-4 rounded-md transition-colors duration-300 ${
                    isActive('/contact') 
                      ? 'bg-accent-teal text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-accent-teal font-medium'
                  }`}
                >
                  Contact
                </a>
              </li>
              <li className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-center">
                  <a 
                    href="#booking" 
                    onClick={handleLinkClick}
                    className="btn-book bg-accent-teal text-white py-3 px-6 rounded-sm no-underline font-semibold transition-colors duration-300 hover:bg-accent-teal-dark text-center w-full max-w-[200px]"
                  >
                    Book Now
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
