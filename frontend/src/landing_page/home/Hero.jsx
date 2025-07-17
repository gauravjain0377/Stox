// Hero.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Hero.css';

function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 150,
      once: true,
    });
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg" />
      {/* --- The single animation is now applied to this parent container --- */}
      <div className="hero-content" data-aos="fade-up">
        
        {/* All individual data-aos and data-aos-delay attributes have been removed from these elements */}
        <div className="hero-lines">
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
        </div>
        
        <button className="hero-badge">
          Zero Hidden Charges <span>&rarr;</span>
        </button>
        
        <h1 className="hero-title">
          Start Your Investment<br />Journey in Indian Markets
        </h1>
        
        <p className="hero-desc">
          Trade stocks, mutual funds, and IPOs with zero hidden charges. Join 2M+ Indian investors building wealth through smart investing.
        </p>
        
        <div className="hero-stats">
          <span>SEBI Registered</span>
          <span>NSE/BSE Member</span>
          <span>2M+ Users</span>
          <span>&#8377;0 AMC Forever</span>
        </div>
        
        
      </div>
    </section>
  );
}

export default Hero;