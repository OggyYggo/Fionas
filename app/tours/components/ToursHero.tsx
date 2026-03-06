'use client'

import { useEffect, useState, useCallback } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

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
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search to reduce API calls
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setIsSearching(false)
      onSearch(value)
    }, 300),
    [onSearch]
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onCategoryChange(value)
  }

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="tour-search"
              name="tour-search"
              type="text"
              placeholder="Search tours..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 !h-[48px] bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border-0"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="relative lg:w-64">
            <label htmlFor="tour-category" className="sr-only">
              Select Tour Category
            </label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="pl-10 pr-8 !h-[48px] bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white opacity-100">
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Adventure Tours">Adventure Tours</SelectItem>
                <SelectItem value="Cultural Tours">Cultural Tours</SelectItem>
                <SelectItem value="Nature Tours">Nature Tours</SelectItem>
                <SelectItem value="Beach Tours">Beach Tours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick filter tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['Popular', 'Adventure', 'Family-friendly', 'Day Trip', 'Luxury'].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              onClick={() => handleSearchChange(tag)}
              className="!h-[48px] bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white px-4"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}