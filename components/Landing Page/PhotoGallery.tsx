'use client'

import { useEffect, useState } from 'react'

interface GalleryItem {
  id: number
  number: string
  title: string
  image: string
}

export default function PhotoGallery() {
  const [isClient, setIsClient] = useState(false)
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({})
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      number: '01',
      title: 'Chocolate Hills',
      image: 'https://scontent.fceb6-1.fna.fbcdn.net/v/t39.30808-6/619208663_1485094393619163_71482542085617517_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFcyjURE7_OZNWTjpeP9XLrZZdVIGqA9_tll1UgaoD3-wBGXk5g214ugF7E_3XZ0Uiy9_puXZsIrlceVvn6pBYI&_nc_ohc=qlwqOlF-WXsQ7kNvwHKO5Nh&_nc_oc=AdnAhxTKtVIkE_l9junULTB64SrGZDdZBDQW3W6gFV91a4gemd2jQxPtHLYgZ8IKykfsCV2qWsy32eLfCa8uL0Yu&_nc_zt=23&_nc_ht=scontent.fceb6-1.fna&_nc_gid=BFqx3SnlNBgh41_bkp6iug&_nc_ss=8&oh=00_Afx2KS8ndC1WV6B22xVg1LDjLixvneOHBycFpnlHCrhSgQ&oe=69AB8C77',
    },
    {
      id: 2,
      number: '02',
      title: 'Man Made Forest',
      image: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/618192783_1485094736952462_4831425341142888431_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFmPRaOt20gsI0_-c6FnLceIpNzg8tBjW0ik3ODy0GNbX8IxrnaJ5E-jL4PoFaXR1x-KVe6l7-7NQybdn7fTfJr&_nc_ohc=-YLE1xInscQQ7kNvwF4NHA_&_nc_oc=AdkNis2_bMMDIU5PbdG2g9_RA_eJ0b0eGEE889wCdSHVzlI25yuLRKJ3nLBuiir1N_KBWYCrvgTxztU7yqYudHIv&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=gSfhGfmSBQUr0fyQ_bbxlg&_nc_ss=8&oh=00_Afwv7o9rM0IbZB4A1DI15Yf23_yjB0k6YACJbtrpOpFPog&oe=69AB7829',
    },
    {
      id: 3,
      number: '03',
      title: 'Busai Falls',
      image: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/618721388_1485065313622071_4759954112346776894_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeEnxNRPeyLe2eqX-yx6-wJi13P5mVwwLSrXc_mZXDAtKo8etG4w6siTiOn_7BBI93JAH7eruq6xEdgbCoLQUC0d&_nc_ohc=iwtgxp_ftBoQ7kNvwHNjr6M&_nc_oc=AdnX1-B-pSqaXEjAyfVHGsU37rDr6rVm8UF_ZKogromchJU8LEw6sgrba09chaHlmSP5KmxHAJBKMLkPXHvTGBVn&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=im9pzdeFDC-Qixty6Jhngg&_nc_ss=8&oh=00_Afx4OlbP4yBhGGj40r7Txuyrk4Ak5jgZtPSJfBCqMYMzOg&oe=69AB6203',
    },
    {
      id: 4,
      number: '04',
      title: 'Tarsier Sanctuary',
      image: 'https://scontent.fceb6-4.fna.fbcdn.net/v/t39.30808-6/596819473_1447704800691456_7754199775834975598_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFQi2rwDLhsUOIncZbGcDtLwIS_xIGbmZnAhL_EgZuZmT3iJ0E_TS5H-yjZFcypyOWLnSlZu20VlmduCdMfrVw0&_nc_ohc=QKeuKNtr7BsQ7kNvwEgyE9s&_nc_oc=AdmiIAnqDvg9uw0HENn2gD92EUm6H0G47UFoHKMWQXIsuOInbfGPGofBxhicqmJaIp0KKfU1V40jCvrSU_5h95JX&_nc_zt=23&_nc_ht=scontent.fceb6-4.fna&_nc_gid=J4CO0SqlVt-KNWucXc4GBQ&_nc_ss=8&oh=00_AfzAtIu64YG9daxYCSRctycP3Pc0PWlh6S5jkJT3K43lQg&oe=69AB5D00',
    },
    {
      id: 5,
      number: '05',
      title: 'Mountain Adventures',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 6,
      number: '06',
      title: 'Cultural Heritage',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 7,
      number: '07',
      title: 'Sunset Views',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 8,
      number: '08',
      title: 'Local Cuisine',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 4 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= galleryItems.length - 4 ? 0 : prev + 1))
  }

  const visibleItems = galleryItems.slice(currentIndex, currentIndex + 4)

  const handleImageLoad = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: false }))
  }

  const handleImageError = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: false }))
    setImageErrors(prev => ({ ...prev, [key]: true }))
  }

  const handleImageStart = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: true }))
  }

  return (
    <section className="photo-gallery-section py-[44px] bg-white text-gray-800 relative overflow-hidden">
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="gallery-header text-center mb-20 max-w-[800px] mx-auto">
          {/* <span className="subtitle text-accent-green font-bold text-sm tracking-wider">BEHIND THE LENS</span> */}
          <h2 className="text-[40px] font-black mb-5 leading-tight text-gray-800">Explore the Beauty of Bohol</h2>
          <p className="text-lg leading-[1.8] text-gray-600 max-w-[700px] mx-auto">
            Stunning moments from tours across Bohol’s top destinations
          </p>
        </div>

        <div className="gallery-wrapper relative flex items-center justify-center">
          <button className="gallery-nav absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-md border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 text-gray-600 text-xl -left-20 hover:bg-accent-teal hover:border-accent-teal hover:text-white hover:scale-110" onClick={handlePrev}>
            <i className="fas fa-chevron-left transition-transform duration-200 hover:scale-125"></i>
          </button>
          
          <div className="gallery-grid grid grid-cols-4 gap-8 mb-16 w-full">
            {visibleItems.map((item) => {
              const imageKey = `gallery-${item.id}`
              return (
                <div key={item.id} className="gallery-item relative h-[400px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-2.5 hover:shadow-2xl">
                  <div className="gallery-image-wrapper relative w-full h-full overflow-hidden">
                    {imageLoading[imageKey] && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-5">
                        <div className="text-gray-400">Loading...</div>
                      </div>
                    )}
                    {imageErrors[imageKey] ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <i className="fas fa-image text-3xl mb-2"></i>
                          <p className="text-sm">Image unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
                        onLoad={() => handleImageLoad(imageKey)}
                        onError={() => handleImageError(imageKey)}
                        onLoadStart={() => handleImageStart(imageKey)}
                      />
                    )}
                    <div className="gallery-overlay absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent flex flex-col justify-end p-8 opacity-0 transition-opacity duration-400 hover:opacity-100">
                      <div className="item-content relative">
                        <span className="item-number absolute -top-16 right-0 text-[4rem] font-black text-white/15 leading-none">{item.number}</span>
                        <h3 className="text-[1.4rem] font-bold mb-2.5 text-white">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="gallery-nav absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-md border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 text-gray-600 text-xl -right-20 hover:bg-accent-teal hover:border-accent-teal hover:text-white hover:scale-110" onClick={handleNext}>
            <i className="fas fa-chevron-right transition-transform duration-200 hover:scale-125"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
