'use client'

import { useEffect, useState, useCallback } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, MapPin } from 'lucide-react'

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

interface DestinationsHeroProps {
  onSearch: (searchTerm: string) => void
  onCategoryChange: (category: string) => void
}

export default function DestinationsHero({
  onSearch,
  onCategoryChange,
}: DestinationsHeroProps) {
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
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      destinationsAnimations()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory]) // Re-run when filters change to ensure animation

  return (
    <section className="relative bg-gradient-to-br from-teal-600 to-blue-700 py-12">
      <div className="container max-w-6xl mx-auto px-5">
        <h1 className="font-primary text-[64px] font-black mb-5 leading-tight tracking-[-1.5px] text-white text-center destinations-header">
          Explore Bohol's Top Destinations
        </h1>

        <p className="font-primary text-xl font-normal leading-relaxed mb-10 text-gray-200 text-center max-w-3xl mx-auto">
          Explore Bohol’s top tourist attractions and hidden island gems.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 max-w-4xl mx-auto items-center justify-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor="destination-search" className="sr-only">
              Search Destinations
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="destination-search"
              name="destination-search"
              type="text"
              placeholder="Search destinations..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 !h-[48px] bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 border-0"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-2 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="relative lg:w-64">
            <label htmlFor="destination-category" className="sr-only">
              Select Destination Category
            </label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="pl-10 pr-8 !h-[48px] bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 border-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white opacity-100">
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Island Hopping">Island Hopping</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Wildlife">Wildlife</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Nature">Nature</SelectItem>
                <SelectItem value="Water Sports">Water Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick filter tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['Beach', 'Nature', 'Cultural', 'Adventure', 'Wildlife'].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              onClick={() => handleSearchChange(tag)}
              className="!h-[48px] bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white px-4"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
