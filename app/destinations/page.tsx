'use client'

import { useState } from 'react'
import Header from '@/components/Landing Page/Header'
import DestinationsHero from './components/DestinationsHero'
import DestinationsGrid from './components/DestinationsGrid'
import Footer from '@/components/Landing Page/Footer'

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  return (
    <>
      <Header />

      <DestinationsHero
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

      <main className="min-h-screen bg-white">
        <DestinationsGrid
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>

      <Footer />
    </>
  )
}
