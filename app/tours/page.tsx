'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ToursHero from './components/ToursHero'
import TourPackages from './components/TourPackages'
import Footer from '@/components/Footer'

export default function Tours() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  return (
    <>
      <Header />

      <ToursHero
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

      <main className="min-h-screen bg-white">
        <TourPackages
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>

      <Footer />
    </>
  )
}