import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function TourCardSkeleton() {
  return (
    <div className="tour-card w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Image skeleton */}
      <div className="card-image relative h-[310px]">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="card-content p-6">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-3/4 mb-2 rounded-lg" />
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
        
        {/* Meta skeleton */}
        <div className="tour-meta flex gap-4 text-xs text-gray-500 mb-6">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        
        {/* Footer skeleton */}
        <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
          <div className="price-box flex flex-col items-start gap-1">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-7 w-16 rounded" />
          </div>
          <Skeleton className="w-[145px] h-12 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function TourGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="tour-grid grid grid-cols-3 gap-8 justify-center">
      {Array.from({ length: count }, (_, i) => (
        <TourCardSkeleton key={i} />
      ))}
    </div>
  )
}
