'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Tour } from '@/types/tour'

interface ToursResponse {
  tours: Tour[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface UseToursOptions {
  page: number
  limit: number
  search?: string
  category?: string
}

const fetchTours = async ({ page, limit, search, category }: UseToursOptions): Promise<ToursResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  
  if (search) {
    params.append('search', search)
  }
  
  if (category && category !== 'All Categories') {
    params.append('category', category.replace(' Tours', ''))
  }
  
  const response = await fetch(`/api/tours?${params.toString()}`, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch tours')
  }
  
  return response.json()
}

export const useTours = ({ page, limit, search, category }: UseToursOptions) => {
  const queryClient = useQueryClient()
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Debounced search to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '')
    }, 300)
    
    return () => clearTimeout(timer)
  }, [search])
  
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tours', page, limit, debouncedSearch, category],
    queryFn: () => fetchTours({ page, limit, search: debouncedSearch, category }),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
  
  // Prefetch next page
  const prefetchNextPage = async () => {
    if (data && page < data.totalPages) {
      await queryClient.prefetchQuery({
        queryKey: ['tours', page + 1, limit, debouncedSearch, category],
        queryFn: () => fetchTours({ page: page + 1, limit, search: debouncedSearch, category }),
        staleTime: 60 * 1000,
      })
    }
  }
  
  // Prefetch previous page
  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['tours', page - 1, limit, debouncedSearch, category],
        queryFn: () => fetchTours({ page: page - 1, limit, search: debouncedSearch, category }),
        staleTime: 60 * 1000,
      })
    }
  }
  
  return {
    tours: data?.tours || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
    prefetchNextPage,
    prefetchPreviousPage,
  }
}
