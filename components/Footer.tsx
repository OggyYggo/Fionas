import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-gray-900 text-white py-16 pb-5">
      <div className="footer-container max-w-[1440px] mx-auto px-5">
        <div className="footer-content grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          {/* Company Info Section */}
          <div className="footer-section text-left">
            <div className="footer-logo flex items-start gap-3 mb-5">
              <div className="logo-icon bg-accent-green text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black flex-shrink-0">F</div>
              <div className="logo-text">
                <h3 className="text-white text-xl font-bold m-0 mb-1">Fiona Travel & Tours</h3>
                <p className="tagline text-gray-400 text-sm m-0">Your Bohol Adventure Partner</p>
              </div>
            </div>
            <p className="footer-description text-gray-300 text-sm leading-relaxed mb-6 max-w-[350px]">
              Experience beauty of Bohol with our expertly curated tours and adventures. From pristine beaches to lush countryside, we bring you best of Philippines.
            </p>
            <div className="social-icons flex gap-3">
              <a href="#" className="social-icon bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center no-underline transition-all duration-300 border border-white/20 hover:bg-accent-green hover:-translate-y-0.5 hover:border-accent-green" aria-label="Facebook">
                <i className="fab fa-facebook-f text-base"></i>
              </a>
              <a href="#" className="social-icon bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center no-underline transition-all duration-300 border border-white/20 hover:bg-accent-green hover:-translate-y-0.5 hover:border-accent-green" aria-label="Instagram">
                <i className="fab fa-instagram text-base"></i>
              </a>
              <a href="#" className="social-icon bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center no-underline transition-all duration-300 border border-white/20 hover:bg-accent-green hover:-translate-y-0.5 hover:border-accent-green" aria-label="YouTube">
                <i className="fab fa-youtube text-base"></i>
              </a>
              <a href="#" className="social-icon bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center no-underline transition-all duration-300 border border-white/20 hover:bg-accent-green hover:-translate-y-0.5 hover:border-accent-green" aria-label="Twitter">
                <i className="fab fa-twitter text-base"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section text-left">
            <h4 className="footer-heading text-white text-base font-bold mb-5 relative">Quick Links</h4>
            <ul className="footer-links list-none p-0 m-0">
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Home</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Tour Packages</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Destinations</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">About Us</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Contact</a></li>
            </ul>
          </div>

          {/* Popular Tours Section */}
          <div className="footer-section text-left">
            <h4 className="footer-heading text-white text-base font-bold mb-5 relative">Popular Tours</h4>
            <ul className="footer-links list-none p-0 m-0">
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Countryside Tour</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Island Hopping</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Diving Adventures</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Dolphin Watching</a></li>
              <li className="mb-3"><a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 inline-block hover:text-white hover:translate-x-1">Firefly Watching</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section text-left">
            <h4 className="footer-heading text-white text-base font-bold mb-5 relative">Contact Info</h4>
            <div className="contact-info flex flex-col gap-4">
              <div className="contact-item flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                <i className="fas fa-map-marker-alt text-white w-4 mt-0.5 flex-shrink-0"></i>
                <span>123 Tagbilaran City, Bohol, Philippines 6300</span>
              </div>
              <div className="contact-item flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                <i className="fas fa-phone text-white w-4 mt-0.5 flex-shrink-0"></i>
                <span>+63 912 345 6789</span>
              </div>
              <div className="contact-item flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                <i className="fas fa-envelope text-white w-4 mt-0.5 flex-shrink-0"></i>
                <span>info@fionatraveltours.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom border-t border-white/10 pt-8 mt-10">
          <div className="footer-bottom-content flex justify-between items-center">
            <p className="copyright text-gray-400 text-sm m-0"> 2026 Fiona Travel & Tours. All rights reserved.</p>
            <div className="footer-bottom-links flex gap-6">
              <a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 hover:text-white hover:underline">Privacy Policy</a>
              <a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 hover:text-white hover:underline">Terms of Service</a>
              <a href="#" className="text-gray-300 no-underline text-sm transition-all duration-300 hover:text-white hover:underline">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
