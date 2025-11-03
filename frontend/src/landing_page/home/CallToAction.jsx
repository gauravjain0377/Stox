import React from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section
      className="w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #007f7f 30%, #ff6a1a 100%)",
        paddingTop: "clamp(40px, 8vw, 80px)",
        paddingBottom: "clamp(40px, 8vw, 80px)",
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center justify-center text-center mx-auto z-10">
        {/* Headline */}
        <h2
          className="font-extrabold text-white mb-4 leading-none unified-heading"
          style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.03em', fontSize: 'clamp(2.5rem, 8vw, 10rem)' }}
          data-aos="fade-up"
        >
          Ready to Start Investing?
        </h2>
        {/* Subheadline */}
        <p className="text-white mb-4 max-w-2xl mx-auto" style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 2xl)' }}>
          Open your free Demat account in under 10 minutes. No paperwork,<br className="hidden md:inline" />
          instant verification for Indian citizens.
        </p>

        {/* Container for Features and Button */}
        <div className="w-full flex flex-col items-center gap-10">
          {/* Feature Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 max-w-5xl mx-auto w-full text-center">
            <div className="flex items-center gap-3 min-w-[180px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
              <span className="text-white font-medium" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}>SEBI Regulated</span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
              <span className="text-white font-medium" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}>Zero Account Opening Charges</span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
             <span className="text-white font-medium mb-10" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}>
           
              24/7 Customer Support</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center w-full mt-8">
            <Link
              to="/signup"
              style={{
                background: '#fafafa',
                color: '#00796b',
                fontWeight: 900,
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                borderRadius: '32px',
                padding: 'clamp(16px, 3vw, 20px) clamp(48px, 6vw, 60px)',
                boxShadow: '0 8px 32px 0 rgba(255,106,26,0.18)',
                border: 'none',
                outline: 'none',
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                marginTop: '20px',
                display: 'inline-block',
              }}
              className="cta-signup-btn hover:scale-105 hover:shadow-lg focus:outline-none"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}