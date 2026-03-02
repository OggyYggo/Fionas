import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-background">
        <div className="cta-overlay">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Explore Bohol?</h2>
            <p className="cta-description">
              Book your dream adventure today and let us show you why Bohol is called the jewel of the Visayas
            </p>
            <div className="cta-buttons">
              <button className="cta-btn-primary">
                Browse Tours
              </button>
              <button className="cta-btn-secondary">
                Contact Us
              </button>
            </div>
            <div className="cta-contact">
              <div className="contact-item">
                <span className="contact-icon"><i className="fas fa-phone"></i></span>
                <span className="contact-text">+63 912 345 6789</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"><i className="fas fa-envelope"></i></span>
                <span className="contact-text">fionatravelandtours@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
