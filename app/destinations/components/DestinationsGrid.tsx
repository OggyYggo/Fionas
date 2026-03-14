'use client'

import React, { useEffect, useState } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'
import Image from 'next/image'
import { TourGridSkeleton } from '@/components/ui/tour-card-skeleton'
import { Tour } from '@/types/tour'
import { DestinationsService, PaginatedDestinationsResponse } from '@/lib/destinationsService'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'

const DESCRIPTION_LIMIT = 120

function truncateText(text: string, limit: number) {
  if (!text) return ''
  if (text.length <= limit) return text
  return text.slice(0, limit).trimEnd() + '...'
}

export default function DestinationsGrid({ searchTerm, selectedCategory }: { 
  searchTerm: string
  selectedCategory: string 
}) {
  const [isClient, setIsClient] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const destinationsPerPage = 9

  const [destinationsResponse, setDestinationsResponse] = useState<PaginatedDestinationsResponse>({
    destinations: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDestinations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await DestinationsService.getDestinationsPaginated(
        currentPage,
        destinationsPerPage,
        searchTerm,
        selectedCategory
      )
      
      setDestinationsResponse(response)
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load destinations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [currentPage, searchTerm, selectedCategory])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Create animations similar to toursAnimations for destinations
      destinationsAnimations()
    }
  }, [isClient])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const { destinations, totalCount, totalPages } = destinationsResponse

  if (error) {
    return (
      <>
        <div className="h-20"></div>
        <section className="destinations-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
          <div className="container max-w-[1440px] mx-auto px-5">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full text-sm text-red-700 shadow-sm">
                <i className="fas fa-exclamation-triangle"></i>
                <span className="font-medium">Failed to load destinations</span>
              </div>
              <button
                onClick={fetchDestinations}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <div className="h-20"></div>
        <section className="destinations-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
          <div className="container max-w-[1440px] mx-auto px-5">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-sm text-blue-700 shadow-sm">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <span className="font-medium">Discovering amazing destinations...</span>
              </div>
            </div>
            <TourGridSkeleton />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="h-20"></div>
      
      <section className="destinations-section py-8 bg-white">
        <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="destination-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <div key={destination.id} className="destination-card group cursor-pointer">
                  <a href={`/destinations/${destination.id}`} className="block no-underline hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300">
                    <div className="relative">
                      {/* Image Container */}
                      <div className="aspect-square w-full overflow-hidden">
                        <Image 
                          src={destination.image} 
                          alt={destination.title} 
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105" 
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                        />
                      </div>
                      
                      {/* Heart/Favorite Button */}
                      <button 
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-sm hover:shadow-md"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Add to favorites logic here
                          console.log('Add to favorites:', destination.title)
                        }}
                      >
                        <svg className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Featured Badge */}
                      {destination.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 bg-white">
                      {/* Location and Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium truncate">
                            {destination.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium">4.8</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-gray-900 font-semibold text-base mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                        {destination.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-500 text-sm line-clamp-2 leading-normal mb-2">
                        {truncateText(destination.description, 60)}
                      </p>
                      
                      {/* Duration/People Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {destination.duration && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {destination.duration}
                          </span>
                        )}
                        {destination.maxPeople && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {destination.maxPeople}
                          </span>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-gray-900 font-bold text-lg">{destination.price}</span>
                          <span className="text-gray-500 text-sm"> / person</span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium underline group-hover:text-blue-700 transition-colors duration-200">View details</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter settings</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      href="#"
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = currentPage === page
                    const isNearActive = Math.abs(page - currentPage) <= 2
                    const showPage = isNearActive || page === 1 || page === totalPages
                    const shouldShowEllipsisBefore = page === 1 && currentPage > 4
                    const shouldShowEllipsisAfter = page === totalPages && currentPage < totalPages - 3
                    
                    if (!showPage && !shouldShowEllipsisBefore && !shouldShowEllipsisAfter) return null
                    
                    if (shouldShowEllipsisBefore) {
                      return (
                        <React.Fragment key="ellipsis-start">
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        </React.Fragment>
                      )
                    }
                    
                    if (shouldShowEllipsisAfter) {
                      return (
                        <React.Fragment key="ellipsis-end">
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        </React.Fragment>
                      )
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#"
                          onClick={() => setCurrentPage(page)}
                          isActive={isActive}
                          className={isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          {/* Results count */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
              <span className="font-medium">{destinations.length}</span>
              <span className="text-gray-400">of</span>
              <span className="font-medium">{totalCount}</span>
              <span className="text-gray-400">destinations</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
