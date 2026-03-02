import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bohol Travel Agency | Book Tours & Explore Tourist Spots',
  description: 'Discover and book unforgettable tours in Bohol, Philippines. Explore Chocolate Hills, Panglao Island, Tarsier Sanctuary, and more with Bohol Travel Agency.',
  keywords: 'Bohol tours, tourist spots, travel agency, booking, Chocolate Hills, Panglao Island, Bohol Philippines',
  authors: [{ name: 'Bohol Travel Agency' }],
  openGraph: {
    title: 'Bohol Travel Agency - Book Your Dream Vacation',
    description: 'Explore the best tourist spots in Bohol, Philippines with affordable tour packages.',
    type: 'website',
    url: 'https://boholtravelagency.ph',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bohol Travel Agency - Book Tours Online',
    description: 'Discover Bohol\'s hidden gems and book your adventure today!',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="https://images.unsplash.com/photo-1599580676039-c9a3e1e6d0a2?w=32&h=32&fit=crop" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bohol Tours" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
