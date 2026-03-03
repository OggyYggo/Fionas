import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Fiona Travel & Tours</h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to Fiona Travel & Tours, your premier travel partner in exploring the beautiful island of Bohol. 
                With years of experience and a passion for showcasing the best of our island paradise, we're dedicated 
                to creating unforgettable experiences for every traveler.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide exceptional travel experiences that showcase the natural beauty, rich culture, 
                  and warm hospitality of Bohol while promoting sustainable tourism and supporting local communities.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading travel and tour company in Bohol, known for our commitment to quality, 
                  customer satisfaction, and responsible tourism practices that preserve our island's natural treasures.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-award text-white text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Expert Guides</h3>
                  <p className="text-gray-600 text-sm">Knowledgeable local guides who bring Bohol's history and culture to life</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-shield-alt text-white text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Safe & Reliable</h3>
                  <p className="text-gray-600 text-sm">Well-maintained vehicles and experienced drivers ensuring your safety</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-heart text-white text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Personalized Service</h3>
                  <p className="text-gray-600 text-sm">Customized tours designed to meet your specific interests and needs</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h2>
              <p className="text-gray-600 mb-8">
                Meet our team of passionate travel experts and local guides who are committed to making your Bohol experience truly special.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium">Fiona Santos</h4>
                  <p className="text-sm text-gray-600">Founder & CEO</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium">Carlos Reyes</h4>
                  <p className="text-sm text-gray-600">Head Guide</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium">Maria Cruz</h4>
                  <p className="text-sm text-gray-600">Tour Coordinator</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium">Jose Mendoza</h4>
                  <p className="text-sm text-gray-600">Operations Manager</p>
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
