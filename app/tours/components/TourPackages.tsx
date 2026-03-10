'use client'

import React, { useEffect, useState } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'
import Image from 'next/image'
import { TourGridSkeleton } from '@/components/ui/tour-card-skeleton'
import { CardSpinner } from '@/components/ui/spinner'
import { Tour } from '@/types/tour'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'

interface ToursResponse {
  tours: Tour[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const DESCRIPTION_LIMIT = 120

function truncateText(text: string, limit: number) {
  if (!text) return ''
  if (text.length <= limit) return text
  return text.slice(0, limit).trimEnd() + '...'
}

export default function TourPackages({ searchTerm, selectedCategory }: { 
  searchTerm: string
  selectedCategory: string 
}) {
  const [isClient, setIsClient] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const toursPerPage = 9

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      toursAnimations()
    }
  }, [isClient])

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        
        // Build query parameters for server-side filtering and pagination
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: toursPerPage.toString()
        })
        
        if (searchTerm) {
          params.append('search', searchTerm)
        }
        
        if (selectedCategory && selectedCategory !== 'All Categories') {
          params.append('category', selectedCategory.replace(' Tours', ''))
        }
        
        const response = await fetch(`/api/tours?${params.toString()}`, { cache: 'no-store' })
        
        if (!response.ok) {
          throw new Error('Failed to fetch tours')
        }
        
        const data: ToursResponse = await response.json()
        
        setTours(data.tours)
        setTotalCount(data.totalCount)
        setTotalPages(data.totalPages)
        
      } catch (error) {
        console.error('Error fetching tours:', error)
        // Try fallback on error
        try {
          const { tours: fallbackTours } = await import('@/app/tours/data/tours')
          
          // Map fallback data to ensure gallery_urls consistency
          const mappedFallbackTours = fallbackTours.map(tour => ({
            ...tour,
            gallery_urls: tour.images || []
          }))
          
          // Client-side filtering for fallback
          const filtered = mappedFallbackTours.filter((tour) => {
            const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 tour.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'All Categories' || 
                                    tour.tag === selectedCategory.replace(' Tours', '')
            return matchesSearch && matchesCategory
          })
          
          const startIndex = (currentPage - 1) * toursPerPage
          const endIndex = startIndex + toursPerPage
          const paginatedTours = filtered.slice(startIndex, endIndex)
          
          setTours(paginatedTours)
          setTotalCount(filtered.length)
          setTotalPages(Math.ceil(filtered.length / toursPerPage))
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setTours([])
          setTotalCount(0)
          setTotalPages(0)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [currentPage, searchTerm, selectedCategory])

  if (loading) {
    return (
      <>
        <div className="h-20"></div>
        <section className="tours-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
          <div className="container max-w-[1440px] mx-auto px-5">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-sm text-blue-700 shadow-sm">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <span className="font-medium">Discovering amazing tours...</span>
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
      
      <section className="tours-section py-20 pt-20 pb-11 bg-white flex items-center justify-center font-primary">
        <div className="container max-w-[1440px] mx-auto px-5">
          
          <div className="tour-grid grid grid-cols-3 gap-8 justify-center">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <div key={tour.id} className="tour-card w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 reveal">
                  <div className="card-image relative h-[310px]">
                    {/* Main image or gallery */}
                    {tour.gallery_urls && tour.gallery_urls.length > 0 ? (
                      <div className="relative w-full h-full">
                        {/* Main image */}
                        <Image 
                          src={tour.image} 
                          alt={tour.title} 
                          fill
                          className="object-cover" 
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Gallery thumbnails overlay */}
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {tour.gallery_urls.slice(0, 3).map((url, index) => (
                            <div key={index} className="relative w-12 h-12 rounded-md overflow-hidden border-2 border-white shadow-md">
                              <Image 
                                src={url} 
                                alt={`${tour.title} gallery ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ))}
                          {tour.gallery_urls.length > 3 && (
                            <div className="w-12 h-12 rounded-md overflow-hidden border-2 border-white shadow-md bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+{tour.gallery_urls.length - 3}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Gallery indicator */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white py-1 px-2 rounded-full text-xs font-medium z-10">
                          <i className="fas fa-images mr-1"></i>
                          {tour.gallery_urls.length + 1} photos
                        </div>
                      </div>
                    ) : (
                      <Image 
                        src={tour.image} 
                        alt={tour.title} 
                        fill
                        className="object-cover" 
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    
                    {tour.featured && <span className="badge-featured absolute top-4 left-4 bg-warning text-white py-1 px-3 rounded-md text-xs font-bold z-10">⭐ Featured</span>}
                    <span className="tag absolute bottom-4 left-4 bg-white py-1 px-3 rounded-2xl text-xs text-gray-800 z-10">{tour.tag}</span>
                  </div>
                  <div className="card-content p-6">
                    <h3 className="text-gray-800 text-[1.7rem] mb-2 transition-colors duration-300">{tour.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{truncateText(tour.description, DESCRIPTION_LIMIT)}</p>
                    <div className="tour-meta flex gap-4 text-xs text-gray-500 mb-6">
                      {tour.duration ? (
                        <span className="flex items-center gap-1"><i className="far fa-clock w-3 h-3"></i> {tour.duration}</span>
                      ) : null}
                      {tour.maxPeople ? (
                        <span className="flex items-center gap-1"><i className="fas fa-users w-3 h-3"></i> {tour.maxPeople}</span>
                      ) : null}
                    </div>
                    <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
                      <div className="price-box flex flex-col items-start gap-1">
                        <span className="from-text block text-xs text-gray-500">For as Low as</span>
                        <span className="price-amount text-green-600 text-[1.8rem] font-semibold leading-none">{tour.price}</span>
                      </div>
                      <a href={`/tours/${tour.id}`} className="btn-details w-[145px] h-12 bg-gray-900 text-white no-underline rounded-lg flex items-center justify-center font-bold p-4 gap-11 transition-all duration-300 hover:bg-gray-900">View <i className="fa-solid fa-circle-chevron-right btn-icon ml-3 text-base align-middle"></i></a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No tours found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter settings.</p>
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
                          className={isActive ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{tours.length}</span>
              <span className="text-gray-400">of</span>
              <span className="font-medium">{totalCount}</span>
              <span className="text-gray-400">tours</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}