import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Destinations() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Popular Destinations</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Explore the most beautiful and iconic destinations in Bohol. From natural wonders to cultural landmarks, discover what makes our island paradise special.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Chocolate Hills</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Chocolate Hills</h3>
                <p className="text-gray-600 mb-4">Bohol's most famous landmark - over 1,200 perfectly cone-shaped hills that turn brown in summer.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Carmen</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Panglao Beach</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Panglao Beach</h3>
                <p className="text-gray-600 mb-4">Pristine white sand beaches with crystal clear waters, perfect for swimming and diving.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Panglao Island</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loboc River</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Loboc River Cruise</h3>
                <p className="text-gray-600 mb-4">Scenic river cruise with floating restaurants and local cultural performances.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Loboc</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Tarsier Sanctuary</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Tarsier Sanctuary</h3>
                <p className="text-gray-600 mb-4">Visit the world's smallest primate in their natural habitat at this conservation center.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Corella</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Blood Compact Site</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Blood Compact Site</h3>
                <p className="text-gray-600 mb-4">Historical landmark commemorating the first treaty of friendship between Filipinos and Spaniards.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tagbilaran</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Hinagdanan Cave</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Hinagdanan Cave</h3>
                <p className="text-gray-600 mb-4">Natural cave with a underground lagoon, perfect for swimming and exploration.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Dauis</span>
                  <button className="text-accent-teal hover:text-accent-teal-dark font-medium">
                    Learn More →
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
