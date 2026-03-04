'use client'

import { useEffect, useState } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'

interface ToursHeroProps {
  onSearch: (searchTerm: string) => void
  onCategoryChange: (category: string) => void
}

export default function ToursHero({
  onSearch,
  onCategoryChange,
}: ToursHeroProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Categories')

  useEffect(() => {
    toursAnimations()
  }, [])

  return (
    <section className="relative min-h-[450px] bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-5 py-20">
        <h1 className="font-primary text-[64px] font-black mb-5 leading-tight tracking-[-1.5px] text-white text-center">
          Discover Our Amazing Tours
        </h1>

        <p className="font-primary text-xl font-normal leading-relaxed mb-10 text-gray-200 text-center max-w-3xl mx-auto">
          Discover handcrafted experiences that showcase the best of Bohol's
          natural wonders, rich culture, and adventure activities.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="tour-search" className="sr-only">
              Search Tours
            </label>

            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"></i>

            <input
              id="tour-search"
              name="tour-search"
              type="text"
              placeholder="Search tours..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                setSearchTerm(value)
                onSearch(value)
              }}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Select */}
          <div className="relative lg:w-64">
            <label htmlFor="tour-category" className="sr-only">
              Select Tour Category
            </label>

            <i className="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"></i>

            <select
              id="tour-category"
              name="tour-category"
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value
                setSelectedCategory(value)
                onCategoryChange(value)
              }}
              className="w-full pl-12 pr-8 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Adventure Tours">Adventure Tours</option>
              <option value="Cultural Tours">Cultural Tours</option>
              <option value="Nature Tours">Nature Tours</option>
              <option value="Beach Tours">Beach Tours</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}