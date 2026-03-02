import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">F</div>
              <div className="logo-text">
                <h3>Fiona Travel & Tours</h3>
                <p className="tagline">Your Bohol Adventure Partner</p>
              </div>
            </div>
            <p className="footer-description">
              Experience the beauty of Bohol with our expertly curated tours and adventures. From pristine beaches to lush countryside, we bring you the best of the Philippines.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Tour Packages</a></li>
              <li><a href="#">Destinations</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Popular Tours Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Popular Tours</h4>
            <ul className="footer-links">
              <li><a href="#">Countryside Tour</a></li>
              <li><a href="#">Island Hopping</a></li>
              <li><a href="#">Diving Adventures</a></li>
              <li><a href="#">Dolphin Watching</a></li>
              <li><a href="#">Firefly Watching</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Tagbilaran City, Bohol, Philippines 6300</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+63 912 345 6789</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@fionatraveltours.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2026 Fiona Travel & Tours. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
