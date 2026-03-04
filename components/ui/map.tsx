'use client'

import React from 'react'

interface MapProps {
  location?: string
  height?: string
  className?: string
}

export default function Map({ location = "Bohol, Philippines", height = "400px", className = "" }: MapProps) {
  // For demonstration, using OpenStreetMap iframe
  // In production, you might want to use Google Maps API or other mapping service
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=123.8%2C9.5%2C124.2%2C9.9&layer=mapnik&marker=9.7%2C124.0`

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${location}`}
      />
    </div>
  )
}
