"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CarouselContext = React.createContext<{
  orientation?: "horizontal" | "vertical"
  direction?: "ltr" | "rtl"
  opts?: {
    align?: "start" | "center" | "end"
    loop?: boolean
    skipSnaps?: boolean
  }
  currentIndex: number
  setCurrentIndex: (index: number) => void
  itemCount: number
} | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opts?: {
      align?: "start" | "center" | "end"
      loop?: boolean
      skipSnaps?: boolean
    }
    orientation?: "horizontal" | "vertical"
    direction?: "ltr" | "rtl"
  }
>(({ className, opts, orientation = "horizontal", direction = "ltr", children, ...props }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemCount, setItemCount] = React.useState(0)

  React.useEffect(() => {
    // Count items after mount
    const countItems = () => {
      const container = document.getElementById('carousel-container')
      if (container) {
        const items = container.querySelectorAll('[data-carousel-item]')
        setItemCount(items.length)
      }
    }
    
    // Initial count
    countItems()
    
    // Set up observer for dynamic content
    const observer = new MutationObserver(countItems)
    const container = document.getElementById('carousel-container')
    if (container) {
      observer.observe(container, { childList: true, subtree: true })
    }
    
    return () => observer.disconnect()
  }, [])

  const scrollToIndex = (index: number) => {
    const container = document.getElementById('carousel-container')
    if (container) {
      const items = container.querySelectorAll('[data-carousel-item]')
      if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'center' })
        setCurrentIndex(index)
      }
    }
  }

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : itemCount - 1
    scrollToIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : 0
    scrollToIndex(newIndex)
  }

  return (
    <CarouselContext.Provider value={{ orientation, direction, opts, currentIndex, setCurrentIndex, itemCount }}>
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div id="carousel-container" className="overflow-x-auto scroll-smooth">
          {children}
        </div>
        <CarouselPrevious onClick={handlePrevious} />
        <CarouselNext onClick={handleNext} />
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    basis?: string
  }
>(({ className, basis = "flex-1 0 0%", ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      data-carousel-item
      className={cn(
        "flex-shrink-0 snap-start",
        orientation === "horizontal" ? "px-2" : "py-2",
        className
      )}
      style={{ flexBasis: basis }}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void
  }
>(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg border border-gray-200 p-3 text-gray-800 hover:bg-gray-50 hover:shadow-xl transition-all z-20",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void
  }
>(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg border border-gray-200 p-3 text-gray-800 hover:bg-gray-50 hover:shadow-xl transition-all z-20",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-5 w-5" />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}
