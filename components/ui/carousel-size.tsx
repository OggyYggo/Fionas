"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSize({ images, tourTitle }: { images: string[], tourTitle: string }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="p-0">
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative" onClick={() => window.open(image, '_blank')}>
                    <img
                      src={image}
                      alt={`${tourTitle} - Photo ${index + 1}`}
                      className="w-full h-[400px] object-contain bg-gray-50"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                        <i className="fas fa-expand mr-2"></i>
                        View Full Size
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
