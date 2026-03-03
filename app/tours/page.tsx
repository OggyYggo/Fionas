import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Tours() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Tours</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Discover the beauty of Bohol with our carefully crafted tour packages. From adventure tours to cultural experiences, we have something for every traveler.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Tour Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Countryside Tour</h3>
                <p className="text-gray-600 mb-4">Explore the famous Chocolate Hills, tarsier sanctuary, and historical sites.</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent-teal font-bold">₱2,500</span>
                  <button className="bg-accent-teal text-white px-4 py-2 rounded hover:bg-accent-teal-dark transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Tour Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Island Hopping</h3>
                <p className="text-gray-600 mb-4">Visit pristine beaches and dive spots in Panglao and nearby islands.</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent-teal font-bold">₱3,500</span>
                  <button className="bg-accent-teal text-white px-4 py-2 rounded hover:bg-accent-teal-dark transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Tour Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Dolphin Watching</h3>
                <p className="text-gray-600 mb-4">Experience the joy of watching dolphins in their natural habitat.</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent-teal font-bold">₱1,800</span>
                  <button className="bg-accent-teal text-white px-4 py-2 rounded hover:bg-accent-teal-dark transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
