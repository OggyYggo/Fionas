import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="cta-section w-full relative overflow-hidden mt-[90px]">
      <div className="cta-background relative w-full h-[600px]">
        <div className="cta-overlay absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="cta-content text-center text-white max-w-[800px] px-5 flex flex-col items-center gap-8">
            <h2 className="cta-title font-primary text-[3.5rem] font-black m-0 leading-tight tracking-[-1px]">Ready to Explore Bohol?</h2>
            <p className="cta-description font-primary text-xl font-normal leading-relaxed m-0 text-white/90 max-w-[600px]">
              Book your dream adventure today and let us show you why Bohol is called the jewel of the Visayas
            </p>
            <div className="cta-buttons flex gap-5 justify-center mt-2.5">
              <button className="cta-btn-primary bg-white text-gray-800 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg py-4 px-8 rounded-full font-primary font-bold text-base no-underline flex items-center justify-center transition-all duration-300 border-none cursor-pointer min-w-[160px]">
                Browse Tours
              </button>
              <button className="cta-btn-secondary hover:-translate-y-0.5 hover:shadow-lg py-4 px-8 rounded-full font-primary font-bold text-base no-underline flex items-center justify-center transition-all duration-300 cursor-pointer min-w-[160px]">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
